# Artist Profile Signal Handoff Dependency Fix

Date: 2026-06-16
Branch: fix/artist-profile-signal-handoff-deps
Status: active carry-forward

## Summary
Fixed a small artist-profile handoff bug in the direct-listen path:

- `/artist-bands/[id]?signalId=...` already used `selectedSignalId` to prioritize the selected song row.
- The `demoTracks` memo did not include `selectedSignalId` in its dependency list.
- If the same artist profile stayed mounted while the signal query changed, the selected song ordering could remain stale.
- The memo now depends on `[profile, selectedSignalId, selectedTrackId]` so song-driven feed/discovery handoffs keep the intended selected row current.

## Files Touched
- `apps/web/src/app/artist-bands/[id]/page.tsx`
- `apps/web/__tests__/community-artist-page-lock.test.ts`
- `docs/CHANGELOG.md`

## Verification
- `pnpm --filter web test -- community-artist-page-lock.test.ts`

## Agent Notes
This does not change Artist Profile scope or add new actions. It preserves the existing rule that feed/discovery song squares hand into Artist Profile listening through `trackId` or `signalId`, with collection/recommendation happening only inside the artist-profile listening context.
