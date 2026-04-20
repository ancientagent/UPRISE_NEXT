# 2026-04-20 — Artist Profile Demo Rows And Collect

## Summary
Implemented the first artist-profile basics so the page now behaves like a demo-listen surface instead of a simple release list.

## What changed
- `apps/api/src/artist-bands/artist-bands.service.ts`
  - profile track summaries now include an optional `signalId` when a matching `single` signal exists for the artist/profile context
- `packages/types/src/artist-band.ts`
  - added optional `signalId` to artist-band track summaries
- `apps/web/src/lib/signals/client.ts`
  - added a focused web helper for `POST /signals/:id/collect`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - replaced the old `Play Single` list behavior with demo rows
  - artist page now shows up to `3` demo songs
  - each row has:
    - `Play Demo` / `Pause Demo`
    - a timeline slider
    - time elapsed / duration
    - `Collect` when a signal id is available
  - the page keeps its existing source-tool access and supporting sections (`Identity`, `Lineup`, `Upcoming and recent`)
- `apps/api/test/artist-bands.service.test.ts`
  - added coverage for returning `signalId` in profile tracks
- `apps/web/__tests__/community-artist-page-lock.test.ts`
  - tightened the artist-page lock around `Demo Songs`, `Play Demo`, `Collect`, and the row timeline

## Result
The artist profile is now a real demo-listen surface with profile-local song rows and collection entry from the profile page.

## Remaining gaps
- The current runtime still shows only however many released tracks actually exist; the lock says `3` demo songs, but fixture/content availability still determines what appears.
- The page does not yet route feed-insert clicks into this demo mode automatically; that handoff remains a follow-on slice.
- `Collect` only appears when a matching `single` signal can be resolved for the track.

## Verification
- `pnpm --filter api test -- artist-bands.service`
- `pnpm --filter web test -- community-artist-page-lock route-ux-consistency-lock`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `git diff --check`
