# Release Deck / RADIYO / Sect Readiness Spec Promotion

**Date:** 2026-07-08
**Branch:** `docs/release-deck-radiyo-sect-readiness-spec-promotion`
**Base:** `plan/release-deck-radiyo-sect-readiness` @ `6edd7f6`
**Agent:** Codex local
**Deployment Target:** none; docs/spec promotion only
**Phase:** owner-spec promotion

## Summary

Promoted the founder-confirmed Release Deck, RADIYO New Releases, and Sect readiness rules into owner specs before runtime implementation.

This branch does not change runtime code, schema/migrations, provider state, database state, or art assets.

## Rules Promoted

- Release Deck is both a per-source submission path and the Uprise-wide catalog/scheduling/readiness system formed by all source decks inside one Uprise.
- Release Deck owns release-date scheduling before a song enters RADIYO/New Releases.
- Fair Play owns lifecycle after scheduled RADIYO entry.
- Every accepted song entering New Releases receives the same fixed protected run: `new_window_days = 10`.
- Daily single volume and deck density must be handled by Release Deck scheduling, not by shrinking a song's protected RADIYO window.
- The old `10 / 7 / 5` density-band model is deprecated and must not be reintroduced through `FairPlayConfig` compatibility fields.
- Sect readiness counts eligible Release Deck songs with explicit song-level sect backing/affiliation.
- A source affiliating with a sect does not make its whole catalog count automatically.
- One song should be readiness-bearing for at most one sect unless a future owner spec changes that rule.

## Files Changed

- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`
- `docs/specs/system/documentation-framework.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/solutions/COMMUNITY_ACTIVATION_PROXY_LIFECYCLE_STRATEGY_R1.md`
- `docs/CHANGELOG.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`

## Deferred / Not Implemented

- Exact Release Deck scheduling capacity algorithm.
- API response shape for requested dates that exceed capacity.
- Scheduler/job wiring that moves scheduled songs into New Releases.
- Schema for scheduled release dates and song-level sect backing.
- Runtime replacement for dead/unwired Fair Play ingestion paths.
- Production caller/controller for New Releases ingestion and recurrence aggregation.
- Sect readiness read path, approval workflow, notices, update channels, and Sect Uprise activation.

## Next Recommended Large Slice

Map the implementation architecture for Release Deck scheduling, Fair Play New Releases entry, and song-level Sect readiness end-to-end. The output should be a buildable plan with model/API/service/test boundaries, not a runtime patch yet.

The hard problem is cross-system sequencing:

1. Release Deck has to schedule entry fairly across all source decks in one Uprise.
2. Fair Play has to consume scheduled songs without using the deprecated density model.
3. Sect readiness has to measure only explicitly encoded songs without accidentally counting whole-source affiliation.
4. Community/Sect activation analytics need read paths that can be trusted before any creation/cutover job exists.

## Validation

Pending at branch creation time; run before PR closeout:

- `pnpm run docs:lint`
- `git diff --check`
- `pnpm run workspace:audit`
