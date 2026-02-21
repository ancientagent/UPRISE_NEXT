# 2026-02-21 — Artist/Band Identity Remaining Phased Plan (Post Slice 28)

## Evidence Snapshot (as of 2026-02-21)
- Strict readiness report: `pnpm run report:isartist-consumers:strict`
  - files with `isArtist` references: 4
  - unapproved legacy references: 0
- Legacy `isArtist` removed from user detail/profile response contracts (slice 26).
- Contract absence assertions added (slice 27).
- Shared `@uprise/types` user schema no longer includes `isArtist` (slice 28).
- Remaining references are now concentrated in:
  - `apps/api/src/users/users.service.ts` (transitional mapping from persistence field),
  - `apps/api/test/users.profile.collection.test.ts` (fixtures/assertions),
  - `apps/web/src/app/users/[id]/page.tsx` (`isArtistTransitional` optional field),
  - `apps/api/prisma/schema.prisma` (persistence field).

## Remaining Slices
1. Slice 29 (guard tightening, additive)
- Narrow `report:isartist-consumers` approved path set to remove stale allowances that are no longer needed.
- Keep strict mode green.

2. Slice 30 (service transitional field isolation, additive)
- Centralize `isArtistTransitional` projection in one mapper helper in users service.
- Objective: make final field removal a single edit point.

3. Slice 31 (web transitional field retirement prep, additive)
- Remove unused `isArtistTransitional` surface from web profile contract type if not rendered.
- Keep runtime behavior unchanged.

4. Slice 32 (destructive API contract step)
- Remove `isArtistTransitional` from `/users/:id` and `/users/:id/profile` responses after caller audit is zero.
- Update targeted tests/spec/changelog/handoff.

5. Slice 33 (destructive persistence step)
- Drop `User.isArtist` from Prisma schema via explicit migration.
- Remove all read/write code paths and fixtures using the field.
- Regenerate Prisma client and run full verify gates.

## Migration Strategy
- Keep additive/contract-hardening slices before destructive removals.
- Require strict report + targeted tests + typecheck green at each slice.
- Only execute DB-column drop after API/contracts are already clean for at least one slice and strict report confirms zero active consumers.

## Risks and Controls
- Risk: hidden consumer relies on `isArtistTransitional`.
  - Control: strict report, targeted users-service tests, and staged contract removal.
- Risk: migration ordering issue causes runtime breakage.
  - Control: destructive API removal precedes DB column removal; no same-slice API+DB destructive combo.
- Risk: drift in docs/contracts across agents.
  - Control: mandatory changelog + handoff updates each slice and spec sync in `USER-IDENTITY`.

## Rollback Strategy
- Slice 29-31 rollback: revert single commit (no data impact).
- Slice 32 rollback: re-add response field mapping + tests (no DB rollback needed).
- Slice 33 rollback options:
  - immediate: restore from pre-migration backup/snapshot,
  - forward-fix: add replacement column + compatibility mapper if restore not possible.

## Validation Gate Template (per slice)
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- targeted tests for touched area
- relevant `pnpm ... typecheck` (or `pnpm run typecheck` for shared-package changes)
- optional readiness guard when identity touched: `pnpm run report:isartist-consumers:strict`

## Validation For This Doc Slice
- `pnpm run docs:lint` — passed.
- `pnpm run infra-policy-check` — passed.
- `pnpm run report:isartist-consumers:strict` — passed (`unapproved legacy references: 0`).
- Drift scan (`Coming Soon|Join|Upgrade`) on touched docs — no new unauthorized CTA semantics (historical changelog mention only).
