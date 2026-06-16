# 2026-04-13 — Artist Profile Source Ownership Cues

## Objective
Carry explicit source ownership through the artist/source profile contract so the page can visibly distinguish explicitly source-owned releases/events from older fallback-only rows.

## What Changed
- `packages/types/src/artist-band.ts`
  - added optional nullable `artistBandId` to track and event profile summary types
- `apps/api/src/artist-bands/artist-bands.service.ts`
  - artist profile track summaries now return `artistBandId`
  - artist profile event summaries now return `artistBandId`
- `apps/api/test/artist-bands.service.test.ts`
  - locked the returned `artistBandId` fields on profile track/event rows
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - explicit source-owned tracks now render a restrained `Source-owned release` chip
  - explicit source-owned events now render a restrained `Source-owned event` chip
- `apps/web/__tests__/community-artist-page-lock.test.ts`
  - locked the new profile cues on the page surface
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - documented that the profile surface may expose restrained ownership cues for explicit source-owned rows

## Why
- the previous slice fixed read precedence so explicit source ownership wins internally
- but the profile surface still flattened explicit source-owned releases/events into the same presentation as legacy fallback rows
- carrying `artistBandId` through the profile contract lets the page make that distinction without changing the route model or breaking older rows

## Verification
- `pnpm --filter @uprise/types build`
- `pnpm --filter api test -- artist-bands.service`
- `pnpm --filter web test -- community-artist-page-lock artist-band-client`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`
- `git diff --check`

## Outcome
- artist/source profile reads now expose explicit source ownership metadata end-to-end
- the artist page can signal when a release/event is directly attached to the current source account
- legacy rows without `artistBandId` remain compatible and stay visually unmarked
