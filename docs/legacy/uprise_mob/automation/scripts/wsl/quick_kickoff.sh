#!/usr/bin/env bash
set -euo pipefail

# UPRISE Sprint 2 – WSL Quick Kickoff
# Non-destructive checks. Logs to /mnt/d/uprise_mob/artifacts/logs

ROOT="/mnt/d/uprise_mob"
LOGDIR="$ROOT/artifacts/logs"
mkdir -p "$LOGDIR"

# Standard env (Postgres 16 @ 5433; API on 3000)
export API_BASE_URL="http://127.0.0.1:3000"
export PG_HOST="127.0.0.1"
export PG_PORT="5433"
export PG_DB="uprise_dev"
export PG_USER="uprise"

cd "$ROOT"
chmod +x docs/scripts/*.sh || true

echo "[1/6] Health checks"
API_BASE_URL="$API_BASE_URL" \
  ./docs/scripts/health_checks.sh 2>&1 | tee "$LOGDIR/health_checks_wsl.log"

echo "[2/6] PostGIS check"
PG_HOST="$PG_HOST" PG_PORT="$PG_PORT" PG_DB="$PG_DB" PG_USER="$PG_USER" \
  ./docs/scripts/psql_postgis_check.sh 2>&1 | tee "$LOGDIR/psql_postgis_check_wsl.log"

echo "[3/6] Env shape (backend)"
ENV_FILE="/mnt/d/uprise_mob/dev-backend/.env.development.local" \
  ./docs/scripts/env_shape_check.sh 2>&1 | tee "$LOGDIR/env_shape_check_wsl.log" || true

echo "[4/6] Migration guard (idempotent)"
API_DIR="/mnt/d/uprise_mob/dev-backend" \
  ./docs/scripts/migration_guard.sh 2>&1 | tee "$LOGDIR/migration_guard_wsl.log"

echo "[5/6] API contract smoke"
API_BASE_URL="$API_BASE_URL" COMMUNITY_KEY="austin-texas-hip-hop" \
  ./docs/scripts/api_contract_check.sh 2>&1 | tee "$LOGDIR/api_contract_check_wsl.log" || true

echo "[6/6] Phase 2 smoke"
API_BASE_URL="$API_BASE_URL" COMMUNITY_KEY="austin-texas-hip-hop" \
  ./docs/scripts/phase2_smoke.sh 2>&1 | tee "$LOGDIR/phase2_smoke_wsl.log"

echo "Done. Logs in $LOGDIR"

