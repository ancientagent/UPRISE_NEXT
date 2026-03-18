# SLICE-UXPLYR-591A

Date: 2026-03-16
Lane: C
Task: Engagement wheel mapping lock pass

## Scope
- Kept the current wheel mapping behavior.
- Reinforced regression coverage around the exact action set and player wiring so mode-specific mappings cannot drift.

## Changes
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to assert the full locked `RADIYO` set (`Report`, `Skip`, `Blast`, `Add`, `Upvote`), the full locked `Collection` set with positions, and the player’s use of `getEngagementWheelActions(mode)`.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Drift Guard Confirmation
- Wheel mapping touched: exact mode-specific action sets remain unchanged.
- Player mode behavior untouched: no new wheel controls or trigger semantics were added.
- Collection/eject untouched: selection entry and eject-only return remain intact.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
