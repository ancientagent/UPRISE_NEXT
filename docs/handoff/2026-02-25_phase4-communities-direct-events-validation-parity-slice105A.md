# 2026-02-25 — Phase 4 Slice 105A: Communities Direct Events Validation Parity

## Scope Lock
1. Extend events-query boolean hardening coverage to direct scene route.
2. Assert `includePast=false` stays false on `GET /communities/:id/events`.
3. Assert invalid includePast strings are rejected.
4. Keep this slice test/docs only.
5. Preserve existing endpoint contracts.

## Out of Scope
- Additional controller/service runtime behavior changes.
- New API routes.
- Web UI changes.
- Schema migrations.

## Changes Implemented
- `apps/api/test/communities.active.controller.test.ts`
  - Added direct scene events test for `includePast='false'`.
  - Added direct scene events invalid-query test (`includePast='not-boolean'`).
- `docs/CHANGELOG.md` updated.

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- communities.active.controller.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter api test -- communities.active.controller.test.ts` ✅ passed (1 suite, 9 tests)
- `pnpm --filter api typecheck` ✅ passed
- `pnpm --filter web typecheck` ✅ passed

## Risk / Rollback
- Risk: low; test/docs only.
- Rollback: single commit revert.
