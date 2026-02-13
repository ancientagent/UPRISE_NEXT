#!/usr/bin/env node
/**
 * Security Scanner for Exposed Secrets
 * Scans codebase for exposed API keys, passwords, and sensitive data
 */

const fs = require('fs').promises;
const path = require('path');

class SecretScanner {
  constructor() {
    this.patterns = {
      // API Keys & Secrets
      firebase_api_key: /AIza[0-9A-Za-z-_]{35}/g,
      firebase_auth_domain: /[a-zA-Z0-9-]+\.firebaseapp\.com/g,
      sendgrid_key: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
      jwt_secret: /jwt[_-]?secret["\s]*[:=]["\s]*([a-zA-Z0-9+/=]{20,})/gi,
      database_url: /postgres:\/\/[^:]+:[^@]+@[^\/]+\/\w+/gi,
      
      // Generic patterns
      generic_api_key: /["\']?api[_-]?key["\']?\s*[:=]\s*["\'][a-zA-Z0-9_-]{20,}["\']/gi,
      generic_secret: /["\']?secret["\']?\s*[:=]\s*["\'][a-zA-Z0-9_-]{20,}["\']/gi,
      generic_password: /["\']?password["\']?\s*[:=]\s*["\'][^\s"']{8,}["\']/gi,
      generic_token: /["\']?token["\']?\s*[:=]\s*["\'][a-zA-Z0-9_-]{20,}["\']/gi,
      
      // Environment variables in client code
      process_env: /process\.env\.[A-Z_]+/g,
      
      // Hardcoded credentials
      hardcoded_user: /user["\s]*[:=]["\s]*[a-zA-Z0-9_-]+/gi,
      hardcoded_pass: /pass(?:word)?["\s]*[:=]["\s]*[^\s"',;)}{]{6,}/gi,
    };

    this.falsePositives = [
      'your_api_key_here',
      'your_secret_here', 
      'example_key',
      'test_key',
      'demo_secret',
      'placeholder',
      'lorem ipsum',
      'firebase_api_key',
      'process.env',
    ];

    this.excludePatterns = [
      /node_modules/,
      /\.git/,
      /\.dev-tools/,
      /backups/,
      /logs/,
      /\.log$/,
      /\.lock$/,
      /\.min\./,
      /\.map$/,
    ];

    this.findings = [];
  }

  shouldExcludeFile(filePath) {
    return this.excludePatterns.some(pattern => pattern.test(filePath));
  }

  isFalsePositive(match) {
    return this.falsePositives.some(fp => 
      match.toLowerCase().includes(fp.toLowerCase())
    );
  }

  async scanFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (const [patternName, pattern] of Object.entries(this.patterns)) {
        let match;
        pattern.lastIndex = 0; // Reset regex state
        
        while ((match = pattern.exec(content)) !== null) {
          if (this.isFalsePositive(match[0])) continue;
          
          // Find line number
          const beforeMatch = content.substring(0, match.index);
          const lineNumber = beforeMatch.split('\n').length;
          const line = lines[lineNumber - 1];
          
          this.findings.push({
            file: filePath,
            line: lineNumber,
            type: patternName,
            match: match[0],
            context: line.trim(),
            severity: this.getSeverity(patternName, match[0])
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message);
    }
  }

  getSeverity(patternName, match) {
    // High severity patterns
    if (patternName.includes('secret') || 
        patternName.includes('password') || 
        patternName.includes('key')) {
      return 'HIGH';
    }
    
    // Medium severity
    if (patternName.includes('token') || 
        patternName.includes('firebase') || 
        patternName.includes('database')) {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }

  async scanDirectory(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (this.shouldExcludeFile(fullPath)) continue;
        
        if (entry.isDirectory()) {
          await this.scanDirectory(fullPath);
        } else if (entry.isFile()) {
          // Only scan text files
          const ext = path.extname(entry.name).toLowerCase();
          const textExtensions = [
            '.js', '.jsx', '.ts', '.tsx', '.json', '.env', '.config',
            '.py', '.java', '.go', '.rs', '.php', '.rb', '.yaml', '.yml',
            '.xml', '.html', '.css', '.scss', '.sass', '.md', '.txt'
          ];
          
          if (textExtensions.includes(ext) || !ext) {
            await this.scanFile(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }

  generateReport() {
    if (this.findings.length === 0) {
      console.log('✅ No potential secrets found!');
      return;
    }

    const severityGroups = this.findings.reduce((groups, finding) => {
      if (!groups[finding.severity]) groups[finding.severity] = [];
      groups[finding.severity].push(finding);
      return groups;
    }, {});

    console.log('🔍 SECURITY SCAN RESULTS\n');
    console.log(`Found ${this.findings.length} potential security issues:\n`);

    for (const severity of ['HIGH', 'MEDIUM', 'LOW']) {
      if (!severityGroups[severity]) continue;
      
      console.log(`🚨 ${severity} SEVERITY (${severityGroups[severity].length} issues):`);
      
      severityGroups[severity].forEach(finding => {
        console.log(`   📁 ${finding.file}:${finding.line}`);
        console.log(`   🔍 ${finding.type}: ${finding.match}`);
        console.log(`   📝 ${finding.context}`);
        console.log();
      });
    }

    // Summary by file
    const fileGroups = this.findings.reduce((groups, finding) => {
      if (!groups[finding.file]) groups[finding.file] = 0;
      groups[finding.file]++;
      return groups;
    }, {});

    console.log('📊 Files with issues:');
    Object.entries(fileGroups)
      .sort((a, b) => b[1] - a[1])
      .forEach(([file, count]) => {
        console.log(`   ${file}: ${count} issues`);
      });

    console.log('\n⚠️  Please review and secure any legitimate secrets found!');
  }

  async scan(targetPath = '.') {
    console.log(`🔍 Scanning for exposed secrets in: ${path.resolve(targetPath)}\n`);
    
    const stats = await fs.stat(targetPath);
    
    if (stats.isDirectory()) {
      await this.scanDirectory(targetPath);
    } else {
      await this.scanFile(targetPath);
    }
    
    this.generateReport();
  }
}

// CLI Interface
async function main() {
  const scanner = new SecretScanner();
  const targetPath = process.argv[2] || '.';
  
  try {
    await scanner.scan(targetPath);
  } catch (error) {
    console.error('❌ Scan failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SecretScanner;