# 2026-02-23 — Registrar Invite Delivery Outcome Read Surface (Slice 66)

## Scope Lock (This Slice)
- Extend `GET /registrar/artist/:entryId/invites` response with additive per-member delivery outcome fields.
- Use existing `RegistrarInviteDelivery` data only (no schema migration, no new endpoint, no UI changes).
- Additive/non-breaking: callers that do not consume the new fields are unaffected.

## Out of Scope (This Slice)
- Schema migration or new columns.
- New endpoints.
- Web/mobile UI changes.
- Outbound email sender worker/provider integration.
- Scheduler/cron trigger wiring.

## Evidence Base
- Canon authority:
  - `docs/specs/system/registrar.md` §"Registrar invite tracking read surface (slice 7)"
  - `docs/specs/system/registrar.md` §"Deferred" — outbound invite email sender worker/provider integration
- Phase 2 roadmap:
  - `docs/handoff/2026-02-22_phase2-roadmap-and-slice64-invite-delivery-state.md` — Slice 66 item
- Prisma schema:
  - `apps/api/prisma/schema.prisma` — `RegistrarInviteDelivery` model (`status`, `dispatchedAt`)

## Implementation Summary

### `apps/api/src/registrar/registrar.service.ts`
- `getArtistBandInviteStatus`: extended `registrarArtistMember.findMany` select to include `deliveries: { select: { status, dispatchedAt } }`.
- Added `membersWithDelivery` mapping step:
  - `deliveryStatus` = `delivery.status` or `null` when no delivery row.
  - `sentAt` = `delivery.dispatchedAt` when `status === 'sent'`, else `null`.
  - `failedAt` = `delivery.dispatchedAt` when `status === 'failed'`, else `null`.
  - Raw `deliveries` array destructured out and not returned.
- Response shape: `members` now contains `deliveryStatus`, `sentAt`, `failedAt` per row.

### `apps/api/test/registrar.service.test.ts`
- Updated existing `returns invite status summary for submitter-owned entry` test to include `deliveries: []` in mock member data.
- Added `includes delivery outcome fields per member when delivery row exists`: asserts `sent`/`failed`/no-delivery mapping across 3 members.
- Added `omits raw deliveries array from member response shape`: asserts `deliveries` absent, `deliveryStatus`/`sentAt`/`failedAt` present.

### Docs
- `docs/specs/system/registrar.md`: added slice 66 implemented-now entry while keeping outbound sender/automation items deferred.
- `docs/specs/users/identity-roles-capabilities.md`: added slice 66 implemented-now entry after slice 64 block.
- `docs/CHANGELOG.md`: added slice 66 entry at top of Unreleased Added section.

## Validation Results
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risks and Controls
- Risk: delivery row join adds latency to invite status reads.
  - Control: `RegistrarInviteDelivery` is `@unique` on `registrarArtistMemberId` — at most one row per member; join is bounded.
- Risk: callers break on new fields.
  - Control: additive only; no existing fields removed or renamed.
- Risk: `deliveries` array leaks into response.
  - Control: destructured out explicitly in mapping step; test asserts absence.

## Rollback Strategy
- Single-commit revert. No schema migration. No new endpoints. No web changes.
- Forward-fix option: remove delivery join and mapping step if emergency compatibility issue appears.
