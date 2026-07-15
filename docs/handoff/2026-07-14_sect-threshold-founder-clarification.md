# Sect Threshold Founder Clarification

**Date:** 2026-07-14
**Branch:** `codex/sect-threshold-founder-clarification`
**Base:** `origin/main@62f2d58`
**Status:** docs correction; no runtime or schema authorization

## Evidence used

- Founder wording captured in `docs/founder-sessions/2026-07-14_sect-readiness-threshold-and-authority.md`
- `docs/canon/Master Narrative Canon.md#16-sects-sub-communities`
- `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary`
- `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`
- `docs/specs/media/release-deck-and-eligibility.md#uprise-wide-deck-system`
- Superseded option framing in `docs/handoff/2026-07-14_sect-backing-readiness-decision-gate.md`

## Settled correction

- A Home Scene listener requests a Sect through Registrar.
- An eligible registered Artist/Band source supports the request by registering
  as a Sect member; songs do not support Sects individually.
- Support from at least `5` distinct eligible registered Artist/Band members
  makes the requested Sect legitimate.
- Sect readiness is `45` total counted minutes collectively across those
  supporting member artists' current eligible Home Scene Release Decks.
- Apply the existing `15`-minute counted contribution cap per source before
  evaluating the aggregate threshold.
- The rule is not `45` minutes per source.
- The Sect becomes active when the supporting artists' current eligible deck
  time reaches `45` counted minutes.
- Previous songs are irrelevant after leaving the current eligible Release
  Deck; there is no track-to-Sect backing or song history lifecycle.
- The requesting listener does not need to manage a source or supply music.
- Routine platform-admin approval is not a stage in the lifecycle.

## Current state versus deferred

- Documentation authority is corrected in this slice.
- Listener request persistence, Artist/Band Sect membership, readiness
  services/APIs, public progress, and threshold-based Sect activation remain
  unimplemented.
- No founder decision remains from the superseded decision packet.

## Validation

- `pnpm run docs:lint`
- `pnpm run workspace:audit`
- `git diff --check`
- read-only product-authority review

## Do not change

- No schema, migration, runtime, UI, provider, or database mutation.
- No discretionary administrator approval gate after the settled artist-support
  and Release Deck music thresholds.
- No Support, Participation, Fair Play, voting, propagation, recurrence, or
  ranking effects.
