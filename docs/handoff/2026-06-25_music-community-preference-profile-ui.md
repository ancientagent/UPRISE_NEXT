# Music-Community Preference Profile UI

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity - listener profile UI

## Summary

Added music-community preference management to the expanded listener profile workspace in `/plot`.

The listener profile now loads the authenticated user's registered music-community preferences, shows the default/starred preference, lets the user add approved parent music communities, and lets the user explicitly mark a different preference as default.

This completes the profile-management UI portion of the Music-Community Preference Contract without changing Home Scene roller selection, Plot/Home scene switching, unresolved-preference display, source tooling, or compatibility-field storage. Home Scene roller selection and Plot/Home scene switching were completed afterward in `docs/handoff/2026-06-25_home-scene-roller-plot-consumption.md`.

## Runtime Added

- `/plot` imports the typed users client wrappers:
  - `getMusicCommunityPreferences(token)`
  - `addMusicCommunityPreference(musicCommunityPreferenceDraft, token)`
  - `setDefaultMusicCommunityPreference(musicCommunity, token)`
- Expanded profile state now tracks:
  - loaded `MusicCommunityPreference[]`;
  - loading/error state;
  - add-preference select draft;
  - save/default mutation state.
- The expanded listener profile renders `data-slot="profile-music-community-preferences"` above collection tabs.
- The add control is selection-only from `MUSIC_COMMUNITIES` and filters out preferences the user already holds.
- Default changes are explicit through `Make default`; adding a preference does not silently steal default state.

## Behavior Locked

- Music-community preference management stays inside the listener profile / collection workspace.
- The UI does not create communities, launch communities, trigger activation, or expose source-dashboard tools.
- The UI uses API endpoints only and does not cross the web-tier boundary.
- Preferences remain profile affiliations. Home Scene roller consumption was completed in `docs/handoff/2026-06-25_home-scene-roller-plot-consumption.md`; unresolved-profile display remains follow-up work.

## Files Changed

- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/handoff/2026-06-25_music-community-preference-runtime-foundation.md`
- `docs/handoff/2026-06-25_music-community-preference-voting-scope.md`
- `docs/handoff/2026-06-25_home-scene-roller-read-model.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_music-community-preference-profile-ui.md`

## Validation

Run before commit:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts users-client.test.ts --runInBand
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

## Remaining Work

1. Display unresolved preferences in profile while keeping them out of the roller.
2. Decide when compatibility fields can be cleaned up after the preference model fully owns runtime behavior.
