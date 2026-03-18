# SLICE-UXPLYR-712A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch21.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch21.json`
- Task: `SLICE-UXPLYR-712A`
- Title: `Expanded profile composition parity pass`

## Scope

Align expanded profile header/workspace composition and section ordering to the locked profile surface spec.

## Outcome

- Confirmed the existing expanded-profile header and workspace composition already satisfy the Batch21 lock.
- Added a focused regression assertion proving the Events section explicitly keeps the calendar in the header.
- Preserved the locked section order and the existing `Activity Score` plus `Calendar` header placement.

## Drift Guard Confirmation

- Expanded-profile sections remain in the locked order.
- The calendar remains in the expanded header, not the Events section body.
- No new profile surfaces or founder decisions were introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
