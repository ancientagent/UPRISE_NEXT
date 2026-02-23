# 2026-02-23 — Slice 70: Registrar Entry-List Invite Outcome Counts

## Scope
- Extend existing registrar entry-list read surface with additive invite outcome counts.
- No migrations, no new endpoints, no UI changes.

## Implementation
- `apps/api/src/registrar/registrar.service.ts`
  - `listArtistBandRegistrations` invite summary aggregation now includes:
    - `sentInviteCount`
    - `failedInviteCount`
  - Existing counts preserved:
    - `pendingInviteCount`, `queuedInviteCount`, `claimedCount`, `existingUserCount`.
- `apps/api/test/registrar.service.test.ts`
  - Updated invite-count aggregation test to cover `sent` and `failed` lifecycle statuses.

## Docs
- Updated:
  - `docs/specs/system/registrar.md`
  - `docs/specs/users/identity-roles-capabilities.md`
  - `docs/CHANGELOG.md`

## Validation
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
- `pnpm --filter api test -- registrar.service.test.ts registrar.controller.test.ts` — passed
- `pnpm --filter api typecheck` — passed
- `pnpm --filter web typecheck` — passed
- `pnpm run qa:phase2` — passed

## Risk / Rollback
- Risk: low (read-only additive count fields).
- Rollback: single commit revert; migration-free.
