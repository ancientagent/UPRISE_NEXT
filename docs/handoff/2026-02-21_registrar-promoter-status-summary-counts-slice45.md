# 2026-02-21 — Registrar Promoter Status Summary Counts (Slice 45)

## Scope
- Add promoter list status summary aggregation for submitter tracking.
- Keep route/auth/ownership behavior unchanged.

## Implemented
- Service: `apps/api/src/registrar/registrar.service.ts`
  - `listPromoterRegistrations` now returns top-level `countsByStatus`.
- Tests:
  - `apps/api/test/registrar.service.test.ts`
    - asserts populated `countsByStatus` and empty-state shape.
  - `apps/api/test/registrar.controller.test.ts`
    - asserts response wrapper carries `countsByStatus`.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/registrar/registrar.service.ts apps/api/test/registrar.controller.test.ts apps/api/test/registrar.service.test.ts docs/specs/system/registrar.md docs/specs/users/identity-roles-capabilities.md docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-status-summary-counts-slice45.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove `countsByStatus` from `listPromoterRegistrations` response.
- Revert controller/service test expectations and docs updates.

## Out of Scope Kept
- No new routes.
- No schema/migration changes.
- No UI action changes.
