# SLICE-UXPLYR-828A

- Date: `2026-03-19`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch25.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch25.json`
- Task: `SLICE-UXPLYR-828A`
- Title: `RADIYO compact shell proportion lock`

## Scope

Tighten compact `RADIYO` shell proportions while preserving the existing control map and avoiding behavior expansion.

## Outcome

- Reduced shell and track-row density again to keep the collapsed player strip tighter against the locked mobile footprint.
- Kept the same labels, controls, and tier stack behavior.

## Drift Guard Confirmation

- `RADIYO` vs `Collection` mode behavior remains unchanged.
- No dedicated mode-switch control was introduced.
- Tier stack remains `RADIYO`-only and still exposes the same three tiers.
- No new founder decisions are required for this slice.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
