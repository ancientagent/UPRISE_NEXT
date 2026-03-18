# SLICE-UXPLYR-680A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch20.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch20.json`
- Task: `SLICE-UXPLYR-680A`
- Title: `Collection entry/eject ownership pass`

## Scope

Enforce collection-mode entry by collection selection and eject-only return to `RADIYO` without direct mode-switch controls.

## Outcome

- Confirmed `/plot` continues to own collection entry and eject return through selection/eject handlers.
- Added focused regression coverage for the collection-only helper copy that keeps the mode entry path explicitly selection-driven.
- Preserved the no-direct-mode-switch contract and the existing `Back to RADIYO` eject path.

## Drift Guard Confirmation

- Collection mode still enters only from a collection selection path.
- Return to `RADIYO` remains eject-only.
- No new mode-toggle control or founder decision was introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
