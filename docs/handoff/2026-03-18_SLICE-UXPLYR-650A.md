# SLICE-UXPLYR-650A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch19.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch19.json`
- Task: `SLICE-UXPLYR-650A`
- Title: `Collection entry/eject ownership pass`

## Scope

Enforce collection-mode entry by collection selection and eject-only return to `RADIYO` without direct mode-switch controls.

## Outcome

- Confirmed `/plot` still owns collection-mode entry and eject-only return state transitions.
- Added a focused regression assertion for the explicit `aria-label="Back to RADIYO"` eject control.
- Preserved the no-direct-mode-switch contract.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
