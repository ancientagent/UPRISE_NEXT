# 2026-02-21 — Registrar Artist Entry List Controller Parity Tests (Slice 54)

## Scope
- Add controller coverage for existing Artist/Band registrar entry-list route.
- Keep runtime behavior unchanged (tests/docs only).

## Implemented
- Tests: `apps/api/test/registrar.controller.test.ts`
  - Added success-path coverage for `listMyArtistBandRegistrations` delegation and wrapped response shape.
  - Added error-path coverage asserting service-layer `ForbiddenException` is propagated.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.controller.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-artist-entry-list-controller-parity-tests-slice54.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove added artist entry-list controller tests from `apps/api/test/registrar.controller.test.ts`.

## Out of Scope Kept
- No endpoint/schema changes.
- No migration changes.
- No UI changes.
