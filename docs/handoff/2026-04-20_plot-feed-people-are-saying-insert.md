# 2026-04-20 — Plot Feed People Are Saying Insert

## Purpose
Add the recommendation-driven feed insert that complements the stats-driven `Popular Singles` insert.

## What Changed
- Plot feed now renders a `People Are Saying` insert from the existing community-discover highlights payload.
- The insert is recommendation-driven rather than stats-driven.
- It uses read-only horizontal squares and arrow controls.
- Each square shows the recommended song, artist, and the listener who recommended it.
- Clicking a square hands the user into the artist page through the same `signalId` artist-listening path used by the other feed insert.

## Boundary Preserved
- No inline `Collect`, `Blast`, or `Follow` actions were added to recommendation squares.
- The insert remains a browse/read surface.
- Artist page remains the listening / collect surface.

## Files
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
