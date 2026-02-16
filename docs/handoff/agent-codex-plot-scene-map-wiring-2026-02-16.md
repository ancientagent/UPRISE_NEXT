# Plot SceneMap Wiring + Tier Guard (2026-02-16)

## Scope
- Wire `SceneMap` into `StatisticsPanel` as the single map renderer.
- Remove duplicated inline map/marker rendering logic from `StatisticsPanel`.
- Add a tier behavior guard test for nearby-lookup scope.

## Changes
- Updated `apps/web/src/components/plot/StatisticsPanel.tsx`:
  - Imported and used `SceneMap` for marker rendering.
  - Reused shared helper in nearby-fetch effect to ensure only `city` triggers nearby lookup.
- Added `apps/web/src/components/plot/tier-guard.ts`:
  - `shouldFetchNearbyForTier(tier)` canon guard utility.
- Added `apps/web/__tests__/plot-tier-guard.test.ts`:
  - Verifies `city => true`, `state/national => false`.

## Canon Alignment
- Tier toggles are structural scope changes (`city/state/national`), not concentric radius rings.
- Radius/nearby lookup is constrained to city-tier local context.

## Validation
- `pnpm --filter web test -- --runInBand plot-tier-guard.test.ts`
- `pnpm --filter web build`
- `pnpm run verify`

## Deferred
- Full state/national macro data layer wiring remains deferred to dedicated scene-map/statistics implementation slice.
