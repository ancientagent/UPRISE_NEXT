# SLICE-UXPLYR-622A

Date: 2026-03-17
Lane: C
Task: Expanded profile composition parity pass

## Scope
- Kept the current expanded-profile implementation.
- Strengthened regression coverage around the full locked header/workspace composition.

## Changes
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to assert:
  - all six required expanded-profile sections remain present
  - required header elements (`Activity Score`, `Calendar`) remain present
  - the old `Tracks/Playlists/Saved` shelf model is not reintroduced

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Drift Guard Confirmation
- Expanded profile touched: full section order remains `Singles/Playlists`, `Events`, `Photos`, `Merch`, `Saved Uprises`, `Saved Promos/Coupons`.
- Header requirements touched: `Activity Score` and header-side `Calendar` remain intact.
- Player mode and collection/eject behavior untouched in this slice.
- Founder decision requests: none.

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
