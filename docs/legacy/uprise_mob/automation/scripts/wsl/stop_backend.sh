#!/usr/bin/env bash
set -euo pipefail

ROOT="${ROOT:-/mnt/d/uprise_mob}"
PID_FILE="$ROOT/artifacts/wsl_backend.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE" || true)
  if [ -n "${PID:-}" ] && kill -0 "$PID" 2>/dev/null; then
    kill "$PID" || true
    wait "$PID" 2>/dev/null || true
    echo "Stopped backend (pid $PID)"
  else
    echo "No running backend process found for pid: ${PID:-N/A}"
  fi
  rm -f "$PID_FILE"
else
  echo "PID file not found: $PID_FILE"
fi
