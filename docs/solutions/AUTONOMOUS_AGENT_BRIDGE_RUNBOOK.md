# Autonomous Agent Bridge Runbook

## Purpose
Provide a scheduler + notification bridge for the lane queue so orchestration can continue with minimal manual relay.

## Scope
- Queue health snapshot
- Claimable task detection by lane
- Stale in-progress detection
- Optional Telegram summary notification
- Scheduled execution in GitHub Actions

## Components
- Script: `scripts/agent-bridge-tick.mjs`
- Tests: `scripts/agent-bridge-tick.test.mjs`
- Workflow: `.github/workflows/agent-queue-bridge.yml`

## Local Usage
Run one bridge tick against an active queue:

```bash
pnpm run agent:bridge:tick -- \
  --queue /tmp/uprise_next_agent_queue.json \
  --lanes docs/handoff/agent-control/lanes.json \
  --output-dir scripts/reports/agent-bridge \
  --stale-minutes 45
```

Fail when blocked tasks exist:

```bash
pnpm run agent:bridge:tick -- \
  --queue /tmp/uprise_next_agent_queue.json \
  --lanes docs/handoff/agent-control/lanes.json \
  --fail-on-blocked
```

## Telegram Notification (Optional)
Set these env vars before running `agent:bridge:tick -- --notify-telegram`:

```bash
export TELEGRAM_BOT_TOKEN=<bot-token>
export TELEGRAM_CHAT_ID=<chat-id>
```

Behavior:
- If both env vars are set and `--notify-telegram` is passed, the bridge posts a concise queue summary.
- If env vars are missing, notification is skipped.

## GitHub Workflow
- Workflow: `Agent Queue Bridge`
- Trigger:
  - schedule every 15 minutes
  - manual `workflow_dispatch` with optional inputs:
    - `queue_path`
    - `stale_minutes`
    - `notify_telegram`
- Required repository secrets for Telegram mode:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

## Output Artifacts
- JSON + Markdown bridge reports are written under:
  - `scripts/reports/agent-bridge/`
- Workflow uploads these reports as CI artifacts.

## Operational Notes
- Default queue file in repo: `docs/handoff/agent-control/queue.json`
- Active local orchestration queue may differ (for example `/tmp/uprise_next_agent_queue.json`).
- Ensure queue path consistency across all lane sessions and bridge invocations.
