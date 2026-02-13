#!/usr/bin/env bash
set -euo pipefail

# Health Checks (run, parse, and summarize)
# - Uses env vars if set, otherwise defaults from System Facts
# - Non-destructive. Prints failing command + stderr and points to docs/operations/TROUBLESHOOTING.md

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:3000}"
PG_HOST="${PG_HOST:-127.0.0.1}"
PG_PORT="${PG_PORT:-5433}"
PG_DB="${PG_DB:-uprise_dev}"
PG_USER="${PG_USER:-uprise}"

failures=0
summary=()

run_check() {
  local name="$1"; shift
  local cmd=("$@")
  local out err rc
  out=""; err=""; rc=0
  if ! out=$("${cmd[@]}" 2> >(err=$(cat); typeset -p err >/dev/null) ); then
    rc=$?
  fi
  if [[ $rc -ne 0 ]]; then
    echo "[FAIL] $name"
    echo "Command: ${cmd[*]}" >&2
    if [[ -n "$err" ]]; then
      echo "stderr:" >&2
      echo "$err" >&2
    fi
    echo "See DOC: docs/operations/TROUBLESHOOTING.md" >&2
    failures=$((failures+1))
    summary+=("$name: FAIL")
  else
    echo "[OK] $name"
    summary+=("$name: OK")
  fi
}

echo "== Health Checks =="

# 1) API health (parse JSON)
run_check "API /health" curl -sf "$API_BASE_URL/health"
if command -v jq >/dev/null 2>&1; then
  if curl -sf "$API_BASE_URL/health" | jq . >/dev/null 2>&1; then
    echo "[OK] API /health JSON parse"
  else
    echo "[WARN] API /health JSON parse failed (jq)"
  fi
else
  echo "[WARN] jq not found; skipping JSON parse"
fi

# 2) Postgres version
run_check "Postgres version" psql "postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DB}" -c "select version();" >/dev/null

# 3) PostGIS version
run_check "PostGIS version" psql "postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DB}" -c "select postgis_full_version();" >/dev/null

echo "\n== Summary =="
for line in "${summary[@]}"; do echo "- $line"; done

if [[ $failures -gt 0 ]]; then
  echo "\n$failures check(s) failed. See DOC: docs/operations/TROUBLESHOOTING.md" >&2
  exit 1
fi

echo "\nAll health checks passed."

