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
- Telegram command bridge: `scripts/agent-bridge-telegram.mjs`
- Telegram parser tests: `scripts/agent-bridge-telegram.test.mjs`
- Telegram workflow: `.github/workflows/agent-telegram-bridge.yml`

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

## Telegram Command Bridge (Bi-Directional)
Run locally:

```bash
export TELEGRAM_BOT_TOKEN=<bot-token>
export TELEGRAM_ALLOWED_USER_IDS=<numeric-user-id>
export TELEGRAM_ALLOWED_CHAT_IDS=<numeric-chat-id>   # optional
pnpm run agent:telegram:tick -- \
  --queue /tmp/uprise_next_agent_queue.json \
  --lanes docs/handoff/agent-control/lanes.json \
  --limit 25
```

Supported Telegram commands:
- `/status [lane]`
- `/poll`
- `/claimable [lane]`
- `/assign <TASK_ID> <LANE> [PRIORITY] <TITLE...> [--depends=A,B]`
- `/ack <TASK_ID> [notes...]`
- `/requeue <TASK_ID> [reason...]`

Security notes:
- The bridge rejects messages from users/chats outside allowlists.
- Set `TELEGRAM_ALLOWED_USER_IDS` as a comma-separated numeric list.
- Optionally restrict chat IDs with `TELEGRAM_ALLOWED_CHAT_IDS`.
- Bridge does not execute shell text from chat; it only maps known commands to `agent-control` subcommands.

## Telegram Workflow
- Workflow: `Agent Telegram Bridge`
- Trigger:
  - schedule every 5 minutes
  - manual `workflow_dispatch` with optional `queue_path` and `limit`
- Required repository secrets:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_ALLOWED_USER_IDS`
- Optional secret:
  - `TELEGRAM_ALLOWED_CHAT_IDS`

## Output Artifacts
- JSON + Markdown bridge reports are written under:
  - `scripts/reports/agent-bridge/`
- Workflow uploads these reports as CI artifacts.

## Operational Notes
- Default queue file in repo: `docs/handoff/agent-control/queue.json`
- Active local orchestration queue may differ (for example `/tmp/uprise_next_agent_queue.json`).
- Ensure queue path consistency across all lane sessions and bridge invocations.
