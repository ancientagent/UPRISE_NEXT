# Slice 126A — Promoter Web Typed Client Test Hardening (List/Detail/Audit)

## Scope
- Strengthen web typed client tests for promoter read methods:
  - `listPromoterRegistrations`
  - `getPromoterRegistration`
  - `getPromoterCapabilityAudit`
- Contract-only; no UI actions.

## Changes
- Updated `apps/web/__tests__/registrar-client.test.ts`:
  - Added stronger shape assertions for promoter detail `promoterCapability` fields.
  - Added stronger shape assertions for capability-audit event fields.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 126A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter web test -- registrar-client.test.ts` — PASS
4. `pnpm --filter web typecheck` — PASS
5. `pnpm --filter api typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only hardening).
- Rollback: revert `apps/web/__tests__/registrar-client.test.ts` assertions and `docs/CHANGELOG.md` entry.
