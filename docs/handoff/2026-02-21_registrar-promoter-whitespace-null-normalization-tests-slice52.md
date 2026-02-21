# 2026-02-21 — Registrar Promoter Whitespace-Null Normalization Tests (Slice 52)

## Scope
- Harden promoter read normalization coverage for whitespace-only payload values.
- Keep endpoint/service runtime logic unchanged.

## Implemented
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added list-read coverage: whitespace-only `productionName` resolves to `null`.
  - Added detail-read coverage: whitespace-only `productionName` resolves to `null`.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.service.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-whitespace-null-normalization-tests-slice52.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove added whitespace-only normalization assertions from `registrar.service.test.ts`.

## Out of Scope Kept
- No endpoint/schema changes.
- No migration changes.
- No UI changes.
