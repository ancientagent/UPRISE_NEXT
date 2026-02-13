#!/usr/bin/env bash
set -euo pipefail

# One-shot kickoff (no secrets echoed)

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:3000}"

rg --files docs | rg -n "PHASE2_EXECUTION_PLAN|SYSTEM_OVERVIEW|params.geo-genre|CHANGELOG|CI_WORKFLOWS|CHECKLISTS|03_AUTHENTICATION|04_COMMUNITY_LOCATION|06_SONG_MANAGEMENT" -S || true
sed -n '1,160p' docs/reference/architecture/SYSTEM_OVERVIEW.md || true
sed -n '1,160p' docs/overview/PHASE2_EXECUTION_PLAN.md || true
chmod +x docs/automation/scripts/phase2_smoke.sh || true
COMMUNITY_KEY="${COMMUNITY_KEY:-austin-texas-hip-hop}" BASE_URL="$API_BASE_URL" ./docs/automation/scripts/phase2_smoke.sh || true

echo "\nKickoff complete. For full health checks run: docs/automation/scripts/health_checks.sh"

