# 2026-02-21 — Registrar Promoter Detail Type-Guard Test (Slice 44)

## Scope
- Harden test coverage for promoter detail read guardrails.
- Keep runtime behavior unchanged.

## Implemented
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added rejection coverage for `getPromoterRegistration` when entry type is not `promoter_registration`.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.service.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-detail-type-guard-test-slice44.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove the non-promoter-type guard test from `registrar.service.test.ts`.

## Out of Scope Kept
- No endpoint/service logic changes.
- No schema/migration changes.
- No UI changes.
