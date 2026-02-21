# 2026-02-21 — Registrar Promoter Controller Test Hardening (Slice 35)

## Scope
- Add controller-level regression test for new promoter registrar route.
- Keep runtime behavior unchanged.

## Implemented
- Added test file: `apps/api/test/registrar.controller.test.ts`
  - Verifies `RegistrarController.submitPromoterRegistration` delegates to `RegistrarService.submitPromoterRegistration` with authenticated user ID + dto.
  - Verifies standard API success wrapper shape `{ success: true, data }`.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts`
  - 2 suites passed, 19 tests passed.
- `pnpm --filter api typecheck`
  - `tsc --noEmit` passed.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.controller.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-controller-test-hardening-slice35.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (single historical changelog mention only).

## Rollback
- Remove `apps/api/test/registrar.controller.test.ts`.

## Out of Scope Kept
- No endpoint contract changes.
- No new models/migrations.
- No web UI changes.
