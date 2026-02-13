# Listening Rooms

**ID:** `V2-ROOMS`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

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

## Non-Functional Requirements
- Rooms are Scene‑bound unless created by private groups.

## Architectural Boundaries
- Listening Rooms do not alter Fair Play rotation.

## Data Models & Migrations
- ListeningRoom
- RoomMember
- RoomPlaybackState

## API Design
- TBD

## Web UI / Client Behavior
- Public rooms visible to Scene members.
- Private rooms visible to group members only.

## Acceptance Tests / Test Plan
- Shared playback is synchronized.
- Private rooms are not visible outside the group.

## References
- `docs/canon/Legacy Narrative plus Context .md`
