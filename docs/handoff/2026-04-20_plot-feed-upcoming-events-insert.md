# 2026-04-20 — Plot Feed Upcoming Events Insert

## Purpose
Complete the last obvious first-pass feed insert by surfacing upcoming events as a read-only carousel inside Plot feed.

## What Changed
- Plot feed now loads a small upcoming-events set from the existing scene events endpoint.
- The insert renders read-only event squares with:
  - title
  - date
  - location
  - publisher context
- The insert uses horizontal browsing with arrow controls.
- No inline calendar/add/collect/blast actions were introduced.

## Boundary Preserved
- The insert remains informational.
- The canonical event surface is still the Events tab.
- This slice does not invent a new event-detail route or a new event action strip.

## Files
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
