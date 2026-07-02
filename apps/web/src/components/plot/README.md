# Plot Components

Current active `/plot` surfaces are `Feed`, `Events`, and `Archive`.

## Active Panels

`PlotTabSurface.tsx` owns the non-expanded tab bar and active-surface frame presentation. `PlotPrimaryTabBody.tsx` owns the current active `Feed`, `Events`, and `Archive` body selection. Keep the route shell responsible for Plot state and selected-scene context; keep primary tab body rendering in this component unless a broader route extraction slice replaces it.

## Shell Components

`PlotTopShell.tsx` owns the non-expanded top shell presentation. `PlotBottomNav.tsx` owns the bottom navigation and UPRISE wheel overlay markup. Keep route-owned state, selected-scene context, and mode/tier transitions in `apps/web/src/app/plot/page.tsx`; pass only the display state and callbacks required by these shell components.

## Deferred Panels

`StatisticsPanel.tsx` and `PlotPromotionsPanel.tsx` are retained implementation seams, not active MVP Plot panels.

- Do not import either panel into `apps/web/src/app/plot/page.tsx`.
- Do not reintroduce `Statistics` or `Promotions` as current Plot tabs.
- Current Archive uses read-only descriptive modules, not the interactive `StatisticsPanel` explorer.
- Promotions may remain as explicit/deferred runtime seams for future scoped work, but they are not a current Plot tab.

If a future spec reactivates either surface, update `docs/specs/communities/plot-and-scene-plot.md`, the relevant lane brief, and the Plot tab contract tests in the same slice.
