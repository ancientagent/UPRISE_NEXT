#!/usr/bin/env node
/**
 * Database Backup Utility
 * Creates timestamped database backups and manages backup retention
 */

require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5433,
  user: process.env.DB_USERNAME || 'uprise',
  password: process.env.DB_PASSWORD || 'Loca$h2682',
  database: process.env.DB_NAME || 'uprise_dev',
};

const BACKUP_DIR = path.join(__dirname, '../../backups/database');

class DatabaseBackup {
  constructor() {
    this.backupDir = BACKUP_DIR;
  }

  async ensureBackupDir() {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log(`✅ Created backup directory: ${this.backupDir}`);
    }
  }

  generateFileName(type = 'full') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `uprise_${type}_${timestamp}.sql`;
  }

  async createFullBackup() {
    await this.ensureBackupDir();
    
    const fileName = this.generateFileName('full');
    const filePath = path.join(this.backupDir, fileName);
    
    const command = `pg_dump -h ${config.host} -p ${config.port} -U ${config.user} -d ${config.database} -f "${filePath}" --verbose --no-password`;
    
    console.log(`🔄 Creating full backup: ${fileName}`);
    
    return new Promise((resolve, reject) => {
      const child = exec(command, {
        env: { ...process.env, PGPASSWORD: config.password }
      });
      
      child.stdout.on('data', (data) => {
        console.log(data.toString().trim());
      });
      
      child.stderr.on('data', (data) => {
        const message = data.toString().trim();
        if (message && !message.includes('NOTICE:')) {
          console.error(message);
        }
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Backup completed: ${fileName}`);
          resolve(filePath);
        } else {
          reject(new Error(`Backup failed with code ${code}`));
        }
      });
    });
  }

  async createSchemaOnlyBackup() {
    await this.ensureBackupDir();
    
    const fileName = this.generateFileName('schema');
    const filePath = path.join(this.backupDir, fileName);
    
    const command = `pg_dump -h ${config.host} -p ${config.port} -U ${config.user} -d ${config.database} -f "${filePath}" --schema-only --verbose --no-password`;
    
    console.log(`🔄 Creating schema backup: ${fileName}`);
    
    return new Promise((resolve, reject) => {
      const child = exec(command, {
        env: { ...process.env, PGPASSWORD: config.password }
      });
      
      child.stdout.on('data', (data) => {
        console.log(data.toString().trim());
      });
      
      child.stderr.on('data', (data) => {
        const message = data.toString().trim();
        if (message && !message.includes('NOTICE:')) {
          console.error(message);
        }
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Schema backup completed: ${fileName}`);
          resolve(filePath);
        } else {
          reject(new Error(`Schema backup failed with code ${code}`));
        }
      });
    });
  }

  async createDataOnlyBackup() {
    await this.ensureBackupDir();
    
    const fileName = this.generateFileName('data');
    const filePath = path.join(this.backupDir, fileName);
    
    const command = `pg_dump -h ${config.host} -p ${config.port} -U ${config.user} -d ${config.database} -f "${filePath}" --data-only --verbose --no-password`;
    
    console.log(`🔄 Creating data backup: ${fileName}`);
    
    return new Promise((resolve, reject) => {
      const child = exec(command, {
        env: { ...process.env, PGPASSWORD: config.password }
      });
      
      child.stdout.on('data', (data) => {
        console.log(data.toString().trim());
      });
      
      child.stderr.on('data', (data) => {
        const message = data.toString().trim();
        if (message && !message.includes('NOTICE:')) {
          console.error(message);
        }
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Data backup completed: ${fileName}`);
          resolve(filePath);
        } else {
          reject(new Error(`Data backup failed with code ${code}`));
        }
      });
    });
  }

  async restoreBackup(backupFile) {
    const filePath = path.isAbsolute(backupFile) 
      ? backupFile 
      : path.join(this.backupDir, backupFile);
    
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`Backup file not found: ${filePath}`);
    }
    
    const command = `psql -h ${config.host} -p ${config.port} -U ${config.user} -d ${config.database} -f "${filePath}" --no-password`;
    
    console.log(`🔄 Restoring backup: ${path.basename(filePath)}`);
    console.log(`⚠️  WARNING: This will modify the database!`);
    
    return new Promise((resolve, reject) => {
      const child = exec(command, {
        env: { ...process.env, PGPASSWORD: config.password }
      });
      
      child.stdout.on('data', (data) => {
        console.log(data.toString().trim());
      });
      
      child.stderr.on('data', (data) => {
        const message = data.toString().trim();
        if (message && !message.includes('NOTICE:')) {
          console.error(message);
        }
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Restore completed from: ${path.basename(filePath)}`);
          resolve();
        } else {
          reject(new Error(`Restore failed with code ${code}`));
        }
      });
    });
  }

  async listBackups() {
    try {
      await this.ensureBackupDir();
      const files = await fs.readdir(this.backupDir);
      const sqlFiles = files.filter(f => f.endsWith('.sql'));
      
      if (sqlFiles.length === 0) {
        console.log('📂 No backup files found.');
        return [];
      }
      
      console.log('\n📂 Available Backups:');
      
      const backupsWithStats = await Promise.all(
        sqlFiles.map(async (file) => {
          const filePath = path.join(this.backupDir, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            size: this.formatFileSize(stats.size),
            date: stats.mtime.toISOString().split('T')[0],
            time: stats.mtime.toTimeString().split(' ')[0],
          };
        })
      );
      
      backupsWithStats
        .sort((a, b) => b.name.localeCompare(a.name))
        .forEach(backup => {
          console.log(`   ${backup.name}`);
          console.log(`     Size: ${backup.size} | Created: ${backup.date} ${backup.time}`);
        });
      
      console.log();
      return sqlFiles;
    } catch (error) {
      console.error('❌ Error listing backups:', error.message);
      return [];
    }
  }

  async cleanOldBackups(retentionDays = 7) {
    try {
      await this.ensureBackupDir();
      const files = await fs.readdir(this.backupDir);
      const sqlFiles = files.filter(f => f.endsWith('.sql'));
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      let deletedCount = 0;
      
      for (const file of sqlFiles) {
        const filePath = path.join(this.backupDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          console.log(`🗑️  Deleted old backup: ${file}`);
          deletedCount++;
        }
      }
      
      if (deletedCount === 0) {
        console.log(`✅ No backups older than ${retentionDays} days found.`);
      } else {
        console.log(`✅ Cleaned up ${deletedCount} old backup(s).`);
      }
    } catch (error) {
      console.error('❌ Error cleaning backups:', error.message);
    }
  }

  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// CLI Interface
async function main() {
  const backup = new DatabaseBackup();
  const command = process.argv[2];
  const param = process.argv[3];

  try {
    switch (command) {
      case 'full':
        await backup.createFullBackup();
        break;
      case 'schema':
        await backup.createSchemaOnlyBackup();
        break;
      case 'data':
        await backup.createDataOnlyBackup();
        break;
      case 'restore':
        if (!param) {
          console.error('Usage: node db-backup.js restore <backup_file>');
          process.exit(1);
        }
        await backup.restoreBackup(param);
        break;
      case 'list':
        await backup.listBackups();
        break;
      case 'clean':
        const days = param ? parseInt(param) : 7;
        await backup.cleanOldBackups(days);
        break;
      default:
        console.log('\nDatabase Backup CLI');
        console.log('\nUsage:');
        console.log('  node db-backup.js full              - Create full database backup');
        console.log('  node db-backup.js schema            - Create schema-only backup');
        console.log('  node db-backup.js data              - Create data-only backup');
        console.log('  node db-backup.js restore <file>    - Restore from backup file');
        console.log('  node db-backup.js list              - List available backups');
        console.log('  node db-backup.js clean [days]      - Clean backups older than N days (default: 7)');
        console.log();
        console.log('Examples:');
        console.log('  node db-backup.js full');
        console.log('  node db-backup.js restore uprise_full_2025-01-15T10-30-00-000Z.sql');
        console.log('  node db-backup.js clean 14');
        console.log();
    }
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DatabaseBackup;