#!/usr/bin/env bash
set -Eeuo pipefail

# --- find repo root based on this script's location ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

ART_DIR="/mnt/d/uprise_mob/artifacts"
FALLBACK_DIR="${REPO_ROOT}/dev-backend"   # D:\uprise_mob\dev-backend

echo "[WSL] Repo root: ${REPO_ROOT}"

# Prefer an existing backend repo; otherwise use repo-local fallback
if [ -d "$HOME/webapp_api" ]; then
  BACKEND_DIR="$HOME/webapp_api"
elif [ -d "/mnt/d/webapp_api" ]; then
  BACKEND_DIR="/mnt/d/webapp_api"
else
  BACKEND_DIR="$FALLBACK_DIR"
fi
echo "[WSL] Using backend dir: ${BACKEND_DIR}"

mkdir -p "$ART_DIR"

# Ensure fallback backend exists (pure Node http, no deps)
if [ "$BACKEND_DIR" = "$FALLBACK_DIR" ]; then
  mkdir -p "$FALLBACK_DIR"
  if [ ! -f "$FALLBACK_DIR/devserver.js" ]; then
    echo "[WSL] Creating fallback dev-backend (no deps)…"
    cat >"$FALLBACK_DIR/devserver.js" <<'JS'
const http = require('http');
const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    const body = JSON.stringify({ ok: true, service: 'uprise-api', time: new Date().toISOString() });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(body);
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});
server.listen(port, host, () => console.log(`dev server on http://${host}:${port}`));
JS
  fi
fi

# Start the server (background) with a pidfile so re-runs are idempotent
PIDFILE="/tmp/uprise_api.pid"
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "[WSL] Backend already running (PID $(cat "$PIDFILE"))"
else
  # if the chosen backend dir doesn't have devserver.js, fall back to repo-local
  ENTRY="${BACKEND_DIR}/devserver.js"
  if [ ! -f "$ENTRY" ]; then
    echo "[WSL] No devserver.js in ${BACKEND_DIR}; falling back to ${FALLBACK_DIR}"
    ENTRY="${FALLBACK_DIR}/devserver.js"
  fi
  echo "[WSL] Starting backend on 0.0.0.0:8080 from ${ENTRY}"
  ( HOST=0.0.0.0 PORT=8080 node "$ENTRY" >/tmp/uprise_api.out 2>/tmp/uprise_api.err & echo $! >"$PIDFILE" )
  sleep 1
fi

# Verify and write artifact
if curl -sf http://localhost:8080/health -o /tmp/backend_health.json; then
  cp /tmp/backend_health.json "${ART_DIR}/backend_health_wsl.json" || true
  echo "[WSL] OK: Backend listening on 0.0.0.0:8080; health saved to D:\uprise_mob\artifacts\backend_health_wsl.json"
else
  echo "[WSL] ERROR: /health did not respond"
  exit 1
fi
