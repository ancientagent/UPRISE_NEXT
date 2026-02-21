# 2026-02-21 — Artist/Band Identity Slice 20 (Profile Managed-Entity Contract)

## Scope
- Add canonical managed-entity summary to profile API response.
- Simplify web profile to consume single profile contract.

## Implemented
- API: `apps/api/src/users/users.service.ts`
  - `getProfileWithCollection` now returns `managedArtistBands` (`id`, `name`, `slug`, `entityType`).
- Tests: `apps/api/test/users.profile.collection.test.ts`
  - added assertions for empty + populated `managedArtistBands`.
- Web: `apps/web/src/app/users/[id]/page.tsx`
  - removed secondary `/artist-bands?userId=:id` request,
  - renders linked entities from `profile.managedArtistBands`.

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
- No registrar flow behavior changes.
- No destructive identity deprecation step.
