# Search Parties

**ID:** `V2-SEARCH`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines private discovery groups where member ADDs are shared into a group collection.

## User Roles & Use Cases
- A user creates a Search Party and invites members.
- Members share discoveries by adding songs to their collection.

## Functional Requirements
- Search Parties are private, opt‑in groups.
- When a member ADDs a song to their collection, it is shared into the party collection.
- Party collection is visible to members only.
- No automatic sharing of follows or other actions.

## Non-Functional Requirements
- No automated recommendations or algorithmic pushing.
- Discovery remains explicit and user‑driven.

## Architectural Boundaries
- Party sharing does not affect Fair Play rotation or voting.

## Data Models & Migrations
- SearchParty
- PartyMember
- PartyCollection

## API Design
- TBD

## Web UI / Client Behavior
- Party creation flow includes name and member invites.
- Shared party collection is visible to members.

## Acceptance Tests / Test Plan
- ADDs by a member appear in the party collection.

## References
- `docs/canon/Legacy Narrative plus Context .md`
