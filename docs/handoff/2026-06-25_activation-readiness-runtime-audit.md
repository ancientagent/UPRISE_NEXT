# Activation Readiness Runtime Audit

**Date:** 2026-06-25
**Branch:** `audit/activation-readiness-runtime`
**Base:** rebased onto `main` after preference-resolver runtime adoption (`f6fd58d` at rebase time)
**Mode:** docs/runtime audit; no runtime edits

## Summary

Activation readiness is already implemented as an authenticated admin primitive in the API. The current runtime matches the core owner-contract rules:

- readiness is source/music-driven, not listener-demand-driven;
- candidate identity is `city + state + music community`;
- accounting reads `ArtistBand.sourceOriginCity`, `sourceOriginState`, and `sourceOriginMusicCommunity`;
- only `ready` tracks with an `artistBandId` count;
- each source is capped at `20` playable minutes;
- activation requires at least `45` capped playable minutes from at least `5` distinct registered source accounts;
- already-active city-tier communities are excluded from readiness candidates;
- manual activation creates a missing natural city-tier `Community` or activates an inactive matching row;
- activation re-anchors matching `ArtistBand.homeSceneId` values for future uploads;
- activation re-roots matching listener `User.tunedSceneId` values for Home/Plot resolution using city/state plus either the compatibility `User.homeSceneCommunity` field or the explicit default `UserMusicCommunityPreference`;
- activation does not move existing tracks, copy votes, or transfer historical engagement.

No code change was needed in this slice.

## Evidence Checked

Owner specs:

- `docs/specs/system/registrar.md`
  - Source Origin Contract
  - City-Tier Activation Authority
  - Implemented Now activation diagnostics/manual trigger bullets
- `docs/specs/communities/scenes-uprises-sects.md`
  - City-Tier Activation Workflow
  - Activation Candidate
  - Readiness Criteria
  - Activation Trigger And Side Effects
  - Source And Listener Re-Resolution

Runtime:

- `apps/api/src/admin-analytics/admin-analytics.controller.ts`
  - `GET /admin/analytics/activation-readiness`
  - `POST /admin/analytics/activation-readiness/activate`
  - controller is guarded by `JwtAuthGuard`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
  - `REQUIRED_PLAYABLE_SECONDS = 45 * 60`
  - `MAX_PLAYABLE_SECONDS_PER_SOURCE = 20 * 60`
  - `REQUIRED_DISTINCT_SOURCES = 5`
  - `getActivationReadinessDiagnostics`
  - `activateReadyCommunity`

Tests:

- `apps/api/test/admin-analytics.service.test.ts`
  - source-origin readiness diagnostics;
  - exclusion of non-ready/missing-origin tracks;
  - creation of missing natural scene;
  - activation of existing inactive natural scene;
  - threshold rejection;
  - tuple-field validation.
- `apps/api/test/admin-analytics.controller.test.ts`
  - controller delegation for diagnostics and activation trigger.

## Findings

### Confirmed Current

1. **Source-origin read model is implemented.**
   Diagnostics group tracks by the source origin persisted on `ArtistBand`, not by the proxy `homeSceneId`.

2. **Locked thresholds are implemented.**
   Runtime uses 45 minutes, 5 distinct sources, and the 20-minute per-source cap. The tests assert the returned threshold values and ready/not-ready behavior.

3. **Listener demand does not activate communities.**
   The diagnostics path only reads approved playable source-backed tracks. Listener onboarding counts, missing-community requests, and follower counts are not part of readiness.

4. **Manual activation has the expected side effects.**
   The trigger creates or activates the natural city-tier scene, reanchors matching source accounts, and updates matching listener `tunedSceneId` values.

5. **Historical proxy data is not moved.**
   Tests assert `track.updateMany` is not called during activation. The implementation does not move tracks, votes, or engagement history.

### Remaining Gaps

1. **Admin RBAC is deferred.**
   The controller is protected by `JwtAuthGuard`, but there is no role/permission guard yet. The current owner spec already says "authenticated/admin-facing with RBAC deferred." This is an implementation hardening gap, not a contradiction.

2. **Activation is manual only.**
   There is no scheduler/evaluator job. This is allowed by current MVP runtime, but automation remains deferred.

3. **Notifications are not implemented.**
   Activation does not notify affected listeners or sources when a natural Home Scene becomes active.

4. **Saved Away Scene/profile preservation is not implemented.**
   Activation re-roots `tunedSceneId`, but it does not persist the prior proxy scene as a saved Away Scene or profile-visible prior context.

5. **Cutover still keeps compatibility tuple fallback.**
   `activateReadyCommunity` now matches listeners through `User.homeSceneCity`, `homeSceneState`, and either compatibility `homeSceneCommunity` or explicit default `UserMusicCommunityPreference`. This is the intended staged migration shape; follow-up cleanup should keep auditing remaining profile/read paths before any schema cleanup demotes or removes `User.homeSceneCommunity`.

6. **No staging/live DB smoke was run here.**
   This audit only inspected code/tests/docs. Live activation must not be tried against staging/production without explicit target confirmation.

## Recommended Follow-Up

1. Add RBAC/admin capability guard before exposing activation trigger beyond trusted staging/operator use.
2. Add a staging-safe read-only smoke for `GET /admin/analytics/activation-readiness`.
3. Add a dry-run activation preview before any non-local activation write path is used operationally.
4. Add notification and saved Away Scene behavior only after owner specs define exact UX/API contracts.
5. Keep activation cutover in the preference-model audit list until staging data proves default preference rows cover the compatibility `homeSceneCommunity` population and remaining profile/read paths are inverted.

## Validation

```bash
pnpm --filter api test -- admin-analytics.service.test.ts admin-analytics.controller.test.ts --runInBand
pnpm run docs:lint
git diff --check
```

Results:

- `admin-analytics.service.test.ts` and `admin-analytics.controller.test.ts`: passed, 2 suites / 9 tests.
- `docs:lint`: passed, including canon lint.
- `git diff --check`: passed.

## Files Changed

- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_activation-readiness-runtime-audit.md`
