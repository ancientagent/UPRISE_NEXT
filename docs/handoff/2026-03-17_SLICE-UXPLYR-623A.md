# SLICE-UXPLYR-623A

Date: 2026-03-17
Lane: C
Task: Player/profile lane closeout + regression pack

## Scope
- Closed Batch18 lane C by strengthening regression coverage only.
- Kept user-facing player/profile behavior unchanged in this slice.

## Changes
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to assert the explicit seam toggle continues to bind `aria-expanded` to the route-owned `isProfileExpanded` state.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Drift Guard Confirmation
- Seam-state ownership touched: expand/collapse remains owned by `/plot`.
- Mode-state ownership untouched beyond regression coverage: player mode remains route-owned.
- Collection/eject behavior untouched: selection entry and eject-only return remain intact.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
