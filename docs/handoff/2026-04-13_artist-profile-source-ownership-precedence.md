# 2026-04-13 — Artist Profile Source Ownership Precedence

## Objective
Tighten artist/source profile reads so explicit stored source ownership wins on tracks and events without breaking older creator-inferred rows.

## What Changed
- `apps/api/src/artist-bands/artist-bands.service.ts`
  - track profile reads still include explicit `artistBandId` matches first
  - legacy artist-name and uploader fallback now apply only when `artistBandId` is `null`
  - event profile reads still include explicit `artistBandId` matches first
  - legacy creator fallback now applies only when `artistBandId` is `null`
- `apps/api/test/artist-bands.service.test.ts`
  - added regression coverage that locks explicit source ownership ahead of legacy fallback branches
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
  - documented the runtime rule that source profile reads prefer explicit ownership while preserving null-only fallback for older rows

## Why
- new `Release Deck` tracks and `Print Shop` events now persist explicit `artistBandId`
- community feed and event surfaces already prefer explicit source attribution when that field exists
- artist/source profile reads were still broad enough to reattach explicitly owned rows through uploader/name/creator inference
- that risked showing another source's explicitly linked content on the wrong profile whenever members overlapped

## Verification
- `pnpm --filter api test -- artist-bands.service`
- `pnpm --filter api typecheck`
- `git diff --check`

## Outcome
- artist/source profiles now respect explicit source ownership first on tracks and events
- older rows without `artistBandId` remain visible through the existing compatibility fallback
- the source-side ownership model is more consistent across write paths, feed reads, and profile reads
