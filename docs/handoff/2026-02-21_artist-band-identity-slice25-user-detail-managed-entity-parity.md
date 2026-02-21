# 2026-02-21 — Artist/Band Identity Slice 25 (User Detail Managed-Entity Parity)

## Scope
- Align `/users/:id` response with profile managed-entity summary contract.
- Add test coverage for new payload fields.

## Implemented
- API: `apps/api/src/users/users.service.ts`
  - `findById` now includes `managedArtistBands` summary with `membershipRole`.
- Tests: `apps/api/test/users.profile.collection.test.ts`
  - expanded `findById` assertions for managed-entity payload.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- users.profile.collection.test.ts`
- `pnpm --filter api typecheck`

## Out of Scope Kept
- No schema/migration changes.
- No web behavior changes.
- No destructive identity deprecation step.
