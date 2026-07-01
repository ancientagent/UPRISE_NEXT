# Home Scene Selector Component Extraction

Date: 2026-07-01
Branch: `refactor/plot-home-scene-selector-component`
Commit: branch HEAD / PR #162

## Summary

Extracted the `/plot` Home Scene selector presentation from `apps/web/src/app/plot/page.tsx` into `apps/web/src/components/plot/HomeSceneSelector.tsx`.

This is a behavior-preserving route-shell cleanup. The `/plot` route still owns the authenticated read model, scene tuning, community fetch, selected community state, and Discover scene context updates.

## Product Contract Preserved

- The Home Scene selector is only a shortcut to resolvable primary music-community preferences in the user's current verified/default city.
- The selected item is the active Home Scene context the user is in.
- Saved Away Scenes, former proxy saved contexts, and arbitrary visitor scenes stay in the listener profile/collection workspace and do not appear in the selector.
- The presentation remains a centered active Home Scene with previous/next arrow controls and horizontal swipe between adjacent resolvable preferences.
- Home Scene movement should use `switch`, `select`, `tune`, or active-context language. `Transport` is reserved for Away Scene movement because the user is leaving their Home Scene context; intended transport entry points are Discover and saved Uprises in the user's collection.

## Files Changed

- `apps/web/src/components/plot/HomeSceneSelector.tsx` - new focused presentation component for selector layout, adjacent arrow controls, and swipe handling.
- `apps/web/src/app/plot/page.tsx` - keeps API loading/tuning/state ownership and renders the extracted selector component.
- `apps/web/__tests__/plot-ux-regression-lock.test.ts` - updates static regression locks so route ownership and component presentation are checked separately.
- `docs/specs/users/onboarding-home-scene-resolution.md` - clarifies switch/select/tune versus transport terminology.
- `docs/specs/communities/discovery-scene-switching.md` - records Discover and saved Uprises as transport entry points.
- `docs/agent-briefs/UI_CURRENT.md` - mirrors the Home Scene selector wording for UI agents.
- `docs/CHANGELOG.md` and `docs/handoff/README.md` - record this slice.

## Validation

- `pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand`
- `pnpm --filter web typecheck`
- `pnpm run docs:lint`
- `git diff --check`

## Notes For Future Agents

Do not reintroduce the superseded switching term or visible `Home Scene Selector` labels. Keep this as a compact Home Scene switcher/swiper UI. Profile remains the management surface for preferences and saved Away Scenes.
