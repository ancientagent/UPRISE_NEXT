# 2026-02-21 — Registrar Artist Service Guard-Path Hardening Tests (Slice 61)

## Scope
- Add missing guard-path unit coverage for existing registrar artist service actions.
- Keep runtime behavior unchanged (tests/docs only).

## Implemented
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added `NotFoundException` coverage for:
    - `dispatchArtistBandInvites` when entry is missing.
    - `getArtistBandInviteStatus` when entry is missing.
    - `syncArtistBandMembers` when entry is missing.
  - Added `ForbiddenException` coverage for:
    - `dispatchArtistBandInvites` when entry type is not `artist_band_registration`.
    - `getArtistBandInviteStatus` when entry type is not `artist_band_registration`.
    - `syncArtistBandMembers` when entry type is not `artist_band_registration`.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.service.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-artist-service-guard-tests-slice61.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove added guard-path assertions from `apps/api/test/registrar.service.test.ts`.

## Out of Scope Kept
- No endpoint/schema changes.
- No migration changes.
- No UI changes.
