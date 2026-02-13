# RaDIYo and Fair Play

**ID:** `BROADCAST-FP`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines the RaDIYo broadcast network and the Fair Play rotation system that governs community broadcasts without personalization or algorithmic recommendation.

## User Roles & Use Cases
- Listeners tune into City, State, and National broadcasts.
- GPS-verified listeners vote during playback.
- Artists upload songs to enter Fair Play rotation.

## Functional Requirements
- RaDIYo is a broadcast receiver, not a playlist.
- Tier toggle: Citywide, Statewide, National.
- Swiping enables discovery jumps (random city/state in same music community).
- Fair Play provides equal initial exposure for all new songs.
- New releases play on the hour for approximately one week.
- Engagement score is calculated after the initial exposure window.
- Higher engagement increases rotation frequency.
- Upvotes determine tier progression.
- Voting is available only to GPS-verified Home Scene listeners.
- National tier is non-interactive and has no voting.
- Personal Play (Collections) is separate from Fair Play and does not affect rotation.

## Non-Functional Requirements
- No personalization or algorithmic recommendations.
- No pay-for-placement or visibility advantage.
- Deterministic rotation logic.

## Architectural Boundaries
- Canon constraints prohibit taste prediction and algorithmic pushing.
- Fair Play never assigns legitimacy or governance power.

## Data Models & Migrations
### Prisma Models
- Song
- RotationEntry
- EngagementMetrics
- Vote

### Migrations
- TBD

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/broadcast/:sceneId` | required | Stream broadcast rotation |
| POST | `/votes` | required | Cast vote during playback |
| GET | `/fair-play/metrics` | required | Retrieve engagement metrics |

## Web UI / Client Behavior
- RaDIYo player shows current Scene and tier.
- Action wheel supports Add, Blast, Upvote, Skip, Report.
- Player never exposes recommendation prompts.

## Acceptance Tests / Test Plan
- New songs receive equal initial exposure.
- Voting blocked without GPS verification.
- National tier is listen-only.

## Future Work & Open Questions
- Define exact engagement score weights.
- Define rotation re-evaluation cadence. See `docs/specs/DECISIONS_REQUIRED.md`.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
