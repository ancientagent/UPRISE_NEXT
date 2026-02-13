# React Native Config Fix - ENV Variables Not Loading

**Date**: 2025-10-02
**Status**: ✅ RESOLVED
**Severity**: Critical - App could not connect to backend

---

## Problem Summary

### Symptoms
- `Config.API_BASE_URL` returned `undefined`
- `Config` object was empty `{}`
- `NativeModules.RNCConfigModule` returned `null`
- App could not connect to backend API
- Login functionality completely broken

### Impact
- **100% login failure rate** - Users could not authenticate
- **0% API connectivity** - No backend communication possible
- **Development blocked** - Unable to test any features requiring API

---

## Root Causes

### 1. Missing Gradle Dependency
`react-native-config` was **NOT** listed in `android/app/build.gradle` dependencies, even though:
- It was in `package.json`
- It was in `android/settings.gradle`
- `dotenv.gradle` was applied
- PackageList auto-included it

**Why it mattered**: Without the explicit dependency declaration, Gradle wouldn't compile the native module properly.

### 2. Missing build_config_package Resource
The `RNCConfigModule` native code looks for a string resource called `build_config_package` to find the BuildConfig class:

```java
// RNCConfigModule.java
int resId = context.getResources().getIdentifier("build_config_package", "string", context.getPackageName());
String className = context.getString(resId);  // Falls back to package name if not found
Class clazz = Class.forName(className + ".BuildConfig");
```

**Without this resource**, the module would silently fail and return an empty object.

### 3. Duplicate Drawable Resources
Build was failing with "Duplicate resources" errors because:
- Metro auto-generates drawable assets from JS `require()` statements
- Manual copies existed in `android/app/src/main/res/drawable-*/`
- Gradle saw both and failed with conflicts

**Result**: Builds kept failing, so old APK from September 30 kept getting installed, making it appear like fixes weren't working.

---

## Solutions Applied

### 1. Added react-native-config to build.gradle Dependencies

**File**: `android/app/build.gradle`

```gradle
dependencies {
    implementation project(':react-native-config')  // ← ADDED
    implementation project(':react-native-splash-screen')
    implementation fileTree(dir: "libs", include: ["*.jar"])
    // ...
}
```

**Why**: Ensures the native module is compiled and linked into the APK.

### 2. Added build_config_package String Resource

**File**: `android/app/build.gradle`

```gradle
android {
    defaultConfig {
        applicationId "com.app.uprise"
        // ... other config
        resValue "string", "build_config_package", "com.app.uprise"  // ← ADDED
    }
}
```

**Why**: Tells `RNCConfigModule` where to find the BuildConfig class (`com.app.uprise.BuildConfig`).

### 3. Removed Duplicate Drawable Directories

**Directories Removed**:
```
android/app/src/main/res/drawable-hdpi/
android/app/src/main/res/drawable-mdpi/
android/app/src/main/res/drawable-xhdpi/
android/app/src/main/res/drawable-xxhdpi/
android/app/src/main/res/drawable-xxxhdpi/
```

**Why**: Metro automatically generates these from JS assets. Manual copies caused build conflicts.

### 4. Clean Build Required

```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

**Why**: Old build artifacts contained the broken configuration. Clean build was essential to apply fixes.

---

## Verification

### Before Fix
```javascript
LOG  === CONFIG DEBUG ===
LOG  NativeModules.RNCConfigModule: null
LOG  Full Config object: {}
LOG  Config.API_BASE_URL: undefined
LOG  Config.BASE_URL: undefined
```

### After Fix
```javascript
LOG  === CONFIG DEBUG ===
LOG  NativeModules.RNCConfigModule: {
  "API_BASE_URL": "http://10.0.2.2:3000",
  "APPLICATION_ID": "com.app.uprise.debug",
  "BUILD_TYPE": "debug",
  "DEBUG": true,
  "REFRESH_TOKEN_URL": "/auth/refresh",
  "UPDATED_USERDETAILS": "/user/me",
  "VERSION_CODE": 45,
  "VERSION_NAME": "1.0"
}
LOG  Config.API_BASE_URL: http://10.0.2.2:3000
```

### Backend Connection Test
```
2025-10-02T10:22:05.143Z [info]: POST /, {"email":"mmmm@yopmail.com","password":"Uprise!234"}
```

✅ **Success**: App successfully connected to backend and sent login request.

---

## Prevention Checklist

### For Future ENV Variable Issues

- [ ] Verify `react-native-config` is in `build.gradle` dependencies
- [ ] Verify `build_config_package` resource exists in `defaultConfig`
- [ ] Check `dotenv.gradle` is applied at top of build.gradle
- [ ] After ENV changes, always rebuild APK (Metro reload is NOT enough)
- [ ] Check APK timestamp to confirm fresh build installed
- [ ] Use debug logging to verify `NativeModules.RNCConfigModule` is not null

### For Build Failures

- [ ] Never manually copy assets to `drawable-*` directories
- [ ] Always run `gradlew clean` before debugging build issues
- [ ] Check `artifacts/gradle_build.log` for actual error (not just "build failed")
- [ ] Verify old APK isn't being installed when builds fail

### Debug Script Pattern

```javascript
// Add to any file that uses Config
if (__DEV__) {
  const { NativeModules } = require('react-native');
  console.log('NativeModules.RNCConfigModule:', NativeModules.RNCConfigModule);
  console.log('Config.API_BASE_URL:', Config.API_BASE_URL);
}
```

---

## Files Modified

### Configuration Files
1. `android/app/build.gradle` - Added dependency and resource
2. `android/app/src/main/java/com/app/upriseradiyo/MainApplication.java` - Verified autolinking
3. `.env.development` - Backend URL maintained at `http://10.0.2.2:3000`

### Script Files
4. `scripts/build_install_verify.ps1` - Fixed port from 8080 to 3000, fixed Gradle path

### Debug Files
5. `src/utilities/utilities.js` - Added NativeModules debug logging

### Documentation
6. `docs/guides/runbooks/android.md` - Added troubleshooting sections
7. `docs/reports/react-native-config-fix-2025-10-02.md` - This document

### Deleted
8. `android/app/src/main/res/drawable-*` directories - Removed duplicates

---

## Related Issues

- [Hall of Mirrors Fix](./hall-of-mirrors-fix.md) - Fixed infinite retry loops
- [Metro Bundler Fix](./metro-bundler-fix-complete.md) - Fixed bundle generation
- [NODE_OPTIONS Fix](../troubleshooting/NODE_OPTIONS_AND_ENV_ISSUES.md) - Fixed global env issues

---

## Key Learnings

1. **react-native-config requires explicit linking on RN 0.66.4** even with autolinking
2. **build_config_package resource is critical** for module to find BuildConfig class
3. **Metro hot reload does NOT reload ENV variables** - always rebuild APK
4. **Build failures can mask the real issue** by installing old APKs
5. **Duplicate resources from manual asset copying** will break builds
6. **Always check APK timestamp** to verify fresh build installation

---

## Timeline

- **09:00** - Issue reported: ENV variables not loading
- **09:15** - Identified Config object empty, NativeModules.RNCConfigModule null
- **09:30** - Added react-native-config to build.gradle dependencies
- **09:45** - Added build_config_package resource
- **10:00** - Discovered duplicate drawable resources blocking builds
- **10:10** - Removed drawable-* directories, ran clean build
- **10:22** - ✅ **RESOLVED**: Config loading, backend connected, login request successful

**Total Resolution Time**: ~1.5 hours

---

*Status: ✅ RESOLVED - ENV variables now load correctly*
*Last Updated: 2025-10-02*
