# Slice 163A — Queue Stale-Runtime Diagnostic Message Hardening

## Scope
- Tooling/docs only.
- Improve stale runtime/current-task mismatch diagnostics.
- No product API/UI/schema changes.

## Changes
- Updated `scripts/reliant-slice-queue.mjs`:
  - `complete` and `block` now emit explicit diagnostics when runtime file is missing.
  - Added explicit runtime/queue mismatch diagnostics including current `in_progress` task IDs.
  - Added actionable recovery hints for stale runtime cleanup and re-claim.
- Updated `docs/CHANGELOG.md` with slice 163A entry.

## Validation Commands and Results
1. `pnpm run reliant:queue:test` — PASS
2. `pnpm run docs:lint` — PASS
3. `pnpm run infra-policy-check` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (diagnostic text improvements only).
- Rollback: revert `scripts/reliant-slice-queue.mjs` and changelog entry.
