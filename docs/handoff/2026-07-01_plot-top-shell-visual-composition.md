# Plot Top Shell Visual Composition

Date: 2026-07-01
Branch: `feat/plot-top-shell-visual-composition`
Base: `main` at `3e07c0e`
Mode: scoped implementation

## Summary

Tightened the non-expanded `/plot` top shell so listener identity, the Home Scene selector, and the top RADIYO player read as one intentional Home Scene cockpit.

This is presentation-only. It does not change Home Scene selector behavior, Discover tuning, player mode behavior, profile pull-down behavior, tabs, API calls, provider state, schema, or art assets.

## Files Changed

- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`
- `docs/operations/ACTIVE_PM.md`
- `docs/superpowers/plans/2026-07-01-plot-top-shell-visual-composition.md`

## Runtime Behavior Preserved

- Home Scene selector remains the active Home Scene shortcut for registered/resolvable music-community preferences in the current city.
- Selector movement still uses existing left/right controls and horizontal swipe.
- Selector still tunes through the existing Discover scene-context path; this does not make Plot a transport surface.
- RADIYO player still uses existing tier/player controls and `profile-bottom` placement when the listener profile is expanded.
- Expanded profile still replaces Plot tabs/body and keeps source tools out of non-expanded Plot.
- Feed, Events, and Archive remain the only current Plot tabs.

## Regression Lock Added

`apps/web/__tests__/plot-ux-regression-lock.test.ts` now asserts:

- `/plot` contains `data-slot="plot-top-shell"`.
- The top shell includes the identity layer, Home Scene selector, and player.
- The top shell does not expose transport/map/seek UI.
- Existing profile/player placement stays intact.

## Validation

Initial focused validation passed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
```

Full slice validation to run before PR closeout:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

## Notes For Future Agents

Do not port `ux-implementation` or `ux-mobile-r1-build` wholesale. They remain preserved prototype references and contain stale or broad behavior that current owner specs do not authorize.

Use this slice as a narrow extraction pattern: copy compatible composition ideas only after checking active specs and regression locks.
