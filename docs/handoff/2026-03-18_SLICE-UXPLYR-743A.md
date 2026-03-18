# SLICE-UXPLYR-743A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch22.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch22.json`
- Task: `SLICE-UXPLYR-743A`
- Title: `Player/profile lane closeout + regression pack`

## Scope

Close lane C with focused regression locks for seam-state ownership, mode-state ownership, and collection/eject behavior.

## Outcome

- Confirmed the current Batch22 player/profile implementation satisfies the locked route, player, and expanded-profile contracts.
- Added an explicit regression assertion proving `/plot` wires the eject handler into `RadiyoPlayerPanel`.
- Replayed the full closeout verification chain covering both player/profile regression suites.

## Drift Guard Confirmation

- Seam-state ownership remains on `/plot`.
- Player mode-state ownership remains on `/plot`.
- Collection entry/eject behavior remains selection-driven and eject-only.
- No new founder decisions are required for lane C closeout.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tier-guard.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
