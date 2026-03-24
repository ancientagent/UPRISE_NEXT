# Runtime Track Create Path

## Branch
- `feat/ux-founder-locks-and-harness`

## What Changed
- Added authenticated `POST /tracks`.
- Added `CreateTrackSchema` in `apps/api/src/tracks/dto/create-track.dto.ts`.
- Added `TracksService.createTrack()` with optional community existence validation.
- Extended focused track service tests to cover successful creation and missing-community rejection.
- Updated `apps/api/README.md` to list the new route.

## Why
- Discover song verification previously required direct DB fixture insertion because the repo exposed no runtime/API path for creating track rows.
- This new route removes that last fixture-only dependency for local Discover QA.

## Verification
- `pnpm --filter api test -- tracks.engagement.service.test.ts`
- `pnpm --filter api typecheck`
