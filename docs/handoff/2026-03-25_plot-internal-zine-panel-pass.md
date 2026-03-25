# Plot Internal Zine Panel Pass

## Scope
Extend the locked DIY zine / record-divider style system from the Plot shell into the current Plot tab internals.

This pass is still Plot-only and still visual-only. It does not change fetch contracts, route behavior, or canonical tab ownership.

## Updated Surfaces
- `Feed`
- `Events`
- `Promotions`
- `Statistics`
- `Top 40`

## Files
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/src/components/plot/PlotEventsPanel.tsx`
- `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
- `apps/web/src/components/plot/StatisticsPanel.tsx`
- `apps/web/src/components/plot/TopSongsPanel.tsx`
- `apps/web/__tests__/plot-tab-contracts.test.ts`

## What Changed
- Restyled tab panels to match the existing Plot shell:
  - `plot-zine-card`
  - `plot-record-sleeve`
  - `plot-ledger-card`
  - `plot-annotation-note`
  - `plot-embossed-label`
- Converted empty states and list rows away from plain white cards into ledger/paper treatments.
- Converted internal status/index labels to embossed-tape style markers.
- Kept all data loading and tab logic unchanged.
- Added a source lock so the Plot internals stay on the same visual system as the shell.

## Verification
- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts __tests__/plot-tab-contracts.test.ts`
- `pnpm --filter web typecheck`
- Playwright CLI live tab check on `/plot`
- `pnpm run docs:lint`

## Residual Notes
- Scene map/chart internals can still take on a more hand-drawn chart treatment in a later slice.
- This pass still does not style `/discover`, `/community/[id]`, or `/artist-bands/[id]`.
