# SLICE-UXPLYR-620A

Date: 2026-03-17
Lane: C
Task: Collection entry/eject ownership pass

## Scope
- Kept the current collection entry/eject behavior.
- Reinforced ownership coverage for the explicit eject control.

## Changes
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to assert the explicit `Back to RADIYO` eject control remains present in the player component while generic mode-switch controls remain absent.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`

## Drift Guard Confirmation
- Collection entry untouched: still selection-driven from collection content.
- Eject return touched: explicit `Back to RADIYO` path remains intact.
- No dedicated mode switch button was reintroduced.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
