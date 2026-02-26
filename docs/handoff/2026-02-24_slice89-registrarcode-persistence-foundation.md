# 2026-02-24 — Slice 89: RegistrarCode Persistence Foundation (P3-API-090A)

## Scope Lock
1. Add additive persistence for registrar capability-code records.
2. Add internal registrar service primitive for policy-locked code issuance.
3. Add unit coverage for issuance success and guardrails.
4. Keep scope API/schema-only; no new controller endpoints.

## Implemented
- Added Prisma model `RegistrarCode` in `apps/api/prisma/schema.prisma` with:
  - relation to `RegistrarEntry`,
  - `codeHash` unique persistence,
  - `capability`, `issuerType`, `status`,
  - optional `expiresAt`/`redeemedAt`,
  - timestamps and status-oriented indexes.
- Added migration:
  - `apps/api/prisma/migrations/20260224101500_add_registrar_codes/migration.sql`
  - creates `registrar_codes` table and FK/indexes.
- Added internal registrar service primitive:
  - `RegistrarService.issueRegistrarCodeForApprovedPromoterEntry(registrarEntryId, options?)`
  - enforces locked policy:
    - issuer must be `system`,
    - registrar entry must be `promoter_registration`,
    - registrar entry status must be `approved`.
  - generates code value, stores only SHA-256 hash (`codeHash`), returns one-time code string.
  - includes bounded retry path for unique hash collisions.
- Added unit coverage in `apps/api/test/registrar.service.test.ts`:
  - success path for approved promoter registration issuance,
  - reject non-system issuer,
  - reject missing registrar entry,
  - reject non-promoter entry type,
  - reject non-approved status.

## Validation
- `pnpm run verify` ✅
- `pnpm --filter api prisma:generate` ✅
- `pnpm --filter api test -- registrar.service.test.ts` ✅
- `pnpm --filter api typecheck` ✅

## Risk
- Low to medium:
  - additive schema only (new table, no destructive changes),
  - no public API route changes in this slice,
  - policy guardrails enforced in service primitive.

## Rollback
- Revert commit for this slice.
- If migration already applied, rollback by dropping `registrar_codes` table in a compensating migration.
