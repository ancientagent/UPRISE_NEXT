# SLICE-UXPLYR-860A

- Date: `2026-03-19`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch26.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch26.json`
- Task: `SLICE-UXPLYR-860A`
- Title: `Collection entry/eject ownership pass`

## Scope

Enforce collection-mode entry by collection selection and eject-only return to `RADIYO` without direct mode-switch controls.

## Outcome

- Confirmed `/plot` continues to own collection entry and eject return through selection/eject handlers.
- Added focused regression coverage asserting selection still stores the chosen collection item before entering `Collection` mode.
- Preserved the no-direct-mode-switch contract and the existing eject/shuffle strip behavior.

## Drift Guard Confirmation

- Collection mode still enters only from a collection selection path.
- Return to `RADIYO` remains eject-only.
- Collection strip controls remain limited to the locked eject/shuffle contract.
- No new founder decisions were introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
