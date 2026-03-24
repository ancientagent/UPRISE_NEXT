# Plot Structural Community Identity Lock

Date: 2026-03-24
Branch: feat/ux-founder-locks-and-harness

## Summary
Locked remaining Plot-visible selected-community labels to the structural community identity format `city + state + music community` wherever the selected community tuple is already present. This removes the last `name`-only labels from the current Plot shell and the Feed / Events / Promotions headers while preserving safe fallback labels for aggregate scopes that do not expose a full city-scene tuple.

## Source of Truth
- `AGENTS.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_WEB_UX_IMPLEMENTATION_BRIEF_R1.md`

## Files
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/src/components/plot/PlotEventsPanel.tsx`
- `apps/web/src/components/plot/PlotPromotionsPanel.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/plot-tab-contracts.test.ts`
- `docs/CHANGELOG.md`

## Change
- Added a route-level `formatPlotCommunityLabel(...)` helper in `/plot`.
- Passed `selectedCommunityLabel` into Feed / Events / Promotions headers instead of `selectedCommunity.name`.
- Updated Plot route shell identity surfaces to prefer structural labels when tuple fields exist.
- Preserved fallback to `community.name` only for aggregate scopes lacking a full structural tuple.

## Verification
- `pnpm --filter web test -- --runInBand __tests__/plot-ux-regression-lock.test.ts __tests__/plot-tab-contracts.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`

## Residual Note
This slice does not broaden Plot reads or alter aggregate statistics semantics. It only corrects visible identity rendering where the selected city-scene tuple is already available in page state.
