# 2026-02-21 — Artist/Band Identity Slice 26 (Remove isArtist From User Detail/Profile Contracts)

## Scope
- Execute first destructive API contract step for legacy artist flag.
- Remove `isArtist` from detail/profile responses while retaining transitional alias.
- Keep DB schema unchanged for rollback safety.

## Implemented
- API: `apps/api/src/users/users.service.ts`
  - `findById` and `getProfileWithCollection` now omit `isArtist` from response payloads.
  - Both continue to return `isArtistTransitional`.
- Tests: `apps/api/test/users.profile.collection.test.ts`
  - removed direct assertion on `result.isArtist`.
  - retained/expanded assertions on `isArtistTransitional`.
- Web typing: `apps/web/src/app/users/[id]/page.tsx`
  - removed required `isArtist` from profile user shape.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint passed; canon lint checked 10 canon markdown files.
- `pnpm run infra-policy-check`
  - web-tier contract guard reported no violations.
- `pnpm --filter api test -- users.profile.collection.test.ts`
  - 1 suite passed, 4 tests passed.
- `pnpm --filter api typecheck`
  - `tsc --noEmit` passed.
- `pnpm --filter web typecheck`
  - `tsc --noEmit` passed.
- `pnpm run report:isartist-consumers:strict`
  - unapproved legacy references: 0.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/web/src/app/users/[id]/page.tsx docs/specs/users/identity-roles-capabilities.md docs/specs/system/registrar.md docs/CHANGELOG.md docs/handoff/2026-02-21_artist-band-identity-slice26-remove-isartist-from-user-detail-profile-contracts.md`
  - No new unauthorized CTA semantics introduced in this slice (single historical changelog mention only).

## Rollback
- Re-add `isArtist` in response mapping only (no DB rollback required).

## Out of Scope Kept
- No schema migration/drop of `User.isArtist` column.
- No registrar flow behavior changes.
