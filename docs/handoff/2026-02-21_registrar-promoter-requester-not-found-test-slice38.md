# 2026-02-21 — Registrar Promoter Requester-Not-Found Test (Slice 38)

## Scope
- Add missing requester-not-found coverage for promoter registration initiation.
- Keep endpoint/service behavior unchanged.

## Implemented
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added `submitPromoterRegistration` rejection case when requester user cannot be loaded (`NotFoundException`).

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm --filter api test -- registrar.controller.test.ts registrar.service.test.ts`
  - 2 suites passed, 23 tests passed.
- `pnpm --filter api typecheck`
  - `tsc --noEmit` passed.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.service.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-requester-not-found-test-slice38.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (single historical changelog mention only).

## Rollback
- Remove added requester-not-found test from `registrar.service.test.ts`.

## Out of Scope Kept
- No endpoint/service behavior changes.
- No migration/model changes.
- No web UI changes.
