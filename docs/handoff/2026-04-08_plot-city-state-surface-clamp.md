# 2026-04-08 Plot City/State Surface Clamp

## Summary
- Propagated the current MVP `city/state` tier decision from Discover into the live Plot player and Statistics surface.
- Kept the broader platform model and API contract aware of `national`, but removed `national` from the active Plot MVP UI.

## Code Changes
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
  - narrowed visible player tier buttons to `state` and `city`
  - updated helper copy to stop advertising `national`
- `apps/web/src/app/plot/page.tsx`
  - added a defensive clamp so stale `national` tier inputs resolve to `state` on the active Plot route
- `apps/web/src/components/plot/StatisticsPanel.tsx`
  - removed `national` MVP copy from empty-state and scope descriptions
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - updated regression locks to assert the new MVP player/route behavior

## Spec Alignment
- `docs/specs/communities/plot-and-scene-plot.md`
  - now states current MVP Plot exposes `city` and `state` only
  - keeps `national` as a broader platform model deferred from the live MVP surface
- `docs/specs/communities/scene-map-and-metrics.md`
  - now states current MVP Plot Statistics exposes `city` and `state` only
  - retains `national` for later broader-scope analytics/modeling, not the current Plot UI

## Verification
- `pnpm --filter web test -- plot-ux-regression-lock plot-statistics-request`
- `pnpm run typecheck`

## Follow-Up
- If `national` is reintroduced later, do it intentionally as a new surface-expansion slice rather than by reusing old Plot assumptions.
