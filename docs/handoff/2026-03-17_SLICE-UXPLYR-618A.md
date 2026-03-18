# SLICE-UXPLYR-618A

Date: 2026-03-17
Lane: C
Task: RADIYO compact shell proportion lock

## Scope
- Tightened the compact `RADIYO` shell proportions only.
- Preserved current controls, labels, and player/profile state behavior.

## Changes
- Updated [RadiyoPlayerPanel.tsx](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/RadiyoPlayerPanel.tsx) to reduce shell padding, compact the track row, shrink the art chip, narrow the `RADIYO` tier stack, and tighten footer control spacing.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Drift Guard Confirmation
- Compact shell touched: scene title, track row, tier stack, and rotation controls remain intact.
- Collection/eject untouched: no mode-switch or return-path changes were introduced.
- Expanded profile untouched in this slice.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
