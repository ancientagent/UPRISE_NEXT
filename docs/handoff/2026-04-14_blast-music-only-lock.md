# 2026-04-14 — Blast Music-Only Lock

## Summary
Reconciled the `Blast` boundary so it remains a listener action on music-distribution signals only. Artist pages no longer expose a source-level `Blast` action, and current founder/spec locks now explicitly confine blastability to `single` and `Uprise`.

## What Changed
- Removed `POST /artist-bands/:id/blast` from `apps/api/src/artist-bands/artist-bands.controller.ts`.
- Removed `blastArtistBand()` from `apps/api/src/artist-bands/artist-bands.service.ts`.
- Narrowed artist-profile action counts to `add` and `support` in:
  - `apps/api/src/artist-bands/artist-bands.service.ts`
  - `packages/types/src/artist-band.ts`
- Removed the artist-page `Blast` button and client helper from:
  - `apps/web/src/app/artist-bands/[id]/page.tsx`
  - `apps/web/src/lib/artist-bands/client.ts`
- Updated regression coverage in:
  - `apps/api/test/artist-bands.service.test.ts`
  - `apps/api/test/artist-bands.controller.test.ts`
  - `apps/web/__tests__/artist-band-client.test.ts`
  - `apps/web/__tests__/community-artist-page-lock.test.ts`
- Updated active docs/specs so `Blast` is now explicitly described as a music-distribution action for `single` and `Uprise`, not a source-page, event-page, or flyer-surface action.

## Founder-Lock Direction Captured
- `Blast` is for music spreading publicly.
- Current blastable classes remain:
  - `single`
  - `Uprise`
- Artist pages are source pages, so they expose:
  - `Follow`
  - `Add`
  - `Support`
- Event pages and flyer artifacts remain outside current blast parity.

## Verification
- `pnpm --filter @uprise/types build`
- `pnpm --filter api test -- artist-bands.service artist-bands.controller`
- `pnpm --filter web test -- artist-band-client community-artist-page-lock`
- `pnpm run verify`
- `git diff --check`
