# Home Scene Roller Plot Consumption

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity - Plot/Home roller consumption

## Summary

Wired the authenticated Home Scene roller read model into `/plot`.

The Plot shell now loads `GET /users/me/home-scene-roller`, renders the Home Scene Roller below the Home identity layer, and lets the listener select among registered music-community preferences that resolve in the current/default city. Selecting a roller item calls the existing Discover scene-context mutation (`POST /discover/tune` through `tuneDiscoverScene`), updates the selected Plot community anchor, and returns the player to RADIYO mode.

Saved Away Scenes remain profile/collection interests and are not treated as roller entries.

## Runtime Added

- `/plot` imports and uses `getHomeSceneRoller` plus `HomeSceneRoller` / `HomeSceneRollerItem` types from `apps/web/src/lib/users/client.ts`.
- `/plot` imports and uses `tuneDiscoverScene` from `apps/web/src/lib/discovery/client.ts`.
- Added local roller state: current location, items, loading state, error state, and selecting scene id.
- Added `handleHomeSceneRollerSelect(item)`:
  - fetches the selected community by `sceneId`;
  - persists tuned scene context with `tuneDiscoverScene(item.sceneId, token)`;
  - updates onboarding discovery context with the tune response;
  - updates the selected Plot community anchor;
  - clears SPACE collection playback and returns to RADIYO;
  - marks the selected roller item as current locally.
- Added visible `data-slot="home-scene-roller"` UI under the Home identity layer.

## Guardrails Preserved

- The roller is sourced only from `homeSceneRoller.items` returned by the authenticated read model.
- Unresolved preferences remain outside the roller; profile-visible unresolved/profile-only labels were completed in `docs/handoff/2026-06-25_unresolved-preference-profile-visibility.md`.
- Saved Away Scenes are not pulled into the roller.
- No new API route, schema migration, provider call, or DB command was added.
- No source-dashboard, registrar, or Artist Profile behavior was changed.

## Tests

RED:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
```

Failed as expected because `/plot` did not yet contain `getHomeSceneRoller(token)`.

GREEN:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
pnpm --filter web typecheck
```

Both passed before documentation updates.

## Files Changed

- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/handoff/2026-06-25_home-scene-roller-read-model.md`
- `docs/handoff/2026-06-25_music-community-preference-voting-scope.md`
- `docs/handoff/2026-06-25_music-community-preference-profile-ui.md`
- `docs/handoff/2026-06-25_music-community-preference-runtime-foundation.md`
- `docs/handoff/2026-06-25_home-scene-roller-plot-consumption.md`
- `docs/CHANGELOG.md`

## Remaining Work

1. Plan compatibility-field cleanup once the preference/default/roller model fully owns runtime behavior.
