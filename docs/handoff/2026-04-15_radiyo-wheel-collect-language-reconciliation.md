# 2026-04-15 — RADIYO Wheel Collect Language Reconciliation

## Summary
Reconciled the visible RADIYO engagement-wheel copy from `Add` to `Collect` so the player-facing language matches the current public action matrix and signal contract while keeping `Upvote` intact for propagation/tier advancement.

## What Changed
- `apps/web/src/components/plot/engagement-wheel.ts`
  - changed the RADIYO wheel save action label from `Add` to `Collect`
  - updated the engagement-wheel action union accordingly
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
  - updated the deterministic wheel lock to expect `Collect`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
  - clarified that public-facing wheel/save language should use `Collect`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
  - reconciled active surface/spec authority to `Collect`

## Result
Visible player/discover wheel copy now matches the current public save verb while preserving the separate `Upvote` broadcast-propagation grammar.

## Verification
- `pnpm --filter web test -- plot-ux-regression-lock`
- `pnpm run docs:lint`
- `git diff --check`
