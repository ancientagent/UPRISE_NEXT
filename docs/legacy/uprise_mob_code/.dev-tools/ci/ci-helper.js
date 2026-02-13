#!/usr/bin/env node
/**
 * CI/CD Helper Utility
 * GitHub Actions and Android CI pipeline utilities
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class CIHelper {
  constructor() {
    this.workflowsPath = path.join(process.cwd(), '.github', 'workflows');
    this.results = {
      workflows: [],
      secrets: [],
      artifacts: [],
      recommendations: []
    };
  }

  async runCommand(command) {
    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      return { success: true, stdout: stdout.trim(), stderr: stderr.trim() };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        stdout: error.stdout || '',
        stderr: error.stderr || ''
      };
    }
  }

  async analyzeWorkflows() {
    console.log('🔍 Analyzing GitHub Workflows...');
    
    try {
      const workflowFiles = await fs.readdir(this.workflowsPath);
      
      for (const file of workflowFiles) {
        if (file.endsWith('.yml') || file.endsWith('.yaml')) {
          const filePath = path.join(this.workflowsPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          
          const workflow = {
            name: file,
            triggers: this.extractTriggers(content),
            jobs: this.extractJobs(content),
            secrets: this.extractSecrets(content),
            artifacts: this.extractArtifacts(content),
            android: content.includes('android'),
            caching: content.includes('cache'),
          };
          
          this.results.workflows.push(workflow);
        }
      }
      
      console.log(`   ✅ Found ${this.results.workflows.length} workflow(s)`);
    } catch (error) {
      console.log('   ⚠️  No .github/workflows directory found');
      this.results.recommendations.push('💡 Consider setting up GitHub Actions workflows for CI/CD');
    }
  }

  extractTriggers(content) {
    const triggers = [];
    const lines = content.split('\n');
    
    let inOnSection = false;
    for (const line of lines) {
      if (line.trim().startsWith('on:')) {
        inOnSection = true;
        continue;
      }
      
      if (inOnSection) {
        if (line.trim() && !line.startsWith(' ') && !line.startsWith('\t')) {
          break;
        }
        
        if (line.trim() && line.includes(':')) {
          const trigger = line.trim().replace(':', '').trim();
          if (trigger !== 'on' && !triggers.includes(trigger)) {
            triggers.push(trigger);
          }
        }
      }
    }
    
    return triggers;
  }

  extractJobs(content) {
    const jobs = [];
    const jobMatches = content.match(/^\s*([a-zA-Z0-9_-]+):\s*$/gm);
    
    if (jobMatches) {
      jobMatches.forEach(match => {
        const jobName = match.trim().replace(':', '');
        if (jobName !== 'on' && jobName !== 'env' && jobName !== 'jobs') {
          jobs.push(jobName);
        }
      });
    }
    
    return jobs;
  }

  extractSecrets(content) {
    const secrets = [];
    const secretMatches = content.match(/\$\{\{\s*secrets\.([A-Z_]+)\s*\}\}/g);
    
    if (secretMatches) {
      secretMatches.forEach(match => {
        const secret = match.replace(/\$\{\{\s*secrets\./, '').replace(/\s*\}\}/, '');
        if (!secrets.includes(secret)) {
          secrets.push(secret);
        }
      });
    }
    
    return secrets;
  }

  extractArtifacts(content) {
    const artifacts = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('upload-artifact') || lines[i].includes('download-artifact')) {
        // Look for name in the next few lines
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].includes('name:')) {
            const name = lines[j].split('name:')[1].trim().replace(/['"]/g, '');
            if (!artifacts.includes(name)) {
              artifacts.push(name);
            }
            break;
          }
        }
      }
    }
    
    return artifacts;
  }

  async checkGitHubCLI() {
    console.log('🔍 Checking GitHub CLI...');
    
    const ghResult = await this.runCommand('gh --version');
    if (ghResult.success) {
      console.log('   ✅ GitHub CLI available');
      
      // Check auth status
      const authResult = await this.runCommand('gh auth status');
      if (authResult.success) {
        console.log('   ✅ GitHub CLI authenticated');
      } else {
        console.log('   ⚠️  GitHub CLI not authenticated');
        this.results.recommendations.push('💡 Run "gh auth login" to authenticate GitHub CLI');
      }
    } else {
      console.log('   ❌ GitHub CLI not installed');
      this.results.recommendations.push('💡 Install GitHub CLI: https://cli.github.com/');
    }
  }

  async getWorkflowRuns() {
    console.log('🔍 Fetching Recent Workflow Runs...');
    
    const runsResult = await this.runCommand('gh run list --limit 10 --json status,conclusion,name,createdAt');
    if (runsResult.success) {
      try {
        const runs = JSON.parse(runsResult.stdout);
        const summary = {
          total: runs.length,
          success: runs.filter(r => r.conclusion === 'success').length,
          failure: runs.filter(r => r.conclusion === 'failure').length,
          cancelled: runs.filter(r => r.conclusion === 'cancelled').length,
          inProgress: runs.filter(r => r.status === 'in_progress').length,
        };
        
        this.results.runSummary = summary;
        console.log(`   📊 Recent runs: ${summary.success} success, ${summary.failure} failed, ${summary.inProgress} in progress`);
      } catch (error) {
        console.log('   ⚠️  Could not parse workflow runs');
      }
    } else {
      console.log('   ⚠️  Could not fetch workflow runs (may need repository access)');
    }
  }

  async checkAndroidCI() {
    console.log('🔍 Analyzing Android CI Setup...');
    
    // Check if Android workflow exists
    const androidWorkflows = this.results.workflows.filter(w => w.android);
    if (androidWorkflows.length === 0) {
      this.results.recommendations.push('💡 Consider adding Android CI workflow');
      return;
    }
    
    console.log(`   📱 Found ${androidWorkflows.length} Android workflow(s)`);
    
    // Check for common Android CI patterns
    for (const workflow of androidWorkflows) {
      const checks = {
        hasGradleCache: workflow.caching,
        hasSecrets: workflow.secrets.length > 0,
        hasArtifacts: workflow.artifacts.length > 0,
      };
      
      if (!checks.hasGradleCache) {
        this.results.recommendations.push('💡 Add Gradle caching to speed up Android builds');
      }
      
      if (!checks.hasSecrets && workflow.name.includes('release')) {
        this.results.recommendations.push('💡 Release workflows should use secrets for signing');
      }
      
      if (!checks.hasArtifacts) {
        this.results.recommendations.push('💡 Consider uploading APK artifacts from Android builds');
      }
    }
  }

  async generateWorkflowTemplate() {
    console.log('🔧 Generating Android CI Workflow Template...');
    
    const template = `name: Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'yarn'
        
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '11'
        
    - name: Cache Gradle
      uses: actions/cache@v3
      with:
        path: |
          ~/.gradle/caches
          ~/.gradle/wrapper
          android/.gradle
        key: \${{ runner.os }}-gradle-\${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
        restore-keys: |
          \${{ runner.os }}-gradle-
          
    - name: Install dependencies
      run: yarn install --frozen-lockfile
      
    - name: Run tests
      run: yarn test --coverage --watchAll=false
      
    - name: Build Android Debug
      run: |
        cd android
        ./gradlew assembleDebug
        
    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: debug-apk
        path: android/app/build/outputs/apk/debug/app-debug.apk
        
  release:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    needs: build
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    # ... (similar setup steps)
      
    - name: Build Android Release
      run: |
        cd android
        ./gradlew assembleRelease
      env:
        ANDROID_KEYSTORE_PASSWORD: \${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
        ANDROID_KEY_ALIAS: \${{ secrets.ANDROID_KEY_ALIAS }}
        ANDROID_KEY_PASSWORD: \${{ secrets.ANDROID_KEY_PASSWORD }}
        
    - name: Upload Release APK
      uses: actions/upload-artifact@v4
      with:
        name: release-apk
        path: android/app/build/outputs/apk/release/app-release.apk
`;

    const templatePath = path.join(process.cwd(), '.dev-tools', 'ci', 'android-ci.yml');
    await fs.writeFile(templatePath, template);
    console.log(`   ✅ Template saved to: ${templatePath}`);
  }

  generateReport() {
    console.log('\n📊 CI/CD ANALYSIS REPORT\n');

    // Workflows summary
    console.log('🔄 Workflows:');
    if (this.results.workflows.length === 0) {
      console.log('   ❌ No GitHub workflows found');
    } else {
      this.results.workflows.forEach(workflow => {
        console.log(`   📄 ${workflow.name}`);
        console.log(`      Triggers: ${workflow.triggers.join(', ') || 'None'}`);
        console.log(`      Jobs: ${workflow.jobs.length}`);
        console.log(`      Secrets: ${workflow.secrets.length}`);
        console.log(`      Artifacts: ${workflow.artifacts.length}`);
        console.log(`      Android: ${workflow.android ? 'Yes' : 'No'}`);
        console.log(`      Caching: ${workflow.caching ? 'Yes' : 'No'}`);
        console.log();
      });
    }

    // Recent runs summary
    if (this.results.runSummary) {
      console.log('📈 Recent Runs (last 10):');
      const { total, success, failure, cancelled, inProgress } = this.results.runSummary;
      console.log(`   Total: ${total}`);
      console.log(`   Success: ${success} ✅`);
      console.log(`   Failed: ${failure} ❌`);
      console.log(`   Cancelled: ${cancelled} ⏹️`);
      console.log(`   In Progress: ${inProgress} 🔄`);
      console.log(`   Success Rate: ${total > 0 ? ((success / total) * 100).toFixed(1) : 0}%`);
      console.log();
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      this.results.recommendations.forEach(rec => {
        console.log(`   ${rec}`);
      });
    } else {
      console.log('✅ CI/CD setup looks good!');
    }

    console.log('\n=== END REPORT ===\n');
  }

  async runAnalysis() {
    console.log('🚀 Starting CI/CD Analysis\n');
    console.log(`Directory: ${process.cwd()}`);
    console.log(`Time: ${new Date().toISOString()}\n`);

    try {
      await this.analyzeWorkflows();
      await this.checkGitHubCLI();
      await this.getWorkflowRuns();
      await this.checkAndroidCI();
      await this.generateWorkflowTemplate();

      this.generateReport();
    } catch (error) {
      console.error('💥 Analysis failed:', error.message);
    }
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];

  const helper = new CIHelper();

  if (command === 'template') {
    await helper.generateWorkflowTemplate();
    console.log('✅ Android CI workflow template generated');
  } else if (command === 'runs') {
    await helper.getWorkflowRuns();
  } else if (command === 'workflows') {
    await helper.analyzeWorkflows();
    helper.generateReport();
  } else {
    console.log('\nCI/CD Helper');
    console.log('\nUsage:');
    console.log('  node ci-helper.js              - Run full CI/CD analysis');
    console.log('  node ci-helper.js template      - Generate Android CI workflow template');
    console.log('  node ci-helper.js runs          - Show recent workflow runs');
    console.log('  node ci-helper.js workflows     - Analyze existing workflows');
    console.log();

    if (!command) {
      await helper.runAnalysis();
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CIHelper;