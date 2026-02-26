# 2026-02-25 — Phase 4 Slice 110A: Discovery Context Consistency Helpers

## Scope Lock
1. Centralize discovery-context store patch mapping and fallback merge logic.
2. Reuse helper functions in both Discover and Plot surfaces.
3. Add focused unit tests for helper behavior.
4. Keep user-facing actions unchanged.
5. Keep migration-free and additive.

## Out of Scope
- API behavior changes.
- New routes/endpoints.
- UI action/CTA changes.
- Schema migrations.

## Changes Implemented
- Added `apps/web/src/lib/discovery/context.ts`:
  - `toDiscoveryContextPatch()`
  - `mergeDiscoveryContextPatch()`
- Updated:
  - `apps/web/src/app/discover/page.tsx`
  - `apps/web/src/app/plot/page.tsx`
- Added tests:
  - `apps/web/__tests__/discovery-context.test.ts`
- Updated docs:
  - `docs/specs/communities/discovery-scene-switching.md`
  - `docs/CHANGELOG.md`

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- discovery-context.test.ts discovery-client.test.ts communities-client.test.ts`
- `pnpm --filter api test -- communities.discovery.controller.test.ts`
- `pnpm --filter web typecheck`
- `pnpm --filter api typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter web test -- discovery-context.test.ts discovery-client.test.ts communities-client.test.ts` ✅ passed (3 suites, 8 tests)
- `pnpm --filter api test -- communities.discovery.controller.test.ts` ✅ passed (1 suite, 7 tests)
- `pnpm --filter web typecheck` ✅ passed
- `pnpm --filter api typecheck` ✅ passed

## Risk / Rollback
- Risk: low; helper consolidation and tests only.
- Rollback: single commit revert.
