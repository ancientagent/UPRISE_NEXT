# 2026-02-21 — Artist/Band Identity Slice 27 (isArtist Contract-Absence Assertions)

## Scope
- Harden contract tests after slice 26 response narrowing.
- Prove `isArtist` is absent from user detail/profile service payloads.
- Keep transitional alias behavior unchanged.

## Implemented
- Tests: `apps/api/test/users.profile.collection.test.ts`
  - Added explicit negative assertions:
    - `result.user` does not contain `isArtist` in profile reads.
    - `result` does not contain `isArtist` in user detail reads.
  - Retained existing `isArtistTransitional` assertions.

## Validation
Commands run (all passed):
- `pnpm run docs:lint`
  - docs lint + canon lint passed.
- `pnpm run infra-policy-check`
  - web-tier contract guard passed with no violations.
- `pnpm --filter api test -- users.profile.collection.test.ts`
  - 1 suite passed, 4 tests passed.
- `pnpm --filter api typecheck`
  - `tsc --noEmit` passed.

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/users.profile.collection.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_artist-band-identity-slice27-isartist-contract-absence-assertions.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (single historical changelog mention only).

## Rollback
- Remove the new negative assertions if contract rollback reintroduces legacy `isArtist` field.

## Out of Scope Kept
- No schema or migration changes.
- No registrar flow changes.
- No web UI behavior changes.
