#!/usr/bin/env bash
set -euo pipefail

CHROME_BIN=${CHROME_BIN:-/usr/bin/google-chrome}
PROFILE_DIR=${PROFILE_DIR:-$HOME/.cache/chrome-devtools-mcp/shared-profile}
PORT=${PORT:-9222}
URL=${1:-about:blank}

mkdir -p "$PROFILE_DIR"
nohup "$CHROME_BIN" \
  --remote-debugging-address=127.0.0.1 \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE_DIR" \
  --no-first-run \
  --no-default-browser-check \
  "$URL" >/tmp/chrome-mcp-wsl.log 2>&1 &

echo "Launched WSL Chrome MCP browser"
echo "Chrome:  $CHROME_BIN"
echo "Port:    $PORT"
echo "Profile: $PROFILE_DIR"
echo "URL:     $URL"
