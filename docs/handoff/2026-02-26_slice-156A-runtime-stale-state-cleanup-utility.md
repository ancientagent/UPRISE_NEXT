# Slice 156A — Runtime Stale-State Cleanup Utility Script

## Scope
- Tooling/docs only.
- Add utility to safely clear stale runtime task file.
- No product API/UI/schema changes.

## Changes
- Added `scripts/reliant-runtime-clean.mjs`:
  - Clears runtime file path (default `.reliant/runtime/current-task.json`) if present.
  - Emits explicit JSON result with `cleared` status and `previousTaskId` when available.
  - Returns deterministic message when runtime file does not exist.
- Updated `package.json`:
  - Added `reliant:runtime:clean` command.
- Updated `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md`:
  - Added utility usage in stale-runtime cleanup sequence.
- Updated `docs/CHANGELOG.md` with slice 156A entry.

## Validation Commands and Results
1. `pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-does-not-exist.json` — PASS (`cleared:false`, explicit not-found message)
2. `pnpm run docs:lint` — PASS
3. `pnpm run infra-policy-check` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (tooling utility + docs only).
- Rollback: remove `scripts/reliant-runtime-clean.mjs`, remove package script, revert docs changes.
