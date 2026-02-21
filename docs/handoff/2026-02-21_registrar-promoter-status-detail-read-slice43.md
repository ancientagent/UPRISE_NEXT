# 2026-02-21 — Registrar Promoter Status Detail Read (Slice 43)

## Scope
- Add a submitter-scoped promoter registration detail read endpoint.
- Preserve initiation-only promoter registration write behavior.

## Implemented
- API/controller: `apps/api/src/registrar/registrar.controller.ts`
  - Added `GET /registrar/promoter/:entryId`.
  - Keeps standard `{ success: true, data }` response envelope.
- Service: `apps/api/src/registrar/registrar.service.ts`
  - Added `getPromoterRegistration(userId, entryId)`:
    - loads registrar entry by ID,
    - enforces type = `promoter_registration`,
    - enforces submitter ownership,
    - returns scene context + payload summary (`productionName`).
- Tests:
  - `apps/api/test/registrar.controller.test.ts`:
    - added controller delegation + wrapper response coverage.
  - `apps/api/test/registrar.service.test.ts`:
    - added success case, non-owner rejection, and missing-entry rejection.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/registrar/registrar.controller.ts apps/api/src/registrar/registrar.service.ts apps/api/test/registrar.controller.test.ts apps/api/test/registrar.service.test.ts docs/specs/system/registrar.md docs/specs/users/identity-roles-capabilities.md docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-status-detail-read-slice43.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove `GET /registrar/promoter/:entryId` route + service method.
- Remove corresponding controller/service tests.
- Revert related spec/changelog/handoff docs.

## Out of Scope Kept
- No promoter capability grant logic.
- No `/registrar/project` or `/registrar/sect-motion` implementation.
- No schema/migration changes.
- No web UI changes.
