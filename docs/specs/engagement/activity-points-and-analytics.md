# Activity Points and Analytics

**ID:** `ENG-ACTIVITY`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines Activity Points and analytics as descriptive metrics for participation and scene health.

## User Roles & Use Cases
- Listeners earn Activity Points through participation.
- Scenes track Activity Score as aggregate community participation.
- Artists view descriptive analytics in the WebApp.

## Functional Requirements
- Activity Points are user-level participation recognition.
- Scene Activity Score aggregates user-level activity.
- Large bonuses are permitted for verified Proof-of-Support and pioneering labor.
- Analytics remain descriptive and must not become ranking/authority inputs.

### Implemented Now
- Engagement capture for Fair Play scoring only:
  - `POST /tracks/:id/engage`
  - `TrackEngagement` records (`type`, `score`, `sessionId`, `userId`, `trackId`).
- Engagement scoring model uses canon-aligned 3/2/1/0 playback points.

## Non-Functional Requirements
- Transparency: point sources are visible.
- No conversion of points into authority or rank.

## Architectural Boundaries
- Activity Points do not influence tier progression.
- Analytics are not used to recommend or rank.

## Data Models & Migrations
### Implemented Models
- `TrackEngagement` (Fair Play input; not Activity Points)

### Planned Models
- `ActivityPoint`
- `ActivityScore`
- `AnalyticsSummary`

### Migrations
- `20260216004000_add_user_home_scene_and_track_engagement` (engagement capture only)

## API Design
### Implemented Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/tracks/:id/engage` | required | Record playback engagement for Fair Play scoring |

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/:id/activity-points` | required | Fetch user activity points ledger |
| GET | `/communities/:id/activity-score` | required | Fetch scene aggregate score |
| POST | `/activity/proof-support` | required | Award points for verified proof-of-support |

### Engagement Events (Implemented)
> **Note:** This section captures engagement events for Fair Play scoring. Activity Points engine is not yet implemented.

- `POST /tracks/:id/engage` records playback engagement (see `docs/specs/broadcast/radiyo-and-fair-play.md`)
- TrackEngagement model stores: userId, trackId, type (full/majority/partial/skip), score, sessionId
- This is separate from Activity Points; engagement affects rotation frequency, Activity Points affect participation recognition

## Web UI / Client Behavior
- Activity Points and scene activity visualization are planned for Plot statistics/profile surfaces.
- Current implementation does not render Activity Points yet.

## Acceptance Tests / Test Plan
- Track engagement endpoint stores additive playback records only.
- Engagement records do not imply tier progression or governance power.
- When Activity Points ship, verify no coupling to rotation order/tier propagation.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Glossary Canon.md`

## Future Work & Open Questions
- Define Activity Points scoring table and decay/seasonality policy in `docs/specs/DECISIONS_REQUIRED.md`.
- Define proof-verification trust model for high-value point awards.
