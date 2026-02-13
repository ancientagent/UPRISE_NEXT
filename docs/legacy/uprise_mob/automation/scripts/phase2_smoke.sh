#!/usr/bin/env bash
set -euo pipefail

# Phase 2 API smoke checks (non-destructive)
# - Requires API running locally (default http://localhost:3000)
# - No secrets printed; no writes executed

BASE_URL="${BASE_URL:-http://localhost:3000}"
COMMUNITY_KEY="${COMMUNITY_KEY:-austin-texas-hip-hop}"

banner() { printf "\n=== %s ===\n" "$*"; }
hit() {
  local label="$1"; shift
  echo "# $label"
  echo curl -sS "$@"
  # shellcheck disable=SC2068
  http_code=$(curl -sS -o /dev/null -w "%{http_code}" $@ || true)
  echo "HTTP $http_code"
}

banner "Discovery by community_key"
hit "GET /api/discovery" "$BASE_URL/api/discovery?community_key=${COMMUNITY_KEY}"

banner "Radio queue by community_key"
hit "GET /api/radio" "$BASE_URL/api/radio?community_key=${COMMUNITY_KEY}"

banner "Communities listing (optional filters)"
hit "GET /api/communities" "$BASE_URL/api/communities?state=Texas&genre=Hip%20Hop"

banner "Events discovery (geo filters where supported)"
hit "GET /api/eventmanagement" "$BASE_URL/api/eventmanagement?city=Austin&state=Texas&genre=Hip%20Hop"

echo "\nDone. Note: These are non-destructive reads. Use COMMUNITY_KEY env to change target."

