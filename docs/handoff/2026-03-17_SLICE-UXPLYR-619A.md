# SLICE-UXPLYR-619A

Date: 2026-03-17
Lane: C
Task: Tier-label deterministic title parity

## Scope
- Kept the current tier-title rendering behavior.
- Strengthened fallback coverage for `City`, `State`, and `National` title generation.

## Changes
- Extended [plot-tier-guard.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-tier-guard.test.ts) with:
  - `state` and `national` fallback coverage from Home Scene data
  - `national` fallback coverage from selected-anchor `name` when no explicit community label is available

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`

## Drift Guard Confirmation
- Tier-title behavior touched: parent community anchor semantics remain deterministic across `City`, `State`, and `National`.
- Player controls untouched: no shell/control changes in this slice.
- Collection/eject untouched: selection entry and eject-only return remain unchanged.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-tier-guard.test.ts plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
