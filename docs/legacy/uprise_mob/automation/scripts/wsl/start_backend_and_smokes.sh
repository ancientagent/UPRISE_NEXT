#!/usr/bin/env bash
set -euo pipefail

ROOT="${ROOT:-/mnt/d/uprise_mob}"
API_PORT="${API_PORT:-3000}"
PID_FILE="$ROOT/artifacts/wsl_backend.pid"
LOGDIR="$ROOT/artifacts/logs"
mkdir -p "$ROOT/artifacts" "$LOGDIR"

echo "Starting dev-backend on :$API_PORT …"
cd "$ROOT/dev-backend"
PORT="$API_PORT" NODE_ENV=development nohup node devserver.js > local_server.log 2>&1 &
echo $! > "$PID_FILE"

sleep 2
if curl -sf "http://127.0.0.1:$API_PORT/health" >/dev/null; then
  echo "API OK on 127.0.0.1:$API_PORT"
else
  echo "API failed to start; see $ROOT/dev-backend/local_server.log" >&2
  exit 1
fi

echo "Running WSL quick kickoff smokes …"
cd "$ROOT"
chmod +x docs/scripts/*.sh docs/scripts/wsl/quick_kickoff.sh || true
API_BASE_URL="http://127.0.0.1:$API_PORT" bash docs/scripts/wsl/quick_kickoff.sh

echo "Done. Logs in $LOGDIR. PID file: $PID_FILE"
