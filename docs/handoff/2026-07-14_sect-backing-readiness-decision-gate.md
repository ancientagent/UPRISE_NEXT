# Sect Membership And Readiness Decision-Gate Correction

**Date:** 2026-07-14

**Original branch:** `codex/sect-readiness-decision-gate`

**Correction branch:** `codex/sect-threshold-founder-clarification`

**Status:** prior decision framing superseded; no founder decisions remain from
this packet; no runtime or schema authorization

## Why this file was corrected

The prior packet incorrectly treated implementation architecture as evidence
that the product lifecycle was unresolved. It proposed:

- source-manager or platform-admin Sect creation authority;
- per-song Sect backing/encoding;
- a song-backing withdrawal/reassignment/history lifecycle; and
- a source-diversity choice that reopened an existing five-artist rule.

Those proposals did not reconstruct the original rule from founder context.
They are rejected and must not guide implementation.

## Raw founder authority

The exact founder corrections are preserved in
`docs/founder-sessions/2026-07-14_sect-readiness-threshold-and-authority.md`.
Future planning and review must read that note before older Sect architecture or
handoffs.

## Correct lifecycle

1. A listener in a Home Scene requests a Sect through Registrar.
2. An eligible registered Artist/Band source supports the request by
   registering as a member of the requested Sect.
3. Support from at least `5` distinct eligible registered Artist/Band members
   makes the requested Sect legitimate.
4. Each supporting member artist contributes the current eligible duration in
   that artist's Home Scene Release Deck, capped by the existing `15`-minute
   per-source Release Deck limit.
5. The legitimate Sect becomes active when those supporting artists'
   collectively counted current Release Deck music reaches at least `45`
   minutes (`2,700` seconds).

## Counting rule

```text
supportingArtistCount >= 5
sum(min(currentEligibleHomeSceneReleaseDeckSecondsByArtist, 900)) >= 2700
```

- The five artists collectively supply `45` minutes. Each artist does not need
  to supply `45` minutes.
- A supporting member artist with three current eligible songs totaling `15`
  minutes contributes `15` minutes.
- Songs do not support, join, affiliate with, or back a Sect individually.
- There is no `TrackSectBacking`, per-song Sect selector, one-Sect-per-song
  rule, song reassignment, or Sect-specific song-backing history.
- When a song enters or leaves a supporting artist's current eligible Home
  Scene Release Deck, readiness is recalculated from the current deck.
  Previous songs are irrelevant to the current Sect total.

## Authority boundary

- The listener request is the initiating action.
- Artist/Band Sect membership is the supporting action.
- Current eligible Release Deck duration is the music evidence.
- Routine platform-admin approval is not a stage in request, legitimacy, or
  threshold-based activation.
- Passive genre/style/listener tags do not create Artist/Band Sect membership.
- Sect membership/readiness do not affect Fair Play placement, recurrence,
  voting weight, propagation, artist rank, Support, or Participation.

## Current runtime boundary

- The database has the parent-community-scoped `Sect` identity foundation.
- Current runtime does not yet persist the corrected listener request and
  Artist/Band Sect membership lifecycle or calculate readiness from member
  artists' current Home Scene Release Decks.
- No schema, API, UI, job, provider, or database mutation is authorized by this
  correction alone.

## Required next implementation sequence

1. Write a fresh executor-ready plan from the corrected owner specs.
2. Independently review the plan against the raw founder session and this
   lifecycle before implementation.
3. Implement listener request and Registrar-held Artist/Band Sect membership.
4. Implement read-only current-deck readiness aggregation.
5. Implement threshold state transitions without adding a discretionary admin
   approval gate.

## Review guardrail

A review fails if it:

- treats a song as the actor supporting a Sect;
- proposes a track-to-Sect association;
- counts historical songs instead of current eligible Release Deck state;
- requires `45` minutes from every supporting artist;
- replaces the listener request with a source-manager or administrator request;
- inserts routine administrator approval; or
- presents any of the rejected design questions as still open.
