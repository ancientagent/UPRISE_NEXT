# 2026-02-21 — Registrar Promoter Guardrail Tests (Slice 36)

## Scope
- Expand promoter initiation test coverage only.
- Keep promoter endpoint/service behavior unchanged.

## Implemented
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added rejection coverage for `submitPromoterRegistration`:
    - scene missing (`NotFoundException`),
    - non city-tier scene (`ForbiddenException`),
    - requester without established Home Scene (`ForbiddenException`).

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts`
  - 2 suites passed, 22 tests passed.
- `pnpm --filter api typecheck`
  - `tsc --noEmit` passed.
- `pnpm --filter web typecheck`
  - `tsc --noEmit` passed.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.service.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-guardrail-tests-slice36.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (single historical changelog mention only).

## Rollback
- Remove added promoter guardrail tests from `registrar.service.test.ts`.

## Out of Scope Kept
- No endpoint/service behavior changes.
- No migration/model changes.
- No web UI changes.
