# 2026-03-23 — Discover Artist Destination Slice

## Summary
Completed the native artist-destination handoff needed after the Discover contract/surface slice.

## What Changed
- Added artist-band profile and action contracts under `apps/api/src/artist-bands/`:
  - `GET /artist-bands/:id/profile`
  - `POST /artist-bands/:id/add`
  - `POST /artist-bands/:id/blast`
  - `POST /artist-bands/:id/support`
- Added shared artist-band profile types in `packages/types/src/artist-band.ts`.
- Added a typed web client in `apps/web/src/lib/artist-bands/client.ts`.
- Added the new web route `apps/web/src/app/artist-bands/[id]/page.tsx`.
- Wired Discover artist rows, song rows with resolved artist-band ids, and Top Artists cards to the new artist route.

## Founder-Lock Alignment
This slice implements the currently locked artist-page minimums from:
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`

Implemented behavior:
- artist-link entry goes to a recognizable profile page without autoplay
- single-link entry goes to the artist page with the selected single auto-streaming from the page
- core page actions are exposed: `Follow`, `Add`, `Blast`, `Support`

## Constraints / Known Gaps
- The current web app still treats artist-page reads as signed-in surfaces, consistent with the rest of the existing web routes.
- Generic Discover signal cards (`Recommendations` / `Trending`) still rely on available signal metadata; this slice only wired the artist/song/top-artist destinations that already resolve cleanly.
- Event rows on the artist page are listed but not yet linked to a dedicated event page route.
- `Add` on the artist page records the artist-band entity signal action but does not introduce a new collection shelf model in this slice.

## Validation
- `pnpm --filter @uprise/types build`
- `pnpm --filter api test -- artist-bands.service.test.ts artist-bands.controller.test.ts`
- `pnpm --filter web test -- artist-band-client.test.ts discovery-client.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
