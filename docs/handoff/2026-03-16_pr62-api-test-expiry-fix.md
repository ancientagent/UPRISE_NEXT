# 2026-03-16 — PR62 API Test Expiry Fix

## Issue
- PR #62 failed `Test Apps (api)` on:
  - `RegistrarService › verifies a redeemable registrar code for approved promoter entry`
- Failure cause: hard-coded `expiresAt` test fixture date was in the past relative to current CI date.

## Change
- Updated `apps/api/test/registrar.service.test.ts` to use a deterministic future timestamp:
  - `const futureExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);`
- Replaced the fixed date fixture and expectation with `futureExpiresAt`.

## Verification
```bash
pnpm --filter api test -- registrar.service.test.ts
pnpm --filter api typecheck
```

Both commands passed locally.
