# Slice 127A — Registrar Contract Inventory Alignment for Implemented Read APIs

## Scope
- Align registrar web contract inventory metadata to include implemented registrar read API surfaces.
- No UI status flips to implemented without concrete web consumers.

## Changes
- Updated `apps/web/__tests__/registrar-contract-inventory.test.ts`:
  - Added explicit coverage asserting implemented registrar read API ids are represented in inventory metadata.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 127A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-contract-inventory.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only inventory alignment guard).
- Rollback: revert test addition in `apps/web/__tests__/registrar-contract-inventory.test.ts` and `docs/CHANGELOG.md` entry.
