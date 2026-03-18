# SLICE-UXPLYR-593A

Date: 2026-03-16
Lane: C
Task: Player/profile lane closeout + regression pack

## Scope
- Closed Batch17 lane C by strengthening the ownership regression pack only.
- Kept user-facing player/profile behavior unchanged in this slice.

## Changes
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to assert seam-state ownership markers on `/plot`, including the dedicated seam toggle id, `aria-controls` wiring, and the route-owned `toggleProfilePanel` transition helper.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Drift Guard Confirmation
- Seam-state ownership touched: expand/collapse remains route-owned on `/plot`.
- Mode-state ownership untouched beyond regression coverage: player mode remains route-owned and selection/eject driven.
- Collection/eject behavior untouched: no direct mode-switch controls were added.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
