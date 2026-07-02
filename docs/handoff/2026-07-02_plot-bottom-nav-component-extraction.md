# Plot Bottom Nav Component Extraction

Date: 2026-07-02
Branch: `refactor/plot-bottom-nav-component`
Base: `main` @ `0ab9ce2` (`Docs: refresh PM after Codex routing merge (#188)`)
Owner: Codex local

## Purpose

Continue small `/plot` structural cleanup from clean `main` by extracting the bottom navigation and UPRISE wheel overlay out of `apps/web/src/app/plot/page.tsx` into a focused component.

## Scope

Changed:

- Added `apps/web/src/components/plot/PlotBottomNav.tsx`.
- Replaced the inline `renderBottomNav` function in `apps/web/src/app/plot/page.tsx` with a `bottomNav` element that passes route-owned state and callbacks into `PlotBottomNav`.
- Updated `apps/web/__tests__/plot-ux-regression-lock.test.ts` so the regression lock follows the component boundary.
- Added `PlotBottomNav` to `apps/web/src/components/plot/README.md` as an active shell component.
- Refreshed `docs/operations/ACTIVE_PM.md` and `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for this branch.

Not changed:

- Bottom navigation behavior, labels, routes, or disabled Discover copy.
- UPRISE wheel action rules.
- Discover transport or Away Scene behavior.
- Provider, database, schema, migration, seed, or art state.
- Product doctrine.

## Contract Preservation

- The route still owns `isEngagementWheelOpen`, `playerMode`, wheel actions, and callbacks.
- `PlotBottomNav` owns only the bottom navigation and overlay markup.
- `Discover` remains disabled / local-community-only in this MVP shell.
- The center UPRISE wheel trigger remains on the `/plot` route.

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

If this merges cleanly, the next cleanup should stay small and target only another clearly named Plot region with existing behavior locks. Do not introduce Discover transport into Plot.
