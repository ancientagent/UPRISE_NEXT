# 2026-02-21 — Registrar Promoter Submit Controller Error-Path Test (Slice 53)

## Scope
- Add controller error-path coverage for promoter submit route.
- Keep runtime controller/service logic unchanged.

## Implemented
- Tests: `apps/api/test/registrar.controller.test.ts`
  - Added coverage asserting `submitPromoterRegistration` propagates `ForbiddenException` from registrar service.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.controller.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-submit-controller-error-path-test-slice53.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove added submit error-path test from `registrar.controller.test.ts`.

## Out of Scope Kept
- No endpoint/schema changes.
- No migration changes.
- No UI changes.
