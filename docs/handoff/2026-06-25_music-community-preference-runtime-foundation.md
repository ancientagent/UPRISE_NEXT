# Music-Community Preference Runtime Foundation

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity foundation

## Summary

Implemented the first runtime foundation for the Music-Community Preference Contract.

This slice adds profile-held preference persistence, authenticated current-user API endpoints, explicit default/star mutation, migration backfill from existing `User.homeSceneCommunity`, typed web wrappers, and focused API/web tests.

This is not the complete preference/default/roller runtime implementation. Current-city preference resolution and the roller read model were completed in `docs/handoff/2026-06-25_home-scene-roller-read-model.md`; GPS voting scope across resolvable registered preferences was completed in `docs/handoff/2026-06-25_music-community-preference-voting-scope.md`; expanded listener-profile preference management was completed in `docs/handoff/2026-06-25_music-community-preference-profile-ui.md`; Home/Plot roller consumption was completed in `docs/handoff/2026-06-25_home-scene-roller-plot-consumption.md`; unresolved/profile-only preference labels were completed in `docs/handoff/2026-06-25_unresolved-preference-profile-visibility.md`; eventual compatibility-field cleanup remains follow-up work.

## Runtime Added

- New Prisma model: `UserMusicCommunityPreference`.
- New migration: `20260625150000_add_user_music_community_preferences`.
- Migration backfills each existing non-empty `User.homeSceneCommunity` as that user's default music-community preference.
- Unique `{userId, musicCommunity}` prevents duplicate preference rows.
- Partial unique index keeps at most one default preference per user.
- `UsersService.listMusicCommunityPreferences(userId)` lists preferences and seeds the compatibility default from `User.homeSceneCommunity` when no preference rows exist.
- `UsersService.addMusicCommunityPreference(userId, musicCommunity)` adds a registered preference without implicitly stealing default when a default exists.
- `UsersService.setDefaultMusicCommunityPreference(userId, musicCommunity)` explicitly changes the default preference.

## API Added

- `GET /users/me/music-community-preferences`
- `POST /users/me/music-community-preferences`
- `POST /users/me/music-community-preferences/default`

All endpoints are under the existing authenticated `UsersController`.

## Web Added

- `apps/web/src/lib/users/client.ts`
  - `getMusicCommunityPreferences(token)`
  - `addMusicCommunityPreference(musicCommunity, token)`
  - `setDefaultMusicCommunityPreference(musicCommunity, token)`

## Tests Added / Updated

- `apps/api/test/users.profile.collection.test.ts`
  - service test for seeding current `homeSceneCommunity` as default preference;
  - service test for adding a second preference without stealing default;
  - service test for explicit default change;
  - controller tests for the three authenticated current-user endpoints.
- `apps/web/__tests__/users-client.test.ts`
  - typed wrapper coverage for list/add/default endpoints.

## Files Changed

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260625150000_add_user_music_community_preferences/migration.sql`
- `apps/api/src/users/dto/user-profile.dto.ts`
- `apps/api/src/users/users.controller.ts`
- `apps/api/src/users/users.service.ts`
- `apps/api/test/users.profile.collection.test.ts`
- `apps/web/src/lib/users/client.ts`
- `apps/web/__tests__/users-client.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_music-community-preference-runtime-foundation.md`

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

1. Decide and implement cleanup path for compatibility fields after the new preference model fully owns runtime behavior.
