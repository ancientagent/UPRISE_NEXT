# 2026-02-21 — Registrar Promoter Read Payload Normalization (Slice 50)

## Scope
- Harden promoter read payload normalization for `productionName`.
- Keep routes/auth/ownership behavior unchanged.

## Implemented
- Service: `apps/api/src/registrar/registrar.service.ts`
  - `listPromoterRegistrations` now trims `productionName`; blank/whitespace-only values resolve to `null`.
  - `getPromoterRegistration` now trims `productionName`; blank/whitespace-only values resolve to `null`.
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added list-read trim normalization coverage.
  - Added detail-read trim normalization coverage.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/registrar/registrar.service.ts apps/api/test/registrar.service.test.ts docs/specs/system/registrar.md docs/specs/users/identity-roles-capabilities.md docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-read-payload-normalization-slice50.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Next Slices Queued
- Slice 51: merge-gate follow-through for controller error-path hardening branch (PR #31), then freshness sync.
- Slice 52: promoter-read contract fixture consolidation (shared helper to keep list/detail payload assertions consistent).
- Slice 53: lightweight registrar readiness checkpoint doc (what remains before project/sect-motion stage).

## Rollback
- Revert promoter `productionName` normalization in list/detail read mappers.
- Revert corresponding service tests and docs updates.

## Out of Scope Kept
- No new routes.
- No schema/migration changes.
- No UI changes.
