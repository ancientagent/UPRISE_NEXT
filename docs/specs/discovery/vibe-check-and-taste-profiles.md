# Vibe Check and Taste Profiles

**ID:** `DISC-VIBE`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines Vibe Check as a user‑initiated discovery tool and the optional taste profile used for comparison.

## User Roles & Use Cases
- Listener runs a Vibe Check between themselves and a Scene, Event, Mix, or another user.
- Listener opts into taste profile import or questionnaire.

## Functional Requirements
- Vibe Check is user‑initiated only.
- Taste Profile is optional and static unless refreshed.
- Taste Profile can be built by questionnaire or external library import.
- Vibe Check compares overlap and displays a match percentage.
- Vibe Check is navigational context, not a recommendation engine.
- System may recommend **Scenes** based on explicit profile inputs or activity, without promoting specific artists.

## Non-Functional Requirements
- No algorithmic content recommendation or ranking.
- No predictive personalization beyond explicit user action.

## Architectural Boundaries
- Vibe Check never auto‑surfaces content.
- Discovery must not affect Fair Play rotation.

## Data Models & Migrations
- TasteProfile
- VibeCheckResult

## API Design
- TBD

## Web UI / Client Behavior
- Vibe Check is accessed explicitly via discovery tools.
- Match results display overlaps and differences.

## Acceptance Tests / Test Plan
- Vibe Check does not trigger automatic recommendations.
- Taste Profile requires user opt‑in.

## References
- `docs/canon/Legacy Narrative plus Context .md`
