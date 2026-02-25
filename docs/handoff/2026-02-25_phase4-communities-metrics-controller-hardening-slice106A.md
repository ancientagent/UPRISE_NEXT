# 2026-02-25 — Phase 4 Slice 106A: Communities Metrics Controller Hardening

## Scope Lock
1. Add controller-level coverage for tier-scoped statistics and scene-map routes.
2. Add controller-level coverage for home-scene tuple resolution route.
3. Assert invalid tier and invalid tuple queries are rejected with validation errors.
4. Keep this slice test/docs only.
5. Preserve endpoint contracts and service behavior.

## Out of Scope
- Runtime controller/service behavior refactors.
- New routes or response shape changes.
- Web changes.
- Schema migrations.

## Changes Implemented
- Added `apps/api/test/communities.metrics.controller.test.ts`:
  - statistics delegation + invalid tier validation,
  - scene-map delegation + invalid tier validation,
  - resolve-home delegation + incomplete tuple validation.
- Updated `docs/CHANGELOG.md`.

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter api test -- communities.metrics.controller.test.ts communities.active.controller.test.ts`
- `pnpm --filter api typecheck`
- `pnpm --filter web typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter api test -- communities.metrics.controller.test.ts communities.active.controller.test.ts` ✅ passed (2 suites, 15 tests)
- `pnpm --filter api typecheck` ✅ passed
- `pnpm --filter web typecheck` ✅ passed

## Risk / Rollback
- Risk: low; test/docs only.
- Rollback: single commit revert.
