# Activity Points and Analytics

**ID:** `ENG-ACTIVITY`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines Activity Points and analytics as descriptive metrics for participation and scene health.

## User Roles & Use Cases
- Listeners earn Activity Points through participation.
- Scenes track Activity Score as aggregate community participation.
- Artists view descriptive analytics in the WebApp.

## Functional Requirements
- Users earn Activity Points from participation (Blasts, attendance, support, projects).
- Scene Activity Score is the sum of individual points.
- Large bonuses are permitted for Proof‑of‑Support and pioneering.
- Analytics report performance across tiers and geography.
- Metrics are descriptive only and do not affect Fair Play or governance.

## Non-Functional Requirements
- Transparency: point sources are visible.
- No conversion of points into authority or rank.

## Architectural Boundaries
- Activity Points do not influence tier progression.
- Analytics are not used to recommend or rank.

## Data Models & Migrations
- ActivityPoint
- ActivityScore
- AnalyticsSummary

## API Design
- TBD

### Engagement Events (Implemented)
> **Note:** This section captures engagement events for Fair Play scoring. Activity Points engine is not yet implemented.

- `POST /tracks/:id/engage` records playback engagement (see `docs/specs/broadcast/radiyo-and-fair-play.md`)
- TrackEngagement model stores: userId, trackId, type (full/majority/partial/skip), score, sessionId
- This is separate from Activity Points; engagement affects rotation frequency, Activity Points affect participation recognition

## Web UI / Client Behavior
- Activity Points visible on user profile.
- Scene Activity Score visible in Plot statistics.

## Acceptance Tests / Test Plan
- Proof‑of‑Support generates activity bonuses.
- Activity points do not alter rotation.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Glossary Canon.md`

## Future Work & Open Questions
- Define the Activity Points scoring table and decay/seasonality rules. See `docs/specs/DECISIONS_REQUIRED.md`.
