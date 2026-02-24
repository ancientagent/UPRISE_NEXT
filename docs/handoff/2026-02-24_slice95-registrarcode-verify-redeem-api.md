# 2026-02-24 — Slice 95: RegistrarCode Verify/Redeem API Primitives

## Scope Lock
1. Add registrar code verification API primitive.
2. Add auth-safe registrar code redemption API primitive.
3. Keep implementation additive (no destructive migration).
4. Keep web surface unchanged (typed contract updates only; no new UI action).

## Implemented
- Added registrar DTO schemas:
  - `RegistrarCodeVerifySchema`
  - `RegistrarCodeRedeemSchema`
- Added registrar service primitives:
  - `verifyRegistrarCode(code)`
  - `redeemRegistrarCodeForUser(userId, code)`
- Added registrar controller routes (auth required):
  - `POST /registrar/code/verify`
  - `POST /registrar/code/redeem`
- Guardrails enforced on verify/redeem:
  - linked entry type must be `promoter_registration`,
  - linked entry status must be `approved`,
  - code must be active (`issued`) and not expired/redeemed.
- Added targeted test coverage:
  - service: verify/redeem success + guard paths,
  - controller: delegation and error propagation,
  - dto: verify/redeem payload validation.
- Updated web typed contract artifacts (no UI wiring):
  - concrete verify/redeem endpoint path mapping in `contractInventory`,
  - typed client helper functions for verify/redeem.

## Validation
- `pnpm run docs:lint` ✅
- `pnpm run infra-policy-check` ✅
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts` ✅ (3 suites, 86 tests)
- `pnpm --filter api typecheck` ✅
- `pnpm --filter web typecheck` ✅

## Risk
- Low:
  - additive API path extension only,
  - no schema migration,
  - no UI action changes.

## Rollback
- Revert the slice commit.
- No migration rollback required for this slice.
