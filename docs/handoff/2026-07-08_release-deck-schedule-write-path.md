# Release Deck Schedule Write Path

**Agent:** Codex local executor  
**Date:** 2026-07-08  
**Branch:** `feat/release-deck-scheduling-stack`  
**Phase:** Release Deck / RADIYO / Sect implementation Slice 3  
**Deployment Target:** local stack branch only; no push/PR yet  
**Status:** Local checkpoint

## Summary

Implemented the source-operator schedule write path for Release Deck songs.

This extends the Slice 2 availability preview with a guarded write endpoint that creates `ReleaseDeckSchedule` rows only. It does not create Fair Play `RotationEntry` rows, ingest into New Releases, schedule jobs, or write Sect backing rows.

## Runtime Contract Added

```http
POST /release-deck/schedule
```

Request:

```ts
{
  trackId: string;
  communityId: string;
  mode: 'soonest' | 'chosen';
  requestedDate?: 'YYYY-MM-DD';
}
```

Behavior:

- `chosen` requires `requestedDate` and creates a schedule only when that exact date is available.
- `soonest` uses server-side availability diagnostics to pick the earliest valid date in the configured lookahead.
- The authenticated user must own or be a member of the managed Artist/Band source behind the track.
- Track community and source Home Scene must match the scheduled community.
- Existing availability eligibility still applies: source-owned, ready, city-tier community, `http(s)` playable URL, <= `360` seconds, source cap, no existing schedule/active rotation.
- Schedule rows store the capacity snapshot used to make the decision.
- Unique `trackId` remains the duplicate guard; P2002 maps to an explicit conflict.

## Guardrails Preserved

- No `RotationEntry.create` / Fair Play ingestion.
- No schedule creation when `chosen` date is over capacity.
- No schedule creation before source-operator authority is verified.
- No deprecated `FairPlayConfig.newWindowBand*` reads.
- No source, track, community, or sect mutation.

## Validation

- `pnpm --filter api test -- release-deck.scheduling.service.test.ts release-deck.controller.test.ts --runInBand`
- `pnpm --filter api typecheck`

## Next Work

Next local stack slice should be a review pass against this checkpoint, then Slice 4 prep/implementation for Fair Play scheduled-song ingestion into New Releases with `newWindowDays = 10`.
