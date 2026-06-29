# Release Deck Song Cap + Registrar GPS Gate

**Date:** 2026-06-29  
**Branch:** `fix/release-deck-song-cap-replacement`  
**Base:** `main` at `f65ed0f`  
**Agent:** Codex  
**Runtime changes:** yes, API + web validation

## Summary

This slice closes the remaining Release Deck song-length/replacement cleanup and hardens Registrar source materialization against stale unverified entries.

## Product Contract Locked

- Release Deck has `3` active music slots per managed Artist/Band source per city-tier community.
- No single Release Deck song may exceed `6` minutes (`360` seconds).
- No single source may occupy more than `15` minutes (`900` seconds) of any one Uprise rotation at a time.
- Current replacement behavior is reject-only: when a source is at the `3`-slot, `6`-minute song, or `15`-minute source cap, the create path rejects the new track and tells the source to choose a different active song combination.
- The MVP create path does not silently delete, mutate, or replace existing tracks because existing tracks may carry rotation, vote, engagement, or tier lifecycle history.
- Artist/Band materialization re-checks GPS verification before creating a source from an unmaterialized registrar entry, so legacy/stale rows cannot bypass the source-registration GPS gate.

## Files Changed

- `apps/api/src/tracks/tracks.service.ts`
  - Added `RELEASE_DECK_MAX_TRACK_SECONDS = 6 * 60` for managed source `ready` tracks.
  - Added reject-only guidance to 3-slot and 15-minute cap errors.
- `apps/api/test/tracks.engagement.service.test.ts`
  - Added 6-minute single-track rejection coverage.
  - Locked reject-only guidance for slot/duration cap failures.
- `apps/web/src/lib/source/release-deck-validation.ts`
  - Added client-side 6-minute validation for Release Deck form payloads.
- `apps/web/__tests__/release-deck-validation.test.ts`
  - Added client-side 6-minute validation coverage.
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
  - Added visible Release Deck constraints: 3 slots, 6 minutes per song, 15 minutes total.
- `apps/api/src/registrar/registrar.service.ts`
  - Added GPS verification re-check before materializing unmaterialized Artist/Band registrar entries.
- `apps/api/test/registrar.service.test.ts`
  - Locked no-write behavior when artist/band submission is not GPS verified.
  - Added legacy-entry materialization rejection when submitter is not GPS verified.
- `docs/specs/media/release-deck-and-eligibility.md`
  - Promoted 6-minute per-song cap and reject-only at-cap behavior into the owner spec.
- `docs/specs/system/registrar.md`
  - Documented materialization GPS re-check for source identity creation.
- `docs/PLATFORM_START_HERE.md`
  - Updated five-minute truth for Release Deck caps.
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
  - Updated source/Release Deck brief to remove stale open-decision language.
- `docs/specs/system/documentation-framework.md`
  - Removed Release Deck song-length/replacement from the unresolved owner-contract queue.
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
  - Updated the community activation strategy to reference the closed Release Deck eligibility contract.

## Staging Evidence Before This Branch

The merged `15`-minute cap was deployed from `main` commit `f65ed0f` to Fly API staging before this branch:

- App: `uprise-api-staging`
- Image: `registry.fly.io/uprise-api-staging:deployment-01KW9WZYEJF3RHXFTH6KCYNNP6`
- Health:
  - `GET https://uprise-api-staging.fly.dev/health/live` returned healthy.
  - `GET https://uprise-api-staging.fly.dev/health/ready` returned healthy database and PostGIS.

Release Deck cap smoke:

- Created a temporary staging user/source/ready track through Fly SSH + API/Prisma.
- Existing source track duration: `850` seconds.
- Attempted additional ready track duration: `60` seconds.
- API rejected with HTTP `400` and `15 minutes` cap text.
- `GET /admin/analytics/activation-readiness` reported:
  - `maxPlayableSecondsPerSource: 900`
  - `maxPlayableMinutesPerSource: 15`
- Cleanup confirmed:
  - `users: 0`
  - `tracks: 0`
  - `artistBands: 0`
  - `members: 0`

Source-origin activation readiness smoke:

- Created temporary source-origin data for an inactive QA tuple using an existing active proxy community.
- Created `5` temporary sources with ready tracks:
  - one source at `1200` raw seconds, capped to `900`
  - four sources at `450` seconds each
- `GET /admin/analytics/activation-readiness` returned the QA tuple as ready:
  - `distinctSourceCount: 5`
  - `rawPlayableSeconds: 3000`
  - `cappedPlayableSeconds: 2700`
  - `ready: true`
  - `requiredPlayableSeconds: 2700`
  - `maxPlayableSecondsPerSource: 900`
- Cleanup confirmed:
  - `users: 0`
  - `tracks: 0`
  - `artistBands: 0`
  - `members: 0`

## Validation Run

- `pnpm --filter api test -- tracks.engagement.service.test.ts`
- `pnpm --filter web test -- release-deck-validation.test.ts route-ux-consistency-lock.test.ts`
- `pnpm --filter api test -- registrar.service.test.ts`

Additional final validation should be run before PR merge:

- `pnpm --filter web typecheck`
- `pnpm --filter api typecheck`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `git diff --check`

## Notes

- No schema migration was added.
- No media storage/transcoding/upload path was activated.
- No paid ad-slot runtime was activated.
- Replacement remains deliberately reject-only until a future history-safe edit/replacement endpoint is specified.
