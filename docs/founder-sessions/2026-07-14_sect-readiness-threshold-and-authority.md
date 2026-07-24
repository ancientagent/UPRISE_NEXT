# Sect Readiness Threshold And Authority Founder Session

Status: raw founder-session capture
Date: 2026-07-14
Continued: 2026-07-22
Source: current chat/session
Related lane(s): REGISTRAR_GOVERNANCE, ARTIST_SOURCE, sect governance
Owner spec candidates: `docs/specs/communities/scenes-uprises-sects.md`, `docs/specs/system/registrar.md`, `docs/specs/media/release-deck-and-eligibility.md`

## Raw Founder Notes

> why are these being reccomended?  is there something about the original rule that you are worried about? for 1 I would not approve this over the orginal rule

> son its 45 minutes total between 5 sources not 5 sources with 45 minutes

> your explanation for number one seems much more complicated than the rule, the rule is a listener can put in a request for the sect.  the request must be supported by enough artists to become a legitimate sect, the sect becomes active once enough music is registered in the homescene's release deck by supporting artists

> so songs dont "support" sects,   an artist has registered themself as a sect member in support of a sect request. that artist has 3 songs in their homescene's release deck totalling15 minutes of music.  because this artist has registered as a sect member this is 15 minutes of music going toward that sect.  this happens until the threshold is met,  so previous songs are irellevant as what only matters is the total music time registered in the release deck

> right, jsut fyi this should then show up in other registrars as an official sect that others can join

> yes as long as its the same music community make sense?

> this is important because these will all contribute to its own 3 tier system, make sensE?

> yes please make sure this context is made clear where necessary

## Clarifications

- A listener in the Home Scene may submit a request for a Sect through the Registrar.
  - Type: settled correction
  - Likely owner: `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`
- Support from at least `5` distinct eligible registered Artist/Band sources
  makes the requested Sect legitimate.
  - Type: settled
  - Likely owner: `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`
- An Artist/Band source supports the request by registering as a Sect member.
  Songs do not support Sects individually.
  - Type: settled correction
  - Likely owner: `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`
- Sect readiness requires `45` minutes total across the current eligible Home
  Scene Release Deck music of at least `5` supporting member artists. It does
  not require each artist to contribute `45` minutes.
  - Type: settled
  - Likely owner: `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary`
- The existing `15`-minute Release Deck cap per source remains part of the
  calculation. A supporting member artist with three current eligible songs
  totaling `15` minutes contributes `15` minutes to the Sect.
  - Type: already documented implementation join point clarified by the settled threshold
  - Likely owner: `docs/specs/media/release-deck-and-eligibility.md#uprise-wide-deck-system`
- Once a Sect becomes legitimate/Official, its title becomes discoverable in
  other Registrars within the same parent music community so other Home Scenes
  can establish or join their own local instance of that Sect.
  - Type: settled cross-Registrar lifecycle rule
  - Likely owner: `docs/specs/communities/scenes-uprises-sects.md#official-sect-boundary`
- Cross-Registrar recognition does not cross parent music communities and does
  not grant membership or voting authority in the originating Home Scene's
  Sect. Each Home Scene retains its own local membership, readiness, and Uprise
  lifecycle.
  - Type: settled authority boundary
  - Likely owner: `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`
- Local Home Scene instances sharing one Official Sect identity supply that
  Sect's own city-to-state-to-national broadcast tier system. Citywide remains
  the civic/member tier; Statewide and National are aggregate Sect broadcasts.
  - Type: settled tier architecture
  - Likely owner: `docs/specs/communities/scenes-uprises-sects.md#sect-three-tier-architecture`

## Feature Sets

None. This session corrects product authority; it does not activate new runtime, schema, UI, provider, governance, or Sect Uprise behavior.

## Working Interpretation

- Readiness is one aggregate calculation over supporting member artists'
  current eligible Home Scene Release Decks: at least `2,700` counted seconds
  total and at least `5` distinct eligible registered Artist/Band members.
- The threshold is not `2,700` seconds per source.
- The lifecycle is simple: a listener requests a Sect; support from at least
  five artists makes it legitimate; and it becomes active once those supporting
  artists' current eligible Home Scene Release Deck music totals at least `45`
  counted minutes.
- The requesting listener does not need to manage an Artist/Band source or
  supply music. Routine platform-admin approval is not a stage in the lifecycle.
- There is no song-backing lifecycle/history decision. Previous songs are
  irrelevant to Sect readiness after leaving the current eligible Release Deck.
- Official Sect titles can propagate as recognized Registrar options across
  Home Scenes in the same parent music community. The resulting membership and
  readiness remain local to each Home Scene rather than joining everyone to the
  originating city's Sect.
- The shared title is functional tier identity, not merely shared vocabulary:
  each active local Sect Uprise contributes to that Sect's Statewide aggregate,
  and Statewide Sect results contribute to its National aggregate.

## Promotion Targets

- Owner spec: `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary`
- Authority owner spec: `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`
- Evidence/read-side join point: `docs/specs/media/release-deck-and-eligibility.md#uprise-wide-deck-system`
- Decision tracker: `docs/specs/DECISIONS_REQUIRED.md`
- Temporary decision packet correction: `docs/handoff/2026-07-14_sect-backing-readiness-decision-gate.md`
- Tests/runtime: future membership/readiness plan only; no implementation authorized by this capture

## Do Not Drift

- Do not require five sources to provide `45` minutes each.
- Do not reduce the rule to `45` minutes from any number of sources.
- Do not add track-to-Sect backing, encoding, reassignment, or history.
- Do not require the requesting listener to manage a source or supply music.
- Do not replace listener request + artist support + supporting-artist Release
  Deck music with routine platform-admin approval.
- Do not add a discretionary approval gate after the settled artist-support and
  music thresholds are satisfied.
- Do not expose an Official Sect title in Registrars for a different parent
  music community.
- Do not treat cross-Registrar discovery as cross-city membership or voting
  authority in the originating Sect.
- Do not model same-title local Sect instances as unrelated broadcasts; they
  belong to one Sect-specific three-tier broadcast system.
- Do not add civic membership or direct voting to Statewide or National Sect
  aggregates.
