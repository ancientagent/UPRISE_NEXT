# 2026-04-20 — Artist Profile Official Links

## Summary
Added the first real official-links section to the artist page so listeners can leave the profile for artist-controlled destinations like merch, music purchases, and direct support.

## What changed
- `apps/api/prisma/schema.prisma`
  - added source-level artist-band link fields:
    - `officialWebsiteUrl`
    - `merchUrl`
    - `musicUrl`
    - `donationUrl`
- `apps/api/prisma/migrations/20260420163000_add_artist_band_official_links/migration.sql`
  - added the new nullable columns to `artist_bands`
- `packages/types/src/artist-band.ts`
  - added the official-link fields to the artist-profile contract
- `apps/api/src/artist-bands/artist-bands.service.ts`
  - now returns the official-link fields on artist-profile reads
- `apps/api/test/artist-bands.service.test.ts`
  - added coverage for the new profile link fields
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - added an `Official Links` / `Go Deeper` section
  - renders `Official Site`, `Buy Music`, `Merch`, and `Donate` when configured
  - keeps the section empty-state honest when no links exist
- `apps/web/__tests__/community-artist-page-lock.test.ts`
  - tightened the page lock around the new official-links section
- `apps/api/scripts/seed-artist-fixture-roster.mjs`
  - fixture artist bands now get deterministic example links so the section appears in local QA after reseeding

## Result
The artist page now supports the newly locked role as an official outbound hub instead of being limited to on-platform listening and identity only.

## Remaining gaps
- There is still no editor/source-dashboard UI for creators to manage these links directly.
- The exact ordering/grouping of official links remains a later refinement, per the current founder lock.
- Social-platform links are still intentionally out of scope for this first pass.

## Verification
- `pnpm --filter api exec prisma generate`
- `pnpm --filter api test -- artist-bands.service`
- `pnpm --filter web test -- community-artist-page-lock`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`
