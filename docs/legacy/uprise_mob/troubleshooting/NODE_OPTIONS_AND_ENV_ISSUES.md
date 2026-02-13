# NODE_OPTIONS and Environment Variable Issues

## Critical Fix: NODE_OPTIONS Process Explosion (2025-09-30)

### The Problem
Setting `NODE_OPTIONS` globally in shell environment (e.g., `.bashrc`) causes catastrophic issues:
- **DeepAgent CLI**: "Hall of mirrors" - spawns 20+ Node processes infinitely
- **Metro Bundler**: May fail to start or pick up environment variables correctly
- **Jest**: Process explosion with worker processes cascading
- **Any IDE using Node**: Duplicate processes, memory issues, authentication failures

### Root Cause
When `NODE_OPTIONS` is exported globally:
```bash
# ❌ WRONG - causes process explosion
export NODE_OPTIONS=--openssl-legacy-provider
```

Every Node process inherits this flag, and when tools spawn child processes (Metro, Jest workers, IDE extensions), each child also inherits it, creating a cascade of processes that can overwhelm the system.

### The Solution

#### 1. **Remove Global NODE_OPTIONS** (CRITICAL)
Edit `~/.bashrc` and comment out or remove:
```bash
# ❌ Remove this line:
# export NODE_OPTIONS=--openssl-legacy-provider

# ✅ Comment it out:
# export NODE_OPTIONS=--openssl-legacy-provider  # Commented out - causes issues with DeepAgent CLI and Metro
```

Then reload your shell:
```bash
source ~/.bashrc
# OR restart your terminal
```

#### 2. **Use Per-Project NODE_OPTIONS** (CORRECT)
The UPRISE project already has this configured correctly in `package.json`:

```json
{
  "scripts": {
    "start": "cross-env NODE_OPTIONS=--openssl-legacy-provider react-native start",
    "android": "cross-env NODE_OPTIONS=--openssl-legacy-provider react-native run-android",
    "bundle:android": "cross-env NODE_OPTIONS=--openssl-legacy-provider react-native bundle ..."
  }
}
```

This ensures the flag is **only** set for Metro/React Native processes, not globally.

#### 3. **Clear NODE_OPTIONS in Current Session**
If you're in an active terminal with NODE_OPTIONS set:
```bash
unset NODE_OPTIONS
echo "NODE_OPTIONS cleared"
```

---

## Metro Not Picking Up .env Files

### Issue
Metro bundler doesn't recognize changes to `.env` or `.env.development` files.

### Why This Happens
1. **react-native-config** reads `.env` files at **build time** (when Gradle runs)
2. Metro doesn't automatically reload when `.env` changes
3. Android app needs to be **rebuilt** for env changes to take effect
4. The `BuildConfig` class is generated during Gradle build, not Metro bundling

### Solution Steps

#### For Development (.env or .env.development changes):

1. **Stop Metro** (Ctrl+C in the terminal running Metro)

2. **Rebuild the Android app:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   cd ..
   ```

3. **Reinstall the APK:**
   ```bash
   adb uninstall com.app.uprise.debug
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Restart Metro with clean cache:**
   ```bash
   npm start -- --reset-cache
   # OR using the configured script:
   npm start
   ```

5. **Launch the app:**
   ```bash
   npm run android
   # OR manually:
   adb shell am start -n com.app.uprise.debug/.MainActivity
   ```

#### Quick Command (all-in-one):
```bash
# Stop Metro first (Ctrl+C), then run:
cd android && ./gradlew clean assembleDebug && cd .. && adb uninstall com.app.uprise.debug && adb install android/app/build/outputs/apk/debug/app-debug.apk && npm start -- --reset-cache
```

### Verification
Check if env vars are loaded in your app:
```javascript
import Config from 'react-native-config';

console.log('API_BASE_URL:', Config.API_BASE_URL);
console.log('All config:', Config);
```

If `Config.API_BASE_URL` is `undefined`:
1. Check `android/app/build.gradle` has:
   ```gradle
   project.ext.reactNativeConfig = [
       buildConfigPackage: "com.app.uprise"
   ]
   apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
   ```

2. Verify `.env` file exists in project root (not in `android/` folder)

3. Check `.env` file has no BOM (Byte Order Mark) - save as UTF-8 without BOM

---

## Related Issues Explained

### Yes, These Issues Are Related!

The NODE_OPTIONS environment variable issue **absolutely** could have been contributing to your Metro env pickup problems:

1. **Process State Pollution**: Global NODE_OPTIONS can cause Metro to spawn in a degraded state where it doesn't properly initialize environment loading

2. **react-native-config Initialization**: If Metro or its child processes are in a weird state due to NODE_OPTIONS cascade, the `dotenv.gradle` plugin might not execute correctly

3. **Build Cache Corruption**: Multiple Metro instances fighting for the same cache could corrupt build artifacts

4. **Gradle Daemon Issues**: If Gradle spawns with inherited NODE_OPTIONS, it might interfere with the `dotenv.gradle` plugin execution

### How to Tell If You're Affected

Run this check:
```bash
# Check for multiple Metro processes
ps aux | grep metro | grep -v grep

# Check for multiple node processes
ps aux | grep node | wc -l

# Should see < 5 processes. If you see 20+, NODE_OPTIONS is still set globally
```

---

## Environment File Hierarchy

UPRISE uses this env file precedence (highest to lowest):

1. `.env.development` (for development builds)
2. `.env.production` (for release builds)
3. `.env` (fallback for all builds)

**Current state:**
- `.env` exists with `API_BASE_URL=http://10.0.2.2:3000`
- `.env.development` exists with same config

**Best Practice:**
Keep emulator-specific config in `.env.development`:
```bash
# .env.development
API_BASE_URL=http://10.0.2.2:3000
REFRESH_TOKEN_URL=/auth/refresh
UPDATED_USERDETAILS=/user/me
```

Keep production URLs in `.env.production` (when created).

---

## Troubleshooting Checklist

- [ ] Removed global NODE_OPTIONS from `~/.bashrc`
- [ ] Unset NODE_OPTIONS in current terminal: `unset NODE_OPTIONS`
- [ ] Verified `package.json` scripts use `cross-env NODE_OPTIONS=...`
- [ ] `.env` file exists in project root
- [ ] `.env` file is UTF-8 without BOM
- [ ] `android/app/build.gradle` has `buildConfigPackage: "com.app.uprise"`
- [ ] `android/app/build.gradle` applies `dotenv.gradle`
- [ ] Ran `./gradlew clean` after env changes
- [ ] Rebuilt APK after env changes
- [ ] Reinstalled APK after rebuild
- [ ] Restarted Metro with `--reset-cache`
- [ ] No zombie Metro processes running (`ps aux | grep metro`)
- [ ] Checked `Config.API_BASE_URL` in app logs

---

## For Other Projects Needing OpenSSL Legacy Provider

If you have **other projects** that need the OpenSSL legacy provider:

### Option 1: Per-Project (Recommended)
Add to that project's `package.json`:
```json
{
  "scripts": {
    "start": "cross-env NODE_OPTIONS=--openssl-legacy-provider <your-command>",
    "dev": "cross-env NODE_OPTIONS=--openssl-legacy-provider <your-command>"
  }
}
```

### Option 2: Project-Level .nvmrc + shell wrapper
Create a wrapper script for that project only.

### Option 3: Per-Command (Manual)
```bash
NODE_OPTIONS=--openssl-legacy-provider npm run dev
```

**Never use global export in `.bashrc`** - it will break DeepAgent, Metro, Jest, and other Node-based tools.

---

## References
- CHANGELOG.md: 2025-09-30 entries for NODE_OPTIONS fix
- Phase 2 docs: Environment configuration in `docs/overview/PHASE2_EXECUTION_PLAN.md`
- Android runbook: `docs/guides/runbooks/android.md`
