# 2026-02-23 — Slice 71: Registrar Entry-List Top-Level Invite Summary

## Scope
- Extend existing `GET /registrar/artist/entries` response with a top-level invite status summary.
- Keep changes additive and migration-free (no new endpoints, no UI changes).

## Implementation
- `apps/api/src/registrar/registrar.service.ts`
  - Added `inviteCountsByStatus` aggregated from `registrarArtistMember.inviteStatus` across all returned entries.
  - Empty responses now include `inviteCountsByStatus: {}` for stable shape parity.
- `apps/api/test/registrar.service.test.ts`
  - Added assertions for populated `inviteCountsByStatus`.
  - Added empty-state assertion for `inviteCountsByStatus: {}`.

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
- Risk: low (read-only additive shape extension).
- Rollback: single commit revert; migration-free.
