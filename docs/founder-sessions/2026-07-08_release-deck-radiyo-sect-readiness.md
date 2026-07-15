# Release Deck, RADIYO, And Sect Readiness Founder Session

Status: raw founder-session capture
Date: 2026-07-08
Source: current chat/session
Related lane(s): Release Deck, RADIYO/Fair Play, Sect readiness, Registrar, Source Dashboard
Owner spec candidates:
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/registrar.md`

## Superseding clarification — 2026-07-14

Preserve the raw founder wording below, but do not use this note's former
song-level interpretation as current product truth. The founder clarified the
actual lifecycle in
`docs/founder-sessions/2026-07-14_sect-readiness-threshold-and-authority.md`:

- a listener requests the Sect;
- artists support it by registering as Sect members;
- each supporting member artist's current eligible Home Scene Release Deck
  duration counts automatically toward the Sect;
- songs do not support or join Sects individually; and
- previous songs are irrelevant after leaving the current eligible Release
  Deck.

All `Clarifications`, `Feature Sets`, `Working Interpretation`, promotion
targets, and `Do Not Drift` language below that requires per-song Sect
encoding/backing is superseded. The raw quotes remain historical evidence of
the conversation that was later misinterpreted.

## Raw Founder Notes

> i dont think that can work because people are dropping singles everyday

> ahh thats right. I forgot the system determins

> i think everyone should get the same time no matter how many people their are, i think people should be able to register their release date or put it in the release deck, once its put in the deck it gets assigned its release date based on all the other songs in all other release decks and each song gets 10 days

> well they would put it in the release deck no matter what its just you could have it autoassigned to the soonest or choose your date.

> this would also make sense for the sects too since it measures the radiyo hour by the songs in release tracks

> err decks

> i mean

> yes so these things need to be encoded into the song. the release deck needs to be able to know if there is enough music via the songs encoded by artists who consider themselves part of that sect

> the the release deck also needs to be able to measure the amount of music

> think of the release deck for every artist in an uprise as one system

> exactly

## Clarifications

- Release Deck is not only a per-source submission UI. It is also the Uprise-wide catalog, scheduling, and readiness measurement system made from every participating artist/source Release Deck inside that Uprise.
  - Type: settled concept, owner-spec promotion needed
  - Likely owner: `docs/specs/media/release-deck-and-eligibility.md`

- The individual source Release Deck remains the place where each managed Artist/Band source places songs, but the system must also read all source decks in an Uprise together as the Uprise's playable catalog pipeline.
  - Type: settled concept, owner-spec promotion needed
  - Likely owner: `docs/specs/media/release-deck-and-eligibility.md`

- The prior density-shortened New Releases window model needs revision before implementation. The founder direction is that every accepted song should receive the same protected RADIYO New Releases time, currently expressed as `10` days, regardless of how many songs are entering the system.
  - Type: correction to current owner-spec behavior
  - Likely owner: `docs/specs/broadcast/radiyo-and-fair-play.md`

- Congestion should be handled through Release Deck release-date scheduling, not by shortening an individual song's protected New Releases window.
  - Type: settled concept, owner-spec promotion needed
  - Likely owner: `docs/specs/broadcast/radiyo-and-fair-play.md`

- A source can place a song in the Release Deck and either let the system auto-assign the soonest valid release date or choose a release date when capacity/rules allow.
  - Type: settled concept, implementation details still needed
  - Likely owner: `docs/specs/media/release-deck-and-eligibility.md`

- Sect readiness should be measured from Release Deck songs/decks, not from loose tags, passive genre metadata, or popularity. The correction was from "release tracks" to "decks": the readiness source is committed music in Release Decks.
  - Type: settled correction
  - Likely owner: `docs/specs/communities/scenes-uprises-sects.md`

- Sect affiliation/backing must be encoded at the song level. The system needs to know which specific Release Deck songs are committed to a sect by artists/sources who consider themselves part of that sect.
  - Type: settled concept, schema/runtime design needed
  - Likely owner: `docs/specs/communities/scenes-uprises-sects.md` and `docs/specs/system/registrar.md`

- A source/artist generally affiliating with a sect is not enough for every song in that artist's catalog to count automatically. The relevant songs need explicit sect encoding/backing.
  - Type: settled clarification
  - Likely owner: `docs/specs/system/registrar.md`

- Release Deck needs measurement/read-side behavior: it must be able to measure the amount of eligible music in the deck system, including total playable music, source caps, sect-encoded playable minutes, and readiness toward RADIYO-hour thresholds.
  - Type: settled concept, owner-spec promotion needed
  - Likely owner: `docs/specs/media/release-deck-and-eligibility.md`

## Feature Sets

- Uprise-wide Release Deck system
  - Raw basis: "think of the release deck for every artist in an uprise as one system"
  - Included behavior:
    - aggregate all participating source Release Decks inside an Uprise;
    - measure total eligible playable music;
    - measure release-date scheduling capacity;
    - measure source-level caps and contribution balance;
    - feed RADIYO/Fair Play scheduling and readiness calculations;
    - support sect readiness by reading song-level sect encoding.
  - Excluded / not activated:
    - no runtime schema migration is approved by this capture alone;
    - no owner-spec replacement is completed by this note alone;
    - no automatic paid placement or pay-for-promotion behavior.
  - Status: settled concept, implementation not started

- Release-date scheduling in Release Deck
  - Raw basis: "autoassigned to the soonest or choose your date"
  - Included behavior:
    - source places song in Release Deck;
    - source may request a date or choose soonest auto-assigned date;
    - the system assigns/schedules the actual RADIYO release date according to the combined deck schedule;
    - every accepted song gets the same protected New Releases run once it enters RADIYO.
  - Excluded / not activated:
    - exact capacity algorithm;
    - rejection vs alternate-date suggestion behavior;
    - schema/API design.
  - Status: concept settled, implementation details open

- Song-level sect encoding
  - Raw basis: "these things need to be encoded into the song"
  - Included behavior:
    - eligible Release Deck songs can carry explicit sect backing/affiliation;
    - sect readiness reads approved playable minutes from songs encoded for that sect;
    - artists/sources can be affiliated with a sect, but song-level encoding determines which music counts.
  - Excluded / not activated:
    - exact UI for selecting sects;
    - whether one song can encode one sect or multiple sects;
    - exact data model/join table.
  - Status: concept settled, schema detail open

## Working Interpretation

- The current `10 / 7 / 5` density-shortened New Releases model in the broadcast spec should not be treated as final implementation truth until reconciled with this founder clarification.
- The intended fairness model is equal protected RADIYO time per accepted song, with queue/schedule pressure handled before the song enters the New Releases pool.
- Release Deck becomes the source-owned catalog authority and the Uprise-wide measurement surface for RADIYO readiness, source caps, release scheduling, and sect readiness.
- Sect readiness should count real, approved/playable, song-level committed catalog, not broad artist identity or passive tags.
- The phrase "release tracks" in the discussion was corrected to "decks"; future agents should not infer that only already-released/live tracks count unless an owner spec later says so.

## Promotion Targets

- Owner spec: `docs/specs/media/release-deck-and-eligibility.md`
  - Add Uprise-wide deck-system concept.
  - Add release-date scheduling/autoscheduling as a future/active contract depending on implementation scope.
  - Add measurement/read-side responsibilities.

- Owner spec: `docs/specs/broadcast/radiyo-and-fair-play.md`
  - Reconcile or replace density-shortened `10 / 7 / 5` New Releases windows.
  - Preserve equal protected New Releases time if approved for owner-spec promotion.
  - Keep engagement/recurrence and upvote/propagation separation intact.

- Owner spec: `docs/specs/communities/scenes-uprises-sects.md`
  - Clarify sect readiness as song-level Release Deck encoding/backing.
  - Clarify Release Deck/deck-system role in measuring 45 minutes of committed playable catalog.

- Owner spec: `docs/specs/system/registrar.md`
  - Clarify Registrar authority for source/sect affiliation and song-level backing authority.
  - Avoid loose profile tags or passive genre metadata becoming official readiness evidence.

- Lane brief: `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
  - Summarize only after owner specs are patched, because Release Deck routing lives there for agents.

- Tests/runtime:
  - Release Deck API and validation tests.
  - Fair Play New Releases scheduling/lifecycle tests.
  - Sect readiness diagnostics tests when implemented.

## Do Not Drift

- Do not implement the old density-shortened `10 / 7 / 5` New Releases behavior without first reconciling it with this founder clarification.
- Do not treat sect readiness as artist-profile tags, listener taste tags, passive genre tags, or popularity.
- Do not count all songs from a sect-affiliated artist automatically; count the songs explicitly encoded/backed for that sect.
- Do not treat Release Deck as only a visual upload form. It is also the Uprise-wide catalog/scheduling/readiness system.
- Do not let release scheduling become pay-for-placement or manual favoritism.
- Do not change Fair Play ordering, voting authority, or promotion thresholds from this capture alone; promote into owner specs first.
