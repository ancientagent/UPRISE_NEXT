# 2026-03-23 — Discover Scope Normalization Fix

## Summary
Fixed the Discover travel-state bug where stale geography input persisted across scope changes.

## What Changed
- Added `apps/web/src/lib/discovery/query-state.ts` to normalize the default travel query per tier.
- Updated `apps/web/src/app/discover/page.tsx` so tier changes reset the location query to the correct scope-specific default:
  - `city` -> current city context
  - `state` -> current state context
  - `national` -> empty geography input
- Added regression coverage in `apps/web/__tests__/discovery-query-state.test.ts`.

## Why
Live harness inspection reported that hidden search state persisted when moving across `city`, `state`, and `national`, leaving stale values active outside the current Discover scope.

## Validation
- `pnpm --filter web test -- discovery-query-state.test.ts discovery-client.test.ts artist-band-client.test.ts`
- `pnpm --filter web typecheck`
