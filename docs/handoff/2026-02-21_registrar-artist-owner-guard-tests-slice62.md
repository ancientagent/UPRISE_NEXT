# 2026-02-21 — Registrar Artist Submitter-Ownership Guard Tests (Slice 62)

## Scope
- Add missing submitter-ownership unit coverage for existing registrar artist service actions.
- Keep runtime behavior unchanged (tests/docs only).

## Implemented
- Tests: `apps/api/test/registrar.service.test.ts`
  - Added `ForbiddenException` coverage for `dispatchArtistBandInvites` when requester is not the submitting user.
  - Added `ForbiddenException` coverage for `getArtistBandInviteStatus` when requester is not the submitting user.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- registrar.dto.test.ts registrar.controller.test.ts registrar.service.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Drift Scan
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" apps/api/test/registrar.service.test.ts docs/CHANGELOG.md docs/handoff/2026-02-21_registrar-artist-owner-guard-tests-slice62.md docs/handoff/README.md`
  - No new unauthorized CTA semantics introduced by this slice (historical changelog mention only).

## Rollback
- Remove added ownership-guard assertions from `apps/api/test/registrar.service.test.ts`.

## Out of Scope Kept
- No endpoint/schema changes.
- No migration changes.
- No UI changes.
