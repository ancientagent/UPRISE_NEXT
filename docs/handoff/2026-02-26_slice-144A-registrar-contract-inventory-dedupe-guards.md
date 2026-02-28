# Slice 144A — Registrar Contract Inventory Dedupe + Guard Tests

## Scope
- Tighten registrar contract inventory tests for dedupe + entry-id guard coverage.
- No behavior or UI changes.

## Changes
- Updated `apps/web/__tests__/registrar-contract-inventory.test.ts`:
  - Added whitespace-trimming assertions for project and sect-motion `detail(entryId)` helpers.
  - Added whitespace-only rejection assertions for project and sect-motion entry-id guards.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 144A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-contract-inventory.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only guard tightening).
- Rollback: revert `apps/web/__tests__/registrar-contract-inventory.test.ts` additions and `docs/CHANGELOG.md` entry.
