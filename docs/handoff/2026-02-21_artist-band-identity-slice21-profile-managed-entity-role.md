# 2026-02-21 — Artist/Band Identity Slice 21 (Profile Managed-Entity Role)

## Scope
- Enrich profile managed-entity summary with canonical membership role.
- Display role in user profile linked-entity list.

## Implemented
- API: `apps/api/src/users/users.service.ts`
  - `managedArtistBands` now includes `membershipRole` from filtered `ArtistBandMember` row.
- Tests: `apps/api/test/users.profile.collection.test.ts`
  - updated managed-entity assertions to include `membershipRole`.
- Web: `apps/web/src/app/users/[id]/page.tsx`
  - linked-entity list now renders `membershipRole` when present.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- users.profile.collection.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web test -- artist-band-labels.test.ts registrar-entry-status.test.ts registrar-artist-registration.test.ts`
- `pnpm --filter web typecheck`

## Out of Scope Kept
- No schema/migration changes.
- No new registrar workflow actions.
- No destructive identity deprecation step.
