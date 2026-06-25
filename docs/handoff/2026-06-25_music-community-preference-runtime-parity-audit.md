# Music-Community Preference Runtime Parity Audit

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity audit

## Summary

Audited current runtime against `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract`.

Result: the owner contract is active, but runtime remains a single-preference compatibility implementation. Current API/web/schema paths support one onboarding-selected/default music community and one resolved tuned scene. They do not yet implement profile-held multiple music-community preferences, explicit default/star selection, a Home Scene roller read model, or voting-scope expansion across all resolvable registered preferences.

No runtime code, schema, migration, seed, provider, or DB action was added in this slice.

## Evidence Checked

Owner contract:

- `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/PLATFORM_START_HERE.md`

Runtime/schema:

- `apps/api/prisma/schema.prisma`
- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/src/communities/communities.service.ts`
- `apps/api/src/communities/discovery.controller.ts`
- `apps/api/src/communities/dto/community.dto.ts`
- `apps/web/src/lib/discovery/client.ts`
- `apps/web/src/lib/discovery/context.ts`
- `apps/web/src/store/onboarding.ts`

Tests inspected:

- `apps/api/test/onboarding.home-scene-resolution.test.ts`
- `apps/api/test/communities.discovery.service.test.ts`
- `apps/api/test/communities.discovery.controller.test.ts`
- `apps/web/__tests__/discovery-context.test.ts`
- `apps/web/__tests__/discovery-client.test.ts`

## Confirmed Current Runtime

- `User.homeSceneCommunity` stores the one onboarding-selected/default music community.
- `User.tunedSceneId` stores the current resolved active listening/voting anchor.
- `POST /onboarding/home-scene` persists one `{city, state, musicCommunity}` tuple and one resolved scene anchor.
- `POST /onboarding/gps-verify` evaluates voting eligibility against the user's current submitted tuple and `tunedSceneId` fallback.
- `GET /discover/context` returns a single `tunedSceneId`, single `tunedScene`, optional `homeSceneId`, and `isVisitor`.
- `POST /discover/tune` and `POST /discover/set-home-scene` mutate scene context by `sceneId`; they are not profile preference CRUD.
- `CommunityMember` records user membership in resolved communities, but it does not encode preference ordering, default-star semantics, or city-carried affiliation intent.

## Parity Gaps

The active owner contract requires follow-up runtime work for:

1. Profile-held music-community preference persistence.
2. Add/remove/list preference API and typed web wrappers.
3. Explicit default/starred music-community preference selection.
4. Current verified/default city resolution for each registered preference.
5. Home Scene roller read model that includes only resolvable registered preferences in the current verified/default city.
6. Visibility of unresolved preferences in profile without showing them in the Home Scene roller.
7. GPS voting scope across all registered preferences that resolve in the currently verified city.
8. City-change behavior that carries preferences forward while re-resolving content.
9. Migration/backfill from current single `User.homeSceneCommunity` into the future preference model.

## Files Changed

- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_music-community-preference-runtime-parity-audit.md`

## Validation

Run before commit:

```bash
pnpm run docs:lint
git diff --check
```

## Next Slice

Recommended next implementation slice:

1. Add a dedicated music-community preference persistence model and migration.
2. Backfill each user's current `homeSceneCommunity` as their initial default preference.
3. Add preference CRUD/default-star API with tests.
4. Add current-city resolution and Home Scene roller read model.
5. Extend voting tests so one verified city grants voting across all registered preferences that resolve in that city, but not across multiple cities.
