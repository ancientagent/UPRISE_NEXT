# Release Deck Eligibility Cap

Date: 2026-06-25
Branch: docs/abacus-fusion-swarm-strategy
Slice: Community activation proxy lifecycle - Release Deck eligibility

## Summary

Created the Release Deck media eligibility owner spec and added API enforcement for the settled MVP source-rotation limits:

- a managed Artist/Band source can have at most `3` ready music slots in one city-tier community;
- a managed Artist/Band source can occupy at most `20` minutes (`1200` seconds) of ready active rotation music in one city-tier community;
- the paid ad attachment is not treated as a fourth music slot;
- enforcement is create-time only against `ready` tracks for the same `artistBandId + communityId`;
- existing tracks, votes, engagement history, and rotation entries are not mutated.

This keeps the current Release Deck MVP URL-only and does not activate upload/storage/transcode/waveform or paid ad-slot runtime.

## Files Changed

- `apps/api/src/tracks/tracks.service.ts`
- `apps/api/test/tracks.engagement.service.test.ts`
- `docs/specs/media/README.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/README.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-25_release-deck-eligibility-cap.md`

## Behavior Locked

- `POST /tracks` still requires a managed Artist/Band source when `artistBandId` is supplied.
- Source-owned tracks still must match the managed source Home Scene when one exists.
- Omitted `status` still defaults to `ready`.
- Ready source-owned tracks now fail if they would create a fourth active music slot for the same source/community.
- Ready source-owned tracks now fail if their duration would push the same source/community above `1200` active ready seconds.
- `processing` and `failed` tracks are not counted as active rotation occupancy.

## TDD Evidence

RED:

```bash
pnpm --filter api test -- tracks.engagement.service.test.ts --runInBand
```

Failed first because `TracksService.createTrack` allowed a source to exceed the 20-minute active rotation cap.

A second RED pass failed because the service had no 3-slot count check for a fourth ready track.

GREEN:

```bash
pnpm --filter api test -- tracks.engagement.service.test.ts --runInBand
```

Passed after adding the aggregate duration and ready-track count guardrails.

## Validation

Run before handoff completion:

```bash
pnpm --filter api test -- tracks.engagement.service.test.ts --runInBand
pnpm --filter api typecheck
pnpm run docs:lint
git diff --check
```

## Not Done

- No replacement UI/API when a source is already at the 3-slot or 20-minute cap.
- No explicit per-song length cap; the active total cap is enforced instead.
- No paid ad-slot runtime.
- No media upload, storage, transcoding, waveform extraction, or worker deployment.
- No migration or live database action.

## Next Slice

Define replacement behavior and user-facing cap error handling, or move to the next owner-contract item: sect readiness and Sect Uprise boundary.
