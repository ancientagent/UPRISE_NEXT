#!/usr/bin/env bash
set -euo pipefail

# ========= CONFIG (edit if needed) =========
MOB_DIR="/mnt/d/uprise_mob"                 # path to repo
SDK_DIR_DEFAULT="/usr/local/lib/android/sdk" # GitHub/CI default
SDK_DIR_ALT="${HOME}/Android/Sdk"            # common local default
BUILD_TOOLS_VER="31.0.0"                     # RN 0.66 / Gradle 7.0.x era
AVD_BOOT_TIMEOUT_SEC=480                     # 8 minutes
# ===========================================

echo "== UPRISE Local Emulator Run =="
echo "Host: $(uname -a)"
echo "Repo: ${MOB_DIR}"

# --- Java 11 detection (no sudo) ---
JAVA_CANDIDATES=(
  "/usr/lib/jvm/java-11-openjdk-amd64"
  "/usr/lib/jvm/temurin-11-jdk-amd64"
  "/usr/lib/jvm/zulu-11-amd64"
)
JAVA_HOME=""
for c in "${JAVA_CANDIDATES[@]}"; do
  if [[ -x "$c/bin/java" ]]; then JAVA_HOME="$c"; break; fi
done
if [[ -z "${JAVA_HOME}" ]]; then
  echo "ERROR: JDK 11 not found. Install OpenJDK 11 (e.g., 'sudo apt-get install openjdk-11-jdk') and re-run." >&2
  exit 1
fi

# --- Android SDK path ---
ANDROID_SDK_ROOT=""
if [[ -d "${SDK_DIR_DEFAULT}" ]]; then ANDROID_SDK_ROOT="${SDK_DIR_DEFAULT}"; fi
if [[ -z "${ANDROID_SDK_ROOT}" && -d "${SDK_DIR_ALT}" ]]; then ANDROID_SDK_ROOT="${SDK_DIR_ALT}"; fi
if [[ -z "${ANDROID_SDK_ROOT}" ]]; then
  echo "ERROR: Android SDK not found at ${SDK_DIR_DEFAULT} or ${SDK_DIR_ALT}." >&2
  echo "Set ANDROID_SDK_ROOT to your SDK path and re-run." >&2
  exit 1
fi
export ANDROID_SDK_ROOT ANDROID_HOME="${ANDROID_SDK_ROOT}"

# --- PATH + Node/RN compatibility ---
export PATH="${JAVA_HOME}/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/emulator:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${PATH}"
export NODE_OPTIONS="--openssl-legacy-provider"

echo "java: $("${JAVA_HOME}/bin/java" -version 2>&1 | head -1)"
echo "adb: $(adb version | head -1)"
echo "emulator: $(emulator -version | head -1 || true)"
echo "SDK: ${ANDROID_SDK_ROOT}"

# --- Go to repo + install JS deps ---
cd "${MOB_DIR}"
if [[ -f yarn.lock ]]; then
  yarn install --frozen-lockfile
else
  yarn install
fi

# --- TrackPlayer manifest fix (permissions + service, v2/v3 auto) ---
MANIFEST="${MOB_DIR}/android/app/src/main/AndroidManifest.xml"
if [[ ! -f "${MANIFEST}" ]]; then
  echo "ERROR: AndroidManifest not found: ${MANIFEST}" >&2
  exit 1
fi

TP_DIR="${MOB_DIR}/node_modules/react-native-track-player"
SERVICE_CLASS=""
if [[ -f "${TP_DIR}/android/src/main/java/com/doublesymmetry/react/service/MusicService.java" ]]; then
  SERVICE_CLASS="com.doublesymmetry.react.service.MusicService" # v3
elif [[ -f "${TP_DIR}/android/src/main/java/com/guichaguri/trackplayer/service/MusicService.java" ]]; then
  SERVICE_CLASS="com.guichaguri.trackplayer.service.MusicService" # v2
fi

# insert <uses-permission> and <service> only if missing
if ! grep -q 'android.permission.FOREGROUND_SERVICE' "${MANIFEST}"; then
  sed -i '0,/<manifest[^>]*>/s//&\
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"\/>/' "${MANIFEST}"
fi
if ! grep -q 'android.permission.POST_NOTIFICATIONS' "${MANIFEST}"; then
  sed -i '0,/<manifest[^>]*>/s//&\
    <!-- Required on API 33+ for media notifications -->\
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"\/>/' "${MANIFEST}"
fi
if ! grep -q 'android.permission.WAKE_LOCK' "${MANIFEST}"; then
  sed -i '0,/<manifest[^>]*>/s//&\
    <uses-permission android:name="android.permission.WAKE_LOCK"\/>/' "${MANIFEST"
fi

if [[ -n "${SERVICE_CLASS}" ]] && ! grep -q "${SERVICE_CLASS//./\\.}" "${MANIFEST}"; then
  # insert service just before </application>
  SERVICE_BLOCK=$(cat <<EOF
        <service
            android:name="${SERVICE_CLASS}"
            android:exported="false"
            android:stopWithTask="false"
            android:foregroundServiceType="mediaPlayback">
            <intent-filter>
                <action android:name="android.media.browse.MediaBrowserService" />
            </intent-filter>
        </service>
EOF
)
  # Escape slashes for sed
  SERVICE_BLOCK_ESCAPED=$(printf '%s\n' "$SERVICE_BLOCK" | sed -e 's/[\/&]/\\&/g')
  sed -i "s/<\/application>/${SERVICE_BLOCK_ESCAPED}\n    <\/application>/" "${MANIFEST}"
  echo "TrackPlayer service ensured: ${SERVICE_CLASS}"
else
  echo "TrackPlayer service already present or package not detected; skipping service insert."
fi

# --- Build (Debug) with Gradle ---
cd "${MOB_DIR}/android"
./gradlew --version
./gradlew clean
./gradlew :app:assembleDebug -Dorg.gradle.jvmargs=-Xmx2g

APK="app/build/outputs/apk/debug/app-debug.apk"
if [[ ! -f "${APK}" ]]; then
  echo "ERROR: Debug APK not found at ${APK}" >&2
  exit 1
fi
APK_MB=$(awk "BEGIN {printf \"%.2f\", $(stat -c%s "${APK}")/1048576}")
echo "APK built: ${APK} (${APK_MB} MB)"

# --- Determine applicationId from APK (prefer aapt; fallback to default) ---
AAPT="${ANDROID_SDK_ROOT}/build-tools/${BUILD_TOOLS_VER}/aapt"
APP_ID="com.uprise.debug"
if [[ -x "${AAPT}" ]]; then
  if out="$("${AAPT}" dump badging "${APK}" 2>/dev/null)" && grep -q "package: name='" <<<"$out"; then
    APP_ID=$(grep -o "package: name='[^']\+'" <<<"$out" | head -1 | cut -d"'" -f2)
  fi
else
  echo "WARN: aapt not found at ${AAPT}; assuming ${APP_ID}"
fi
echo "applicationId: ${APP_ID}"

# --- Pick target: prefer physical device, else first existing AVD (no creation) ---
adb start-server >/dev/null
TARGET=""
# Physical device?
if adb devices | awk 'NR>1 && $2=="device"{print $1}' | grep -q .; then
  TARGET="$(adb devices | awk 'NR>1 && $2=="device"{print $1; exit}')"
  echo "Using physical device: ${TARGET}"
else
  # Existing AVD?
  if ! emulator -list-avds | grep -q .; then
    echo "ERROR: No device and no existing AVDs. Create an AVD in Android Studio first, then re-run." >&2
    exit 1
  fi
  AVD="$(emulator -list-avds | head -1)"
  echo "Booting AVD: ${AVD}"
  # headless, conservative resources to minimize flake
  nohup emulator -avd "${AVD}" -no-window -no-audio -gpu swiftshader_indirect -no-boot-anim -accel off >/dev/null 2>&1 &
  # wait for sys.boot_completed=1 (timeout)
  SECONDS=0
  until [[ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; do
    [[ ${SECONDS} -ge ${AVD_BOOT_TIMEOUT_SEC} ]] && { echo "ERROR: AVD boot timeout."; exit 1; }
    sleep 5
  done
  TARGET="emulator-5554"
  echo "AVD ready: ${TARGET}"
fi

# --- Install & Launch ---
adb -s "${TARGET}" uninstall "${APP_ID}" >/dev/null 2>&1 || true
adb -s "${TARGET}" install -r -d "${APK}" >/dev/null

# Try resolving launcher; fallback to monkey
RESOLVE_OUT="$(adb -s "${TARGET}" shell cmd package resolve-activity -c android.intent.category.LAUNCHER "${APP_ID}" 2>/dev/null || true)"
ACTIVITY=$(grep -o "name=[^[:space:]]*" <<<"${RESOLVE_OUT}" | head -1 | cut -d= -f2)
LAUNCH_OK=false
if [[ -n "${ACTIVITY}" ]]; then
  OUT="$(adb -s "${TARGET}" shell am start -n "${APP_ID}/${ACTIVITY}" 2>&1 || true)"
  grep -q "Starting: Intent" <<<"${OUT}" && LAUNCH_OK=true
  LAUNCH_LINE="$(head -1 <<<"${OUT}")"
else
  OUT="$(adb -s "${TARGET}" shell monkey -p "${APP_ID}" -c android.intent.category.LAUNCHER 1 2>&1 || true)"
  grep -q "Events injected: 1" <<<"${OUT}" && LAUNCH_OK=true
  LAUNCH_LINE="$(tail -1 <<<"${OUT}")"
fi

# Save last 200 log lines
LOGPATH="${MOB_DIR}/local_smoke_logcat.txt"
adb -s "${TARGET}" logcat -d -t 200 > "${LOGPATH}" || true

echo
if ${LAUNCH_OK}; then
  echo "RESULT: PASS (build + run)"
  echo "APK: ${PWD}/${APK} (${APK_MB} MB)"
  echo "TARGET: ${TARGET}"
  echo "LAUNCH: ${LAUNCH_LINE}"
  echo "LOGCAT: ${LOGPATH}"
else
  echo "RESULT: FAIL (run)"
  echo "Reason: Launch command did not confirm start."
  echo "APK: ${PWD}/${APK} (${APK_MB} MB)"
  echo "TARGET: ${TARGET}"
  echo "LAUNCH (line): ${LAUNCH_LINE}"
  echo "LOGCAT: ${LOGPATH}"
  exit 1
fi