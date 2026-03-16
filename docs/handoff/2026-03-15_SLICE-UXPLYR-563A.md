# SLICE-UXPLYR-563A

Date: 2026-03-15
Lane: C
Task: Player/profile regression lock closeout

## Scope
- Finalized the lane C pass by hardening regression coverage around player/profile state ownership.
- Added focused locks for panel state, mode state, and player ownership boundaries without changing user-facing behavior again.

## Changes
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to assert:
  - panel state remains owned by `/plot`
  - player mode remains owned by `/plot`
  - the player component only handles eject, not generic mode switching
  - collection entry remains selection-driven
  - expanded profile / wheel / compact shell locks remain intact
- Re-ran the tier guard alongside the plot regression suite to close the lane with both title-parity and player/profile ownership coverage.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
