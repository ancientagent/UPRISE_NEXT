# SLICE-UXPLYR-829A

- Date: `2026-03-19`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch25.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch25.json`
- Task: `SLICE-UXPLYR-829A`
- Title: `Tier-label deterministic title parity`

## Scope

Lock `City/State/National` title rendering parity in the player header while preserving parent community anchor semantics.

## Outcome

- Confirmed the current title helper already satisfies the Batch25 tier-label contract.
- Added focused regression coverage proving anchor-name fallback still applies when home-scene only contributes location fields.
- Preserved the existing parent-anchor precedence and normalization behavior.

## Drift Guard Confirmation

- Tier titles remain deterministic across `city`, `state`, and `national`.
- Parent community anchor semantics remain unchanged.
- No new labels, controls, or founder decisions were introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-tier-guard.test.ts plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
