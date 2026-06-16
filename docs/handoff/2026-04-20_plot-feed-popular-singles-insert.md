# 2026-04-20 — Plot Feed Popular Singles Insert

## Purpose
Implement the first real intermittent discovery insert inside the Plot feed without reopening live Discover.

## What Changed
- Plot feed now reads the existing community-discover highlights payload and renders a `Popular Singles` insert inside the S.E.E.D feed.
- The insert is read-only and uses horizontal song squares with arrow controls.
- The insert currently surfaces:
  - `Most Added`
  - `Recent Rises` when available
- Clicking an insert square now hands the listener into the artist page using `signalId`, so the artist page can resolve the intended song and start listening there.

## Runtime Notes
- This slice reuses the existing highlights endpoint instead of inventing a new feed contract.
- `DiscoverSignalResult` now carries optional `artistBandId` so feed inserts can route to the correct artist page.
- The artist page now understands `signalId` query params in addition to `trackId` query params.

## Files
- `packages/types/src/discovery.ts`
- `apps/api/src/communities/communities.service.ts`
- `apps/api/test/communities.discovery.service.test.ts`
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/community-artist-page-lock.test.ts`

## Boundary Preserved
- No inline `Collect`, `Blast`, or `Follow` actions were added to feed squares.
- `RADIYO` remains the broadcast surface.
- artist page remains the listening / collect surface.
- `Blast` remains out of this slice.
