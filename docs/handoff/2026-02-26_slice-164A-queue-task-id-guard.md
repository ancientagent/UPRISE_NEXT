# Slice 164A — Queue `--task-id` Guard For Complete/Block

## Scope
- Tooling/docs only.
- Add optional task-id guard to prevent wrong-task complete/block transitions.
- No product API/UI/schema changes.

## Changes
- Updated `scripts/reliant-slice-queue.mjs`:
  - Added optional `--task-id` to `complete` and `block`.
  - Added guard mismatch checks against runtime `taskId` with explicit error/hint output.
- Updated `scripts/reliant-slice-queue.test.mjs`:
  - Added guard-mismatch coverage for `complete` failure path.
- Updated `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md`:
  - Documented optional `--task-id` usage in manual claim/complete/block flows.
- Updated `docs/CHANGELOG.md` with slice 164A entry.

## Validation Commands and Results
1. `pnpm run reliant:queue:test` — PASS
2. `pnpm run docs:lint` — PASS
3. `pnpm run infra-policy-check` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (backward-compatible optional guard only).
- Rollback: revert queue script/test/doc updates for this slice.
