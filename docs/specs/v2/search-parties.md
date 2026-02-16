# Search Parties

**ID:** `V2-SEARCH`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

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

### Implemented Now
- No Search Party models/endpoints currently exist.
- Building-block actions (`ADD`, collections, follow graph) exist and can be reused.

### Deferred (Not Implemented Yet)
- Group creation/invite/accept lifecycle.
- Party collection aggregation from member ADD actions.
- Group-scoped permissions and moderation controls.

## Non-Functional Requirements
- No automated recommendations or algorithmic pushing.
- Discovery remains explicit and user‑driven.

## Architectural Boundaries
- Party sharing does not affect Fair Play rotation or voting.

## Data Models & Migrations
### Planned Models
- `SearchParty`
- `PartyMember`
- `PartyCollection`
- optional `PartyInvite`

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/search-parties` | required | Create private party |
| POST | `/search-parties/:id/invites` | required | Invite user |
| POST | `/search-parties/:id/join` | required | Accept invite/join |
| GET | `/search-parties/:id/collection` | required | Read shared party collection |

## Web UI / Client Behavior
- Party creation flow includes name and member invites.
- Shared party collection is visible to members.

## Acceptance Tests / Test Plan
- ADDs by a member appear in the party collection.
- Non-members cannot read party collection or metadata.

## References
- `docs/canon/Legacy Narrative plus Context .md`
