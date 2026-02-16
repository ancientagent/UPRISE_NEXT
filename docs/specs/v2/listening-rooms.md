# Listening Rooms

**ID:** `V2-ROOMS`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines shared listening rooms inside the Social tab of The Plot.

## User Roles & Use Cases
- Community members join public rooms for shared listening.
- Search Parties host private listening sessions.

## Functional Requirements
- Listening Rooms exist in the Social tab.
- Room types:
  - Public rooms for community listening.
  - Private rooms for Search Parties or groups.
- Shared playback synchronized across members.
- Discussion via message boards and/or group chat.

### Implemented Now
- No Listening Room backend or UI currently exists.
- Plot Social surface is currently placeholder-only.

### Deferred (Not Implemented Yet)
- Room lifecycle management (create/join/leave/close).
- Playback synchronization protocol.
- Room chat integration and moderation policy.

## Non-Functional Requirements
- Rooms are Scene‑bound unless created by private groups.

## Architectural Boundaries
- Listening Rooms do not alter Fair Play rotation.

## Data Models & Migrations
### Planned Models
- `ListeningRoom`
- `RoomMember`
- `RoomPlaybackState`
- optional `RoomMessage`

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/listening-rooms` | required | Create room |
| POST | `/listening-rooms/:id/join` | required | Join room |
| POST | `/listening-rooms/:id/playback` | required | Update playback state |
| GET | `/listening-rooms/:id` | required | Fetch room state |

## Web UI / Client Behavior
- Public rooms visible to Scene members.
- Private rooms visible to group members only.

## Acceptance Tests / Test Plan
- Shared playback is synchronized.
- Private rooms are not visible outside the group.
- Room state updates are ordered and resilient to reconnects.

## References
- `docs/canon/Legacy Narrative plus Context .md`
