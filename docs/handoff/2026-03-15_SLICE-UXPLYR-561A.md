# SLICE-UXPLYR-561A

Date: 2026-03-15
Lane: C
Task: Engagement wheel mode-action mapping pass

## Scope
- Locked the wheel action sets for `RADIYO` vs `Collection`.
- Avoided inventing clickable wheel behavior because the wheel trigger/surface is not yet implemented in `/plot` and this slice only authorizes mapping determinism.
- Preserved the current route/state model and collection-entry/eject behavior from prior slices.

## Changes
- Added [engagement-wheel.ts](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/engagement-wheel.ts) as a single source of truth for mode-specific wheel actions and collection-mode position mapping.
- Updated [RadiyoPlayerPanel.tsx](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/RadiyoPlayerPanel.tsx) to surface the active wheel mapping as read-only copy, keeping the action set visible without shipping speculative no-op controls.
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to guard the exact `RADIYO` and `Collection` mappings.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
