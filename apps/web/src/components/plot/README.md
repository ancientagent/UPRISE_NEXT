# Plot Components

Current active `/plot` surfaces are `Feed`, `Events`, and `Archive`.

## Deferred Panels

`StatisticsPanel.tsx` and `PlotPromotionsPanel.tsx` are retained implementation seams, not active MVP Plot panels.

- Do not import either panel into `apps/web/src/app/plot/page.tsx`.
- Do not reintroduce `Statistics` or `Promotions` as current Plot tabs.
- Current Archive uses read-only descriptive modules, not the interactive `StatisticsPanel` explorer.
- Promotions may remain as explicit/deferred runtime seams for future scoped work, but they are not a current Plot tab.

If a future spec reactivates either surface, update `docs/specs/communities/plot-and-scene-plot.md`, the relevant lane brief, and the Plot tab contract tests in the same slice.
