#!/usr/bin/env bash
set -euo pipefail

# Superlight API contract checks (read-only)

BASE_URL="${API_BASE_URL:-http://127.0.0.1:3000}"
COMMUNITY_KEY="${COMMUNITY_KEY:-austin-texas-hip-hop}"

need_jq=0
if ! command -v jq >/dev/null 2>&1; then need_jq=1; fi

pass=0; fail=0
ok(){ echo "[OK] $1"; pass=$((pass+1)); }
bad(){ echo "[FAIL] $1"; fail=$((fail+1)); }

# Health
if curl -sf "$BASE_URL/health" >/dev/null; then ok "GET /health"; else bad "GET /health"; fi

# Onboarding genres
if curl -sf "$BASE_URL/onboarding/all-genres" >/dev/null; then
  if (( need_jq == 0 )); then
    if curl -sf "$BASE_URL/onboarding/all-genres" | jq -e '.data | arrays' >/dev/null; then ok "GET /onboarding/all-genres returns data[]"; else bad "GET /onboarding/all-genres shape"; fi
  else
    ok "GET /onboarding/all-genres (no jq)"
  fi
else bad "GET /onboarding/all-genres"; fi

# Discovery
if curl -sf "$BASE_URL/api/discovery?community_key=$COMMUNITY_KEY" >/dev/null; then
  if (( need_jq == 0 )); then
    if curl -sf "$BASE_URL/api/discovery?community_key=$COMMUNITY_KEY" | jq -e '..|objects|.community_key? | select(.!=null)' >/dev/null; then ok "GET /api/discovery echoes community_key"; else bad "GET /api/discovery missing community_key"; fi
  else
    ok "GET /api/discovery (no jq)"
  fi
else bad "GET /api/discovery"; fi

# Radio
if curl -sf "$BASE_URL/api/radio?community_key=$COMMUNITY_KEY" >/dev/null; then ok "GET /api/radio"; else bad "GET /api/radio"; fi

echo "\nSummary: $pass passed, $fail failed"
if (( fail > 0 )); then exit 1; fi

