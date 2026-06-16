# Onboarding Fallback Voting Anchor

Date: 2026-06-16
Branch: `feat/upr-10-onboarding-fallback`
Issue: `UPR-10`
Status: implementation slice

## Summary

Aligned server-side Home Scene resolution with the active onboarding spec and founder clarification:

- exact active city-tier Home Scene remains the user's active Home Scene and voting anchor
- inactive or missing submitted Home Scene preserves pioneer intent as submitted `city + state + musicCommunity`
- inactive or missing submitted Home Scene resolves the nearest active city-tier scene for the selected parent music community
- resolved active scene is stored in `User.tunedSceneId` as the active listening/voting anchor
- server no longer creates inactive `Community` rows from onboarding fallback
- fallback users can vote in the resolved active scene after GPS verification

## Voting Rule

GPS remains required for voting only. Listening and participation do not require GPS.

When the submitted Home Scene is available, GPS/voting applies to that exact scene.

When the submitted Home Scene is not available, GPS/voting applies to the resolved nearest active city-tier scene, while the submitted tuple remains pioneer intent for future activation/follow-up.

## Files Changed

- `apps/api/src/onboarding/onboarding.service.ts`
- `apps/api/src/fair-play/fair-play.service.ts`
- `apps/api/test/onboarding.home-scene-resolution.test.ts`
- `apps/api/test/fair-play.vote.test.ts`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/CHANGELOG.md`

## Verification

Targeted verification should include:

```bash
pnpm --filter api test -- onboarding.home-scene-resolution.test.ts fair-play.vote.test.ts --runInBand
pnpm --filter api typecheck
pnpm run docs:lint
pnpm exec prettier --check docs/specs/users/onboarding-home-scene-resolution.md docs/agent-briefs/ONBOARDING_HOME_SCENE.md docs/handoff/2026-06-16_onboarding-fallback-voting-anchor.md
```

## Notes

This slice does not run the launch-community seed against Neon. That remains tracked separately under `UPR-11` and requires explicit database target confirmation.
