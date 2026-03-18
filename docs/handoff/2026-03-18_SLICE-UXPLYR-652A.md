# SLICE-UXPLYR-652A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch19.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch19.json`
- Task: `SLICE-UXPLYR-652A`
- Title: `Expanded profile composition parity pass`

## Scope

Align expanded profile header/workspace composition and section ordering to the locked profile surface spec.

## Outcome

- Confirmed the current `/plot` expanded-profile surface already matches the locked section order and header composition.
- Added explicit regression assertions for `Events`, `Photos`, `Merch`, `Saved Uprises`, `Saved Promos/Coupons`, `Activity Score`, and `Calendar`.
- Added a negative assertion to prevent drift back to legacy collection-shelf naming.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
