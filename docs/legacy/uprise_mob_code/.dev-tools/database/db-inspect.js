#!/usr/bin/env node
/**
 * Database Inspection Utility
 * Provides comprehensive PostgreSQL database analysis and monitoring
 */

require('dotenv').config();
const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USERNAME || 'uprise',
  password: process.env.DB_PASSWORD || 'Loca$h2682',
  database: process.env.DB_NAME || 'uprise_dev',
};

class DatabaseInspector {
  constructor() {
    this.client = new Client(config);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log(`✅ Connected to PostgreSQL database: ${config.database}`);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    await this.client.end();
  }

  async getTableInfo() {
    const query = `
      SELECT 
        schemaname,
        tablename,
        tableowner,
        tablespace,
        hasindexes,
        hasrules,
        hastriggers,
        rowsecurity
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    
    const result = await this.client.query(query);
    return result.rows;
  }

  async getColumnInfo(tableName) {
    const query = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const result = await this.client.query(query, [tableName]);
    return result.rows;
  }

  async getIndexInfo() {
    const query = `
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;
    
    const result = await this.client.query(query);
    return result.rows;
  }

  async getConstraints() {
    const query = `
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      LEFT JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_type;
    `;
    
    const result = await this.client.query(query);
    return result.rows;
  }

  async getExtensions() {
    const query = `
      SELECT 
        extname,
        extversion,
        nspname as schema
      FROM pg_extension e
      JOIN pg_namespace n ON n.oid = e.extnamespace
      ORDER BY extname;
    `;
    
    const result = await this.client.query(query);
    return result.rows;
  }

  async getDatabaseSize() {
    const query = `
      SELECT 
        pg_database.datname,
        pg_size_pretty(pg_database_size(pg_database.datname)) AS size
      FROM pg_database
      WHERE datname = $1;
    `;
    
    const result = await this.client.query(query, [config.database]);
    return result.rows[0];
  }

  async getTableSizes() {
    const query = `
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    `;
    
    const result = await this.client.query(query);
    return result.rows;
  }

  async getMigrationStatus() {
    const query = `
      SELECT 
        name,
        batch,
        migration_time
      FROM "SequelizeMeta"
      ORDER BY migration_time DESC
      LIMIT 10;
    `;
    
    try {
      const result = await this.client.query(query);
      return result.rows;
    } catch (error) {
      return null; // Migration table doesn't exist
    }
  }

  async generateReport() {
    console.log('\n=== DATABASE INSPECTION REPORT ===\n');

    // Database Info
    const dbSize = await this.getDatabaseSize();
    console.log('📊 Database Information:');
    console.log(`   Name: ${dbSize.datname}`);
    console.log(`   Size: ${dbSize.size}\n`);

    // Extensions
    const extensions = await this.getExtensions();
    console.log('🔧 Installed Extensions:');
    extensions.forEach(ext => {
      console.log(`   ${ext.extname} v${ext.extversion} (${ext.schema})`);
    });

    // Migration Status
    const migrations = await getMigrationStatus();
    if (migrations) {
      console.log('\n📈 Recent Migrations:');
      migrations.forEach(mig => {
        console.log(`   ${mig.name} (batch: ${mig.batch})`);
      });
    }

    // Tables Overview
    const tables = await this.getTableInfo();
    console.log(`\n📋 Tables (${tables.length} total):`);
    tables.forEach(table => {
      const indicators = [];
      if (table.hasindexes) indicators.push('IDX');
      if (table.hastriggers) indicators.push('TRG');
      if (table.hasrules) indicators.push('RUL');
      const flags = indicators.length ? ` [${indicators.join(',')}]` : '';
      console.log(`   ${table.tablename}${flags}`);
    });

    // Table Sizes
    const tableSizes = await this.getTableSizes();
    console.log('\n💾 Table Sizes:');
    tableSizes.forEach(table => {
      console.log(`   ${table.tablename}: ${table.size} (table: ${table.table_size}, indexes: ${table.index_size})`);
    });

    // Constraints Summary
    const constraints = await this.getConstraints();
    const constraintGroups = constraints.reduce((acc, constraint) => {
      if (!acc[constraint.constraint_type]) acc[constraint.constraint_type] = 0;
      acc[constraint.constraint_type]++;
      return acc;
    }, {});

    console.log('\n🔗 Constraints:');
    Object.entries(constraintGroups).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    console.log('\n=== END REPORT ===\n');
  }

  async inspectTable(tableName) {
    console.log(`\n=== TABLE INSPECTION: ${tableName} ===\n`);

    const columns = await this.getColumnInfo(tableName);
    console.log('📋 Columns:');
    columns.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`   ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
    });

    const indexes = await this.getIndexInfo();
    const tableIndexes = indexes.filter(idx => idx.tablename === tableName);
    
    if (tableIndexes.length > 0) {
      console.log('\n🗂️  Indexes:');
      tableIndexes.forEach(idx => {
        console.log(`   ${idx.indexname}`);
        console.log(`     ${idx.indexdef}`);
      });
    }

    const constraints = await this.getConstraints();
    const tableConstraints = constraints.filter(c => c.table_name === tableName);
    
    if (tableConstraints.length > 0) {
      console.log('\n🔗 Constraints:');
      tableConstraints.forEach(c => {
        const ref = c.foreign_table_name ? ` -> ${c.foreign_table_name}.${c.foreign_column_name}` : '';
        console.log(`   ${c.constraint_name} (${c.constraint_type}): ${c.column_name}${ref}`);
      });
    }

    console.log(`\n=== END ${tableName} ===\n`);
  }
}

// CLI Interface
async function main() {
  const inspector = new DatabaseInspector();
  await inspector.connect();

  const command = process.argv[2];
  const param = process.argv[3];

  try {
    switch (command) {
      case 'report':
        await inspector.generateReport();
        break;
      case 'table':
        if (!param) {
          console.error('Usage: node db-inspect.js table <table_name>');
          process.exit(1);
        }
        await inspector.inspectTable(param);
        break;
      case 'tables':
        const tables = await inspector.getTableInfo();
        console.log('\n📋 Available Tables:');
        tables.forEach(table => console.log(`   ${table.tablename}`));
        console.log();
        break;
      default:
        console.log('\nDatabase Inspector CLI');
        console.log('\nUsage:');
        console.log('  node db-inspect.js report          - Generate full database report');
        console.log('  node db-inspect.js tables          - List all tables');
        console.log('  node db-inspect.js table <name>    - Inspect specific table');
        console.log();
    }
  } finally {
    await inspector.disconnect();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DatabaseInspector;