# SLICE-UXPLYR-679A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch20.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch20.json`
- Task: `SLICE-UXPLYR-679A`
- Title: `Tier-label deterministic title parity`

## Scope

Lock `City/State/National` title rendering parity in the player header while preserving parent community anchor semantics.

## Outcome

- Confirmed the current tier-title helper already satisfies the Batch20 player-header parity contract.
- Added focused regression coverage proving selected-anchor community data wins over conflicting home-scene fallback data.
- Preserved the existing fallback path for missing city/state/community fields.

## Drift Guard Confirmation

- Tier titles remain deterministic across `city`, `state`, and `national`.
- Parent community anchor semantics remain unchanged.
- No new controls, labels, or founder decisions were introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-tier-guard.test.ts plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
