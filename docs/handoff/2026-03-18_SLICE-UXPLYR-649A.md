# SLICE-UXPLYR-649A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch19.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch19.json`
- Task: `SLICE-UXPLYR-649A`
- Title: `Tier-label deterministic title parity`

## Scope

Lock City/State/National title rendering parity in the compact player header while preserving parent community anchor semantics.

## Outcome

- Confirmed the current `buildRadiyoBroadcastLabel` implementation preserves the parent community anchor across tier switches.
- Added focused regression coverage for state/national home-scene fallback rendering.
- Added focused regression coverage for selected-anchor-name fallback when an explicit community label is absent.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-tier-guard.test.ts plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
