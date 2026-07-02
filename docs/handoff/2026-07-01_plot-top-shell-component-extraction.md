# Plot Top Shell Component Extraction

Date: 2026-07-01
Branch: `refactor/plot-top-shell-component`
Base: `main` at `a7918c2`
Mode: scoped implementation / refactor

## Summary

Extracted the non-expanded `/plot` top shell into `PlotTopShell` so listener identity, the Home Scene selector, and the top RADIYO player live behind a focused component boundary.

This is a presentation/refactor-only slice. It does not change Home Scene selector loading/tuning, Discover scene-context behavior, RADIYO/SPACE player behavior, profile pull-down behavior, Plot tabs, API calls, provider state, schema, database state, or art assets.

## Files Changed

- `apps/web/src/components/plot/PlotTopShell.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`
- `docs/operations/ACTIVE_PM.md`

## Runtime Behavior Preserved

- `/plot/page.tsx` still owns Home Scene selector loading, selector tuning, selected community state, player state, profile panel state, notification panel state, and all API calls.
- `PlotTopShell` only renders the existing top-shell composition and delegates callbacks back to `/plot/page.tsx`.
- Home Scene selector remains the active Home Scene shortcut for registered/resolvable music-community preferences in the current city.
- The top RADIYO player still hides from the top shell when the expanded listener profile is open and still renders in `profile-bottom` placement inside `PlotListenerProfile`.
- Proxy-scene notice discoverability remains on the existing notification icon.
- No transport, map, seek, Discover, source-dashboard, Print Shop, or Registrar behavior was added to the non-expanded Plot top shell.

## Regression Lock Updated

`apps/web/__tests__/plot-ux-regression-lock.test.ts` now asserts:

- `/plot/page.tsx` imports and renders `PlotTopShell`.
- `PlotTopShell` owns the `plot-top-shell`, `home-identity-layer`, listener avatar, recommendation bubble, Home Scene selector, and top-shell selector/player slots.
- `/plot/page.tsx` still owns selector loading/tuning, profile panel state, player state, and notification state.
- Top-shell transport/map/seek UI remains absent.

## Validation

Passed:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand
pnpm --filter web typecheck
```

To run before PR closeout:

```bash
pnpm run docs:lint
git diff --check
pnpm run verify
```

## Notes For Future Agents

Use this as the pattern for continuing `/plot` cleanup: extract a clearly named presentational region only after behavior is already locked by tests, leave route-owned state/API behavior in the route unless the owner spec explicitly authorizes a behavior change, and keep Discover/transport outside Plot.
