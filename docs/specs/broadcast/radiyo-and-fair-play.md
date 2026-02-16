# RaDIYo and Fair Play

**ID:** `BROADCAST-FP`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines the RaDIYo broadcast network and Fair Play constraints. This spec distinguishes canon-locked behavior from currently implemented API components.

## User Roles & Use Cases
- Listeners tune into City/State/National broadcast contexts.
- GPS-verified Home Scene listeners vote during playback (when voting endpoints are implemented).
- Artists upload tracks to enter Fair Play rotation.

## Functional Requirements (Canon)
- RaDIYo is a broadcast receiver, not a playlist.
- Tier model: Citywide, Statewide, National.
- Swiping exits Fair Play listening and enters discovery traversal in visitor mode.
- Fair Play provides equal initial exposure for new songs.
- Engagement is additive-only and never demotes via negative scoring.
- Upvotes affect propagation/tier progression only.
- Voting is available only to GPS-verified Home Scene listeners.
- National tier is non-interactive (no voting).
- Personal collections are separate from Fair Play.

### Engagement Score Inputs (Canon)
- Playback weight:
  - full completion = 3
  - majority listen (>1/2) = 2
  - partial listen (>=1/3) = 1
  - skip/early interruption = 0
- Contextual modifiers (bounded, additive):
  - ADD +0.5
  - BLAST +0.25
- Modifiers affect rotation frequency only, not tier progression.

## Implemented Behavior (Current)
- `POST /tracks/:id/engage` records playback engagement events.
- Engagement events are deduplicated by `(userId, trackId, sessionId)`.
- Engagement rows store normalized score (`3|2|1|0`) derived from engagement type.

## Deferred Behavior (Not Implemented Yet)
- Broadcast rotation engine endpoint/service (`/broadcast/:sceneId`) is not implemented.
- Voting endpoint and propagation logic are not implemented.
- Tier progression thresholds and release-window timing remain founder-lock items.
- Rotation weighting job/location (API vs worker) remains undecided.

## Non-Functional Requirements
- No personalization or algorithmic recommendation.
- No pay-for-placement inside Fair Play/governance/rotation systems.
- Deterministic and auditable engagement inputs.

## Architectural Boundaries
- Fair Play never assigns legitimacy or governance power.
- Engagement capture is one input layer only; it is not equivalent to promotion authority.
- Canon constraints prohibit taste prediction and algorithmic push.

## Data Models & Migrations
### Prisma Models
- `Track`
- `TrackEngagement`
  - `type`: `full | majority | partial | skip`
  - `score`: normalized additive score
  - `sessionId`: dedupe guard
  - Unique constraint: `(userId, trackId, sessionId)`
  - Index: `(trackId, createdAt)`

### Migrations
- `20260216004000_add_user_home_scene_and_track_engagement`

## API Design
### Endpoints (Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/tracks/:id/engage` | required | Record playback engagement event |

### Endpoints (Planned)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/broadcast/:sceneId` | required | Stream broadcast rotation |
| POST | `/votes` | required | Cast upvote during playback |
| GET | `/fair-play/metrics` | required | Retrieve engagement/rotation metrics |

### `POST /tracks/:id/engage` Contract
- Request: `{ sessionId: string, type: "full" | "majority" | "partial" | "skip" }`
- Behavior:
  - validates track existence
  - maps type to score (`3|2|1|0`)
  - records idempotent-per-session engagement row
- Scope:
  - captures engagement events only
  - does not perform rotation recalculation or propagation

## Web UI / Client Behavior
- Player semantics remain broadcast-first (no direct song picking in Fair Play).
- Upvote controls must remain disabled unless GPS-verified and in Home Scene.
- Collection actions remain decoupled from voting/propagation.

## Acceptance Tests / Test Plan
- `POST /tracks/:id/engage`:
  - full/majority/partial/skip map to `3/2/1/0`
  - duplicate session rows are blocked by unique constraint
- Validate no tier progression side effects from engagement capture alone.
- Validate no negative score paths exist.

## Future Work & Open Questions
- Lock release-cycle timing and reevaluation cadence.
- Implement vote and propagation services after threshold decisions are finalized.
- Define moderation effects on rotation without violating canon constraints.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/specs/DECISIONS_REQUIRED.md`
