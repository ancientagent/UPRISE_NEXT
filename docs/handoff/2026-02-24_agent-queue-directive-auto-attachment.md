# 2026-02-24 — Agent Queue Directive Auto-Attachment

## Scope Lock
1. Auto-attach standing directives to newly assigned queue tasks.
2. Backfill directive metadata when claiming legacy tasks missing directives.
3. Add test coverage and docs update for the new behavior.

## Implemented
- Updated `scripts/agent-control.mjs`:
  - Added default directive bundle:
    - required reading order,
    - standing orders,
    - validation gate checklist.
  - `assign` now writes `task.directives` automatically.
  - `claim` backfills `task.directives` when absent (legacy tasks).
  - Added `backfill-directives` command for one-shot queue-wide directive patching on existing tasks.
- Updated `scripts/agent-control.test.mjs`:
  - Added assertions that assigned tasks include directive metadata.
- Updated `docs/handoff/agent-control/README.md`:
  - Added directive auto-attachment behavior in guardrails section.
- Updated `docs/CHANGELOG.md`.

## Validation
- `pnpm run docs:lint` ✅
- `pnpm run infra-policy-check` ✅
- `pnpm run agent:queue:test` ✅

## Risk
- Low:
  - queue metadata extension only,
  - no task lifecycle behavior removed.

## Rollback
- Revert the commit introducing directive fields.
- Existing tasks remain usable; missing directives are backfilled on claim.
