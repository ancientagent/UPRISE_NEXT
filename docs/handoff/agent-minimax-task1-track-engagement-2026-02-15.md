# Task 1: Track Engagement Recording API

**Agent:** MiniMax
**Date:** 2026-02-15
**Status:** Completed

## Summary
Implemented Canon-aligned engagement capture for songs (3/2/1/0 model) per Master Narrative Canon §4.1.1.

## Changes

### API
- `POST /tracks/:id/engage` - Records engagement with payload `{ sessionId, type: "full" | "majority" | "partial" | "skip" }`
- Score mapping: full=3, majority=2, partial=1, skip=0
- Spam guard: unique constraint on (userId, trackId, sessionId)

### Schema
- Added `TrackEngagement` model to `apps/api/prisma/schema.prisma`
- Relations: User.trackEngagements[], Track.engagements[]
- Index: (trackId, createdAt)

### Tests
- `test/engagement.test.ts` - Pure utils tests (6 passing)
- `test/tracks.engagement.service.test.ts` - Service mock tests (4 passing)

### Docs Updated
- `docs/specs/broadcast/radiyo-and-fair-play.md` - Added endpoint documentation
- `docs/specs/engagement/activity-points-and-analytics.md` - Noted this captures events only
- `docs/CHANGELOG.md` - Added entry

## Deferred (Not in Scope)
- Rotation calculation / frequency weighting
- Tier propagation (Citywide → Statewide → National)
- UPVOTE endpoint and tier progression thresholds
- Activity Points engine (separate from engagement scoring)
- Subscription/Discovery Pass tiers

## Build/Test Status
- `pnpm --filter api build` ✓
- `pnpm --filter api test -- test/engagement.test.ts --runInBand` ✓ (6/6)
- `pnpm --filter api test -- test/tracks.engagement.service.test.ts --runInBand` ✓ (4/4)

## Next Steps
1. Fair Play rotation engine (compute scores, apply weighting)
2. UPVOTE endpoint with GPS verification
3. Tier propagation job
