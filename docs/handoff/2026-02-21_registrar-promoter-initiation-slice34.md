# 2026-02-21 — Registrar Promoter Initiation (Slice 34)

## Scope
- Implement registrar initiation primitive for promoter registration.
- Keep behavior initiation-only (no capability grant or approval workflow).

## Implemented
- API endpoint: `POST /registrar/promoter`
  - Added in `apps/api/src/registrar/registrar.controller.ts`.
- DTO: `apps/api/src/registrar/dto/registrar.dto.ts`
  - Added `PromoterRegistrationSchema` + `PromoterRegistrationDto` with:
    - `sceneId` (uuid)
    - `productionName` (required, 1-140)
- Service: `apps/api/src/registrar/registrar.service.ts`
  - Added `submitPromoterRegistration(userId, dto)`:
    - validates scene exists,
    - validates city-tier registrar scene,
    - validates requester Home Scene is established and matches target scene,
    - creates `RegistrarEntry` with `type: promoter_registration` and payload `{ productionName }`.
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added submit success test.
  - Added out-of-home-scene rejection test.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm --filter api test -- registrar.service.test.ts`
  - 1 suite passed, 18 tests passed.
- `pnpm --filter api typecheck`
  - required `pnpm --filter api prisma:generate` first after branch fast-forward; then `tsc --noEmit` passed.
- `pnpm --filter web typecheck`
  - `tsc --noEmit` passed.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/registrar apps/api/test/registrar.service.test.ts docs/specs/system/registrar.md docs/specs/users/identity-roles-capabilities.md docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-initiation-slice34.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (single historical changelog mention only).

## Rollback
- Remove controller route + DTO schema/type + service method.
- Remove added registrar tests.

## Out of Scope Kept
- No promoter capability grant, code issuance, or approval state machine.
- No web UI/CTA additions.
- No new migrations/models.
