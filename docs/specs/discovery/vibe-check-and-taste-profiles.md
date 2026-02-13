# Vibe Check and Taste Profiles

**ID:** `DISC-VIBE`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines Vibe Check as a user‑initiated discovery tool and the optional taste profile used for comparison.

## User Roles & Use Cases
- Listener runs a Vibe Check between themselves and a Music Community/Uprise, Event, Artist, Business, or another Listener.
- Listener opts into taste profile scan or builds a profile through platform questions and taste tags.

## Functional Requirements
- Vibe Check is user‑initiated only (no auto‑run).
- Vibe Check is accessed via a button next to **Follow** on eligible entities.
- Eligible entities: Music Community/Uprise, Event, Artist, Business, Promoter, Listener.
- Taste Profile is optional and static unless refreshed.
- Taste Profile can be built by:
  - Opt‑in playlist scan, or
  - On‑platform questions and taste tags (no external scan).
- Vibe Check compares overlap and displays a match percentage plus shared tags/bridges.
- Vibe Check is navigational context, not a recommendation engine.
- Scene recommendations may be shown based on explicit profile inputs or activity, but never by promoting specific artists.

## Non-Functional Requirements
- No algorithmic content recommendation or ranking.
- No predictive personalization beyond explicit user action.

## Architectural Boundaries
- Vibe Check never auto‑surfaces content.
- Discovery must not affect Fair Play rotation.
- Vibe Check must never be used to auto‑populate feeds.

## Data Models & Migrations
- TasteProfile
- VibeCheckResult

## API Design
- TBD

## Web UI / Client Behavior
- Vibe Check appears next to **Follow** on eligible entities.
- Match results display overlaps, shared tags, and bridges to adjacent communities.

## Acceptance Tests / Test Plan
- Vibe Check does not trigger automatic recommendations.
- Taste Profile requires user opt‑in.

## Future Work & Open Questions
- V1 scope: collect taste tags and optional scan data; no Vibe Check UI.
- V2 scope: full Vibe Check interactions on eligible entities.

## References
- `docs/canon/Legacy Narrative plus Context .md`
