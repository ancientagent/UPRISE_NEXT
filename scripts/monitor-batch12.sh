#!/usr/bin/env bash
set -euo pipefail

QUEUES=(
  ".reliant/queue/mvp-lane-a-api-admin-batch12.json"
  ".reliant/queue/mvp-lane-b-web-contract-batch12.json"
  ".reliant/queue/mvp-lane-c-invite-batch12.json"
  ".reliant/queue/mvp-lane-d-automation-batch12.json"
  ".reliant/queue/mvp-lane-e-qarev-batch12.json"
)

INTERVAL_SECONDS="${1:-120}"

while true; do
  clear
  date -Is
  echo
  for q in "${QUEUES[@]}"; do
    echo "== ${q}"
    node scripts/reliant-slice-queue.mjs status --queue "$q" \
      | node -e 'const fs=require("fs"); const j=JSON.parse(fs.readFileSync(0,"utf8")); console.log(JSON.stringify(j.summary));'
  done
  echo
  sleep "$INTERVAL_SECONDS"
done
