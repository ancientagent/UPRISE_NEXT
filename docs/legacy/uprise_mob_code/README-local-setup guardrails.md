# Local Development Setup Guide

This guide ensures your local development environment aligns with project guardrails and CI requirements.

## 🛡️ Project Guardrails

- **Windows non-admin**: All tools must be user-writable
- **No global installs**: Use portable/standalone installations
- **Version pinning**: Node v20.19.0, JDK 11 (Temurin)
- **User profile paths**: Android SDK in `%LOCALAPPDATA%`

## 📋 Required Tools

### Node.js v20.19.0 (Portable)
- **Path**: `C:\tools\node-v20.19.0-win-x64`
- **Download**: [Node.js v20.19.0 Windows x64](https://nodejs.org/dist/v20.19.0/node-v20.19.0-win-x64.zip)
- **Setup**: Extract to `C:\tools\` (create directory if needed)
- **Verify**: `C:\tools\node-v20.19.0-win-x64\node.exe --version`

### Java 11 (Temurin)
- **Path**: `C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot`
- **Download**: [Eclipse Temurin JDK 11](https://adoptium.net/temurin/releases/?version=11)
- **Verify**: `java -version` (should show OpenJDK 11.0.28)

### Android SDK
- **Path**: `%LOCALAPPDATA%\Android\Sdk`
- **Install**: Use Android Studio or standalone SDK tools
- **Verify**: `%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe version`

### GitHub CLI (Optional)
- **Download**: [GitHub CLI](https://cli.github.com/)
- **Alternative**: Use Web UI fallback at [GitHub Actions](https://github.com/ancientagent/uprise_mob/actions)

## ⚙️ Environment Setup

### PowerShell Configuration
```powershell
# Add Node.js to PATH for current session
$env:PATH += ";C:\tools\node-v20.19.0-win-x64"

# Set Java environment
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot"
$env:PATH += ";$env:JAVA_HOME\bin"

# Set Android SDK
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\cmdline-tools\latest\bin"
```

### NPM Configuration
```powershell
# Set PowerShell as script shell (required for CI helpers)
npm config set script-shell "powershell.exe"
```

## 🚀 Quick Start

### 1. Verify Tools
```powershell
node --version    # Should show v20.19.0
java -version     # Should show OpenJDK 11.0.28
adb version       # Should show Android Debug Bridge
```

### 2. Install Dependencies
```powershell
# Install project dependencies
npm install --legacy-peer-deps
```

### 3. CI Helper Commands
```powershell
# List recent CI runs
npm run ci:list

# Show jobs for latest run
npm run ci:jobs

# Watch live logs
npm run ci:tail

# Rerun failed jobs
npm run ci:rerun
```

## 🔧 Troubleshooting

### GitHub CLI Not Available
If `gh` command is not found, the CI helpers will automatically show:
- Web UI fallback URL: https://github.com/ancientagent/uprise_mob/actions
- Installation instructions for GitHub CLI

### Node Version Issues
- **Problem**: Using Node v22+ instead of v20.19.0
- **Solution**: Use the portable Node v20.19.0 installation
- **Verify**: Check `node --version` shows v20.19.0

### Java Version Issues
- **Problem**: Using JDK 17+ instead of JDK 11
- **Solution**: Install Eclipse Temurin JDK 11
- **Verify**: Check `java -version` shows OpenJDK 11.0.28

### Android SDK Issues
- **Problem**: SDK not found or wrong path
- **Solution**: Install Android SDK to `%LOCALAPPDATA%\Android\Sdk`
- **Verify**: Check `adb version` works

## 📁 Project Structure

```
uprise_mob/
├── tools.json                    # Local tool configurations
├── ci/
│   └── ci-tools.ps1             # CI helper scripts with Web UI fallback
├── scripts/
│   ├── local-build.ps1          # Local build automation
│   └── extract-apk-info.ps1     # APK analysis tools
└── package.json                 # NPM scripts calling PowerShell helpers
```

## 🔗 Useful Links

- [GitHub Actions](https://github.com/ancientagent/uprise_mob/actions) - CI/CD workflows
- [Node.js v20.19.0](https://nodejs.org/dist/v20.19.0/) - Portable download
- [Eclipse Temurin JDK 11](https://adoptium.net/temurin/releases/?version=11) - Java download
- [GitHub CLI](https://cli.github.com/) - Optional CLI tool

---

**Note**: This setup ensures compatibility with CI environment and maintains project guardrails for Windows non-admin development.
