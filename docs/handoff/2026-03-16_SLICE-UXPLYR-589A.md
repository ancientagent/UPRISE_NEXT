# SLICE-UXPLYR-589A

Date: 2026-03-16
Lane: C
Task: Tier-label deterministic title parity

## Scope
- Kept the existing tier-title rendering behavior.
- Hardened deterministic fallback coverage so `city`, `state`, and `national` continue to preserve the parent music-community anchor semantics.

## Changes
- Extended [plot-tier-guard.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-tier-guard.test.ts) with additional fallback coverage for `state` and `national` titles when the active scene anchor is absent and Home Scene data must supply the label context.

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`

## Drift Guard Confirmation
- Tier-title behavior touched: parent music-community anchor remains constant across `City`, `State`, and `National`.
- Player control map untouched: no control additions or removals in this slice.
- Collection/eject untouched: selection-driven entry and eject-only return remain unchanged.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-tier-guard.test.ts plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
