# SLICE-UXPLYR-590A

Date: 2026-03-16
Lane: C
Task: Collection entry/eject ownership pass

## Scope
- Kept the existing collection entry/eject behavior.
- Strengthened the ownership guard so collection mode stays tied to `Singles/Playlists` selection and eject-only return.

## Changes
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to assert that:
  - expanded profile defaults to `Singles/Playlists`
  - collection entry wiring lives under the `Singles/Playlists` section
  - entry remains item-selection driven rather than generic mode switching

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`

## Drift Guard Confirmation
- Collection entry touched: still selection-driven from collection content, not a mode toggle.
- Eject return touched: still the only explicit return path to `RADIYO`.
- Player control map untouched: no new player controls or state transitions added.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
