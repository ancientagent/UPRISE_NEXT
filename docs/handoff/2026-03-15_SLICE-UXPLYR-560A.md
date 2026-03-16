# SLICE-UXPLYR-560A

Date: 2026-03-15
Lane: C
Task: Collection entry/eject transition lock pass

## Scope
- Removed alternate player-mode entry controls that violated the locked MVP contract.
- Added a concrete selection-driven collection entry path inside expanded profile preview.
- Preserved route-stable `/plot` behavior and kept wheel mapping / expanded profile IA changes for later slices.

## Changes
- Updated [RadiyoPlayerPanel.tsx](/home/baris/UPRISE_NEXT/apps/web/src/components/plot/RadiyoPlayerPanel.tsx) to remove direct `RADIYO`/`Collection` mode switch buttons.
- Added explicit eject controls in collection mode so return to `RADIYO` only happens through an explicit user action.
- Added lightweight preview selections in [page.tsx](/home/baris/UPRISE_NEXT/apps/web/src/app/plot/page.tsx) so collection mode is entered from a chosen track/playlist item instead of a generic mode toggle.
- Extended [plot-ux-regression-lock.test.ts](/home/baris/UPRISE_NEXT/apps/web/__tests__/plot-ux-regression-lock.test.ts) to guard against reintroducing implicit collection entry.

## Canon / Spec Anchors
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`

## Verification
- Exact queued command passed:

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
