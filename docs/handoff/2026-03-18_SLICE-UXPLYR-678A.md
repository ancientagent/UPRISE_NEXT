# SLICE-UXPLYR-678A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch20.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch20.json`
- Task: `SLICE-UXPLYR-678A`
- Title: `RADIYO compact shell proportion lock`

## Scope

Tighten compact `RADIYO` shell proportions while preserving the existing control map and avoiding behavior expansion.

## Outcome

- Reduced compact-shell outer padding and shell radius to better match the locked mobile player footprint.
- Tightened the track row, thumbnail chip, transport pills, and live badge spacing without changing any player controls or labels.
- Narrowed the right-side tier stack while preserving the exact `city/state/national` control set and current interaction model.

## Drift Guard Confirmation

- `RADIYO` vs `Collection` mode contract remains unchanged.
- No dedicated mode-switch control was introduced.
- Tier stack remains visible only in `RADIYO` mode and still exposes the same three tiers.
- No new founder decisions are required for this slice.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
