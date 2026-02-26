# 2026-02-24 — Slice 92: Telegram Near-Real-Time Long-Poll Loop

## Scope Lock
1. Improve Telegram command responsiveness without introducing new hosting infrastructure.
2. Keep GitHub Actions as the execution surface for the Telegram bridge.
3. Add bounded long-poll behavior to `agent-telegram` tick runs.
4. Keep queue/control-plane contracts unchanged.
5. Ship with tests, docs, changelog, and handoff updates.

## Out of Scope
- New external webhook service or persistent bot server.
- Product API/UI behavior changes.
- Queue schema/data model changes.

## Implemented
- Updated `scripts/agent-bridge-telegram.mjs`:
  - Added bounded long-poll loop within a single run.
  - Added CLI controls:
    - `--poll-timeout-seconds`
    - `--max-runtime-seconds`
    - `--idle-sleep-ms` (busy-loop guard when timeout is 0)
  - Replaced single-pass update handling with repeated polling until runtime budget is reached.
  - Added run metrics in output: `batches`, `runtime_seconds`, `poll_timeout_seconds`, `max_runtime_seconds`.
- Updated `scripts/agent-bridge-telegram-lib.mjs`:
  - Added `parseNonNegativeInteger` helper for guarded numeric option parsing.
- Updated tests `scripts/agent-bridge-telegram.test.mjs`:
  - Added coverage for integer option parsing helper.
- Updated workflow `.github/workflows/agent-telegram-bridge.yml`:
  - Added `workflow_dispatch` inputs:
    - `poll_timeout_seconds` (default `25`)
    - `max_runtime_seconds` (default `240`)
  - Added workflow-level concurrency group `agent-telegram-bridge`.
  - Passes long-poll args into bridge script.
- Updated docs:
  - `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md`
  - `docs/handoff/agent-control/README.md`
  - `docs/handoff/README.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` ✅
- `pnpm run infra-policy-check` ✅
- `pnpm run agent:bridge:test` ✅
- `pnpm run agent:telegram:test` ✅
- `pnpm --filter api typecheck` ✅
- `pnpm --filter web typecheck` ✅

## Risk
- Low:
  - Additive tooling/workflow changes only.
  - No production API/database behavior changes.

## Rollback
- Revert the slice commit.
- No schema/data rollback required.
