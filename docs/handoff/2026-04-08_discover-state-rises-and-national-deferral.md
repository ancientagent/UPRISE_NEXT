# Discover State Rises And National Deferral

Date: 2026-04-08
Branch: feat/ux-founder-locks-and-harness

## Summary
- Locked Discover MVP to `city` + `state` scope on the current surface.
- Deferred `national` Discover scope until population justifies it.
- Implemented `Recent Rises` from actual city-to-state broadcast promotions instead of leaving the rail empty.

## Doctrine updates
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
  - Discover currently operates at `city` and `state` scope only for MVP.
  - `national` Discover scope is deferred.
  - `Recent Rises` at `state` scope means the most recent singles pulled from city-origin communities into the state player.
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
  - `Recent Rises` now points to `highestScopeReached = state` and `lastRiseAt = enteredPoolAt` for state-player promotion.

## Runtime implementation
- `apps/api/src/communities/communities.service.ts`
  - looks up the active state-tier scene for the current music community/state
  - reads recent `rotation_entries` ordered by `enteredPoolAt desc`
  - matches those tracks back to scoped single signals by origin community + title/artist metadata
  - returns `recentRises` with:
    - `highestScopeReached = state`
    - `lastRiseAt`
    - origin community labels
- `apps/web/src/app/discover/page.tsx`
  - clamps initial Discover scope from `national` to `state`
  - renders only `city` + `state` Discover tier controls for MVP
  - shows state-rise empty-state copy and origin community labels on surfaced singles

## Verification target
- targeted API tests
- targeted web Discover tests
- repo typecheck
- docs lint

## Notes
- This does not remove `national` from the broader platform model.
- It only narrows the current MVP Discover surface so the product and runtime stay aligned.
