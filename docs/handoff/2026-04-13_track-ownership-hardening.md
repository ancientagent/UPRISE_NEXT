# 2026-04-13 — Track Ownership Hardening

## Goal
Move new `Release Deck` writes beyond source-recognition-only behavior by adding an explicit optional source/entity link for tracks while keeping older inferred tracks working.

## What Changed
- `apps/api/prisma/schema.prisma`
  - added optional `artistBandId` to `Track`
  - added `Track -> ArtistBand` relation and index
- `apps/api/prisma/migrations/20260413234500_add_track_artist_band_link/migration.sql`
  - additive migration for the new optional link
- `packages/types/src/track.ts`
  - added optional/nullable `artistBandId` to `Track`
  - added optional `artistBandId` to `CreateTrackInput`
- `apps/api/src/tracks/dto/create-track.dto.ts`
  - accepts optional `artistBandId`
- `apps/api/src/tracks/tracks.service.ts`
  - validates that the signed-in user manages the submitted Artist/Band before accepting `artistBandId`
  - normalizes `artist` to the managed source name when explicit source linkage is used
  - rejects mismatched Home Scene community writes for linked sources
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - now submits `artistBandId: activeSource.id`
  - updated Release Deck copy to reflect direct source linkage for new releases
- `apps/api/src/artist-bands/artist-bands.service.ts`
  - artist page now resolves tracks by explicit `artistBandId` first, with legacy fallback still preserved
- `apps/api/src/communities/communities.service.ts`
  - discover/song resolution now uses explicit `artistBandId` first when present
- tests:
  - `apps/api/test/tracks.engagement.service.test.ts`
  - `apps/web/__tests__/release-deck-shell-lock.test.ts`
  - `apps/web/__tests__/route-ux-consistency-lock.test.ts`

## Why
- The previous system worked, but it inferred track ownership from:
  - active source context
  - artist name
  - uploader membership
  - community alignment
- That was acceptable for an MVP slice, but brittle as the source-side system became more coherent.
- This change makes new source-side releases explicit without breaking older records that still rely on inference.

## Verification
- `pnpm --filter api prisma:generate`
- `pnpm --filter api test -- tracks.engagement.service`
- `pnpm --filter api typecheck`
- `pnpm --filter web test -- release-deck-shell-lock route-ux-consistency-lock`
- `pnpm --filter web typecheck`
- `pnpm --filter api exec prisma migrate deploy`
- Chrome DevTools MCP:
  - opened `/source-dashboard/release-deck`
  - created `Youngblood QA Explicit Source Link`
  - verified success message and slot rendering
- Prisma direct check:
  - newest track row has `artistBandId = 2d037ba2-9bd9-446f-9321-09bea9fab593`
  - older Release Deck track still has `artistBandId = null`

## Outcome
- New Release Deck tracks now have explicit source ownership.
- Older inferred tracks still remain readable until broader backfill/migration work is warranted.
- Source-shell continuity work is now backed by a stronger runtime ownership model instead of only operator-context UI.
