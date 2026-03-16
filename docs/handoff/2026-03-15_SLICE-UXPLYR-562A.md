# SLICE-UXPLYR-562A

Date: 2026-03-15
Lane: C
Task: Expanded profile composition parity pass

## Scope
- Realigned expanded profile composition to the locked MVP section order.
- Moved the calendar widget into the expanded header, outside the Events collection section.
- Preserved single-route `/plot` behavior and earlier collection-entry/eject locking.

## Changes
- Updated [page.tsx](/home/baris/UPRISE_NEXT/apps/web/src/app/plot/page.tsx) to replace the prior ad hoc expanded-profile cards with:
  - expanded header summary
  - activity score + tier snapshot
  - header-side calendar widget
  - exact section rail order: `Singles/Playlists`, `Events`, `Photos`, `Merch`, `Saved Uprises`, `Saved Promos/Coupons`
- Scoped collection-entry items to the `Singles/Playlists` section and kept other sections read-only, spec-aligned content blocks.
- Removed extra expanded-profile action buttons that were outside the locked MVP composition.
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to guard the new section rail and header calendar placement.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
