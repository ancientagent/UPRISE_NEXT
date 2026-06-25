# Music-Community Preference Compatibility Cleanup Plan

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity - compatibility cleanup plan

## Summary

Added a phased compatibility cleanup plan to the onboarding/Home Scene owner spec.

This is a docs/strategy slice only. No schema fields were removed and no runtime code was changed.

The scan before writing the plan showed that the legacy single-preference fields still have mixed responsibilities:

- `User.homeSceneCity` and `User.homeSceneState` still carry active submitted/default city authority for GPS verification, source registration locality, activation cutover, and scene resolution.
- `User.tunedSceneId` and `User.tunedSceneUpdatedAt` still carry active resolved scene context for exact Home Scenes, proxy scenes, Away Scene tuning, and Plot/Home anchoring.
- `User.homeSceneCommunity` is the main compatibility shadow of the default `UserMusicCommunityPreference.isDefault` row.
- `User.homeSceneTag` and internal `pioneer`/`pioneerHomeScene`/`pioneerFollowUp` names are cleanup candidates, but they must not be removed casually from old compatibility paths.

## Plan Added

The owner spec now defines a five-step cleanup path:

1. Invert read paths to prefer a shared default-preference resolver while retaining `User.homeSceneCommunity` fallback.
2. Make onboarding/default-preference writes update the preference/default model first and `homeSceneCommunity` only as a compatibility shadow.
3. Switch shared web/API contracts and tests so new behavior no longer requires `homeSceneCommunity`, while city/state and tuned scene fields remain active.
4. Run staging data verification proving default preference rows exist and resolve correctly.
5. Add schema cleanup only as a dedicated migration/removal slice after the preceding gates pass.

## Guardrails

- Do not delete `homeSceneCity`, `homeSceneState`, `tunedSceneId`, or `tunedSceneUpdatedAt` as part of preference cleanup.
- Do not bundle schema cleanup with feature work.
- Do not remove `homeSceneCommunity` until read paths prefer the default preference model and staging data verification passes.
- Do not build new product language around `pioneer`; user-facing language remains submitted Home Scene, proxy scene, natural Home Scene, and Away Scene.

## Files Changed

- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/handoff/2026-06-25_music-community-preference-compatibility-cleanup-plan.md`
- `docs/CHANGELOG.md`

## Validation

```bash
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Work

1. Implement the compatibility cleanup plan in a future runtime slice.
2. Add migration only after read-path inversion, contract switch, and staging data verification pass.
