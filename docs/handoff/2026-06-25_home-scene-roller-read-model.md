# Home Scene Roller Read Model

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity - Home Scene roller read model

## Summary

Added an authenticated Home Scene roller read model on top of the Music-Community Preference persistence foundation.

The read model resolves the user's registered music-community preferences against their current/default city:

1. exact active natural city-tier scene;
2. same-state active proxy scene for the same music community;
3. any active proxy scene for the same music community.

Preferences with no active scene resolution remain profile-only and are excluded from the roller response.

## Runtime Added

- `UsersService.getHomeSceneRoller(userId)` returns:
  - current/default city and state from the user's Home Scene fields;
  - roller items for registered preferences that resolve to an active natural/proxy scene;
  - `resolution: natural | proxy`;
  - `isCurrent` based on `User.tunedSceneId`.
- `GET /users/me/home-scene-roller` exposes the read model through the authenticated current-user profile boundary.
- `getHomeSceneRoller(token)` typed web wrapper added in `apps/web/src/lib/users/client.ts`.

## Behavior Locked

- Registered preferences with an exact active current-city scene resolve as `natural`.
- Registered preferences without exact active current-city scene resolve as `proxy` when an active same-state or any active scene exists for that music community.
- Registered preferences with no active resolution do not appear in the roller.
- The read model does not mutate `User.tunedSceneId`, `User.homeSceneCommunity`, `CommunityMember`, GPS state, votes, tracks, or source origin.
- The read model does not auto-enroll users into every active music community in their city; it only considers explicit registered preferences.

## Files Changed

- `apps/api/src/users/users.service.ts`
- `apps/api/src/users/users.controller.ts`
- `apps/api/test/users.profile.collection.test.ts`
- `apps/web/src/lib/users/client.ts`
- `apps/web/__tests__/users-client.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_home-scene-roller-read-model.md`

## Validation

Run before commit:

```bash
pnpm --filter api test -- users.profile.collection.test.ts --runInBand
pnpm --filter web test -- users-client.test.ts --runInBand
pnpm --filter api run typecheck
pnpm --filter web typecheck
pnpm run docs:lint
git diff --check
```

## Remaining Work

1. Implement the compatibility cleanup plan in `docs/handoff/2026-06-25_music-community-preference-compatibility-cleanup-plan.md` after read-path inversion, contract switch, and staging data verification.

Update: Home/Plot consumption of this read model was completed in `docs/handoff/2026-06-25_home-scene-roller-plot-consumption.md`.
Update: Profile-visible unresolved preference labels were completed in `docs/handoff/2026-06-25_unresolved-preference-profile-visibility.md`.
