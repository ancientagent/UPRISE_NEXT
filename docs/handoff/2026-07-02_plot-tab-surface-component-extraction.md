# Plot Tab Surface Component Extraction

Date: 2026-07-02
Branch: `refactor/plot-tab-surface-component`
PR: #190 (draft)
Base: `main` @ `0cd181e` (`Refactor: extract Plot bottom nav (#189)`)
Owner: Codex local

## Purpose

Continue small `/plot` structural cleanup from clean `main` by extracting the non-expanded tab bar and active surface frame out of `apps/web/src/app/plot/page.tsx` into a focused component.

## Scope

Changed:

- Added `apps/web/src/components/plot/PlotTabSurface.tsx`.
- Replaced the inline tab-navigation and active-surface frame in `apps/web/src/app/plot/page.tsx` with `PlotTabSurface`.
- Kept route-owned `activeTab`, tab list, selected tier/community, and `renderPrimaryPlotTabBody()` in the route.
- Updated `apps/web/__tests__/plot-tab-contracts.test.ts` so the tab contract follows the new component boundary.
- Updated `apps/web/src/components/plot/README.md` to document `PlotTabSurface` ownership.
- Refreshed `docs/operations/ACTIVE_PM.md` and `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for this branch.

Not changed:

- Plot tab names or order.
- Feed, Events, or Archive body behavior.
- Archive descriptive wording or selected-tier context.
- Discover transport or Away Scene behavior.
- Provider, database, schema, migration, seed, or art state.
- Product doctrine.

## Contract Preservation

- Active Plot tabs remain exactly `Feed`, `Events`, and `Archive`.
- The route still owns tab state and primary tab body data flow.
- `PlotTabSurface` owns only tab button presentation and the active-surface frame.
- `PlotPrimaryTabBody` remains the owner of the active Feed/Events/Archive body switch.

## Validation

Run before merge:

```bash
pnpm run workspace:audit
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts plot-profile-player-state-contract.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

## Next Signal

If this merges cleanly, continue only with another clearly bounded Plot structural cleanup that already has behavior locked by tests. Do not add Discover transport into Plot.
