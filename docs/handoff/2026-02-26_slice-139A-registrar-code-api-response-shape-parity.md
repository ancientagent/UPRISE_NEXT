# Slice 139A — Registrar Code Verify/Redeem API Response-Shape Parity Tests

## Scope
- Harden API tests for registrar code verify/redeem response-shape parity and status transitions.
- Existing endpoints only; no route/schema changes.

## Changes
- Updated `apps/api/test/registrar.controller.test.ts`:
  - Strengthened verify/redeem passthrough shape assertions (`capability`, `issuerType`, timestamps, status values).
- Updated `apps/api/test/registrar.service.test.ts`:
  - Strengthened verify/redeem response-shape assertions for status transition semantics.
  - Added explicit assertion that verify response omits `redeemedAt`.
- Updated `docs/CHANGELOG.md`:
  - Added Unreleased entry for slice 139A.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts` — PASS
4. `pnpm --filter api typecheck` — PASS
5. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (test-only parity hardening).
- Rollback: revert test assertion updates in `apps/api/test/registrar.controller.test.ts` and `apps/api/test/registrar.service.test.ts`, plus changelog entry.
