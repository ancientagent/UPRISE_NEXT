# SLICE-UXPLYR-832A

- Date: `2026-03-19`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch25.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch25.json`
- Task: `SLICE-UXPLYR-832A`
- Title: `Expanded profile composition parity pass`

## Scope

Align expanded profile header/workspace composition and section ordering to the locked profile surface spec.

## Outcome

- Confirmed the existing expanded-profile header and workspace composition already satisfy the Batch25 lock.
- Added a focused regression assertion proving the Saved Promos/Coupons body copy stays on the locked MVP wording.
- Preserved the locked section order and the existing header placement rules.

## Drift Guard Confirmation

- Expanded-profile sections remain in the locked order.
- The calendar remains in the expanded header, not the Events section body.
- No new profile surfaces or founder decisions were introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
