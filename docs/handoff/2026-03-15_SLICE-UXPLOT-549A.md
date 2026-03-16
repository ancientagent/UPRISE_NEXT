# SLICE-UXPLOT-549A

Date: 2026-03-15
Lane: A (`lane-a-ux-plot-batch16`)
Task: Plot Statistics/Scene Map contract coherence pack 1
Status: completed

## Scope
Execute one MVP slice only: enforce Statistics tab ownership of Top Songs/Scene Activity + scene-map tier read coherence, preserving existing API contracts.

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`

## Implemented
- Added `resolveSceneMapRequest()` in `apps/web/src/components/plot/statistics-request.ts` to make scene-map anchor/source resolution explicit for selected-community vs active-scene fallback paths.
- Extended `apps/web/__tests__/plot-statistics-request.test.ts` to lock request resolution for:
  - anchored statistics reads
  - active-scene statistics fallback
  - selected-community scene-map reads
  - active-scene scene-map fallback
  - unresolved/no-anchor state
- Updated `apps/web/src/components/plot/StatisticsPanel.tsx` with:
  - tier-stable scene-map scope copy
  - explicit map-read error copy separate from statistics-read errors
  - visible anchor-source note for macro map tiers

## Non-Changes / Guardrails
- Did not change statistics endpoints, scene-map endpoints, metrics shape, or Top Songs payload contract.
- Did not move Top Songs or Scene Activity outside the Statistics tab.

## Verify Command
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-statistics-request.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Verify Result
- Passed exactly as claimed.

## Files Touched
- `apps/web/src/components/plot/statistics-request.ts`
- `apps/web/src/components/plot/StatisticsPanel.tsx`
- `apps/web/__tests__/plot-statistics-request.test.ts`
- `docs/CHANGELOG.md`
