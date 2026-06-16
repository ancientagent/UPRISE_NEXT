# Community Identity Follow-Up Alignment (2026-03-23)

## Purpose
Close the remaining repo mismatches after elevating the community identity rule into top-level agent guidance.

## Implemented
- `apps/web/src/app/plot/page.tsx`
  - fixed the profile-strip Scene Context label so it no longer falls back to `musicCommunity` alone
  - fallback now uses the full Home Scene identity tuple (`city, state • music community`) or an unset state
- `docs/specs/communities/discovery-scene-switching.md`
  - removed stale wording that implied Discover exposes a user-selected music-community filter
  - aligned Discover travel to inherited current-community context
- `docs/specs/communities/scene-map-and-metrics.md`
  - clarified that parent context is anchored to the active `city + state + music community` identity and inherited when already known
- `docs/specs/communities/plot-and-scene-plot.md`
  - clarified that Plot/Statistics tier toggles preserve full community identity context, not a standalone genre label

## Why
The full community identity model already existed in onboarding and data contracts, but several surface/spec texts still described community context too loosely. Those loose descriptions created room for genre-only or re-selection interpretations.

## Verification
- `pnpm --filter web test -- discovery-query-state.test.ts`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
