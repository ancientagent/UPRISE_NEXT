# 2026-02-21 — Artist/Band Identity Slice 13 (Member Sync Primitive)

## Scope
- Add registrar action to sync eligible registrar members into canonical Artist/Band membership graph.
- Keep implementation additive/non-breaking.

## Implemented
- New endpoint: `POST /registrar/artist/:entryId/sync-members`
  - Controller: `apps/api/src/registrar/registrar.controller.ts`
  - Service: `syncArtistBandMembers(userId, entryId)` in `apps/api/src/registrar/registrar.service.ts`
- Behavior:
  - submitter-only,
  - requires `type = artist_band_registration`,
  - requires materialized registration (`artistBandId` present),
  - gathers eligible linked users from registrar rows:
    - `existing_user` -> `existingUserId`
    - `claimed` -> `claimedUserId`
  - writes canonical membership rows via `artistBandMember.createMany(..., skipDuplicates: true)`.

## Tests
- Updated `apps/api/test/registrar.service.test.ts` with:
  - successful sync for existing/claimed members,
  - guard for non-materialized entry,
  - guard for non-submitter call.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.service.test.ts`
- `pnpm --filter api typecheck`

## Out of Scope Kept
- No schema/migration changes.
- No invite provider delivery integration.
- No `User.isArtist` removal.
- No promoter/project/sect registrar features.
