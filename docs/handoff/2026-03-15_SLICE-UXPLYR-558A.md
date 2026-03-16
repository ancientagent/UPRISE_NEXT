# SLICE-UXPLYR-558A

Date: 2026-03-15
Lane: C
Task: Player compact-shell proportion pass

## Scope
- Tightened the `/plot` player shell layout only.
- Preserved existing route and mode-state wiring.
- Avoided tier-title parity, collection entry/eject semantics, and expanded profile composition changes because those belong to later lane C slices.

## Changes
- Refactored [RadiyoPlayerPanel.tsx](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/RadiyoPlayerPanel.tsx) into a denser compact shell with:
  - compact context header
  - dedicated track row
  - right-side vertical tier stack scaffolding in `RADIYO`
  - smaller footer controls and preserved mode toggle wiring
- Added a narrow regression guard in [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to keep the compact shell, track row, and tier stack slots from drifting.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
