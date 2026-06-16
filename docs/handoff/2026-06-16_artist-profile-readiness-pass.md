# Artist Profile Readiness Pass

Date: 2026-06-16
Branch: `feat/artist-profile-readiness-pass`
Issue: `UPR-7`
Status: readiness lock / regression coverage

## Summary

Audited the listener-facing Artist Profile route against current active locks. The route already satisfies the main MVP requirements, so this slice locks the behavior with tests/docs instead of widening the surface.

## Implemented Now

- Artist Profile is a public source page and direct-listen surface outside `RADIYO`.
- Plain artist-page entry does not auto-play by default.
- Feed/discovery handoff can select a track by `trackId` or `signalId`.
- The direct-listen song area is capped to `3` playable rows.
- If a selected handoff track is outside the first three, it is shown first and the row count remains capped at `3`.
- Song rows include local `Play` / `Pause`, timeline, `Collect`, and gated `Recommend` controls.
- `Recommend` stays disabled until the listener has genuinely collected/holds the song.
- Page-level source actions include `Follow`, `Share Artist Page`, and official outbound links where configured.
- Events are visible in the `Upcoming and recent` section.
- Source operators can reach source tools, but source-management actions are not listener-profile actions.

## Explicitly Not Present

- No engagement wheel on Artist Profile.
- No `Blast` on Artist Profile.
- No source-level `Collect`.
- No source-level `Support` button.
- No rankings, comparative quality scores, or editorial badges.

## Deferred / Retained Future Context

- Full artist catalogue/library/history expansion is not a current MVP listener-facing requirement.
- Later profile-data candidates remain retained context, but they do not authorize rendering every artist track or a full catalogue surface now.
- Current MVP exposes only the capped direct-listen rows plus artist info, official links, members, and events.

## Regression Coverage

Updated `apps/web/__tests__/community-artist-page-lock.test.ts` to lock:

- `Follow` and `Share Artist Page`
- no engagement wheel / no Blast
- `profile.tracks.slice(0, 3)` cap
- selected handoff track replacement preserving a max of `3` rows
- `demoTracks.map`, not full `profile.tracks.map`
- `Collect` / gated `Recommend`
- official links and events
- no leaderboard/ranking/editorial/quality-score copy

## Verification

Run:

```bash
pnpm --filter web test -- community-artist-page-lock.test.ts
pnpm --filter web typecheck
pnpm run docs:lint
```
