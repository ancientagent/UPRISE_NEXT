# 2026-04-20 — Plot Song Handoff Into Artist Listening

## Summary
Wired the first live Plot-side song handoff into artist-page listening so song rows in current Plot surfaces can open the artist page on the selected track instead of stopping at a dead list item.

## What changed
- `apps/api/src/communities/communities.service.ts`
  - statistics top-song payloads now include `artistBandId`
- `apps/api/test/communities.statistics.service.test.ts`
  - added coverage for `artistBandId` on top-song results
- `apps/web/src/lib/communities/client.ts`
  - updated the web-side statistics contract to include `artistBandId`
- `apps/web/src/components/plot/TopSongsPanel.tsx`
  - Top 40 rows now open `/artist-bands/[id]?trackId=...` when the source artist is known
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
  - `track_release` feed items now open `/artist-bands/[id]?trackId=...` when the release item carries artist-band metadata
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - tightened the static lock around both handoff paths

## Result
Current Plot song surfaces now hand listeners into the artist page on the chosen track. That lets the artist page handle the actual listening and collection context instead of leaving the song rows as dead discovery items.

## Remaining gaps
- This is the first live handoff path, not the final intermittent feed-carousel implementation.
- `signal_created` and other non-track feed items still keep their existing read behavior.
- The current handoff relies on route transition into the artist page rather than a dedicated shared-player pause orchestration layer.

## Verification
- `pnpm --filter api test -- communities.statistics.service`
- `pnpm --filter web test -- plot-ux-regression-lock`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`
