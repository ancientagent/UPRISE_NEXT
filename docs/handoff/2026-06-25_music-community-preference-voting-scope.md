# Music-Community Preference Voting Scope

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Music-Community Preference runtime parity - Fair Play voting scope

## Summary

Extended the Fair Play vote gate so one GPS-verified current/default city grants voting authority across the user's registered music-community preferences when each preference resolves to the target natural city-tier scene or active proxy scene.

This completes the voting-scope portion of the Music-Community Preference Contract without changing profile UI, Plot/Home roller consumption, source registration, activation cutover, or compatibility-field storage. Expanded listener-profile preference management was completed separately in `docs/handoff/2026-06-25_music-community-preference-profile-ui.md`.

## Runtime Added

- `FairPlayService.castVote` now keeps the existing allowed paths:
  - exact GPS-verified Home Scene match;
  - assigned fallback/proxy scene via `User.tunedSceneId`.
- The vote gate now also checks `UserMusicCommunityPreference` for the target scene's music community.
- If the target scene is in the user's current/default city and the music community is registered, voting is allowed.
- If the target scene is outside the user's current/default city, runtime resolves the registered preference using the same active-scene order as the Home Scene roller:
  1. exact active current-city scene;
  2. same-state active proxy scene;
  3. any active proxy scene.
- Voting is allowed only when the target scene is the resolved natural/proxy scene for that registered preference.

## Behavior Locked

- GPS remains required before voting.
- Registered preferences do not authorize every active music community in the city; the preference row must exist.
- Registered preferences do not authorize arbitrary visitor/Away Scene voting.
- A different city scene is rejected when the user's current/default city has an exact active scene for that preference.
- Existing proxy fallback voting through `User.tunedSceneId` remains intact for the primary onboarding assignment path.
- The implementation does not mutate user location, `tunedSceneId`, preferences, community membership, tracks, source origin, or vote history.

## Files Changed

- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/test/fair-play.vote.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/handoff/2026-06-25_music-community-preference-runtime-foundation.md`
- `docs/handoff/2026-06-25_home-scene-roller-read-model.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_music-community-preference-voting-scope.md`

## Validation

Run before commit:

```bash
pnpm --filter api test -- fair-play.vote.test.ts users.profile.collection.test.ts --runInBand
pnpm --filter api run typecheck
pnpm run docs:lint
git diff --check
```

## Remaining Work

1. Implement the compatibility cleanup plan in `docs/handoff/2026-06-25_music-community-preference-compatibility-cleanup-plan.md` after read-path inversion, contract switch, and staging data verification.

Update: Home/Plot roller consumption was completed in `docs/handoff/2026-06-25_home-scene-roller-plot-consumption.md`.
Update: Profile-visible unresolved preference labels were completed in `docs/handoff/2026-06-25_unresolved-preference-profile-visibility.md`.
