# 2026-02-25 — Phase 4 Slice 107A: Communities Route Resolution Guard

## Scope Lock
1. Add route-level regression coverage for `GET /communities/nearby`.
2. Ensure static nearby route does not regress behind dynamic `/:id` route.
3. Keep slice limited to tests/docs.
4. Preserve runtime endpoint contracts.
5. Keep migration-free and additive.

## Out of Scope
- Controller/service runtime behavior changes.
- New route additions.
- Web UI changes.
- Schema migrations.

## Changes Implemented
- Added `apps/api/test/communities.routes.test.ts`:
  - boots a Nest Fastify app with guard override,
  - injects request to `/communities/nearby?...`,
  - asserts `findNearby` is called and `findById` is not called.
- Updated `docs/CHANGELOG.md`.

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- communities.routes.test.ts communities.metrics.controller.test.ts communities.active.controller.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter api test -- communities.routes.test.ts communities.metrics.controller.test.ts communities.active.controller.test.ts` ✅ passed (3 suites, 16 tests)
- `pnpm --filter api typecheck` ✅ passed
- `pnpm --filter web typecheck` ✅ passed

## Risk / Rollback
- Risk: low; tests/docs only.
- Rollback: single commit revert.
