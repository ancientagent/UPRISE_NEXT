# Release Deck / RADIYO / Sect Implementation Architecture Handoff

**Date:** 2026-07-08
**Branch:** `plan/release-deck-radiyo-sect-implementation-architecture`
**Base:** `docs/release-deck-radiyo-sect-readiness-spec-promotion` @ `8df3807`
**Agent:** Codex local
**Deployment Target:** none; docs/planning only
**Phase:** implementation architecture mapping

## Summary

Added a buildable architecture plan for Release Deck scheduling, Fair Play New Releases ingestion, and song-level Sect readiness.

No runtime code, schema/migration, provider, database, or art state was changed.

## Main Output

- `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`

The plan maps:

- current runtime seams and missing production callers;
- proposed models for `ReleaseDeckSchedule`, `TrackSectBacking`, `Sect`, `RotationEntry.newWindowDays`, and `FairPlayConfig.newReleaseWindowDays`;
- service boundaries for measurement, scheduling, ingestion, graduation, and readiness;
- API boundaries for measurement, availability, scheduling, manual ingestion, graduation, and sect backing;
- manual job flow before cron/provider automation;
- nine implementation slices with files and validation commands;
- recommended first PR: read-only Uprise-wide Release Deck measurement.

## Key Recommendation

Start with Slice 1: read-only Uprise-wide Release Deck measurement.

This is the safest first runtime slice because it needs no migration and creates the shared server-side measurement primitive required by scheduling and Sect readiness.

## Validation

Pending at handoff creation time; run before PR closeout:

- `pnpm run docs:lint`
- `git diff --check`
- `pnpm run workspace:audit`
