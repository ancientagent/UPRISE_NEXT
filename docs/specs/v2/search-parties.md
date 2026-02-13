# Search Parties

**ID:** `V2-SEARCH`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines collaborative discovery groups where member actions benefit the entire party.

## User Roles & Use Cases
- A user creates a Search Party and invites up to 10 members.
- Members share discoveries through explicit actions.

## Functional Requirements
- Search Parties are opt‑in groups.
- Shared actions can include ADDs, FOLLOWs, and Scene access based on party settings.
- Members can opt out of specific sharing categories.
- Parties have configurable focus (music community, region, mood) and duration.
- Party statistics include discoveries, activity, and geographic spread.

## Non-Functional Requirements
- No automated recommendations or algorithmic pushing.
- Discovery remains explicit and user‑driven.

## Architectural Boundaries
- Party sharing does not affect Fair Play rotation or voting.

## Data Models & Migrations
- SearchParty
- PartyMember
- PartySettings
- PartyActivity

## API Design
- TBD

## Web UI / Client Behavior
- Party creation flow includes name, focus, settings, duration.
- Shared collections visible to members.

## Acceptance Tests / Test Plan
- Shared actions propagate according to settings.
- Members can opt out of specific sharing types.

## References
- `docs/canon/Legacy Narrative plus Context .md`
