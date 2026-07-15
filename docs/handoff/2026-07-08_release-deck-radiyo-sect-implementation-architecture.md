# Release Deck / RADIYO / Sect Implementation Architecture Handoff

> **Superseded Sect context (2026-07-14):** Preserve this handoff as execution
> history, but do not implement its `TrackSectBacking`, per-song Sect API, or
> song-level readiness design. Current authority is
> `docs/founder-sessions/2026-07-14_sect-readiness-threshold-and-authority.md`:
> listener request + Registrar-held Artist/Band Sect membership + current
> member-artist Home Scene Release Deck aggregation.

**Date:** 2026-07-08
**Branch:** `plan/release-deck-radiyo-sect-implementation-architecture`
**Base:** `docs/release-deck-radiyo-sect-readiness-spec-promotion` @ `8df3807`
**Agent:** Codex local
**Deployment Target:** none; docs/planning only
**Phase:** implementation architecture mapping

## Summary

Added the historical architecture plan for Release Deck scheduling, Fair Play
New Releases ingestion, and the now-superseded per-song Sect design.

No runtime code, schema/migration, provider, database, or art state was changed.

## Main Output

- `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md`

The plan maps:

- current runtime seams and missing production callers;
- proposed models including the implemented/historical scheduling fields and a
  rejected `TrackSectBacking` model that must not be implemented;
- service boundaries for measurement, scheduling, ingestion, graduation, and readiness;
- API boundaries for measurement, availability, scheduling, manual ingestion,
  graduation, and the rejected per-song Sect path;
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
