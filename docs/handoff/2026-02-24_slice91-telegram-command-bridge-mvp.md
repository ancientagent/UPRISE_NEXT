# 2026-02-24 — Slice 91: Telegram Command Bridge MVP (Bi-Directional)

## Scope Lock
1. Add Telegram command intake for queue orchestration actions.
2. Keep execution restricted to allowlisted sender IDs/chats.
3. Map Telegram commands to existing `agent-control` operations.
4. Add parser/tests and workflow automation.
5. Keep changes tooling-only (no product API/UI behavior changes).

## Out of Scope
- Full webhook hosting service.
- Arbitrary shell execution from Telegram.
- Non-queue orchestration actions.

## Implemented
- Added `scripts/agent-bridge-telegram-lib.mjs`:
  - command parsing (`/status`, `/poll`, `/claimable`, `/assign`, `/ack`, `/requeue`)
  - allowlist parsing helpers
  - claimable-task computation helper
- Added `scripts/agent-bridge-telegram.mjs`:
  - polls Telegram updates (`getUpdates`)
  - authorizes sender/chat via env allowlists
  - executes mapped queue commands through `scripts/agent-control.mjs`
  - replies with concise command output
  - confirms processed updates via offset advancement
- Added tests:
  - `scripts/agent-bridge-telegram.test.mjs`
- Added workflow:
  - `.github/workflows/agent-telegram-bridge.yml`
  - scheduled every 5 minutes + manual dispatch
- Added package scripts:
  - `pnpm run agent:telegram:tick`
  - `pnpm run agent:telegram:test`

## Security
- Mandatory allowlisted user IDs: `TELEGRAM_ALLOWED_USER_IDS`.
- Optional chat allowlist: `TELEGRAM_ALLOWED_CHAT_IDS`.
- Command handling is explicit and bounded; unknown commands are rejected.
- No raw shell text from Telegram is executed.

## Validation
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm run agent:bridge:test`
- `pnpm run agent:telegram:test`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Risk
- Low:
  - additive tooling/workflow only,
  - no production app behavior mutations.

## Rollback
- Revert slice commit(s):
  - remove telegram bridge script/workflow/docs/scripts.
- No migration/data rollback required.
