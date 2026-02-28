# Slice 136A — Registrar Contract Inventory Metadata Hygiene Pass

## Scope
- Align registrar contract inventory metadata for API-implemented but web-action-gated endpoints.
- Keep ids/path templates/gap classifications coherent and test-enforced.
- No UI implementation status flips.

## Changes
- Updated `apps/web/__tests__/registrar-contract-inventory.test.ts`:
  - Added metadata coherence invariants:
    - `implemented` contracts require `webConsumerPath` and `gapKind = null`.
    - `gap` contracts require `webConsumerPath = null` and non-null `gapKind`.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 136A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-contract-inventory.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only metadata hygiene enforcement).
- Rollback: revert test addition in `apps/web/__tests__/registrar-contract-inventory.test.ts` and `docs/CHANGELOG.md` entry.
