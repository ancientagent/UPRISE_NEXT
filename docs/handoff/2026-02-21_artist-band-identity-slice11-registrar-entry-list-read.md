# 2026-02-21 — Artist/Band Identity Slice 11 (Registrar Entry List Read)

## Scope
- Add submitter-owned registrar entry list read surface for Artist/Band registrations.
- Keep implementation additive and non-breaking.
- Add unit test coverage and update specs/changelog.

## Implemented
- API endpoint:
  - `GET /registrar/artist/entries` (auth required)
  - Controller: `apps/api/src/registrar/registrar.controller.ts`
- Service method:
  - `listArtistBandRegistrations(userId)` in `apps/api/src/registrar/registrar.service.ts`
  - Filters to `type = artist_band_registration` and `createdById = userId`.
  - Returns reverse-chronological entries with:
    - scene metadata,
    - registration payload summary (`name`, `slug`, `entityType`),
    - `memberCount`,
    - invite lifecycle summary counts (`pendingInviteCount`, `queuedInviteCount`, `claimedCount`, `existingUserCount`).
- Tests:
  - `apps/api/test/registrar.service.test.ts`
  - Added coverage for populated entry list and empty state.

## Canon/Spec Alignment
- Supports canon registrar requirement to track registration intent/status.
- No authority changes; read-only visibility for submitter-owned records.
- No change to voting, Fair Play, or cross-scene authority boundaries.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.service.test.ts`
- `pnpm --filter api typecheck`

## Out of Scope Kept
- No migration/schema change.
- No invite delivery provider integration.
- No removal of transitional `User.isArtist`.
- No promoter/project/sect registrar work.
