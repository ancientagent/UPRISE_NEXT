# 2026-02-25 — Phase 4 Slice 103A: Communities Active Controller Hardening

## Scope Lock
1. Add controller-level regression coverage for active-scene community endpoints.
2. Verify route delegation uses `resolveActiveSceneId` before scene reads.
3. Cover active feed/statistics/events/promotions controller response contracts.
4. Add invalid-query validation-path assertion for active feed.
5. Keep this slice test-only (no runtime API behavior changes).

## Out of Scope
- Endpoint additions/changes.
- Service logic refactors.
- Web UI changes.
- Schema migrations.

## Changes Implemented
- Added `apps/api/test/communities.active.controller.test.ts` with coverage for:
  - `GET /communities/active/feed`
  - `GET /communities/active/statistics`
  - `GET /communities/active/events`
  - `GET /communities/active/promotions`
  - validation error path for invalid feed query (`limit=0`).

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- communities.active.controller.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter api test -- communities.active.controller.test.ts` ✅ passed (1 suite, 5 tests)
- `pnpm --filter api typecheck` ✅ passed
- `pnpm --filter web typecheck` ✅ passed

## Risk / Rollback
- Risk: low; tests/docs only.
- Rollback: single commit revert.
