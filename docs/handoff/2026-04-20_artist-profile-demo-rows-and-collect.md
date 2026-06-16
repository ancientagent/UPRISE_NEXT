# 2026-04-20 — Artist Profile Listening Rows And Collect

## Summary
Implemented the first artist-profile listening basics so the page now behaves like a direct-listen surface instead of a simple release list.

## What changed
- `apps/api/src/artist-bands/artist-bands.service.ts`
  - profile track summaries now include an optional `signalId` when a matching `single` signal exists for the artist/profile context
- `packages/types/src/artist-band.ts`
  - added optional `signalId` to artist-band track summaries
- `apps/web/src/lib/signals/client.ts`
  - added a focused web helper for `POST /signals/:id/collect`
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - replaced the old `Play Single` list behavior with listening rows
  - artist page now shows up to `3` songs in the listening area
  - each row has:
    - `Play` / `Pause`
    - a timeline slider
    - time elapsed / duration
    - `Collect` when a signal id is available
  - the page keeps its existing source-tool access and supporting sections (`Identity`, `Lineup`, `Upcoming and recent`)
- `apps/api/test/artist-bands.service.test.ts`
  - added coverage for returning `signalId` in profile tracks
- `apps/web/__tests__/community-artist-page-lock.test.ts`
  - tightened the artist-page lock around the listening area, `Collect`, and the row timeline

## Result
The artist profile is now a real direct-listen surface with profile-local song rows and collection entry from the profile page.

## Remaining gaps
- The current runtime still shows only however many released tracks actually exist; the lock says `3` songs in the listening area, but fixture/content availability still determines what appears.
- The page does not yet route feed-insert clicks into this listening mode automatically; that handoff remains a follow-on slice.
- `Collect` only appears when a matching `single` signal can be resolved for the track.

## Verification
- `pnpm --filter api test -- artist-bands.service`
- `pnpm --filter web test -- community-artist-page-lock route-ux-consistency-lock`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `git diff --check`
