# Slice 147A — Queue Script Idempotency Guards (Complete/Block)

## Scope
- Harden `scripts/reliant-slice-queue.mjs` transition safety to avoid accidental complete/block on stale runtime IDs.
- Additive queue-tooling guard checks + tests/docs only.

## Changes
- Updated `scripts/reliant-slice-queue.mjs`:
  - Added transition guard: `complete` now requires task status `in_progress` (with idempotent re-complete handling for already `done`).
  - Added transition guard: `block` now requires task status `in_progress` (with idempotent re-block handling for already `blocked`).
  - Added explicit status-mismatch error messaging (`expected "in_progress"`) and exit code `4` for stale transition attempts.
- Added `scripts/reliant-slice-queue.test.mjs`:
  - Covers idempotent re-complete behavior.
  - Covers stale block/complete rejection behavior.
- Updated `package.json`:
  - Added `reliant:queue:test` script.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 147A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api typecheck` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm run reliant:queue:test` — PASS

## Risk / Rollback
- Risk: low (tooling-only safety guardrails).
- Rollback: revert `scripts/reliant-slice-queue.mjs`, `scripts/reliant-slice-queue.test.mjs`, `package.json`, and changelog entry.
