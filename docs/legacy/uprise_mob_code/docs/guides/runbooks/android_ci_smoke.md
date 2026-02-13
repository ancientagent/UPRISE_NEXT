## Android Smoke Test – How to Verify Each CI Run

**Where:** GitHub → your repo → **Actions** → workflow **Android Debug Build**  
**What it does:**  
1) Builds a debug APK (`android-build` job)  
2) Boots an Android 12 (API 31) emulator, installs & launches the APK, and uploads logs (`android-smoke-test` job)

### Quick Check (1 minute)

1. Open **Actions** → click the latest run.
2. Confirm both jobs:
   - `android-build` ✅
   - `android-smoke-test` ✅
3. Scroll to **Artifacts** and download:
   - `app-debug-apk`
   - `android-smoke-artifacts` (contains `smoke-logcat.txt`)
4. Open `smoke-logcat.txt` and search:
   - ✅ **Success**
     - `ActivityManager: START ... cmp=com.app.uprise/.MainActivity`
     - `ActivityTaskManager: Displayed com.app.uprise/.MainActivity`
     - **No** `FATAL EXCEPTION`
   - ❌ **Failure**
     - Any `FATAL EXCEPTION` line → capture ~50 lines around it for debugging.

### What “Good” Looks Like (sample lines)
ActivityManager: START u0 {cmp=com.app.uprise/.MainActivity}
ActivityTaskManager: Displayed com.app.uprise/.MainActivity

pgsql
Copy code
No fatal errors below those lines.
