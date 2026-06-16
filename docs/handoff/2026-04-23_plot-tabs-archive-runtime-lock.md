# 2026-04-23 - Plot Tabs Archive Runtime Lock

## Purpose
Align the live `/plot` route with the founder-corrected MVP tab language: `Feed`, `Events`, and `Archive`.

## What Changed
- `/plot` now renders the primary tab set as `Feed`, `Events`, `Archive`.
- The old `Promotions` tab is no longer part of the current MVP tab row.
- The old `Statistics` tab condition is now the `Archive` condition.
- The existing statistics/archive panel implementation remains in use inside `Archive` for descriptive scene history and activity.
- The `/plot` regression lock now rejects reintroducing `Promotions` or `Statistics` as active current-MVP tabs.

## Boundaries Preserved
- No promotional boosting or ranking behavior was added.
- The statistics/archive content remains descriptive only.
- The Feed remains the default Plot tab.
- Events still owns the full event lane.

## Files
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
