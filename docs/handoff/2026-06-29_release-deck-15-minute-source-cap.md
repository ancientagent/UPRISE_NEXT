# Release Deck 15-Minute Source Cap

Date: 2026-06-29
Branch: fix/release-deck-15-minute-source-cap
Clarification type: founder decision / runtime threshold change

## Decision

The maximum amount of active playable music that a single Artist/Band source may occupy in any one Uprise rotation is now `15` minutes (`900` seconds), replacing the previous `20` minute (`1200` second) cap.

This applies to both:

- Release Deck ready-track eligibility for a managed Artist/Band source in one city-tier community.
- Activation readiness accounting when capping each source's contribution toward the `45` minute / `5` distinct source community activation threshold.

## Scope

Changed current owner contracts, lane summaries, and runtime constants/tests from `20` minutes / `1200` seconds to `15` minutes / `900` seconds.

Historical handoffs that describe the prior `20` minute rule were not rewritten; this handoff supersedes them for current work.

## Files Updated

- `apps/api/src/tracks/tracks.service.ts`
- `apps/api/src/admin-analytics/admin-analytics.service.ts`
- `apps/api/test/tracks.engagement.service.test.ts`
- `apps/api/test/admin-analytics.service.test.ts`
- `apps/api/test/admin-analytics.controller.test.ts`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/system/registrar.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/specs/system/documentation-framework.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`

## Notes

- The `3` active music-slot cap remains unchanged.
- The `45` minute / `5` distinct source activation threshold remains unchanged.
- This does not set an explicit per-song length cap. The owner spec still leaves per-song length and replacement UX as follow-up decisions.
- This does not change historical vote/song lifecycle behavior for proxy-to-natural cutover.

## Validation Plan

```bash
pnpm --filter api test -- tracks.engagement.service.test.ts admin-analytics.service.test.ts admin-analytics.controller.test.ts --runInBand
pnpm --filter api typecheck
pnpm run docs:lint
git diff --check
pnpm run verify
```
