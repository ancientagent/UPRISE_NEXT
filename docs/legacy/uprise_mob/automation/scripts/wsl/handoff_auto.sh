#!/usr/bin/env bash
set -euo pipefail

TO="codex-wsl"
ROOT="/mnt/d/uprise_mob"
EVENTS="$ROOT/docs/handoff/events.jsonl"

mkdir -p "$(dirname "$EVENTS")"
touch "$EVENTS"

echo "[handoff-auto] Watching $EVENTS for events addressed to '$TO'" >&2

tail -n 0 -F "$EVENTS" | while read -r line; do
  [[ -z "$line" ]] && continue
  to=$(echo "$line" | jq -r '.to // empty' 2>/dev/null || true)
  [[ "$to" != "$TO" ]] && continue
  from=$(echo "$line" | jq -r '.from // "unknown"' 2>/dev/null || echo "unknown")
  kind=$(echo "$line" | jq -r '.kind // "info"' 2>/dev/null || echo "info")
  msg=$(echo "$line" | jq -r '.msg // ""' 2>/dev/null || echo "")
  echo "[handoff-auto] <- from=$from kind=$kind msg=$msg" >&2

  case "$kind" in
    run-wsl)
      echo "[handoff-auto] running orchestrate:wsl" >&2
      (cd "$ROOT" && bash docs/scripts/wsl/codex_autorun.sh) || true
      ;;
    run-smokes)
      echo "[handoff-auto] running wsl:smokes" >&2
      (cd "$ROOT" && yarn wsl:smokes) || true
      ;;
    run-command)
      if [[ "$msg" =~ ^sh: ]]; then
        cmd="${msg#sh:}"
        echo "[handoff-auto] exec: $cmd" >&2
        bash -lc "$cmd" || true
      fi
      ;;
    *)
      echo "[handoff-auto] noted event kind=$kind" >&2
      ;;
  esac
done

