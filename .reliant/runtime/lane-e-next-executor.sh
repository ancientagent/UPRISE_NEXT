#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
QUEUE=".reliant/queue/mvp-lane-e-qarev-next.json"
RUNTIME=".reliant/runtime/current-task-lane-e-next.json"
while true; do
  node scripts/reliant-next-action.mjs --queue "$QUEUE" --runtime "$RUNTIME" || true
  CLAIM=$(node scripts/reliant-slice-queue.mjs claim --queue "$QUEUE" --runtime "$RUNTIME" || true)
  if echo "$CLAIM" | rg -q '"claimed":false'; then
    echo "[lane-e-next-executor.sh] no queued tasks; stopping"
    exit 0
  fi
  echo "[lane-e-next-executor.sh] claimed: $CLAIM"
  echo "[lane-e-next-executor.sh] execute claimed slice in agent session, then complete/block it"
  exit 0
done
