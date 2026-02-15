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
- Swiping exits Fair Play listening and enters Discover traversal (visitor mode) in another Scene; listener continues in that Scene with Visitor privileges.
- Fair Play provides equal initial exposure for all new songs.
- New releases play on the hour for approximately one week (initial exposure window).
- Engagement score is calculated after the initial exposure window.
- Higher engagement increases rotation frequency.
- Engagement is additive-only: skips are non‑negative and do not demote.
- Upvotes determine tier progression only.
- Voting is available only to GPS‑verified Home Scene listeners and occurs during playback.
- National tier is non-interactive and has no voting.
- Personal Play (Collections) is separate from Fair Play and does not affect rotation.

### Engagement Score (Canon)
- Engagement score uses playback weight and contextual modifiers.
- Playback weight: full completion = 3 points; partial listen (majority played) = 2; partial listen (minority played, ≥ 1/3 duration) = 1; skip/early interruption = 0.
- Contextual modifiers (once per user per song per tier): ADD +0.5 points; BLAST +0.25 points.
- Modifiers affect rotation frequency only and never tier progression.

## Non-Functional Requirements
- No personalization or algorithmic recommendations.
- No pay-for-placement or visibility advantage within Fair Play, governance, or rotation systems.
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
| POST | `/tracks/:id/engage` | required | Record playback engagement (Canon 3/2/1/0) |

### Engagement Capture (Implemented)
`POST /tracks/:id/engage` records listener engagement during playback:
- **Payload:** `{ sessionId: string, type: "full" | "majority" | "partial" | "skip" }`
- **Scoring:** full=3, majority=2, partial=1, skip=0 (per Canon §4.1.1)
- **Deduplication:** Unique constraint on (userId, trackId, sessionId) prevents spam
- **Scope:** This endpoint captures engagement events only; rotation calculation and tier propagation are deferred

## Web UI / Client Behavior
- RaDIYo player shows current Scene and tier.
- Action wheel supports Add, Blast, Upvote, Skip, Report.
- Player never exposes recommendation prompts.

## Acceptance Tests / Test Plan
- New songs receive equal initial exposure.
- Voting blocked without GPS verification.
- National tier is listen-only.

## Future Work & Open Questions
- Define rotation re-evaluation cadence. See `docs/specs/DECISIONS_REQUIRED.md`.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
