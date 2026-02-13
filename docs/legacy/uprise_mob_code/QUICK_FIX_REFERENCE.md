# Quick Fix Reference Card

> **Last Updated:** 2025-10-01
> **Critical Fix:** NODE_OPTIONS environment variable issue resolved

---

## 🚨 Critical Issues Fixed

### NODE_OPTIONS Process Explosion (RESOLVED ✅)
**What happened:** Global `NODE_OPTIONS=--openssl-legacy-provider` in shell config caused 20+ process cascades

**Symptoms:**
- DeepAgent CLI "hall of mirrors"
- Metro bundler failing to start or spawning duplicates
- Jest worker process explosion
- ENV vars not being picked up

**Fix applied:**
- ✅ Commented out global NODE_OPTIONS in `~/.bashrc`
- ✅ Project already uses `cross-env NODE_OPTIONS=...` correctly in `package.json`
- ✅ Full documentation created: `docs/troubleshooting/NODE_OPTIONS_AND_ENV_ISSUES.md`

**Action for current sessions:**
```bash
# WSL/Linux:
unset NODE_OPTIONS

# PowerShell:
$env:NODE_OPTIONS = $null
```

---

## 📱 Metro Not Picking Up ENV Changes

**Problem:** Changed `.env` but app still uses old values

**Root cause:** `react-native-config` bakes ENV vars into `BuildConfig` at **compile time**, not runtime

**Fix:**
```bash
# Stop Metro (Ctrl+C)
cd android
./gradlew clean assembleDebug
cd ..
adb uninstall com.app.uprise.debug
adb install android/app/build/outputs/apk/debug/app-debug.apk
npm start -- --reset-cache
```

**Why:** Metro restart alone won't pick up ENV changes - you must rebuild the Android app.

**Full guide:** `docs/troubleshooting/NODE_OPTIONS_AND_ENV_ISSUES.md`

---

## ⚡ Quick Commands

### Start Metro (correct way):
```bash
npm start
# Project script already sets NODE_OPTIONS correctly
```

### Build and install debug APK:
```bash
cd android && ./gradlew assembleDebug && cd ..
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Check if NODE_OPTIONS is polluting your environment:
```bash
# Should be empty:
echo $NODE_OPTIONS          # Linux/WSL
echo $env:NODE_OPTIONS      # PowerShell
```

### Kill zombie Metro/Node processes:
```bash
# Linux/WSL:
pkill -f metro
pkill -f node

# PowerShell:
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### Verify ENV vars in app:
```javascript
import Config from 'react-native-config';
console.log('API_BASE_URL:', Config.API_BASE_URL);
```

---

## 📚 Documentation

- **Full troubleshooting guide:** `docs/troubleshooting/NODE_OPTIONS_AND_ENV_ISSUES.md`
- **Android runbook:** `docs/guides/runbooks/android.md`
- **Change log:** `docs/overview/CHANGELOG.md`
- **Project docs:** `docs/README.md`

---

## 🔍 Verification Checklist

After applying NODE_OPTIONS fix:

- [ ] `echo $NODE_OPTIONS` returns empty (WSL)
- [ ] `echo $env:NODE_OPTIONS` returns empty (PowerShell)
- [ ] New terminals start clean (no NODE_OPTIONS inherited)
- [ ] Metro starts successfully with `npm start`
- [ ] Only 1-3 node processes running (not 20+)
- [ ] DeepAgent CLI works without "hall of mirrors"
- [ ] ENV changes picked up after rebuild

---

## 🆘 Still Having Issues?

1. Check full docs: `docs/troubleshooting/NODE_OPTIONS_AND_ENV_ISSUES.md`
2. Review CHANGELOG: `docs/overview/CHANGELOG.md` (search for "2025-10-01")
3. Check Android runbook: `docs/guides/runbooks/android.md`

---

**Questions?** This fix resolves the root cause of multiple issues including DeepAgent crashes, Metro failures, Jest explosions, and ENV pickup problems. All related issues should be resolved after applying the fix and rebuilding.
