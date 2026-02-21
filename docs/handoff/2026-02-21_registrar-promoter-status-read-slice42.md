# 2026-02-21 — Registrar Promoter Status Read (Slice 42)

## Scope
- Add submitter-owned promoter registration list read surface.
- Keep promoter registration write behavior initiation-only.

## Implemented
- API/controller: `apps/api/src/registrar/registrar.controller.ts`
  - Added `GET /registrar/promoter/entries`.
  - Returns `{ success: true, data }` envelope and delegates to service with authenticated `userId`.
- Service: `apps/api/src/registrar/registrar.service.ts`
  - Added `listPromoterRegistrations(userId)`:
    - filters `RegistrarEntry` by `createdById` + `type = promoter_registration`,
    - orders by latest `createdAt`,
    - returns scene context and payload summary (`productionName`) per entry.
- Tests:
  - `apps/api/test/registrar.controller.test.ts`
    - added delegation + response wrapper coverage for promoter entry list read.
  - `apps/api/test/registrar.service.test.ts`
    - added list behavior coverage for populated and empty submitter-owned promoter entries.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/registrar/registrar.controller.ts apps/api/src/registrar/registrar.service.ts apps/api/test/registrar.controller.test.ts apps/api/test/registrar.service.test.ts docs/specs/system/registrar.md docs/specs/users/identity-roles-capabilities.md docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-status-read-slice42.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove `GET /registrar/promoter/entries` controller route + service method.
- Remove related controller/service tests.
- Revert associated spec/changelog/handoff updates.

## Out of Scope Kept
- No promoter capability grant logic.
- No `/registrar/project` or `/registrar/sect-motion` implementation.
- No migration/schema changes.
- No web UI changes.
