#!/usr/bin/env bash
set -euo pipefail
ROOT="/mnt/d/uprise_mob"
ART="$ROOT/artifacts"
DEVB="$ROOT/dev-backend"
mkdir -p "$ART"

# Merge discovered endpoints from net_boot.txt into stubs.json
STUBS="$DEVB/stubs.json"
if [[ ! -f "$STUBS" ]]; then
  cat >"$STUBS" <<'JSON'
{
  "GET /health": { "ok": true, "service": "uprise-api" },
  "GET /config": { "features": {}, "env": "dev" },
  "GET /auth/session": { "authenticated": false },
  "GET /me": { "id": "dev-user", "roles": [], "displayName": "Dev User" },
  "GET /genres": [],
  "GET /feed": []
}
JSON
fi

mapfile -t endpoints < <(grep -Eo "(GET|POST|PUT|PATCH|DELETE)\s+/[A-Za-z0-9_./-]+" "$ART/net_boot.txt" 2>/dev/null | sort -u || true)
tmp=$(mktemp)
cp "$STUBS" "$tmp" || echo '{}' >"$tmp"

merge_kv() {
  local key="$1"; local method path
  method="${key%% *}"; path="${key#* }"
  # Determine fallback value
  local val='{}'
  if [[ "$method" == "GET" && "$path" == "/config" ]]; then val='{"features":{},"env":"dev"}'
  elif [[ "$method" == "GET" && "$path" == "/auth/session" ]]; then val='{"authenticated":false}'
  elif [[ "$method" == "GET" && "$path" == "/me" ]]; then val='{"id":"dev-user","roles":[],"displayName":"Dev User"}'
  elif [[ "$method" == "GET" && "$path" =~ (genres|feed|list|items|search|results|tracks|stations|events) ]]; then val='[]'
  fi
  # jq merge if missing
  jq --arg k "$key" --argjson v "$val" 'if has($k) then . else . + {($k): $v} end' "$tmp" >"$tmp.new" && mv "$tmp.new" "$tmp"
}

if ((${#endpoints[@]})); then
  for k in "${endpoints[@]}"; do merge_kv "$k"; done
  cp "$tmp" "$STUBS"
fi

# Start backend on 0.0.0.0:8080
cd "$ROOT"
nohup node "$DEVB/devserver.js" > "$ART/wsl_backend.out" 2> "$ART/wsl_backend.err" & echo $! > "$ART/wsl_backend.pid"
sleep 1
curl -sS http://localhost:8080/health > "$ART/backend_health_wsl.json" || true

echo "{"\"backend\"":"\"ok\"","\"port\"":8080,"\"stubs\"":"\"$DEVB/stubs.json\"","\"endpoints\"":${#endpoints[@]},"\"artifact\"":"\"$ART/backend_health_wsl.json\""}"

#!/usr/bin/env bash
set -euo pipefail

MOB_DIR="/mnt/d/uprise_mob"
ART_DIR="$MOB_DIR/artifacts"
DEV_DIR="$MOB_DIR/dev-backend"
ENTRY_JS="$DEV_DIR/devserver.js"
PIDFILE="$ART_DIR/wsl_backend.pid"
OUTLOG="$ART_DIR/wsl_backend.out"
ERRLOG="$ART_DIR/wsl_backend.err"

mkdir -p "$ART_DIR" "$DEV_DIR"

# 1) Ensure devserver exists (pure Node http, CORS + /health + stubs)
if [ ! -f "$ENTRY_JS" ]; then
  cat > "$ENTRY_JS" <<'JS'
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const host = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '8080', 10);
const stubsPath = path.join(__dirname, 'stubs.json');
let stubs = {};
try { if (fs.existsSync(stubsPath)) { stubs = JSON.parse(fs.readFileSync(stubsPath, 'utf8')); } } catch (_) {}
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}
const srv = http.createServer((req, res) => {
  cors(res);
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname || '/';
  const method = (req.method||'GET').toUpperCase();
  if (method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (method === 'GET' && pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, service: 'uprise-api', time: new Date().toISOString() }));
  }
  const key = `${method} ${pathname}`;
  if (Object.prototype.hasOwnProperty.call(stubs, key)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(stubs[key]));
  }
  // Heuristics
  const lower = pathname.toLowerCase();
  let payload = {};
  if (lower.includes('config')) payload = { features: {}, env: 'dev' };
  else if (lower.includes('session')) payload = { authenticated: false };
  else if (lower === '/me' || lower.endsWith('/me')) payload = { id: 'dev-user', roles: [], displayName: 'Dev User' };
  else if (/genres|list|feed|discovery|popular|radio|home|events|promos/.test(lower)) payload = [];
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
});
srv.listen(port, host, () => console.log(`dev-backend on ${host}:${port}`));
JS
fi

# 2) Generate/merge stubs from net_boot.txt
NET_LOG="$ART_DIR/net_boot.txt"
node "$DEV_DIR/gen-stubs.js" >/dev/null 2>&1 || true

# 3) Kill prior backend if still running
if [ -f "$PIDFILE" ]; then
  OLD=$(cat "$PIDFILE" 2>/dev/null || true)
  if [ -n "${OLD:-}" ] && kill -0 "$OLD" 2>/dev/null; then
    kill "$OLD" 2>/dev/null || true
    sleep 1
  fi
fi

# 4) Start backend and verify
nohup env HOST=0.0.0.0 PORT=8080 NODE_ENV=development node "$ENTRY_JS" \
  >"$OUTLOG" 2>"$ERRLOG" & echo $! > "$PIDFILE"

# Retry up to 10s
STATUS=error
for i in $(seq 1 10); do
  if curl -sfm 2 http://localhost:8080/health -o "$ART_DIR/backend_health_wsl.json"; then STATUS=ok; break; fi
  sleep 1
done

# 5) Print summary JSON (one line)
EP_COUNT=$(node -e "try{const s=require('${DEV_DIR}/stubs.json');console.log(Object.keys(s).length)}catch(e){console.log(0)}" 2>/dev/null || echo 0)
printf '{"backend":"%s","port":8080,"stubs":"%s","endpoints":%s,"artifact":"%s"}\n' \
  "$STATUS" "$DEV_DIR/stubs.json" "$EP_COUNT" "$ART_DIR/backend_health_wsl.json"

