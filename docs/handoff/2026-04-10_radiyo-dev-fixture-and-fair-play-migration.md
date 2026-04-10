# 2026-04-10 — RaDIYo Dev Fixture And Fair-Play Migration

## Summary
- Added the missing Prisma migration for the Fair Play runtime tables that the new broadcast playback path expects.
- Added a local-only dev fixture script that generates a tiny WAV under `apps/web/public/dev-audio/` and seeds city-tier rotation entries against a real community.
- Verified in the live Chrome DevTools browser that both `/discover` and `/plot` now render a working `<audio>` player for the city-tier Austin Punk scene.

## Why This Was Needed
- The new RaDIYo playback slice was querying Prisma models that existed in `apps/api/prisma/schema.prisma` but had never been added to the migration chain.
- The browser failure was therefore environmental-but-real: `/broadcast/rotation?tier=city` returned `500` because `public.rotation_entries` did not exist.
- Even after the schema was fixed, the local dataset still had no rotation entries and no valid playable `fileUrl`, so the browser could only show empty state.

## What Landed
- Migration: `apps/api/prisma/migrations/20260410021500_add_fair_play_runtime_tables/migration.sql`
  - creates `RotationPool`
  - creates `rotation_entries`
  - creates `track_votes`
  - creates `fair_play_config`
- Dev helper: `apps/api/scripts/seed-radiyo-dev-fixture.mjs`
  - generates `apps/web/public/dev-audio/qa-broadcast-tone.wav`
  - seeds one `NEW_RELEASES` and one `MAIN_ROTATION` entry for the preferred `Austin, TX • Punk` city scene (or the first city scene available)
- Ignore rule: local generated dev audio stays out of git via `.gitignore`

## Browser QA
- `/discover`
  - `GET /broadcast/rotation?tier=city` now returns `200`
  - the player renders `QA Broadcast Tone (Current)` and a working HTML audio control
  - the WAV asset is requested from `GET /dev-audio/qa-broadcast-tone.wav` with `206`
- `/plot`
  - the player renders `QA Broadcast Tone (New)` with a working HTML audio control
- `state` tier still returns `404` for `TX • Punk` because no active state scene exists yet; this is now a data gap, not a missing-table failure

## Local Command
Run from `apps/api` when you need a playable local fixture again:

```bash
pnpm run seed:radiyo-fixture
```
