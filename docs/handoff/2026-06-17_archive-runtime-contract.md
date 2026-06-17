# Archive Runtime Contract Hardening (2026-06-17)

## Scope
Small runtime/test hardening slice for the current `/plot` Archive contract.

## Changed
- Updated the internal `/plot` panel comment from `Archive & Map` to `Active Plot Surface`.
- Added a regression assertion in `apps/web/__tests__/plot-ux-regression-lock.test.ts` that keeps Archive descriptive and rejects default map/analytics exploration drift.

## Current Contract
- Plot tabs remain `Feed`, `Events`, `Archive`.
- Archive remains read-only descriptive history for the current Plot context.
- Archive does not mount `StatisticsPanel`, `SceneMap`, nearby-community exploration, leaderboards, predictive analytics, or comparative artist scoring as its default MVP body.

## Verification
- `pnpm --filter web test -- plot-ux-regression-lock.test.ts`
- `pnpm run docs:lint`
- `git diff --check`
