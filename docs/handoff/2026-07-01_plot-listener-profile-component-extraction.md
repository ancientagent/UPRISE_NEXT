# 2026-07-01 Plot Listener Profile Component Extraction

## Branch / Commit

- Branch: `refactor/plot-listener-profile-component`
- Base: `main` after PR #163 (`7a16d6b`)
- Mode: low-risk web structural cleanup

## Summary

Extracted the expanded listener profile presentation from `apps/web/src/app/plot/page.tsx` into `apps/web/src/components/plot/PlotListenerProfile.tsx`.

The `/plot` route still owns:

- profile panel open/peek/expanded state
- API reads for the user profile, music-community preferences, registrar status, Home Scene selector, statistics, and broadcast rotation
- Home Scene selector switching/tuning
- player state and RADIYO/SPACE transitions
- route navigation for Registrar, Print Shop, Source Dashboard, and selected community links

The new component owns only the expanded listener profile body:

- Profile Summary / Activity Score / Calendar / Scene Context
- Home Scene activation notices
- music-community preference display/add/default controls
- expanded profile collection tabs
- saved singles, event artifacts, merch shelves, saved Uprises, and saved Away Scenes
- bottom profile-player strip and Return to Plot Tabs control

## Contract Preserved

- Listener profile remains an in-place `/plot` expansion and is not routed through `/users/[id]`.
- Expanded profile still replaces the Plot tabs/body and restores them when collapsed.
- `RadiyoPlayerPanel` still receives `placement={isProfileExpanded ? 'profile-bottom' : 'top'}`.
- Source/admin tools remain out of the listener profile component.
- Saved Away Scenes and activation notices remain in the expanded listener profile, not in the Home Scene selector.
- No transport UI was added to Plot.
- No backend, API, schema, provider, or art changes were made.

## Files Changed

- `apps/web/src/components/plot/PlotListenerProfile.tsx`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/CHANGELOG.md`
- `docs/handoff/README.md`
- `docs/handoff/2026-07-01_plot-listener-profile-component-extraction.md`

## Validation

- `pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `git diff --check`

## Notes

This is structural cleanup only. It intentionally does not redesign the listener profile, change the Home Scene selector, alter Discover/transport behavior, or promote founder-session Discover notes into owner specs.
