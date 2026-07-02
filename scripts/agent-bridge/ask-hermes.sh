#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/agent-bridge/ask-hermes.sh [--agent uprisereviewer+|uprisereviewer-|upriseauditor+|upriseauditor-|PATH] [--out-dir DIR] PROMPT_FILE

Runs a Hermes-compatible one-shot agent against PROMPT_FILE and stores the
prompt, response, stderr, and metadata under tmp/agent-bridge/hermes by default.

Environment:
  HERMES_TIMEOUT_SECONDS  Max seconds to wait for the one-shot agent. Default: 300.
                          Set to 0 to disable the timeout.
USAGE
}

AGENT_BIN="${UPRISE_AGENT_BIN:-uprisereviewer+}"
OUT_DIR="tmp/agent-bridge/hermes"
TIMEOUT_SECONDS="${HERMES_TIMEOUT_SECONDS:-300}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --agent)
      AGENT_BIN="${2:-}"
      shift 2
      ;;
    --out-dir)
      OUT_DIR="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      break
      ;;
  esac
done

if [[ $# -ne 1 ]]; then
  usage >&2
  exit 2
fi

PROMPT_FILE="$1"
if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt file not found: $PROMPT_FILE" >&2
  exit 1
fi

if ! command -v "$AGENT_BIN" >/dev/null 2>&1; then
  echo "Agent command not found: $AGENT_BIN" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BASE_NAME="$(basename "$PROMPT_FILE")"
RUN_DIR="$OUT_DIR/$STAMP-${BASE_NAME%.*}"
mkdir -p "$RUN_DIR"

cp "$PROMPT_FILE" "$RUN_DIR/prompt.md"

set +e
if [[ "$TIMEOUT_SECONDS" =~ ^[0-9]+$ ]] && [[ "$TIMEOUT_SECONDS" -gt 0 ]] && command -v timeout >/dev/null 2>&1; then
  timeout "${TIMEOUT_SECONDS}s" "$AGENT_BIN" -z "$(cat "$PROMPT_FILE")" >"$RUN_DIR/response.md" 2>"$RUN_DIR/stderr.log"
else
  "$AGENT_BIN" -z "$(cat "$PROMPT_FILE")" >"$RUN_DIR/response.md" 2>"$RUN_DIR/stderr.log"
fi
STATUS=$?
set -e

TIMED_OUT=false
if [[ "$STATUS" -eq 124 ]]; then
  TIMED_OUT=true
  printf '\nHermes one-shot timed out after %s seconds.\n' "$TIMEOUT_SECONDS" >>"$RUN_DIR/stderr.log"
fi

cat >"$RUN_DIR/metadata.json" <<JSON
{
  "agent": "$AGENT_BIN",
  "promptFile": "$PROMPT_FILE",
  "status": $STATUS,
  "createdAt": "$STAMP",
  "timeoutSeconds": $TIMEOUT_SECONDS,
  "timedOut": $TIMED_OUT
}
JSON

echo "$RUN_DIR"
if [[ $STATUS -ne 0 ]]; then
  echo "Hermes one-shot failed with status $STATUS. See $RUN_DIR/stderr.log" >&2
  exit "$STATUS"
fi
