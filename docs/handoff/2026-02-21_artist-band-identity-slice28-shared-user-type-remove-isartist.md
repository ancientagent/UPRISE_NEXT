# 2026-02-21 — Artist/Band Identity Slice 28 (Shared User Type Remove isArtist)

## Scope
- Align shared cross-app user type contracts with post-slice-26 API response shape.
- Remove legacy `isArtist` from shared `@uprise/types` user schema.
- Keep DB persistence and API transitional alias behavior unchanged.

## Implemented
- Types: `packages/types/src/user.ts`
  - Removed `isArtist` from `UserSchema`.
- Spec: `docs/specs/users/identity-roles-capabilities.md`
  - Documented that shared cross-app `User` type contract no longer includes `isArtist`.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm --filter @uprise/types typecheck`
  - `tsc --noEmit` passed for `@uprise/types`.
- `pnpm run typecheck`
  - Turbo monorepo typecheck passed across all in-scope packages/apps.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" packages/types/src/user.ts docs/specs/users/identity-roles-capabilities.md docs/CHANGELOG.md docs/handoff/2026-02-21_artist-band-identity-slice28-shared-user-type-remove-isartist.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (single historical changelog mention only).

## Rollback
- Reintroduce `isArtist` to `packages/types/src/user.ts` only.

## Out of Scope Kept
- No Prisma schema/migration changes.
- No registrar flow or web CTA changes.
