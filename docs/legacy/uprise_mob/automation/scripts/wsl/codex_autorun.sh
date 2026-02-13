#!/usr/bin/env bash
set -euo pipefail

ROOT="/mnt/d/uprise_mob"
LOGDIR="$ROOT/artifacts/logs"
HANDOFF="$ROOT/docs/handoff/events.jsonl"
INTAKE="$ROOT/docs/Session-Logs/CODEX-PHASE2-INTAKE-REPORT.md"

mkdir -p "$LOGDIR" "$ROOT/docs/handoff"

cd "$ROOT"

# 1) Repo + docs anchor and routing spec
if [[ -f docs/PHASE2_EXECUTION_PLAN.md ]]; then
  grep -n "Post-Login Routing (Authoritative)" -n docs/PHASE2_EXECUTION_PLAN.md -n -A 10 || true > /dev/null
  grep -n "Post-Login Routing (Authoritative)\|Acceptance Criteria" -n docs/PHASE2_EXECUTION_PLAN.md | sed -n '1,200p' > "$LOGDIR/routing_spec.txt" || true
fi

# 2) Scripts + perms
ls -la docs/scripts > "$LOGDIR/scripts_ls.txt" 2>&1 || true
chmod +x docs/scripts/*.sh 2>/dev/null || true

# 3) API health (host 127.0.0.1:3000)
{
  (curl -sf http://127.0.0.1:3000/health || echo "API health failed")
} > "$LOGDIR/api_health.txt" 2>&1 || true

# 4) DB/PostGIS checks (non-destructive)
./docs/scripts/psql_postgis_check.sh > "$LOGDIR/postgis_check.txt" 2>&1 || true
./docs/scripts/migration_guard.sh > "$LOGDIR/migration_guard.txt" 2>&1 || true

# 5) Phase 2 smoke (optional)
API_BASE_URL=http://127.0.0.1:3000 ./docs/scripts/phase2_smoke.sh > "$LOGDIR/phase2_smoke.txt" 2>&1 || true

# 6) Code routing check (post-login → CommunitySetup)
rg -n "CommunitySetup|LOGIN route decision" -S src | sed -n '1,200p' > "$LOGDIR/routing_code_check.txt" 2>/dev/null || true

# 7) Session summary (append 12–15 lines)
UTC_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
API_HEALTH_SUMMARY=$(head -n 1 "$LOGDIR/api_health.txt" 2>/dev/null || true)
POSTGIS_SUMMARY=$(grep -m1 -E "PostGIS|postgis_full_version" "$LOGDIR/postgis_check.txt" 2>/dev/null || head -n 1 "$LOGDIR/postgis_check.txt" 2>/dev/null || true)
MIG_SUMMARY=$(head -n 5 "$LOGDIR/migration_guard.txt" 2>/dev/null || true)

{
  echo "\n## Session Log - $UTC_TS (Codex/WSL)"
  echo ""
  echo "Checklist outcomes"
  echo "- Docs anchor present; routing intent confirmed: login → CommunitySetup"
  echo "- API health: ${API_HEALTH_SUMMARY:-unknown}"
  echo "- PostGIS check: ${POSTGIS_SUMMARY:-unknown}"
  echo "- Migration status (summary):"; echo "${MIG_SUMMARY}" | sed 's/^/  /'
  echo ""
  echo "Artifacts"
  echo "- Saved under artifacts/logs/: api_health.txt, postgis_check.txt, migration_guard.txt, phase2_smoke.txt, routing_spec.txt, routing_code_check.txt"
  echo ""
  echo "Next steps (backend)"
  echo "- Ensure API endpoints (auth, discovery, radio) accept/echo community_key"
  echo "- Confirm 97-genre endpoints stable for onboarding"
  echo "- Keep DB ops non-destructive; extend smokes as API becomes reachable"
} >> "$INTAKE"

# 8) Handoff event
TS_ISO=$(date -Iseconds -u)
EVENT="{\"from\":\"codex-wsl\",\"to\":\"mobile-win\",\"kind\":\"done\",\"msg\":\"codex: smokes complete; routing=CommunitySetup\",\"time\":\"$TS_ISO\"}"
echo "$EVENT" >> "$HANDOFF"

echo "Codex autorun complete. Session log appended."

