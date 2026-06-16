# Archive Read-Only Contract

Date: 2026-06-16
Branch: `feat/archive-tab-readonly-contract`
Issue: `UPR-6`
Status: implementation slice

## Summary

Reconciled `/plot` Archive runtime with the current active tab contract:

- The current MVP tab remains `Archive`, not `Statistics`.
- Archive now renders read-only descriptive modules instead of the interactive `StatisticsPanel` explorer.
- `TopSongsPanel` remains archive-only.
- `Scene Activity Snapshot` now renders descriptive metric cards from the existing community statistics state.

## Runtime Change

Removed `StatisticsPanel` from `apps/web/src/app/plot/page.tsx` Archive render path.

The Archive body now contains:

1. `TopSongsPanel`
2. `Scene Activity Snapshot`
   - Members
   - Active Sects
   - Events This Week
   - Active Tracks
   - selected scene identity copy when available

## Boundaries

- No `Statistics` tab was added.
- No `Promotions` tab was added.
- No map, nearby-community selector, or tier explorer is exposed as the current MVP Archive body.
- No ranking, predictive analytics, leaderboards, or comparative artist scoring was introduced.
- `apps/web/src/components/plot/StatisticsPanel.tsx` remains in the repo as an unused/future/internal component, but `/plot` no longer imports or renders it.

## Verification

Updated `apps/web/__tests__/plot-ux-regression-lock.test.ts` so `/plot` rejects `StatisticsPanel` in the primary tab body and still requires Archive's read-only modules.

Targeted verification:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts
```

Result: `25` tests passed.
