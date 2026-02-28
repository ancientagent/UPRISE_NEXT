# Slice 159A — Registrar Contract Inventory Helper Coverage Expansion

## Scope
- Expand helper guard coverage in registrar contract inventory tests for entry-id scoped endpoint builders.

## Changes
- Updated `apps/web/__tests__/registrar-contract-inventory.test.ts`:
  - Added promoter endpoint helper coverage for:
    - `registrarPromoterEndpoints.detail(entryId)`
    - `registrarPromoterEndpoints.capabilityAudit(entryId)`
  - Added empty-entry-id guard assertions for promoter entry-scoped endpoint builders.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 159A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-contract-inventory.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only helper coverage).
- Rollback: revert test additions in `apps/web/__tests__/registrar-contract-inventory.test.ts` and `docs/CHANGELOG.md` entry.
