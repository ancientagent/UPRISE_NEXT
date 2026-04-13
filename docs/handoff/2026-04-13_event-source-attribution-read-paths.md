# 2026-04-13 — Event Source Attribution Read Paths

## Objective
Carry the new explicit `Print Shop` event ownership model through the read side so source-owned events display as source-owned in Plot/community surfaces instead of defaulting back to creator-user attribution.

## What Changed
- `apps/api/src/communities/communities.service.ts`
  - community feed event reads now include optional `artistBand` details for `event_created` items
  - community events-panel reads now include optional `artistBand` details on each event row
- `apps/web/src/lib/communities/client.ts`
  - extended `CommunityEventItem` with optional `artistBand`
- `apps/web/src/components/plot/PlotEventsPanel.tsx`
  - event rows now prefer source attribution when `artistBand` is present
  - source-owned events now link to the source profile from the `Published by` line
- `apps/web/src/components/plot/SeedFeedPanel.tsx`
  - event-created feed items now prefer source attribution from metadata when present
  - source-owned feed rows link to the source profile instead of always linking to the creator user
- `apps/api/test/communities.feed.service.test.ts`
  - locked `artistBand` metadata on `event_created` feed items
- `apps/api/test/communities.events.service.test.ts`
  - locked `artistBand` payload on community event rows
- `apps/web/__tests__/plot-tab-contracts.test.ts`
  - locked the new Plot Events source-attribution helper/link behavior

## Why
- The write side already persists explicit event ownership through `artistBandId`.
- Without this read-side pass, source-owned events still looked like personal creator actions in Plot.
- That broke continuity with the Source Dashboard system and undercut the point of explicit ownership.

## Verification
- `pnpm --filter api test -- communities.feed.service communities.events.service`
- `pnpm --filter web test -- plot-tab-contracts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Browser QA
- Opened `/plot`
- verified `Feed` shows the newly created event as:
  - `Event Created by Youngblood QA Source`
- switched to `Events`
- verified `Youngblood QA Source Event Link` shows:
  - `Published by Youngblood QA Source`
  - source-profile link under the `Published by` line
- verified older creator-only events still render normally
- verified no console warnings/errors

## Outcome
- Source-owned events now read as source-owned across the main Plot/community event surfaces.
- Older creator-inferred event rows remain compatible until more surfaces are migrated.
