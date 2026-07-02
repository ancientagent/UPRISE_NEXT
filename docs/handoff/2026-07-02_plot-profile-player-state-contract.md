# Plot Profile Player State Contract

Date: 2026-07-02
Branch: `test/plot-profile-player-state-contract`
PR: #185
Base: `main` @ `9285b25`
Mode: focused web test + execution-state refresh

## Purpose

Add a current-compatible Plot profile/player state contract test inspired by the preserved `ux-implementation` state-machine reference without importing old prototype runtime, old naming, or stale tier assumptions.

## Scope

Changed:

- Added `apps/web/__tests__/plot-profile-player-state-contract.test.ts`.
- Refreshed `docs/operations/ACTIVE_PM.md` for this active branch.
- Marked PR #184 as merged in `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` and registered this branch.
- Added this handoff and changelog entry.

Not changed:

- No runtime code.
- No provider, database, schema, or art state.
- No old prototype component/store/state-machine import.
- No transport UI inside Plot.

## Contract Covered

The new test locks these current rules:

- `/plot` owns profile panel state and player mode state.
- `PlotTopShell`, `PlotListenerProfile`, and `RadiyoPlayerPanel` stay controlled by route-owned state.
- Expanded profile moves the same player panel to profile-bottom placement and hides the top-shell player.
- `SPACE` starts only from collection selection and returns to `RADIYO` through eject / Home Scene selector / tier changes.
- MVP player tier buttons remain `state` and `city`; `national` is coerced to `state` when encountered in route state.
- Plot player/profile state stays separate from Discover transport, map/seek, Discovery Pass, `Statistics`, and `Promotions` surfaces.
- Old prototype `collection` mode and `plot-ui-state-machine` imports stay out of current runtime.

## Validation

```bash
pnpm --filter web test -- plot-profile-player-state-contract.test.ts plot-ux-regression-lock.test.ts
pnpm run workspace:audit
pnpm run docs:lint
git diff --check
```

Results:

- `pnpm --filter web test -- plot-profile-player-state-contract.test.ts plot-ux-regression-lock.test.ts` - passed; 2 suites, 35 tests.
- `pnpm run workspace:audit` - passed; 10 registry entries cover local branches, worktrees, and open PR heads.
- `pnpm run docs:lint` - passed, including `canon:lint`.
- `git diff --check` - passed.

## Next Signal

After this branch merges, continue with small Plot structural cleanup only if a specific region is named and behavior is already locked by tests. Do not merge preserved UX prototype branches wholesale.
