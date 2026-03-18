# SLICE-UXPLYR-710A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch21.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch21.json`
- Task: `SLICE-UXPLYR-710A`
- Title: `Collection entry/eject ownership pass`

## Scope

Enforce collection-mode entry by collection selection and eject-only return to `RADIYO` without direct mode-switch controls.

## Outcome

- Confirmed `/plot` continues to own collection entry and eject return through selection/eject handlers.
- Added focused regression coverage asserting the explicit `Shuffle collection` strip control remains present in collection mode.
- Preserved the no-direct-mode-switch contract and the existing `Back to RADIYO` eject path.

## Drift Guard Confirmation

- Collection mode still enters only from a collection selection path.
- Return to `RADIYO` remains eject-only.
- Collection strip controls remain limited to the locked eject/shuffle contract.
- No new founder decisions were introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
