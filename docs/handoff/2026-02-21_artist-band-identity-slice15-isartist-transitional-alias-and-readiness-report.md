# 2026-02-21 — Artist/Band Identity Slice 15 (isArtistTransitional Alias + Readiness Report)

## Scope
- Add explicit transitional alias for legacy `isArtist` on user read responses.
- Add evidence script for in-repo `isArtist` consumer inventory.
- Keep behavior non-breaking and additive.

## Implemented
- API user read bridge updates in `apps/api/src/users/users.service.ts`:
  - `GET /users/:id` now returns `isArtistTransitional` in addition to `isArtist` + `hasArtistBand`.
  - `GET /users/:id/profile` now returns `isArtistTransitional` in addition to `isArtist` + `hasArtistBand`.
- Tests updated:
  - `apps/api/test/users.profile.collection.test.ts`
  - Added assertions for `isArtistTransitional` parity and `findById` coverage.
- Readiness report script:
  - `scripts/is-artist-consumer-report.mjs`
  - command: `pnpm run report:isartist-consumers`
  - reports file/line references for remaining in-repo `isArtist` usages.
- Web typing compatibility:
  - `apps/web/src/app/users/[id]/page.tsx` user shape now includes optional `isArtistTransitional`.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- users.profile.collection.test.ts`
- `pnpm --filter api typecheck`
- `pnpm run report:isartist-consumers`

## Out of Scope Kept
- No schema migration/removal of `User.isArtist`.
- No registrar/auth flow behavior changes.
- No new UI action semantics beyond compatibility typing.
