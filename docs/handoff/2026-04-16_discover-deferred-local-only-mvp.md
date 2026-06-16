# 2026-04-16 — Discover Deferred For Local-Only MVP

## What Changed
- Reduced the live `/discover` route to a `Coming Soon` placeholder in `apps/web/src/app/discover/page.tsx`.
- Disabled the active `Discover` entrypoints in `apps/web/src/app/plot/page.tsx` and `apps/web/src/app/page.tsx`.
- Removed remaining `Back to Discover` language from `apps/web/src/app/artist-bands/[id]/page.tsx` so artist surfaces return to `Plot` instead of a deferred route.
- Rewrote `apps/web/__tests__/discover-page-lock.test.ts` and updated `apps/web/__tests__/plot-ux-regression-lock.test.ts` to lock the deferred-route behavior.
- Reconciled active Discover/Plot/feed docs so they now state:
  - MVP is local-community-only while communities settle
  - borders open later
  - useful discovery/statistics material appears only as intermittent inserted feed moments
  - the same insertion pattern can later be reused for paid placements/promos

## Why
- Founder direction narrowed MVP to people listening to their own community first.
- Cross-community travel and a live Discover destination are premature before communities stabilize.
- Useful discovery/statistics material still has MVP value, but it belongs as occasional feed inserts rather than fixed furniture.

## Files Touched
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/__tests__/discover-page-lock.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`

## Follow-On
- If feed insertions are implemented next, keep them:
  - scene-scoped
  - deterministic
  - intermittent rather than fixed
  - structurally reusable for later paid placements
