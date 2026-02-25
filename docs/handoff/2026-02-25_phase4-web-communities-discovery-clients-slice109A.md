# 2026-02-25 — Phase 4 Slice 109A: Web Communities/Discovery Typed Clients

## Scope Lock
1. Centralize Communities/Discovery web endpoint usage into typed client modules.
2. Replace inline route strings in Discover/Plot/Statistics surfaces.
3. Add focused client tests for endpoint mapping and response parsing.
4. Keep all existing user actions unchanged.
5. Update relevant Phase 4 community specs/changelog/handoff index.

## Out of Scope
- New endpoint additions.
- New CTA/action semantics.
- Service/API behavior changes.
- Schema migrations.

## Changes Implemented
- Added typed clients:
  - `apps/web/src/lib/discovery/client.ts`
  - `apps/web/src/lib/communities/client.ts`
- Replaced inline endpoint calls in:
  - `apps/web/src/app/discover/page.tsx`
  - `apps/web/src/app/plot/page.tsx`
  - `apps/web/src/components/plot/StatisticsPanel.tsx`
- Added web client tests:
  - `apps/web/__tests__/discovery-client.test.ts`
  - `apps/web/__tests__/communities-client.test.ts`
- Updated specs:
  - `docs/specs/communities/discovery-scene-switching.md`
  - `docs/specs/communities/plot-and-scene-plot.md`

## Validation Commands
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm --filter web test -- discovery-client.test.ts communities-client.test.ts`
- `pnpm --filter api test -- communities.discovery.controller.test.ts`
- `pnpm --filter web typecheck`
- `pnpm --filter api typecheck`

## Validation Results
- `pnpm run docs:lint` ✅ passed
- `pnpm run infra-policy-check` ✅ passed
- `pnpm --filter web test -- discovery-client.test.ts communities-client.test.ts` ✅ passed (2 suites, 4 tests)
- `pnpm --filter api test -- communities.discovery.controller.test.ts` ✅ passed (1 suite, 7 tests)
- `pnpm --filter web typecheck` ✅ passed
- `pnpm --filter api typecheck` ✅ passed

## Risk / Rollback
- Risk: low-medium; web client routing refactor, no API/schema mutation.
- Rollback: single commit revert.
