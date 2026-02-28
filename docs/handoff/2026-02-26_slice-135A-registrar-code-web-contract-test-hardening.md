# Slice 135A — Registrar Code Web Read/Client Contract Test Hardening

## Scope
- Strengthen web typed client/contract tests around registrar code verify/redeem scaffolding.
- Keep issue endpoint unresolved per spec.
- No new UI actions.

## Changes
- Updated `apps/web/__tests__/registrar-client.test.ts`:
  - Added verify endpoint request-mapping and typed payload passthrough test.
  - Added redeem endpoint request-mapping and typed payload passthrough test.
  - Retained unresolved issue endpoint scaffold expectation.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 135A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-client.test.ts registrar-contract-inventory.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (contract/test-only hardening).
- Rollback: revert `apps/web/__tests__/registrar-client.test.ts` additions and `docs/CHANGELOG.md` entry.
