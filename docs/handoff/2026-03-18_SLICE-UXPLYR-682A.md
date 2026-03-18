# SLICE-UXPLYR-682A

- Date: `2026-03-18`
- Lane: `C`
- Queue: `.reliant/queue/mvp-lane-c-ux-player-profile-batch20.json`
- Runtime: `.reliant/runtime/current-task-lane-c-ux-batch20.json`
- Task: `SLICE-UXPLYR-682A`
- Title: `Expanded profile composition parity pass`

## Scope

Align expanded profile header/workspace composition and section ordering to the locked profile surface spec.

## Outcome

- Confirmed the existing expanded-profile header and workspace composition already satisfy the Batch20 lock.
- Added an exact-order assertion for the `expandedProfileSections` array so the section sequence itself cannot drift.
- Preserved the existing header `Activity Score` and `Calendar` placement contract.

## Drift Guard Confirmation

- Expanded-profile sections remain ordered as `Singles/Playlists`, `Events`, `Photos`, `Merch`, `Saved Uprises`, `Saved Promos/Coupons`.
- The calendar remains in the expanded header, not the Events section body.
- No new profile surfaces or founder decisions were introduced.

## Verification

```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web test -- plot-ux-regression-lock.test.ts && pnpm --filter web typecheck && pnpm --filter api typecheck
```
