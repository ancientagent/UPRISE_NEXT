# 2026-02-21 — Registrar Promoter Controller Error-Path Tests (Slice 49)

## Scope
- Harden controller test coverage for promoter read error propagation.
- Keep runtime endpoint/service logic unchanged.

## Implemented
- Tests: `apps/api/test/registrar.controller.test.ts`
  - Added coverage asserting controller propagates service errors for:
    - `listMyPromoterRegistrations` (`ForbiddenException`),
    - `getMyPromoterRegistration` (`NotFoundException`).

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.controller.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-controller-error-path-tests-slice49.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove added controller error-path tests in `registrar.controller.test.ts`.

## Out of Scope Kept
- No endpoint/service logic changes.
- No schema/migration changes.
- No UI changes.
