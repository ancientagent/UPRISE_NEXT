# 2026-04-10 — Player Tier Context Continuity

## Summary
- Fixed a cross-route player-context bug where Discover could widen the listening scope to `state`, but `/plot` would immediately reset the player back to `city`.
- The active MVP player tier is now shared state instead of route-local state, so the persistent player actually survives the Discover -> Plot handoff.

## Problem
- Discover stored the current playback tier in route-local React state only.
- Plot also initialized its own tier locally and hard-defaulted to `city`.
- Result:
  - user could be actively listening at `state` in Discover
  - navigate back to Plot
  - Plot reopened on `city`, breaking persistent-player continuity

## What Changed
- Added shared persisted player-tier state to `apps/web/src/store/onboarding.ts`:
  - `playerTier: 'city' | 'state' | null`
  - `setPlayerTier`
- Added shared MVP tier-clamp helper in `apps/web/src/components/plot/tier-guard.ts`:
  - `getMvpPlayerTier(tunedTier)`
- Discover now:
  - derives its initial tier from shared player tier first, then tuned-scene fallback
  - persists explicit city/state tier changes into the shared store
- Plot now:
  - derives its initial tier from shared player tier first, then tuned-scene fallback
  - syncs its local player state from that shared value
  - persists explicit city/state tier changes back into the shared store

## Files Touched
- `apps/web/src/store/onboarding.ts`
- `apps/web/src/components/plot/tier-guard.ts`
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-tier-guard.test.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/discover-page-lock.test.ts`

## Verification
- `pnpm --filter web test -- plot-tier-guard plot-ux-regression-lock discover-page-lock`
- `pnpm --filter web typecheck`

## Live Browser QA
Chrome DevTools MCP against the existing UPRISE browser target:
- starting from `/discover`, the player was widened to `STATE`
- navigating back to `/plot` preserved `STATE`
- Plot rendered:
  - state tier pressed
  - state broadcast label (`TX Punk`)
  - state seeded rotation track (`QA Texas New 1`)
- this confirms the route handoff now preserves active player tier instead of resetting to city

## Why This Matters
- The roadmap and shell doctrine treat the player as a governing persistent system.
- Route-local tier state violated that rule.
- This slice closes that coherence gap without widening scope or inventing new player semantics.
