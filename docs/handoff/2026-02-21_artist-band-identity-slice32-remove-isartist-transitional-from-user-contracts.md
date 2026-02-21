# 2026-02-21 — Artist/Band Identity Slice 32 (Remove isArtistTransitional From User Contracts)

## Scope
- Execute destructive API-contract step to remove transitional alias from user detail/profile responses.
- Remove users-service dependency on persistence `isArtist` for these response mappings.
- Keep persistence column intact for now.

## Implemented
- API: `apps/api/src/users/users.service.ts`
  - Removed `isArtist` from Prisma `select` in `findById` and `getProfileWithCollection`.
  - Removed `isArtistTransitional` from returned payloads.
- Tests: `apps/api/test/users.profile.collection.test.ts`
  - Removed transitional alias assertions and legacy fixture fields.
  - Kept canonical bridge assertions (`hasArtistBand`, `managedArtistBands`).
- Guard: `scripts/is-artist-consumer-report.mjs`
  - Cleared strict-mode approved legacy path set after zero-reference state.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm run report:isartist-consumers:strict`
  - strict report passed; `isArtist` references in scanned code: `0`.
- `pnpm --filter api test -- users.profile.collection.test.ts`
  - 1 suite passed, 4 tests passed.
- `pnpm --filter api typecheck`
  - `tsc --noEmit` passed.
- `pnpm --filter web typecheck`
  - `tsc --noEmit` passed.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/src/users/users.service.ts apps/api/test/users.profile.collection.test.ts scripts/is-artist-consumer-report.mjs docs/specs/users/identity-roles-capabilities.md docs/specs/system/registrar.md docs/CHANGELOG.md docs/handoff/2026-02-21_artist-band-identity-slice32-remove-isartist-transitional-from-user-contracts.md docs/handoff/README.md docs/handoff/2026-02-21_artist-band-identity-remaining-phased-plan.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Re-add `isArtist` select + `isArtistTransitional` projection in `UsersService`.
- Restore prior transitional assertions in users profile service tests.

## Out of Scope Kept
- No DB migration/drop of `User.isArtist` column yet.
- No registrar flow behavior changes.
