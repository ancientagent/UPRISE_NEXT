# 2026-02-21 — Registrar Promoter Normalization Helper Consolidation (Slice 51)

## Scope
- Reduce duplication in promoter read normalization logic.
- Preserve existing list/detail read behavior.

## Implemented
- Service: `apps/api/src/registrar/registrar.service.ts`
  - Added shared helper `normalizePromoterProductionName(payload)`.
  - Reused helper in:
    - `listPromoterRegistrations`
    - `getPromoterRegistration`

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/registrar/registrar.service.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-promoter-normalization-helper-consolidation-slice51.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Inline helper logic back into list/detail read mappers.

## Out of Scope Kept
- No endpoint/schema changes.
- No migration changes.
- No UI changes.
