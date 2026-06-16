# 2026-04-13 — Track Source Attribution Feed

## Objective
Carry explicit `Release Deck` track ownership through the shared community feed so source-owned track releases display as source-owned instead of always reading as uploader-user actions.

## What Changed
- `apps/api/src/communities/communities.service.ts`
  - community feed track reads now include optional `artistBand` details for `track_release` items
- `apps/api/test/communities.feed.service.test.ts`
  - locked `artistBand` metadata on `track_release` feed items

## Why
- `Release Deck` already persists explicit `artistBandId` ownership on new tracks.
- The feed UI was already capable of preferring source attribution from metadata.
- Without this API pass, the newest source-owned track releases still looked like personal uploader actions.

## Verification
- `pnpm --filter api test -- communities.feed.service`
- `pnpm --filter api typecheck`

## Browser QA
- Reloaded `/plot`
- verified the newest `Track Release` row now renders:
  - `Track Release by Youngblood QA Source`
- verified older creator-only track rows still render normally
- verified no console warnings/errors

## Outcome
- The shared community feed now respects explicit source ownership for new Release Deck tracks.
- Older creator-inferred track rows remain compatible until more read surfaces are migrated.
