# UPRISE Mobile — Android Runbook (RN 0.66.x / JDK 11)

This is the one‑pager agents/devs should follow when building/running the Android app locally on Windows (PowerShell).

---

## 0) Environment (Windows / PowerShell)

```powershell
# Java 11 (required by this legacy RN 0.66.x app)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version  # should show 11.x

# Node (portable, pinned)
$env:Path = "C:\tools\node-v20.19.0-win-x64;$env:Path"
node -v       # v20.19.0

# From project root
cd D:\uprise_mob\android
```

> **Policy:** Use PowerShell for all commands (not Git Bash). Do **not** rely on any `.bashrc`.

---

## 1) Build

```powershell
# Stop daemons, clean, build debug
./gradlew --stop
./gradlew clean
./gradlew assembleDebug --stacktrace
```

**If you hit INSTALL_FAILED_UPDATE_INCOMPATIBLE on install:**
- We use a dev suffix for debug builds: `com.app.uprise.dev`.
- Uninstall any existing conflicting package, then reinstall:

```powershell
adb uninstall com.app.uprise        # if a prior non-suffixed debug APK exists
adb uninstall com.app.uprise.dev    # or the dev variant
adb install -r .\app\build\outputs\apk\debug\app-debug.apk
```

---

## 2) App IDs & Strings (debug vs. release)

- **applicationId (release):** `com.app.uprise`
- **debug appIdSuffix:** `.dev` → `com.app.uprise.dev`
- **Strings policy (to avoid duplicates):**
  - Keep `app_name` in file‑based resources.
  - **Do not** set `resValue "string", "app_name", ...` in `build.gradle`.

**Files:**
```
android/app/src/main/res/values/strings.xml         # app_name = "Uprise"
android/app/src/debug/res/values/strings.xml        # app_name = "Uprise (Dev)"
```

If a duplicate error appears:
```
> Duplicate resources: [string/app_name]
```
Remove any `resValue` for `app_name` from `android/app/build.gradle` or delete the conflicting file so only ONE source defines each value per variant.

---

## 3) Firebase (google-services.json)

**Plugin:** `apply plugin: 'com.google.gms.google-services'` is already applied in `android/app/build.gradle` (keep it at the bottom).

**Where to place files:**
```
android/app/src/debug/google-services.json   # client package_name MUST be com.app.uprise.dev
android/app/src/release/google-services.json # client package_name MUST be com.app.uprise
```

**Fix for** `No matching client found for package name 'com.app.uprise.dev'`:
1) In Firebase Console → Project Settings → *Your apps* → Android:
   - Ensure two Android apps exist:
     - `com.app.uprise` (release)
     - `com.app.uprise.dev` (debug)
2) Download each JSON and place as above.
3) Rebuild.

**SHA‑1 for Debug App (what to register in Firebase):**
Use the project’s debug keystore (generated under the app module), not the global one.
```powershell
cd D:\uprise_mob\android
./gradlew signingReport --console=plain | Select-String -Context 0,12 -Pattern "^> Variant: debug$"
```
Look for the block where **Store** equals `D:\uprise_mob\android\app\debug.keystore` and copy its **SHA1** into Firebase for **both** debug and release entries if Google Sign‑In is shared. (Release will later use a real release keystore with its own SHA‑1.)

> If you accidentally registered the wrong SHA‑1 or package name, you can add a new SHA‑1 under the correct Android app in Firebase settings and re‑download the JSON.

---

## 4) Device install / run

```powershell
# Ensure a device/emulator is connected
adb devices

# Install debug APK
adb install -r .\app\build\outputs\apk\debug\app-debug.apk

# Launch (adjust activity if needed)
adb shell monkey -p com.app.uprise.dev -c android.intent.category.LAUNCHER 1
```

If you see signature mismatch errors, uninstall first (see §1).

---

## 5) Known project specifics

- **JDK:** 11 (keep for RN 0.66.x)
- **Hermes:** enabled
- **AndroidX:** enabled + Jetifier enabled
- **No symlinks policy:** everything is vendored or imported via Gradle
- **ScalableVideoView:** vendored as a local Gradle module
  - Module path: `android/external/scalableviewer/`
  - `settings.gradle` includes `':scalableviewer'`
  - `app/build.gradle` depends on `implementation project(':scalableviewer')`
- **Track Player:** temporarily excluded due to ExoPlayer conflicts; re‑enable when dependency matrix is updated
  - Re‑enable by restoring `implementation project(':react-native-track-player')` and resolving ExoPlayer versions

---

## 6) Clean builds (when things feel sticky)

```powershell
cd D:\uprise_mob\android
./gradlew --stop
Remove-Item -Recurse -Force .\.gradle, .\app\build -ErrorAction SilentlyContinue
cd ..
# (Optional) npm ci to re-install deps cleanly
# npm ci
cd .\android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

---

## 7) Common errors & quick fixes

**A) Duplicate resources: `app_name`**  → Follow Strings policy in §2.

**B) `No matching client found for package name 'com.app.uprise.dev'`**  → Verify two Firebase Android apps and place JSONs per §3.

**C) `INSTALL_FAILED_UPDATE_INCOMPATIBLE`**  → Uninstall conflicting package(s) per §1.

**D) `.bashrc: … command not found`**  → Ignore; ensure you’re using PowerShell as in §0.

**E) ExoPlayer conflicts**  → Keep `react-native-track-player` disabled until alignment; document changes in `docs/overview/CHANGELOG.md`.

---

## 8) Documentation hygiene (what to update after changes)

- `docs/overview/CHANGELOG.md` — note build fixes, dependency toggles
- `docs/runbooks/runbook_android.md` — keep this page current
- `docs/ADR/0001-no-symlinks.md` — if the policy changes, update it

---

### That’s it
If the steps above are followed exactly, you should get a green **assembleDebug** and a debuggable APK that installs as `com.app.uprise.dev`.

