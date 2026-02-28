# Slice 157A — Queue File Validation Schema/Check Script

## Scope
- Tooling/docs only.
- Add queue JSON validation to prevent runtime corruption.
- No product API/UI/schema changes.

## Changes
- Updated `scripts/reliant-slice-queue.mjs`:
  - Expanded queue schema validation to enforce:
    - required task fields (`id`, `title`, `prompt`, `status`)
    - allowed statuses (`queued`, `in_progress`, `done`, `blocked`)
    - duplicate task-id rejection
    - `verifyCommand` string type when provided
  - Added `validate` command: `node scripts/reliant-slice-queue.mjs validate --queue <path>`
- Updated `scripts/reliant-slice-queue.test.mjs`:
  - Added validation coverage for success and duplicate-id failure.
- Updated `package.json`:
  - Added `reliant:queue:validate` shortcut.
- Updated `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md` with validate preflight usage.
- Updated `docs/CHANGELOG.md` with slice 157A entry.

## Validation Commands and Results
1. `pnpm run reliant:queue:test` — PASS
2. `pnpm run docs:lint` — PASS
3. `pnpm run infra-policy-check` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (queue tooling validation + docs only).
- Rollback: revert `scripts/reliant-slice-queue.mjs`, `scripts/reliant-slice-queue.test.mjs`, `package.json`, and docs updates.
