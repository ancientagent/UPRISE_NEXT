#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROFILE_DIR="${HOME}/.cache/chrome-devtools-mcp/shared-profile"
EXT_DIR="${ROOT_DIR}/tools/midjourney-avatar-picker"
URL="${1:-https://www.midjourney.com/imagine}"

mkdir -p "${PROFILE_DIR}"

# Chrome will often reuse an existing process for the same profile and ignore
# new --load-extension flags. Kill the shared-profile browser first so the
# avatar-picker extension is always loaded on relaunch.
pkill -f "${PROFILE_DIR}" 2>/dev/null || true
sleep 1

CHROME_BIN=""
if command -v chromium >/dev/null 2>&1; then
  CHROME_BIN="$(command -v chromium)"
elif command -v chromium-browser >/dev/null 2>&1; then
  CHROME_BIN="$(command -v chromium-browser)"
elif command -v google-chrome >/dev/null 2>&1; then
  CHROME_BIN="$(command -v google-chrome)"
elif command -v google-chrome-stable >/dev/null 2>&1; then
  CHROME_BIN="$(command -v google-chrome-stable)"
else
  echo "No Chrome/Chromium binary found." >&2
  exit 1
fi

"${CHROME_BIN}" \
  --remote-debugging-port=9222 \
  --user-data-dir="${PROFILE_DIR}" \
  --disable-extensions-except="${EXT_DIR}" \
  --load-extension="${EXT_DIR}" \
  --new-window \
  "${URL}" >/dev/null 2>&1 &
