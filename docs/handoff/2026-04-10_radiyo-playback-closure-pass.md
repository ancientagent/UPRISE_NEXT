# 2026-04-10 — RaDIYo Playback Closure Pass

## Summary
Closed the next immediate playback rough edges after the initial runtime wire-up.

## What changed
- Added minimal in-player queue progression for RaDIYo playback in `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`.
- The player now advances through the current rotation queue on native audio `ended` events instead of pinning the experience to the first track only.
- Added a shared web helper in `apps/web/src/lib/broadcast/runtime.ts` for normalizing broadcast runtime failures.
- Softened the missing-state-scene playback case in both `/plot` and `/discover`:
  - web now treats the missing state scene as an intentional empty-state condition
  - API now returns an empty success payload instead of a `404` for `GET /broadcast/rotation?tier=state` when the user has no active state scene yet
- Preserved explicit user-facing copy:
  - `No state scene is active for this community yet.`

## Files touched
- `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/src/app/discover/page.tsx`
- `apps/web/src/lib/broadcast/runtime.ts`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `apps/web/__tests__/broadcast-runtime.test.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/test/fair-play.rotation.test.ts`

## Verification
- `pnpm --filter web test -- broadcast-client broadcast-runtime plot-ux-regression-lock`
- `pnpm --filter web typecheck`
- `pnpm --filter api test -- fair-play.rotation`
- `pnpm --filter api typecheck`

## Live browser QA
Chrome DevTools MCP against the UPRISE browser target verified:
- `/plot` city-tier playback renders live native audio and plays the seeded QA tone
- `/plot` state-tier playback now shows intentional empty-state copy instead of a raw runtime error
- `/discover` state-tier playback now returns `200` instead of `404`
- `/discover` shows the same intentional state-tier empty-state copy
- browser console remains clean during the state-tier switch

## Remaining boundary
- Queue progression is minimal only: rotate to next queued track on `ended`
- no richer queue memory / history / explicit transport redesign was introduced
- state-tier still has no real rotation until an active state scene exists; the runtime now communicates that cleanly
