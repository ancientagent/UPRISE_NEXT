# SLICE-UXPLYR-559A

Date: 2026-03-15
Lane: C
Task: Tier-context title parity pass

## Scope
- Enforced deterministic `RADIYO` broadcast title parity for `city`, `state`, and `national`.
- Kept the parent music-community label stable while tier scope changes.
- Left collection entry/eject behavior, wheel mapping, and expanded profile composition untouched for later slices.

## Changes
- Added `buildRadiyoBroadcastLabel` in [tier-guard.ts](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/tier-guard.ts) to generate tier-specific labels from the current scene anchor with Home Scene fallback.
- Wired `/plot` to use that helper in [page.tsx](/home/baris/UPRISE_NEXT/apps/web/src/app/plot/page.tsx) so the player title responds deterministically to `city`, `state`, and `national`.
- Extended [plot-tier-guard.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-tier-guard.test.ts) to lock the parent music-community anchor and fallback behavior.

## Canon / Spec Anchors
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-tier-guard.test.ts plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
