# UPRISE Project – CHANGELOG

This changelog records technical progress, environment fixes, and debugging milestones.  
It complements `PROJECT_OVERVIEW.md` (carryover summary) and `RUNBOOK_ANDROID.md` (step-by-step guide).

---

## 2025-08-19 — Initial Android Build Issues
- **Issue:** `:app:mergeDebugResources` failed due to Gradle task misordering.
- **Action:** Ran `.\gradlew clean` to reset intermediates.
- **Resolution:** Resources merged successfully after a clean build.
- **Note:** Added reminder to always clean after dependency changes.

---

## 2025-08-20 — JDK Conflict
- **Issue:** Build failed at `:app:processDebugMainManifest` with:
Unable to make field private final java.lang.String java.io.File.path accessible

shell
Copy
Edit
- **Cause:** Wrong JDK selected (JDK 17 picked up instead of JDK 11).
- **Fix:** Installed **Temurin JDK 11.0.28** and set:
```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-11.0.28.6-hotspot"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
Resolution: Gradle 7.0.2 correctly recognized JVM 11.0.28.

2025-08-21 — adb Not Found
Issue: adb command not recognized in PowerShell.

Cause: platform-tools not on PATH.

Fix: Added:

sql
Copy
Edit
C:\Users\<user>\AppData\Local\Android\Sdk\platform-tools
to PATH.

Resolution: adb devices listed emulator as expected.

2025-08-22 — Successful Debug Build & Install
Action: Built and installed debug APK:

powershell
Copy
Edit
.\gradlew assembleDebug
adb install -r .\app\build\outputs\apk\debug\app-debug.apk
Result: Installed successfully on emulator (emulator-5554).

Note: App launch failed without Metro running.

2025-08-22 — Metro OpenSSL Crash
Issue: Metro bundler crashed with:

vbnet
Copy
Edit
Error: error:0308010C:digital envelope routines::unsupported
Cause: Node 20 defaults to OpenSSL 3; RN 0.66 Metro requires legacy provider.

Fix: Run Metro with:

powershell
Copy
Edit
$env:NODE_OPTIONS="--openssl-legacy-provider"
npx react-native start
Resolution: Bundler launched cleanly; app connected.

2025-08-22 — Firebase Integration Verified
Finding: Firebase already integrated (Analytics, Crashlytics, Messaging).

Verification:

google-services.json present in src/debug and src/release.

Package IDs (com.app.uprise / com.app.uprise.dev) match console config.

Firebase BoM + Gradle plugins confirmed.

Docs Updated: RUNBOOK_ANDROID.md, BUILD_LOG.md, ADR-0002.

Notes
Always uninstall both IDs before reinstalling if in doubt:

powershell
Copy
Edit
adb uninstall com.app.uprise
adb uninstall com.app.uprise.dev
Debug builds require Metro; release builds do not.

Document new findings here before migrating stable steps to runbooks.

yaml
Copy
Edit

---

📌 Would you like me to also add a **section at the bottom for “Planned Work / Next”**, so this changelog doubles as a lightweight TODO tracker?





Ask ChatGPT
