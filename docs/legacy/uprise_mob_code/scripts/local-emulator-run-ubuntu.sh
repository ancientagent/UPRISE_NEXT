#!/usr/bin/env bash
set -euo pipefail

# ====== CONFIG (adjust if needed) =================================================
MOB_DIR="/mnt/d/uprise_mob"                        # repo path
SDK_DIR_DEFAULT="/usr/local/lib/android/sdk"       # GitHub runner default
SDK_DIR_ALT="${HOME}/Android/Sdk"                  # common local default
BUILD_TOOLS_VER="31.0.0"                           # RN 0.66 era
AVD_NAME="local_api_31"
SYSIMG="system-images;android-31;google_apis;x86_64"
BOOT_TIMEOUT=480                                   # 8 minutes
# ==================================================================================

echo "== UPRISE Android local run (Ubuntu) =="

# --- Java 11 ---
JAVA_HOME=""
for c in /usr/lib/jvm/java-11-openjdk-amd64 /usr/lib/jvm/temurin-11-jdk-amd64 /usr/lib/jvm/zulu-11-amd64; do
  [[ -x "$c/bin/java" ]] && JAVA_HOME="$c" && break
done
if [[ -z "${JAVA_HOME}" ]]; then
  echo "ERROR: JDK 11 not found. Install it:  sudo apt-get update && sudo apt-get install -y openjdk-11-jdk" >&2
  exit 1
fi
export JAVA_HOME

# --- Android SDK ---
if [[ -d "${SDK_DIR_DEFAULT}" ]]; then
  export ANDROID_SDK_ROOT="${SDK_DIR_DEFAULT}"
elif [[ -d "${SDK_DIR_ALT}" ]]; then
  export ANDROID_SDK_ROOT="${SDK_DIR_ALT}"
else
  echo "ERROR: Android SDK not found at ${SDK_DIR_DEFAULT} or ${SDK_DIR_ALT}." >&2
  echo "Install or set ANDROID_SDK_ROOT before continuing." >&2
  exit 1
fi
export ANDROID_HOME="${ANDROID_SDK_ROOT}"
export PATH="${JAVA_HOME}/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/emulator:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${PATH}"
export NODE_OPTIONS="--openssl-legacy-provider"

echo "java: $("${JAVA_HOME}/bin/java" -version 2>&1 | head -1)"
echo "adb: $(adb version | head -1 || true)"
echo "SDK: ${ANDROID_SDK_ROOT}"

# --- Repo & Metro ---
cd "${MOB_DIR}"
# Start Metro in background on a fresh cache (ignore if already running)
if ! pgrep -f "react-native start" >/dev/null 2>&1; then
  (yarn start --reset-cache > "${MOB_DIR}/metro.log" 2>&1 &) || true
  sleep 2
fi

# Quick sanity: TrackPlayer service present?
MANIFEST="${MOB_DIR}/android/app/src/main/AndroidManifest.xml"
SERVICE_OK=false
if grep -q 'com\.doublesymmetry\.react\.service\.MusicService' "${MANIFEST}" || \
   grep -q 'com\.guichaguri\.trackplayer\.service\.MusicService' "${MANIFEST}"; then
  SERVICE_OK=true
fi
if ! ${SERVICE_OK}; then
  echo "⚠️  TrackPlayer service element not found in AndroidManifest.xml."
  echo "    (Permissions are present; app may still run. Add service later for stability.)"
fi

# --- Build (Debug) ---
cd "${MOB_DIR}/android"
./gradlew --version
./gradlew clean
./gradlew :app:assembleDebug -Dorg.gradle.jvmargs=-Xmx2g

APK="app/build/outputs/apk/debug/app-debug.apk"
[[ -f "${APK}" ]] || { echo "ERROR: ${APK} not found." >&2; exit 1; }
APK_MB=$(awk "BEGIN {printf \"%.2f\", $(stat -c%s "${APK}")/1048576}")
echo "APK built: ${APK} (${APK_MB} MB)"

# --- applicationId from APK (aapt) ---
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

# --- Device selection: prefer physical; else existing AVD; else create minimal AVD ---
adb start-server >/dev/null || true
TARGET=""
if adb devices | awk 'NR>1 && $2=="device"{print $1}' | grep -q .; then
  TARGET="$(adb devices | awk 'NR>1 && $2=="device"{print $1; exit}')"
  echo "Using physical device: ${TARGET}"
else
  # Ensure system image + avdmanager available
  sdkmanager --install "platform-tools" "emulator" "build-tools;${BUILD_TOOLS_VER}" >/dev/null
  sdkmanager --install "${SYSIMG}" >/dev/null || true

  if ! emulator -list-avds | grep -q .; then
    echo "Creating AVD: ${AVD_NAME}"
    (echo "no") | avdmanager create avd -n "${AVD_NAME}" -k "${SYSIMG}" -d pixel || true
  fi
  # boot the first available AVD (or our named one)
  AVD="$(emulator -list-avds | grep -E "^${AVD_NAME}$" || true)"
  [[ -z "${AVD}" ]] && AVD="$(emulator -list-avds | head -1)"
  echo "Booting AVD: ${AVD}"
  nohup emulator -avd "${AVD}" \
    -no-window -no-audio -gpu swiftshader_indirect -no-boot-anim \
    -accel off -cores 1 -memory 1024 >/dev/null 2>&1 &

  # wait for boot
  SECONDS=0
  until [[ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; do
    [[ ${SECONDS} -ge ${BOOT_TIMEOUT} ]] && { echo "ERROR: AVD boot timeout."; exit 1; }
    sleep 5
  done
  TARGET="emulator-5554"
  echo "AVD ready: ${TARGET}"
fi

# --- Install & launch ---
adb -s "${TARGET}" uninstall "${APP_ID}" >/dev/null 2>&1 || true
adb -s "${TARGET}" install -r -d "${APK}" >/dev/null

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
  echo "Reason: Launch did not confirm start."
  echo "APK: ${PWD}/${APK} (${APK_MB} MB)"
  echo "TARGET: ${TARGET}"
  echo "LAUNCH (line): ${LAUNCH_LINE}"
  echo "LOGCAT: ${LOGPATH}"
  exit 1
fi