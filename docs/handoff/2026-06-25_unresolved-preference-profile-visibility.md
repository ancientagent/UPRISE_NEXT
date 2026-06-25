# Unresolved Preference Profile Visibility

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity - unresolved/profile-only labels

## Summary

Added visible resolution labels to the `/plot` expanded listener profile music-community preference list.

The profile now compares the user's saved music-community preferences against `homeSceneRoller.items` and labels each preference as either:

- `In Home Scene Roller` when the preference resolves to an active natural/proxy scene in the current/default city; or
- `Profile-only until active scene` when the preference remains saved in the profile but does not currently resolve into the Home Scene Roller.

This completes the unresolved-profile visibility portion of the Music-Community Preference Contract without adding a new API route. The Home Scene Roller remains sourced only from the authenticated roller read model, so unresolved preferences stay out of the roller while remaining visible in the listener profile.

## Runtime Added

- `/plot` derives `resolvedRollerMusicCommunities` from `homeSceneRoller.items`.
- The expanded listener profile preference list labels each saved preference using that derived roller-resolution set.
- No preference is removed from the profile just because it is unresolved.
- No unresolved preference is added to the Home Scene Roller.

## Guardrails Preserved

- No schema migration, API route, provider call, DB command, or source-dashboard behavior was added.
- The roller remains limited to `homeSceneRoller.items` from `GET /users/me/home-scene-roller`.
- Saved Away Scenes remain profile/collection interests, not Home Scene roller entries.

## Tests

RED:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
```

Failed as expected because `/plot` did not yet derive `resolvedRollerMusicCommunities` or render the profile-only label.

GREEN:

```bash
pnpm --filter web test -- plot-ux-regression-lock.test.ts --runInBand
```

Passed after adding the derived set and labels.

## Files Changed

- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/handoff/2026-06-25_home-scene-roller-read-model.md`
- `docs/handoff/2026-06-25_home-scene-roller-plot-consumption.md`
- `docs/handoff/2026-06-25_music-community-preference-profile-ui.md`
- `docs/handoff/2026-06-25_music-community-preference-runtime-foundation.md`
- `docs/handoff/2026-06-25_music-community-preference-voting-scope.md`
- `docs/handoff/2026-06-25_unresolved-preference-profile-visibility.md`
- `docs/CHANGELOG.md`

## Remaining Work

1. Implement the compatibility cleanup plan in `docs/handoff/2026-06-25_music-community-preference-compatibility-cleanup-plan.md` after read-path inversion, contract switch, and staging data verification.
