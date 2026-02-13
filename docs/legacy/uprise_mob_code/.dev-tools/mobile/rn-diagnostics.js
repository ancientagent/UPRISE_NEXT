#!/usr/bin/env node
/**
 * React Native Diagnostics Utility
 * Comprehensive diagnostics for React Native 0.66.4 and TrackPlayer issues
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class RNDiagnostics {
  constructor() {
    this.results = {
      environment: {},
      dependencies: {},
      android: {},
      metro: {},
      trackPlayer: {},
      recommendations: []
    };
  }

  async runCommand(command, options = {}) {
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000,
        ...options
      });
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

  async checkEnvironment() {
    console.log('🔍 Checking Environment...');
    
    // Node.js version
    const nodeResult = await this.runCommand('node --version');
    if (nodeResult.success) {
      this.results.environment.node = nodeResult.stdout;
      const version = parseFloat(nodeResult.stdout.substring(1));
      if (version < 16) {
        this.results.recommendations.push('⚠️  Node.js < 16 detected. RN 0.66.4 works best with Node 16+');
      }
    }

    // Yarn version
    const yarnResult = await this.runCommand('yarn --version');
    if (yarnResult.success) {
      this.results.environment.yarn = yarnResult.stdout;
    }

    // Java version
    const javaResult = await this.runCommand('java -version');
    if (javaResult.success) {
      this.results.environment.java = javaResult.stderr.split('\n')[0];
      if (!javaResult.stderr.includes('11.')) {
        this.results.recommendations.push('⚠️  Java 11 recommended for RN 0.66.4. Current: ' + this.results.environment.java);
      }
    }

    // React Native CLI
    const rnCliResult = await this.runCommand('npx react-native --version');
    if (rnCliResult.success) {
      this.results.environment.reactNativeCli = rnCliResult.stdout;
    }

    console.log('   ✅ Environment check complete');
  }

  async checkPackageJson() {
    console.log('🔍 Analyzing package.json...');
    
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      this.results.dependencies.reactNative = packageJson.dependencies?.['react-native'] || 'Not found';
      this.results.dependencies.react = packageJson.dependencies?.['react'] || 'Not found';
      this.results.dependencies.trackPlayer = packageJson.dependencies?.['react-native-track-player'] || 'Not installed';
      
      // Check for version compatibility
      const rnVersion = this.results.dependencies.reactNative;
      if (rnVersion && !rnVersion.includes('0.66')) {
        this.results.recommendations.push(`⚠️  React Native version mismatch. Expected 0.66.x, found: ${rnVersion}`);
      }

      // Check React version compatibility
      const reactVersion = this.results.dependencies.react;
      if (reactVersion && !reactVersion.startsWith('17.')) {
        this.results.recommendations.push(`⚠️  React 17.x recommended for RN 0.66.4. Found: ${reactVersion}`);
      }

      console.log('   ✅ package.json analysis complete');
    } catch (error) {
      console.log('   ❌ Could not read package.json:', error.message);
    }
  }

  async checkAndroidSetup() {
    console.log('🔍 Checking Android Setup...');
    
    // Android SDK
    const sdkResult = await this.runCommand('echo $ANDROID_HOME');
    this.results.android.sdkPath = sdkResult.stdout || 'Not set';
    
    if (!sdkResult.stdout) {
      this.results.recommendations.push('❌ ANDROID_HOME environment variable not set');
    }

    // Gradle wrapper
    const gradlewPath = path.join(process.cwd(), 'android', 'gradlew');
    try {
      await fs.access(gradlewPath);
      this.results.android.gradlewExists = true;
      
      // Check Gradle version
      const gradleResult = await this.runCommand('./android/gradlew --version', { cwd: process.cwd() });
      if (gradleResult.success) {
        const versionLine = gradleResult.stdout.split('\n').find(line => line.includes('Gradle'));
        this.results.android.gradleVersion = versionLine || 'Unknown';
        
        if (!versionLine?.includes('7.0')) {
          this.results.recommendations.push('⚠️  Gradle 7.0.2 recommended for RN 0.66.4');
        }
      }
    } catch {
      this.results.android.gradlewExists = false;
      this.results.recommendations.push('❌ Gradle wrapper not found in android/gradlew');
    }

    // Check build.gradle files
    const appBuildGradle = path.join(process.cwd(), 'android', 'app', 'build.gradle');
    const projectBuildGradle = path.join(process.cwd(), 'android', 'build.gradle');
    
    try {
      const appGradleContent = await fs.readFile(appBuildGradle, 'utf8');
      this.results.android.compileSdkVersion = this.extractGradleValue(appGradleContent, 'compileSdkVersion');
      this.results.android.targetSdkVersion = this.extractGradleValue(appGradleContent, 'targetSdkVersion');
      this.results.android.minSdkVersion = this.extractGradleValue(appGradleContent, 'minSdkVersion');
    } catch (error) {
      this.results.recommendations.push('❌ Could not read android/app/build.gradle');
    }

    console.log('   ✅ Android setup check complete');
  }

  extractGradleValue(content, key) {
    const regex = new RegExp(`${key}\\s+(\\d+)`);
    const match = content.match(regex);
    return match ? match[1] : 'Not found';
  }

  async checkMetroConfig() {
    console.log('🔍 Checking Metro Configuration...');
    
    const metroConfigPath = path.join(process.cwd(), 'metro.config.js');
    
    try {
      const metroContent = await fs.readFile(metroConfigPath, 'utf8');
      this.results.metro.configExists = true;
      
      // Check for legacy OpenSSL support (needed for Node 18+)
      if (metroContent.includes('legacy-openssl')) {
        this.results.metro.hasLegacyOpenSSL = true;
      } else {
        this.results.metro.hasLegacyOpenSSL = false;
        this.results.recommendations.push('⚠️  Consider adding legacy OpenSSL support for Node 18+ compatibility');
      }
      
      // Check for asset extensions
      const hasAssetExts = metroContent.includes('assetExts');
      this.results.metro.hasCustomAssets = hasAssetExts;
      
    } catch {
      this.results.metro.configExists = false;
      this.results.recommendations.push('⚠️  Metro config not found. May need custom configuration');
    }

    console.log('   ✅ Metro configuration check complete');
  }

  async checkTrackPlayer() {
    console.log('🔍 Diagnosing TrackPlayer Issues...');
    
    // Check if TrackPlayer is installed
    const trackPlayerPath = path.join(process.cwd(), 'node_modules', 'react-native-track-player');
    
    try {
      await fs.access(trackPlayerPath);
      this.results.trackPlayer.installed = true;
      
      // Check package.json for version
      const tpPackagePath = path.join(trackPlayerPath, 'package.json');
      const tpPackageContent = await fs.readFile(tpPackagePath, 'utf8');
      const tpPackage = JSON.parse(tpPackageContent);
      this.results.trackPlayer.version = tpPackage.version;
      
      // Check for common files
      const androidManifestPath = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
      try {
        const manifestContent = await fs.readFile(androidManifestPath, 'utf8');
        this.results.trackPlayer.hasManifestPermissions = manifestContent.includes('FOREGROUND_SERVICE');
        
        if (!this.results.trackPlayer.hasManifestPermissions) {
          this.results.recommendations.push('⚠️  TrackPlayer may need FOREGROUND_SERVICE permission in AndroidManifest.xml');
        }
      } catch {
        this.results.recommendations.push('❌ Could not check AndroidManifest.xml for TrackPlayer permissions');
      }
      
      // Check for auto-linking
      const reactNativeConfigPath = path.join(process.cwd(), 'react-native.config.js');
      try {
        await fs.access(reactNativeConfigPath);
        this.results.trackPlayer.hasReactNativeConfig = true;
      } catch {
        this.results.trackPlayer.hasReactNativeConfig = false;
      }

    } catch {
      this.results.trackPlayer.installed = false;
      this.results.recommendations.push('❌ react-native-track-player not installed');
    }

    // Check for common TrackPlayer issues
    const indexJsPath = path.join(process.cwd(), 'index.js');
    try {
      const indexContent = await fs.readFile(indexJsPath, 'utf8');
      this.results.trackPlayer.hasIndexRegistration = indexContent.includes('TrackPlayer');
    } catch {
      this.results.trackPlayer.hasIndexRegistration = false;
    }

    console.log('   ✅ TrackPlayer diagnosis complete');
  }

  async checkCommonIssues() {
    console.log('🔍 Checking for Common Issues...');
    
    // Check node_modules size (indicator of dependency issues)
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    try {
      const { stdout } = await this.runCommand(`du -sh "${nodeModulesPath}"`);
      this.results.environment.nodeModulesSize = stdout.split('\t')[0];
    } catch {
      // Not available on all systems
    }

    // Check for conflicting dependencies
    try {
      const packageLockPath = path.join(process.cwd(), 'package-lock.json');
      await fs.access(packageLockPath);
      this.results.recommendations.push('⚠️  Both yarn.lock and package-lock.json found. Use only one package manager');
    } catch {
      // No package-lock.json, good for yarn projects
    }

    // Check for Metro cache issues
    const metroCachePath = path.join(process.cwd(), 'metro-cache');
    try {
      await fs.access(metroCachePath);
      this.results.metro.hasCacheDir = true;
    } catch {
      this.results.metro.hasCacheDir = false;
    }

    console.log('   ✅ Common issues check complete');
  }

  generateReport() {
    console.log('\n📊 REACT NATIVE DIAGNOSTICS REPORT\n');

    // Environment
    console.log('🌍 Environment:');
    Object.entries(this.results.environment).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Dependencies
    console.log('\n📦 Dependencies:');
    Object.entries(this.results.dependencies).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Android
    console.log('\n🤖 Android:');
    Object.entries(this.results.android).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Metro
    console.log('\n🚇 Metro:');
    Object.entries(this.results.metro).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // TrackPlayer
    console.log('\n🎵 TrackPlayer:');
    Object.entries(this.results.trackPlayer).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.results.recommendations.forEach(rec => {
        console.log(`   ${rec}`);
      });
    } else {
      console.log('\n✅ No issues detected!');
    }

    // Quick fixes
    console.log('\n🔧 Quick Fixes:');
    console.log('   Clean build: yarn react-native clean');
    console.log('   Reset Metro: yarn start --reset-cache');
    console.log('   Clean Android: cd android && ./gradlew clean && cd ..');
    console.log('   Reinstall deps: rm -rf node_modules yarn.lock && yarn install');

    console.log('\n=== END DIAGNOSTICS ===\n');
  }

  async runDiagnostics() {
    console.log('🚀 Starting React Native Diagnostics\n');
    console.log(`Directory: ${process.cwd()}`);
    console.log(`Time: ${new Date().toISOString()}\n`);

    try {
      await this.checkEnvironment();
      await this.checkPackageJson();
      await this.checkAndroidSetup();
      await this.checkMetroConfig();
      await this.checkTrackPlayer();
      await this.checkCommonIssues();

      this.generateReport();
    } catch (error) {
      console.error('💥 Diagnostics failed:', error.message);
    }
  }
}

// CLI Interface
async function main() {
  const diagnostics = new RNDiagnostics();
  await diagnostics.runDiagnostics();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = RNDiagnostics;