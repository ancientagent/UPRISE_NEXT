# 2026-02-24 — Slice 96: Promoter Capability Transition Persistence/Read Enrichment

## Scope Lock
1. Add additive persistence for user capability grants.
2. Wire registrar code redemption to capability grant upsert.
3. Enrich promoter submitter read surfaces with capability transition state.
4. Keep scope additive (no destructive migration, no new UI actions).

## Implemented
- Added Prisma model/table `UserCapabilityGrant`:
  - unique grant key: `userId + capability`,
  - source provenance fields: `sourceRegistrarEntryId`, `sourceRegistrarCodeId`,
  - status lifecycle fields: `status`, `grantedAt`, `revokedAt`.
- Added migration:
  - `apps/api/prisma/migrations/20260224200000_add_user_capability_grants/migration.sql`
- Updated redemption flow:
  - `RegistrarService.redeemRegistrarCodeForUser` now performs transactional:
    - code status update (`issued` -> `redeemed`),
    - capability grant upsert (`promoter_capability`).
- Promoter read enrichment:
  - `listPromoterRegistrations` and `getPromoterRegistration` now include `promoterCapability` summary:
    - `codeIssuedCount`,
    - `latestCodeStatus`,
    - `latestCodeIssuedAt`,
    - `latestCodeRedeemedAt`,
    - `granted`,
    - `grantedAt`.
- Updated web typed client contract (`RegistrarPromoterEntry`) with additive `promoterCapability` shape.

## Validation
- `pnpm --filter api prisma:generate` ✅
- `pnpm run docs:lint` ✅
- `pnpm run infra-policy-check` ✅
- `pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts registrar.dto.test.ts` ✅
- `pnpm --filter api typecheck` ✅
- `pnpm --filter web typecheck` ✅

## Risk
- Low to medium:
  - additive schema/table only,
  - read enrichment is additive/non-breaking,
  - redemption writes now include one additional transactional table upsert.

## Rollback
- Revert slice commit for code/docs changes.
- If migration is already applied, issue compensating migration to drop `user_capability_grants` after data review.
