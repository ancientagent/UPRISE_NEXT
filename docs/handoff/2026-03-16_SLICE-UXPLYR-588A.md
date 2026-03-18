# SLICE-UXPLYR-588A

Date: 2026-03-16
Lane: C
Task: RADIYO compact shell proportion lock

## Scope
- Tightened the compact `RADIYO` shell proportions only.
- Preserved the existing control map, state model, and collection/eject behavior from prior locks.

## Changes
- Updated [RadiyoPlayerPanel.tsx](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/RadiyoPlayerPanel.tsx) to reduce shell padding, track-row spacing, art-chip size, rotation-chip size, footer density, and tier-stack width for a tighter compact shell.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Drift Guard Confirmation
- Compact player shell touched: preserved required scene title line, track row, right-side tier stack, and rotation control.
- Collection entry/eject untouched: no new mode-switch controls were introduced.
- Expanded profile untouched: no section-order or calendar changes in this slice.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
