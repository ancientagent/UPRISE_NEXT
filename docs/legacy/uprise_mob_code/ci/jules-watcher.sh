#!/usr/bin/env bash
set -euo pipefail

# Requires: gh CLI, jq
# Watches last 5 workflow runs for the smoke-ubuntu job and evaluates summary/summary.json.

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
WORKFLOW_NAME="Android Build & Smoke Test"

echo "Repo: $REPO"
echo "Workflow: $WORKFLOW_NAME"

mapfile -t RUN_IDS < <(gh run list --repo "$REPO" --workflow "$WORKFLOW_NAME" --limit 10 --json databaseId -q '.[].databaseId')

count=0
declare -i null_ttjs=0
declare -i bad_boot_streak=0
echo "Checking last 5 runs for smoke-ubuntu…"
for RUN_ID in "${RUN_IDS[@]}"; do
  (( count++ ))
  if (( count > 5 )); then break; fi

  # Verify the run has a smoke-ubuntu job
  if ! gh api \
      repos/:owner/:repo/actions/runs/$RUN_ID/jobs \
      --repo "$REPO" \
      --jq '.jobs[].name' | grep -qx 'smoke-ubuntu'; then
    continue
  fi

  tmpdir="$(mktemp -d)"
  if gh run download "$RUN_ID" --repo "$REPO" -n summary -D "$tmpdir" >/dev/null 2>&1; then
    SUM_JSON=$(find "$tmpdir" -type f -name 'summary.json' | head -1 || true)
    if [[ -f "$SUM_JSON" ]]; then
      boot_ok=$(jq -r '.boot_ok' "$SUM_JSON" 2>/dev/null || echo null)
      ttjs=$(jq -r '.ttjs_s' "$SUM_JSON" 2>/dev/null || echo null)
      run_url=$(jq -r '.run_url' "$SUM_JSON" 2>/dev/null || echo "https://github.com/$REPO/actions/runs/$RUN_ID")
      echo "RUN $RUN_ID | boot_ok=$boot_ok | ttjs_s=$ttjs | $run_url"
      if [[ "$boot_ok" != "true" ]]; then
        (( bad_boot_streak++ ))
      else
        bad_boot_streak=0
      fi
      if [[ "$ttjs" == "null" || -z "$ttjs" ]]; then
        (( null_ttjs++ ))
      fi
    else
      echo "RUN $RUN_ID | summary.json missing | https://github.com/$REPO/actions/runs/$RUN_ID"
      (( bad_boot_streak++ ))
    fi
  else
    echo "RUN $RUN_ID | summary artifact missing | https://github.com/$REPO/actions/runs/$RUN_ID"
    (( bad_boot_streak++ ))
  fi
done

if (( bad_boot_streak >= 2 )); then
  echo "ALERT: summary.json missing or boot_ok=false for 2 consecutive runs."
fi

if (( null_ttjs >= 5 )); then
  echo "SUGGESTION: ttjs_s null for 5 runs — increase probe window or keep install-only."
fi

echo "Daily one-pager (last 5 smoke-ubuntu runs):"
for RUN_ID in "${RUN_IDS[@]:0:5}"; do
  gh api repos/:owner/:repo/actions/runs/$RUN_ID --repo "$REPO" \
    --jq '[.id, .display_title, .run_started_at, .run_attempt, .status, .conclusion, .html_url] | @tsv' \
    | awk -F"\t" '{printf("- id=%s | title=%s | started=%s | attempt=%s | %s/%s | %s\n", $1,$2,$3,$4,$5,$6,$7)}'
done

