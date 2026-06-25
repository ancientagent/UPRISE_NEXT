# 2026-06-25 Non-City-Tier Vote Guard

## Summary

Locked Fair Play vote creation to city-tier scenes. A GPS-verified user may still listen through `User.tunedSceneId`, but `POST /tracks/:id/vote` now rejects state-tier, national-tier, or other non-city `Community` targets even when the tuned scene matches.

## Why

The preference/proxy voting work expanded vote eligibility across registered music-community preferences that resolve from the user's current/default city. The fallback/proxy path could still accept a non-city target when `User.tunedSceneId === scene.id`. That would let listening context become direct state/national vote authority, which conflicts with current city-tier Home Scene voting rules.

## Files Changed

- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/test/fair-play.vote.test.ts`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/CHANGELOG.md`

## Runtime Behavior

- `castVote` still requires the track to be in the target scene's active rotation.
- `castVote` now rejects any non-city target scene before GPS and Home/proxy preference authorization.
- City-tier exact Home Scene votes remain valid.
- City-tier proxy votes through `User.tunedSceneId` remain valid.
- Registered music-community preference votes remain limited to exact natural city scenes or active city-tier proxy scenes.

## Test Coverage

- Added `rejects voting against non-city tier scenes even when tuned scene matches` to `apps/api/test/fair-play.vote.test.ts`.
- The test sets `gpsVerified=true` and `tunedSceneId` to a state-tier scene, proves the call throws `BadRequestException`, and proves no `trackVote.create` occurs.

## Validation

Passed in this branch:

- `pnpm --filter api test -- fair-play.vote.test.ts --runInBand` - 12 tests passed
- `pnpm --filter api typecheck` - passed
- `pnpm run docs:lint` - passed
- `pnpm run infra-policy-check` - passed
- `git diff --check` - passed

## Boundaries

- No schema changes.
- No provider, DB, seed, migration, or deployment commands.
- No change to state/national tier promotion policy.
- No change to listening context or `POST /discover/tune`.
