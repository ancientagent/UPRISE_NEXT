# 2026-02-21 — Artist/Band Identity Remaining Phased Plan (Post Slice 28)

## Evidence Snapshot (as of 2026-02-21, post slice 32)
- Strict readiness report: `pnpm run report:isartist-consumers:strict`
  - files with `isArtist` references: 0
  - unapproved legacy references: 0
- Legacy `isArtist` removed from user detail/profile response contracts (slice 26).
- Contract absence assertions added (slice 27).
- Shared `@uprise/types` user schema no longer includes `isArtist` (slice 28).
- Transitional alias removed from user detail/profile API contracts (slice 32).
- Remaining legacy field location is persistence layer only (`apps/api/prisma/schema.prisma`).

## Remaining Slices
1. Slice 33 (destructive persistence step)
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
