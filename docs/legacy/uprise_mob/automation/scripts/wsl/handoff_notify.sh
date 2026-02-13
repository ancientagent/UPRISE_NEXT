#!/usr/bin/env bash
set -euo pipefail

TO=""
MSG=""
KIND="done"
FROM="codex-wsl"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -t|--to) TO="$2"; shift 2 ;;
    -m|--msg) MSG="$2"; shift 2 ;;
    -k|--kind) KIND="$2"; shift 2 ;;
    -f|--from) FROM="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$TO" || -z "$MSG" ]]; then
  echo "Usage: $0 --to <recipient> --msg <message> [--kind done|info|error] [--from <sender>]" >&2
  exit 2
fi

ROOT="/mnt/d/uprise_mob"
HANDOFF_DIR="$ROOT/docs/handoff"
EVENTS="$HANDOFF_DIR/events.jsonl"
mkdir -p "$HANDOFF_DIR"

TS=$(date -Iseconds -u)
PAYLOAD=$(jq -c -n --arg from "$FROM" --arg to "$TO" --arg kind "$KIND" --arg msg "$MSG" --arg time "$TS" '{from:$from,to:$to,kind:$kind,msg:$msg,time:$time}')
echo "$PAYLOAD" >> "$EVENTS"
echo "Appended event to $EVENTS"

