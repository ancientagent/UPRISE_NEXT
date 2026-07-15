# Release Deck Schedule Availability Preview

**Agent:** Codex orchestrator + Codex executor/reviewer agents  
**Date:** 2026-07-08  
**Branch:** `feat/release-deck-schedule-availability-preview`  
**Phase:** Release Deck / RADIYO / Sect implementation Slice 2  
**Deployment Target:** API/runtime schema + read-only API preview; no provider state touched  
**Status:** Ready for PR

## Summary

Implemented Slice 2 from `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`: a durable `ReleaseDeckSchedule` model plus a read-only schedule availability preview endpoint.

This slice does not schedule songs, create Fair Play rotation entries, ingest into New Releases, write Sect request/membership state, or touch provider/database state outside normal local schema/code changes.

## Files Changed

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260708150000_add_release_deck_schedule/migration.sql`
- `apps/api/src/release-deck/dto/release-deck-schedule.dto.ts`
- `apps/api/src/release-deck/release-deck-scheduling.service.ts`
- `apps/api/src/release-deck/release-deck.controller.ts`
- `apps/api/src/release-deck/release-deck.module.ts`
- `apps/api/test/release-deck.scheduling.service.test.ts`
- `apps/api/test/release-deck.controller.test.ts`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/CHANGELOG.md`

## Runtime Contract Added

### Prisma

Added `ReleaseDeckSchedule` with:

- unique `trackId`
- `communityId`
- `artistBandId`
- `scheduledFor`
- `assignmentMode`
- optional `requestedFor`
- `status`
- optional `capacitySnapshot`
- `createdById`
- created/updated timestamps
- indexes for community/date/status and artist/community/status lookup

### API

Added:

```http
GET /release-deck/schedule/availability?communityId=<id>&trackId=<id>&from=<YYYY-MM-DD>&days=30
```

The endpoint is authenticated via the existing `ReleaseDeckController` guard and remains read-only.

Response behavior:

- returns community tuple and track/source context;
- reports server-side capacity inputs;
- scans the requested lookahead window;
- returns per-date diagnostics;
- returns `soonestValidDate` and alternatives;
- uses playable seconds, not raw song count;
- fails closed when the requested/from date is over capacity, while still returning later alternatives;
- fails closed when no valid date exists in lookahead.

## Guardrails Preserved

- No `RotationEntry` create/update/delete.
- No Fair Play ingestion path.
- No schedule write endpoint.
- No `ReleaseDeckSchedule.create` call in this slice.
- No deprecated `FairPlayConfig.newWindowBand*` reads.
- No source, track, community, or sect mutation in the availability service.
- Tracks must be source-owned, ready, attached to the measured city-tier community, in the source Home Scene, <= `360` seconds, and have an explicit playable `http(s)` URL.

## Review Findings Resolved

Independent reviewer blocked the first executor pass on two points:

- Requested/from date over-capacity returned `success: true` when a later alternative existed.
- URL playability was not checked in scheduling eligibility.

Both were patched before closeout:

- over-capacity requested dates now return `success: false` with `DATE_CAPACITY_FULL`, diagnostics, `soonestValidDate`, and alternatives;
- missing/non-`http(s)` `fileUrl` returns deterministic track eligibility failures.

## Validation

- `pnpm --filter api test -- release-deck.scheduling.service.test.ts release-deck.controller.test.ts --runInBand`
- `pnpm --filter api typecheck`
- `pnpm run docs:lint`
- `git diff --check`
- `pnpm run workspace:audit`

## Remaining Work

Next intended slice:

- Slice 3: schedule write path for source operators (`POST /release-deck/schedule`) with source/member authority, idempotence/conflict handling, and no Fair Play rotation writes.

Still deferred:

- Fair Play scheduled-song ingestion.
- `RotationEntry.newWindowDays` migration/usage.
- graduation job.
- corrected listener Sect request, Artist/Band membership, and current
  member-artist Release Deck readiness diagnostics.
- real media upload/storage/transcoding.
