#!/usr/bin/env node
// generated-by: DeepAgent on 2025-11-13
// 
// UPRISE Web-Tier Contract Guard
// Purpose: Enforce architectural boundaries to prevent direct database access,
//          server-side imports, and secret leakage in the web tier.
//
// This script is part of the T5 implementation task and ensures that apps/web
// adheres to the UPRISE infrastructure boundaries defined in:
// - docs/STRATEGY_CRITICAL_INFRA_NOTE.md
// - docs/RUNBOOK.md
// - apps/web/WEB_TIER_BOUNDARY.md

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Violation {
  file: string;
  line: number;
  column: number;
  pattern: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

interface Pattern {
  regex: RegExp;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const ROOT = process.cwd();
const WEB_DIR = path.join(ROOT, 'apps', 'web');

// Directories to skip during scanning
const SKIP_DIRS = [
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'build',
  'coverage',
  '__tests__',
  '.git',
];

// Files to skip (guard files and test files that intentionally use prohibited patterns)
const SKIP_FILES = [
  'web-tier-guard.ts',
  'web-tier-guard.test.ts',
  'web-tier.d.ts',
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// ============================================================================
// PROHIBITED PATTERNS
// ============================================================================

const PROHIBITED_PATTERNS: Pattern[] = [
  // Database Access Violations
  {
    regex: /from\s+['"]@prisma\/client['"]/,
    message: 'Direct Prisma Client import is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_001',
  },
  {
    regex: /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]@prisma\/client['"]/,
    message: 'Direct Prisma Client import is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_001',
  },
  {
    regex: /from\s+['"]pg['"]/,
    message: 'Direct PostgreSQL (pg) import is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_002',
  },
  {
    regex: /from\s+['"]postgres['"]/,
    message: 'Direct PostgreSQL import is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_003',
  },
  {
    regex: /from\s+['"]mysql['"]/,
    message: 'Direct MySQL import is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_004',
  },
  {
    regex: /from\s+['"]mongodb['"]/,
    message: 'Direct MongoDB import is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_005',
  },
  {
    regex: /from\s+['"]mongoose['"]/,
    message: 'Direct Mongoose import is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_006',
  },
  {
    regex: /new\s+PrismaClient\s*\(/,
    message: 'Direct PrismaClient instantiation is prohibited in web tier. Use API client instead.',
    severity: 'error',
    code: 'WEB_TIER_DB_007',
  },

  // Server-Side Import Violations
  {
    regex: /from\s+['"]\.\.\/\.\.\/api\/src/,
    message: 'Direct import from apps/api/src is prohibited. Use API client or shared packages.',
    severity: 'error',
    code: 'WEB_TIER_IMPORT_001',
  },
  {
    regex: /from\s+['"]\.\.\/\.\.\/socket\/src/,
    message: 'Direct import from apps/socket/src is prohibited. Use Socket.IO client or shared packages.',
    severity: 'error',
    code: 'WEB_TIER_IMPORT_002',
  },
  {
    regex: /from\s+['"]apps\/api\/src/,
    message: 'Direct import from apps/api/src is prohibited. Use API client or shared packages.',
    severity: 'error',
    code: 'WEB_TIER_IMPORT_003',
  },
  {
    regex: /from\s+['"]apps\/socket\/src/,
    message: 'Direct import from apps/socket/src is prohibited. Use Socket.IO client or shared packages.',
    severity: 'error',
    code: 'WEB_TIER_IMPORT_004',
  },

  // Environment Variable & Secret Leakage Violations
  {
    regex: /process\.env\.DATABASE_URL/,
    message: 'DATABASE_URL must not be accessed in web tier. This is a server-side secret.',
    severity: 'error',
    code: 'WEB_TIER_SECRET_001',
  },
  {
    regex: /process\.env\.JWT_SECRET/,
    message: 'JWT_SECRET must not be accessed in web tier. This is a server-side secret.',
    severity: 'error',
    code: 'WEB_TIER_SECRET_002',
  },
  {
    regex: /process\.env\.AWS_SECRET_ACCESS_KEY/,
    message: 'AWS_SECRET_ACCESS_KEY must not be accessed in web tier. This is a server-side secret.',
    severity: 'error',
    code: 'WEB_TIER_SECRET_003',
  },
  {
    regex: /process\.env\.AWS_ACCESS_KEY_ID/,
    message: 'AWS_ACCESS_KEY_ID must not be accessed in web tier. This is a server-side secret.',
    severity: 'error',
    code: 'WEB_TIER_SECRET_004',
  },
  {
    regex: /process\.env\.SENTRY_AUTH_TOKEN/,
    message: 'SENTRY_AUTH_TOKEN must not be accessed in web tier. This is a server-side secret.',
    severity: 'error',
    code: 'WEB_TIER_SECRET_005',
  },
  {
    regex: /process\.env\.(?!NEXT_PUBLIC_)[A-Z_]+['"\s]/,
    message: 'Non-NEXT_PUBLIC_ environment variables must not be accessed in client components. Use NEXT_PUBLIC_ prefix for client-safe variables.',
    severity: 'warning',
    code: 'WEB_TIER_SECRET_006',
  },

  // AWS SDK Violations
  {
    regex: /from\s+['"]aws-sdk['"]/,
    message: 'AWS SDK import is prohibited in web tier. AWS operations should be performed server-side via API.',
    severity: 'error',
    code: 'WEB_TIER_AWS_001',
  },
  {
    regex: /from\s+['"]@aws-sdk/,
    message: 'AWS SDK v3 import is prohibited in web tier. AWS operations should be performed server-side via API.',
    severity: 'error',
    code: 'WEB_TIER_AWS_002',
  },

  // File System Access Violations
  {
    regex: /from\s+['"]fs['"]/,
    message: 'File system (fs) access is prohibited in web tier client code. Use API for file operations.',
    severity: 'error',
    code: 'WEB_TIER_FS_001',
  },
  {
    regex: /require\s*\(\s*['"]fs['"]\s*\)/,
    message: 'File system (fs) access is prohibited in web tier client code. Use API for file operations.',
    severity: 'error',
    code: 'WEB_TIER_FS_002',
  },

  // Server-Only Module Violations
  {
    regex: /from\s+['"]child_process['"]/,
    message: 'child_process is a server-only module and is prohibited in web tier.',
    severity: 'error',
    code: 'WEB_TIER_SERVER_001',
  },
  {
    regex: /from\s+['"]node:child_process['"]/,
    message: 'child_process is a server-only module and is prohibited in web tier.',
    severity: 'error',
    code: 'WEB_TIER_SERVER_002',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a directory or file should be skipped
 */
function shouldSkip(itemPath: string): boolean {
  const basename = path.basename(itemPath);
  
  // Check if it's a directory to skip
  if (SKIP_DIRS.some(skipDir => basename === skipDir || itemPath.includes(`/${skipDir}/`))) {
    return true;
  }
  
  // Check if it's a file to skip
  if (SKIP_FILES.some(skipFile => basename === skipFile)) {
    return true;
  }
  
  return false;
}

/**
 * Check if a file should be scanned based on its extension
 */
function shouldScanFile(filePath: string): boolean {
  return SCAN_EXTENSIONS.some(ext => filePath.endsWith(ext));
}

/**
 * Get the line and column number for a match in the file content
 */
function getLineAndColumn(content: string, matchIndex: number): { line: number; column: number } {
  const lines = content.substring(0, matchIndex).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

/**
 * Extract a snippet of code around the violation for better error messages
 */
function getCodeSnippet(content: string, matchIndex: number, matchLength: number): string {
  const start = Math.max(0, matchIndex - 20);
  const end = Math.min(content.length, matchIndex + matchLength + 20);
  let snippet = content.substring(start, end).trim();
  
  // Limit to single line for cleaner output
  const newlineIndex = snippet.indexOf('\n');
  if (newlineIndex !== -1) {
    snippet = snippet.substring(0, newlineIndex);
  }
  
  return snippet.length > 80 ? snippet.substring(0, 80) + '...' : snippet;
}

/**
 * Recursively scan a directory for violations
 */
function scanDirectory(dir: string): Violation[] {
  let violations: Violation[] = [];

  // Check if directory exists
  if (!fs.existsSync(dir)) {
    console.error(`❌ Error: Directory ${dir} does not exist.`);
    return violations;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    // Skip if in skip list
    if (shouldSkip(fullPath)) {
      continue;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      violations = violations.concat(scanDirectory(fullPath));
    } else if (stat.isFile() && shouldScanFile(fullPath)) {
      // Scan file for violations
      violations = violations.concat(scanFile(fullPath));
    }
  }

  return violations;
}

/**
 * Scan a single file for violations
 */
function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(ROOT, filePath);

  for (const pattern of PROHIBITED_PATTERNS) {
    let match: RegExpExecArray | null;
    
    // Reset regex state
    pattern.regex.lastIndex = 0;
    
    // Find all matches in the file
    while ((match = pattern.regex.exec(content)) !== null) {
      const { line, column } = getLineAndColumn(content, match.index);
      const code = getCodeSnippet(content, match.index, match[0].length);

      violations.push({
        file: relativePath,
        line,
        column,
        pattern: pattern.code,
        message: pattern.message,
        code,
        severity: pattern.severity,
      });

      // Prevent infinite loops with global regex
      if (!pattern.regex.global) {
        break;
      }
    }
  }

  return violations;
}

/**
 * Format and display violations
 */
function displayViolations(violations: Violation[]): void {
  const errors = violations.filter(v => v.severity === 'error');
  const warnings = violations.filter(v => v.severity === 'warning');

  if (errors.length > 0) {
    console.error('\n❌ Web-Tier Contract Violations Detected (ERRORS):\n');
    console.error('═'.repeat(80));
    
    errors.forEach((violation, index) => {
      console.error(`\n${index + 1}. ${violation.file}:${violation.line}:${violation.column}`);
      console.error(`   Code: ${violation.pattern}`);
      console.error(`   Message: ${violation.message}`);
      console.error(`   Snippet: ${violation.code}`);
    });
    
    console.error('\n' + '═'.repeat(80));
    console.error(`\n❌ Total Errors: ${errors.length}`);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Web-Tier Contract Warnings:\n');
    console.warn('─'.repeat(80));
    
    warnings.forEach((violation, index) => {
      console.warn(`\n${index + 1}. ${violation.file}:${violation.line}:${violation.column}`);
      console.warn(`   Code: ${violation.pattern}`);
      console.warn(`   Message: ${violation.message}`);
      console.warn(`   Snippet: ${violation.code}`);
    });
    
    console.warn('\n' + '─'.repeat(80));
    console.warn(`\n⚠️  Total Warnings: ${warnings.length}`);
  }

  if (violations.length === 0) {
    console.log('\n✅ Web-Tier Contract Guard: No violations detected!');
    console.log('   All architectural boundaries are properly enforced.\n');
  }
}

/**
 * Display helpful information about allowed vs prohibited patterns
 */
function displayHelp(): void {
  console.log('\n📚 Web-Tier Contract Guard - Help\n');
  console.log('═'.repeat(80));
  console.log('\nThis guard enforces the following architectural boundaries:\n');
  
  console.log('❌ PROHIBITED in apps/web:');
  console.log('   • Direct database imports (@prisma/client, pg, mongodb, etc.)');
  console.log('   • Direct imports from apps/api/src or apps/socket/src');
  console.log('   • Server-side environment variables (DATABASE_URL, JWT_SECRET, etc.)');
  console.log('   • AWS SDK imports (aws-sdk, @aws-sdk/*)');
  console.log('   • File system access (fs module)');
  console.log('   • Server-only Node.js modules (child_process, etc.)\n');
  
  console.log('✅ ALLOWED in apps/web:');
  console.log('   • API client (e.g., import { api } from "@/lib/api")');
  console.log('   • Socket.IO client (e.g., import { io } from "socket.io-client")');
  console.log('   • Shared packages (@uprise/ui, @uprise/types, etc.)');
  console.log('   • NEXT_PUBLIC_ environment variables');
  console.log('   • Client-safe utilities and components\n');
  
  console.log('📖 For more information, see:');
  console.log('   • docs/STRATEGY_CRITICAL_INFRA_NOTE.md');
  console.log('   • docs/RUNBOOK.md');
  console.log('   • apps/web/WEB_TIER_BOUNDARY.md\n');
  console.log('═'.repeat(80) + '\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);

  // Check for help flag
  if (args.includes('--help') || args.includes('-h')) {
    displayHelp();
    process.exit(0);
  }

  console.log('\n🔍 UPRISE Web-Tier Contract Guard');
  console.log('═'.repeat(80));
  console.log(`Scanning: ${path.relative(ROOT, WEB_DIR)}`);
  console.log(`Patterns: ${PROHIBITED_PATTERNS.length} prohibited patterns`);
  console.log('═'.repeat(80) + '\n');

  // Check if web directory exists
  if (!fs.existsSync(WEB_DIR)) {
    console.error(`❌ Error: Web directory not found at ${WEB_DIR}`);
    console.error('   Make sure you are running this script from the monorepo root.');
    process.exit(1);
  }

  // Scan for violations
  const startTime = Date.now();
  const violations = scanDirectory(WEB_DIR);
  const duration = Date.now() - startTime;

  // Display results
  displayViolations(violations);

  // Summary
  const errors = violations.filter(v => v.severity === 'error').length;
  const warnings = violations.filter(v => v.severity === 'warning').length;
  
  console.log(`\n⏱️  Scan completed in ${duration}ms`);
  
  if (args.includes('--verbose') || args.includes('-v')) {
    console.log(`   Files scanned: ${countFilesInDirectory(WEB_DIR)}`);
  }

  // Exit with appropriate code
  if (errors > 0) {
    console.error('\n❌ Build failed: Web-tier contract violations must be fixed.\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.warn('\n⚠️  Build succeeded with warnings. Consider fixing them.\n');
    process.exit(0);
  } else {
    console.log('\n✅ Build succeeded: All checks passed!\n');
    process.exit(0);
  }
}

/**
 * Count the number of files in a directory (for verbose output)
 */
function countFilesInDirectory(dir: string): number {
  let count = 0;
  
  if (!fs.existsSync(dir)) {
    return count;
  }

  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    if (shouldSkip(fullPath)) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      count += countFilesInDirectory(fullPath);
    } else if (stat.isFile() && shouldScanFile(fullPath)) {
      count++;
    }
  }
  
  return count;
}

// Run the script
if (require.main === module) {
  main();
}

export { scanDirectory, scanFile, PROHIBITED_PATTERNS };
