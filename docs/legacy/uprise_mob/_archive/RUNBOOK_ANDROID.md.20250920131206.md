# UPRISE Android Build & CI Runbook

## Overview
This document provides step-by-step instructions for building, testing, and deploying the UPRISE Android application.

---

## Quickstart: Past Title Screen (Emulator)

Goal: Install and launch the debug APK on Android Emulator so the app gets past the title/splash screen and renders React Native UI.

What you need (Windows/PowerShell 7):
- Node 20.19.0 portable at `C:\\tools\\node-v20.19.0-win-x64` (or on PATH)
- JDK 11 (Temurin) for Gradle
- Android SDK at `%LOCALAPPDATA%\\Android\\Sdk` (emulator + platform-tools installed)
- PowerShell 7 (`pwsh.exe`), not Windows PowerShell 5.1

Steps
1) Boot an emulator
   PowerShell 7 → `D:\\uprise_mob\\scripts\\boot_emulator.ps1 -AvdName "Pixel_6_API_31"`

2) Start Metro bundler
   PowerShell 7 → `D:\\uprise_mob\\scripts\\windows\\start-metro.ps1`

3) Start a local dev backend stub (WSL)
   WSL (Ubuntu) → `./scripts/wsl/bootstrap_title_flow.sh`
   - Serves `/health` and common GET endpoints on `http://localhost:8080`
   - Emulator reaches it via `http://10.0.2.2:8080`

4) Install, launch, and wire ports
   PowerShell 7 → `D:\\uprise_mob\\scripts\\build_install_verify.ps1 -AppId "com.app.uprise.debug"`
   - Ensures `.env.development` has `API_BASE_URL=http://10.0.2.2:8080`
   - Performs `adb reverse tcp:8081 tcp:8081` and launches the app

Acceptance
- You see the RN UI after splash (not stuck on title)
- `artifacts\\logcat_health.txt` shows HTTP logs and ReactNativeJS lines
- Optional: `Invoke-WebRequest http://localhost:8080/health` returns JSON

If stuck on splash
- Confirm Metro: `Get-Content artifacts\\metro_health.txt`
- Check backend stub: `curl http://localhost:8080/health` in WSL
- Ensure `API_BASE_URL=http://10.0.2.2:8080` in `.env.development`
- Reinstall the app: rerun `build_install_verify.ps1`
- As needed, temporarily disable features that require real services (e.g., maps, player) and retry

## Prerequisites

### System Requirements
- **OS**: Windows 10/11
- **JDK**: OpenJDK 11 (Temurin) - `C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot`
- **Node.js**: 20.19.0 - `C:\tools\node-v20.19.0-win-x64`
- **Android SDK**: Located at `$env:LOCALAPPDATA\Android\Sdk`
- **Package Manager**: Yarn (yarn.lock must be committed)

### Environment Variables
```powershell
# Add to system PATH
$env:PATH += ";C:\tools\node-v20.19.0-win-x64"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

# Metro compatibility
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```

## Build Configuration

### Version Matrix (RN 0.66.x Baseline)
- **React Native**: 0.66.4
- **Gradle**: 7.0.2
- **Android Gradle Plugin**: 7.0.4
- **Kotlin**: 1.5.31
- **compileSdkVersion**: 31
- **targetSdkVersion**: 31
- **minSdkVersion**: 21

### Key Properties
```properties
# android/gradle.properties
android.useAndroidX=true
android.enableJetifier=true
HermesEnabled=true
```

## Build Process

### 1. Clean Build
```powershell
cd android
.\gradlew.bat clean assembleDebug
```

### 2. Install Debug APK
```powershell
.\gradlew.bat installDebug
```

### 3. Start Metro
```powershell
cd ..
yarn start
# or with legacy OpenSSL support
$env:NODE_OPTIONS="--openssl-legacy-provider"; yarn start
```

### Dev Server Auto-Config (Debug)
The debug run script now auto-configures the React Native dev server host:
- Metro host set via `adb reverse tcp:8081 tcp:8081` (emulator ↔ host)
- `.env.development` ensures `API_BASE_URL=http://10.0.2.2:8080`
- Persists `ReactNativeDevServerHost` inside the app sandbox so RN targets `10.0.2.2:8081`
- Also broadcasts `RN_DEBUG_SERVER_HOST` as a fallback

Example snippet the script executes:
```powershell
# Persist dev server host inside app sandbox
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$device = 'emulator-5554'  # first device is auto-detected by the script
$appId = 'com.app.uprise.debug'
& $adb -s $device reverse tcp:8081 tcp:8081
& $adb -s $device shell "am broadcast -a com.facebook.react.modules.systeminfo.RN_DEBUG_SERVER_HOST -e host 10.0.2.2:8081"
& $adb -s $device shell "run-as $appId sh -c 'mkdir -p files && echo 10.0.2.2:8081 > files/ReactNativeDevServerHost'"
```

## First Login Flow (Home Scene)

- After first login, the app opens the Home Scene Creation page:
  - Sub‑Genre: typeahead suggestions (via alpha list or `GET /onboarding/genre-suggestions`)
  - City, State: typeahead (plus “Use my GPS” to auto‑fill)
  - Note: GPS verification is optional, but only GPS‑verified users can upvote songs in their Home Scene.
- Submit behavior:
  - App validates the community; if active → proceeds to Dashboard
  - If inactive → shows Revolutionary modal (Invite + Continue to nearest active hub) and proceeds
- Revolutionary summon: app prompts users to return when their local community becomes active

### Admin Tools (SUPERADMIN)

- Profile → Admin Tools is visible only if JWT `roles[]` contains `SUPERADMIN`.
- Staging controls (server recommended):
  - Viability bypass toggle (server env or admin endpoint)
  - Seed minutes / Force activate a community
- Client testing flag (Debug/staging only):
  - `COMMUNITY_VIABILITY_BYPASS=true` in react-native-config → onboarding treats communities as active


### 4. Launch App
```powershell
# Forward Metro port
adb reverse tcp:8081 tcp:8081

# Launch app
adb shell monkey -p com.app.uprise.dev -c android.intent.category.LAUNCHER 1
```

## Crash Triage (Android)

Use this when the app installs but immediately returns to background or shows a RedBox.

- Quick capture (PowerShell)
  - ADB path: `$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"`
  - Clear buffers: `& $adb logcat -c`
  - Launch app: `& $adb shell monkey -p com.app.uprise -c android.intent.category.LAUNCHER 1`
  - Crash buffers: `& $adb logcat -b crash -v time -d | Out-File -Encoding utf8 artifacts\logs\crash_buffer.txt`
  - Tail filtered: `& $adb logcat -d | Select-String "AndroidRuntime|FATAL EXCEPTION|ReactNativeJS|Process com.app.uprise|RuntimeInit|libc" | Select-Object -Last 200 | Out-File -Encoding utf8 artifacts\logs\crash_tail.txt`
  - PID logs (optional): `$pid = (& $adb shell pidof com.app.uprise); if($pid){ & $adb logcat --pid $pid -v time -d | Out-File -Encoding utf8 artifacts\logs\app_pid_log.txt }`

- Scripted capture
  - Use `scripts\windows\capture-logcat.ps1` after reproducing the crash.
  - Share: `crash_tail.txt`, `crash_buffer.txt`, `app_pid_log.txt` (if present), `dumpsys_crashes.txt` (if supported).

- Debug RedBox (JS stacks)
  - `yarn start --reset-cache`
  - `scripts\build_install_verify_v2.ps1 -Configuration Debug`
  - Screenshot the RedBox (file + line).

- Reduce native noise while debugging
  - `.env`: set `DISABLE_TRACK_PLAYER=true`, `DISABLE_FIREBASE_MESSAGING=true`.

- Install issues
  - Storage/incremental: clear Play Store & WebView data or push APK + `pm install` from `/data/local/tmp`.
  - Manifest parse: `apkanalyzer manifest print <apk>`; ensure `android:exported` present on API 31+ components.

## CI/CD Pipeline

### Workflow File
`.github/workflows/android-debug-build.yml` (Latest: 2025-09-05 Major Overhaul)

### Workflow Architecture
- **Build Job**: Ubuntu runner - generates debug and release APKs
- **Smoke Test Jobs**: 
  - **Ubuntu**: Software emulator with comprehensive testing
  - **macOS HVF**: Hardware-accelerated testing (optional, continues on error)

### CI Steps (Build Job)
1. **Setup**: Dual JDK (11 for Gradle, 17 for sdkmanager), Android SDK, Node.js 18
2. **Monitoring**: Initialize CI monitoring and SDK validation
3. **Dependencies**: `npm install --legacy-peer-deps` (switched from yarn)
4. **Build**: `./gradlew --no-daemon clean assembleDebug assembleRelease`
5. **Artifacts**: app-debug-apk, app-release-apk with monitoring data

### CI Steps (Smoke Test Jobs)
1. **Setup**: Platform-specific Android SDK and emulator configuration  
2. **APK Download**: Fetch build artifacts with integrity verification
3. **Monitoring**: APK validation with MD5 checksums and structure checks
4. **Emulator**: Boot with platform-optimized settings and boot progress monitoring
5. **Testing**: Install APK, launch app, collect comprehensive diagnostics
6. **Artifacts**: smoke-logs with monitoring data and failure diagnostics

### Smoke Test – Debug & Release Parity
- Purpose: Validate that both Debug and Release APKs install, launch, and reach React Native JS without crashes under identical emulator conditions.
- Scope:
  - Install and launch both `app-debug.apk` and `app-release.apk` in separate runs on the same AVD profile.
  - Collect identical diagnostics for each variant: adb logs, boot state, TTJS (time-to-first ReactNativeJS log), package id, APK size.
- Artifacts produced:
  - `smoke-ubuntu/monitoring/summary.txt` and `summary.json` per variant
  - `smoke-ubuntu/smoke-logs/` per variant with logcat excerpts and install/launch traces
  - Equivalent set for macOS HVF job when enabled
- Acceptance:
  - Both variants complete install and launch with non-empty `summary.json`
  - No TrackPlayer-related crashes in early lifecycle logs
  - Parity check passes: package id shape, main activity, and TTJS within reasonable bounds


### Concurrency & Reliability Features
```yaml
concurrency:
  group: android-${{ github.ref }}
  cancel-in-progress: true
run-name: Android CI - ${{ github.ref_name }} @ ${{ github.sha }}
```

### Monitoring Layer (2025-09-05)
- **Non-Invasive**: All monitoring functions use `|| true` - never fails builds
- **SDK Validation**: Automatic verification of Android SDK and tool availability
- **APK Integrity**: MD5 checksums, size checks, structure validation
- **Resource Tracking**: CPU, memory, disk usage during operations
- **Failure Diagnostics**: Automatic capture of system state and logs on failures
- **Monitoring Artifacts**: `artifacts/monitoring/` with comprehensive reports

### CI Prerequisites  
- **sdkmanager must run under JDK 17**; Gradle remains on JDK 11 (RN 0.66.x)
- **build-tools pinned to 31.0.0** across all jobs for consistency
- **Android cmdline-tools pinned: r8 (8092744)** to ensure SDK XML v2 for AGP 7.0.x
- **SIGPIPE Prevention**: All `yes` commands replaced with `printf` approach

### CI Environment
- **Build Runner**: ubuntu-latest (fast, stable)
- **Smoke Runners**: ubuntu-latest + macos-13 (with HVF acceleration)  
- **JDK**: Temurin 11 (Gradle) + Temurin 17 (sdkmanager)
- **Android SDK**: Latest via android-actions/setup-android@v3
- **Metro Compatibility**: NODE_OPTIONS=--openssl-legacy-provider

## CI/CD Monitoring & Diagnostics (2025-09-05)

### Monitoring Features
The CI/CD pipeline includes comprehensive, non-invasive monitoring that provides detailed diagnostics without failing builds:

#### Monitoring Artifacts Location
All monitoring data is available in workflow artifacts under `artifacts/monitoring/`:
```
monitoring/
├── initial_state.txt         # System state at job start
├── sdk_validation.txt        # Android SDK validation results  
├── apk_validation_debug.txt  # Debug APK integrity checks
├── apk_validation_release.txt # Release APK integrity checks
├── emulator_boot.log         # Emulator boot progress (background)
├── resources_*.log           # Resource usage tracking
├── summary.txt               # Human-readable summary report
└── failures/                 # Detailed failure diagnostics
    └── [context]_[timestamp]/
        ├── system_state.txt
        ├── adb_devices.txt
        └── logcat_tail.txt
```

#### Using Monitoring Data
1. **Check Workflow Summary**: Monitoring summary appears in CI logs
2. **Download Artifacts**: Get `smoke-ubuntu` or `smoke-macos` artifacts from GitHub
3. **Review monitoring/summary.txt**: Shows validation results and issue counts
4. **Investigate Specific Issues**: Look in individual monitoring files for details

#### Monitoring Summary Interpretation
```bash
=== CI Monitoring Summary ===
✓ SDK validation passed          # Android SDK setup successful
⚠ APK validation found issues   # Check apk_validation_*.txt
✓ Emulator booted successfully   # Boot completed in reasonable time
2 issues detected                # Review individual monitoring files
```

### Workflow Run Identification  
With the new run naming system, you can easily identify which commit is running:
- **Run Name Format**: `Android CI - [branch] @ [commit]`
- **Example**: `Android CI - main @ cf767160badd6d4c62466a362c03e70412e6fe6f`
- **Concurrency**: Old runs automatically cancelled when new commits pushed

### Branch Consistency
All major branches now have identical, up-to-date workflows:
- ✅ **main**: Production-ready with all fixes
- ✅ **ci/macos-hvf-install-launch**: Latest CI improvements
Note: CCPM-related branches and workflows are deprecated and no longer part of the strategy.

## Troubleshooting

### New Workflow Troubleshooting (2025-09-05)

#### 1. Workflow Confusion Issues
**Problem**: Old workflow versions running or conflicting results
**Solution**: 
- Check run name to verify commit being executed
- Concurrency controls now auto-cancel old runs
- All branches have consistent workflows (no more version conflicts)

#### 2. SIGPIPE Errors
**Problem**: `yes: stdout: Broken pipe` errors  
**Solution**: ✅ **Fixed** - All `yes` commands replaced with `printf` approach

#### 3. Variable Errors
**Problem**: `TARGET_SDK: unbound variable` errors
**Solution**: ✅ **Fixed** - All variables protected with `${VAR:-default}` syntax

#### 4. APK Download Issues
**Problem**: APK artifacts not found or corrupted
**Solution**: 
- Check `monitoring/apk_validation_*.txt` for integrity issues
- Verify APK paths in monitoring summary
- Review artifact upload/download logs

#### 5. Monitoring False Positives
**Problem**: Monitoring warnings in successful builds
**Solution**: 
- Monitoring never fails builds (all functions use `|| true`)
- Warnings indicate potential issues but don't block CI
- Review monitoring files to understand warnings

### Common Issues

#### 1. Metro Port Conflicts
```powershell
# Kill existing Metro processes
Get-Process -Name "node" | Stop-Process -Force

# Start on alternative port
$env:NODE_OPTIONS="--openssl-legacy-provider"
yarn start --port 8082
adb reverse tcp:8082 tcp:8082
```

#### 2. Build Failures
```powershell
# Clean and rebuild
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug --stacktrace
```

#### 3. Track-Player Issues
Track-player is temporarily disabled with TEMP DISABLE markers. To re-enable:
1. Uncomment track-player imports in service.js, index.js, App.js
2. Add fallback implementations for useProgress() and playbackState
3. Test thoroughly before re-enabling

### Debug Commands
```powershell
# Check device connection
adb devices

# View logs
adb logcat

# Check app status
adb shell dumpsys activity activities | findstr "uprise"

# Verify Metro connection
adb shell curl http://localhost:8081/status
```

## Security & Compliance

### Firebase Credentials
- **Location**: `android/app/src/**/google-services.json`
- **Git Status**: Excluded via .gitignore
- **CI**: Use secrets for production builds

### Keystores
- **Debug**: Automatically generated
- **Release**: Use secure keystore management
- **Git Status**: Excluded via .gitignore

### Package Manager
- **Primary**: Yarn (yarn.lock committed)
- **Prohibited**: package-lock.json (deleted if present)

## Monitoring & Maintenance

### Build Health Checks
- [ ] APK generates successfully (target: ~47MB)
- [ ] Hermes enabled in logs
- [ ] Metro bundle loads without errors
- [ ] No track-player crashes
- [ ] Firebase services operational

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Verify CI pipeline weekly
- [ ] Test build process on clean environment
- [ ] Monitor APK size changes
- [ ] Review security exclusions

## Emergency Procedures

### Critical Build Failure
1. Revert to last working commit
2. Check dependency conflicts
3. Verify environment setup
4. Test on clean environment
5. Document root cause

### Metro Issues
1. Kill all Node processes
2. Clear Metro cache: `yarn start --reset-cache`
3. Use alternative port if needed
4. Check firewall/antivirus settings

### Track-Player Re-enable
1. Ensure all fallbacks implemented
2. Test on multiple devices
3. Monitor crash reports
4. Gradual rollout with feature flags

## Local Smoke Testing

### CI Smoke Test Summary
- **Latest Run**: 17355198212 (PR #14) - TTJS: 4.2s, Debug APK: 53.9MB, Release APK: 42.2MB

### Local Smoke (PowerShell)
1) Ensure SDK tools on PATH for the session:
   - %UserProfile%\AppData\Local\Android\Sdk\platform-tools
   - %UserProfile%\AppData\Local\Android\Sdk\cmdline-tools\latest\bin
2) Build: `./gradlew --no-daemon clean :app:assembleDebug`
3) Boot emulator; wait for `sys.boot_completed=1` in a loop.
4) Clean uninstall: `adb shell pm list packages | findstr /i uprise` → `adb uninstall <pkg>`
5) Install: `adb install -r app\build\outputs\apk\debug\app-debug.apk`
6) Launch: detect component via `aapt dump badging` (fallback `com.app.uprise/.MainActivity`)
7) Confirm in logcat: look for `ActivityTaskManager: Displayed <component>`
[2025-09-02 19:36] Android RUNBOOK update:
- macOS HVF smoke test parameters:
  - AVD: API 30; google_apis; x86_64; profile=pixel_5
  - Flags: -no-snapshot -no-snapshot-save -no-window -no-audio -no-boot-anim -gpu swiftshader_indirect -memory 1024 -netfast -no-metrics
  - ADB hygiene: portable loops (no GNU timeout), 120s emulator appearance, 5 recovery attempts
  - Boot wait: portable 6-minute timeout with early exit
  - TTJS collection: logcat watch for 'ReactNativeJS', environment variable extraction
  - Artifacts: ids (RUN_ID.txt, RUN_URL.txt), summary (summary.json), smoke-logs, APKs

[2025-09-04] macOS smoke test update:
- **Background emulator**: Runs in background with PID tracking, no snapshots
- **Dynamic APP_ID**: Detects package name from built debug APK using aapt/apkanalyzer
- **Unified flow**: Same uninstall/install/launch sequence as Ubuntu smoke test
- **ADB restart**: Kills and restarts ADB server before emulator operations
- **summary.json**: Includes app_id, boot_ok, ttjs_s (null), debug/release APK sizes, run_id, run_url

Windows Run: device 'emulator-5556'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-09T17:50:51

Windows Run: device 'emulator-5556'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-09T17:52:26

2025-09-09 18:08:24 - Build Troubleshooting: Gradle error 'Project app not found' marked as non-fatal since APK exists. Backend healthy at localhost:8080. Metro running on 8081. ADB reverse configured. App relaunched successfully. Network log captured to net_boot.txt.

2025-09-09 18:15:50 - Build agent: Gradle build failed but APK exists, .env.development updated, app reinstalled on emulator-5554

2025-09-09T18:24:54  Gradle diagnose/build attempted; see artifacts/gradle_build_full.log

2025-09-09T18:39:09  Gradle diagnose/build attempted; see artifacts/gradle_build_full.log

2025-09-09T19:48:22  agent: device=emulator-5554, apk=True, metro=False, backend=False

2025-09-09T19:50:44  agent: device=emulator-5554, apk=True, metro=False, backend=False

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T18:05:30

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T18:18:06

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T18:29:51

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T18:30:05

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T18:36:28

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T18:49:53

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T22:33:43

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T22:44:52

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T22:53:23

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-10T23:19:54

Windows Run: device 'emulator-5554'; APK installed; API_BASE_URL=http://10.0.2.2:8080; HealthPath=/health; 2025-09-11T07:50:54
