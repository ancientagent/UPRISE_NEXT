# Plot Statistics Handmade Map Pass

## Scope
Deepen the Plot Statistics visual language so the map and metric area feel as handmade as the rest of the Plot zine shell.

This pass is still visual-only. It does not change statistics fetch behavior, scene-map anchor rules, or Plot routing.

## Files
- `apps/web/src/components/plot/SceneMap.tsx`
- `apps/web/src/components/plot/StatisticsPanel.tsx`
- `apps/web/__tests__/plot-tab-contracts.test.ts`

## What Changed
- Restyled `SceneMap` to use:
  - paper/ledger card treatment
  - dashed notebook/grid overlay
  - subtle red crosshatch texture
  - red-pen / highlighter selected marker state
  - embossed point-count label
- Extended Statistics cards with simple handmade cue bars and annotation labels.
- Added in-panel annotation cues for scene pin selection and macro rollup context.
- Kept all statistics and scene-map logic unchanged.

## Verification
- `pnpm --filter web test -- --runInBand __tests__/plot-tab-contracts.test.ts`
- `pnpm --filter web typecheck`
- Playwright CLI live check on `/plot` -> `Statistics`
- `pnpm run docs:lint`

## Residual Notes
- A later pass can replace the remaining plain metric rows with more explicit hand-drawn chart structures if needed.
- This slice only affects the Plot statistics/map presentation.
