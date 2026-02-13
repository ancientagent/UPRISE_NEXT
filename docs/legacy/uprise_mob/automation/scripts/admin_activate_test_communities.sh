#!/usr/bin/env bash
set -euo pipefail

# Activates a small set of test communities for local/dev usage.
# Uses optional ADMIN_BEARER for Authorization header.
# Logs to artifacts/logs/activate_test_communities.log

ROOT_DIR="${ROOT_DIR:-$(pwd)}"
BASE_URL="${API_BASE_URL:-http://127.0.0.1:3000}"
LOGDIR="$ROOT_DIR/artifacts/logs"
mkdir -p "$LOGDIR"
LOGFILE="$LOGDIR/activate_test_communities.log"

hdr=()
if [[ -n "${ADMIN_BEARER:-}" ]]; then
  hdr+=( -H "Authorization: Bearer ${ADMIN_BEARER}" )
fi

communities=(
  "austin-texas-hip-hop"
  "austin-texas-house"
  "buda-texas-thrash-punk"
)

echo "[admin] Activating test communities at ${BASE_URL}" | tee "$LOGFILE"
for key in "${communities[@]}"; do
  echo "-- Seed minutes for $key" | tee -a "$LOGFILE"
  curl -sf -X POST "${BASE_URL}/admin/communities/seed-minutes" \
    -H 'Content-Type: application/json' \
    "${hdr[@]}" \
    -d "{\"community_key\":\"${key}\",\"minutes\":1000}" | tee -a "$LOGFILE" || true
  echo "" | tee -a "$LOGFILE"

  echo "-- Force activate $key" | tee -a "$LOGFILE"
  curl -sf -X POST "${BASE_URL}/admin/communities/activate" \
    -H 'Content-Type: application/json' \
    "${hdr[@]}" \
    -d "{\"community_key\":\"${key}\"}" | tee -a "$LOGFILE" || true
  echo "" | tee -a "$LOGFILE"
done

echo "Done. Log: $LOGFILE"

