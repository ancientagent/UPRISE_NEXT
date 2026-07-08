# Shared Listen / Jam Space

**ID:** `V2-ROOMS`
**Status:** `deferred`
**Owner:** `platform`
**Last Updated:** `2026-07-07`

## Overview & Purpose
Defines deferred shared listening inside listener-owned collection/profile space.
The preferred direction is not a public Social-tab room by default: a listener
invites other listener avatars into their decorated space for synchronized
listening and a lightweight playful avatar interaction.

## User Roles & Use Cases
- A listener hosts a Shared Listen / Jam Space from their collection/profile
  space.
- Invited listener avatars enter that user's decorated space.
- Participants share a selected track/session without changing RADIYO/Fair Play
  authority.
- A later playful layer may let avatars perform a silly mini dance/idle
  interaction while listening.

## Functional Requirements
- Shared Listen is a deferred listener-space feature.
- Shared Listen should originate from the listener's collection/profile space,
  not from public Feed, Artist Profile, or the RADIYO wheel.
- Initial scope should be private or invite-only.
- Shared playback should synchronize the active shared track/session across
  invited participants.
- Avatar presence should use listener avatars and respect future avatar clothing,
  merch, patch, and decoration systems.
- The mini dance interaction is lightweight/playful and must not become a public
  ranking, popularity, or propagation mechanic.
- Shared Listen must not expose private inventory, collection items, or decorated
  space objects unless the owner has made them visible for that context.

### Implemented Now
- No Listening Room backend or UI currently exists.

### Deferred (Not Implemented Yet)
- Session lifecycle management (invite/join/leave/end).
- Playback synchronization protocol.
- Avatar presence and lightweight dance/idle interaction.
- Visibility controls for public/decorated inventory atmosphere versus private
  inventory.
- Moderation, reporting, blocking, and safety controls for invite sessions.

## Non-Functional Requirements
- Shared Listen should feel lightweight and optional.
- Shared Listen must not degrade normal RADIYO, Plot, or collection performance.
- Only one player/audio engine should own active playback state; mode/source
  changes must be explicit and recoverable.

## Architectural Boundaries
- Shared Listen does not alter Fair Play rotation.
- Shared Listen does not create votes, ranking authority, propagation priority,
  source metrics, or civic evidence by default.
- Shared Listen is not a user-to-user DM, comment thread, public Social tab, or
  generic chat surface by default.
- Shared Listen must not replace Artist Profile, Plot Feed, Events, Archive, or
  public source updates.
- If future public/community listening rooms are reintroduced, they need a
  separate explicit owner-spec update; do not derive them from this listener
  Jam Space direction.

## Data Models & Migrations
### Candidate Future Models
- `SharedListenSession`
- `SharedListenParticipant`
- `SharedListenPlaybackState`
- `SharedListenAvatarState`
- optional invitation / visibility / moderation models

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/shared-listen/sessions` | required | Create invite-only shared listen session |
| POST | `/shared-listen/sessions/:id/invite` | required | Invite a listener avatar |
| POST | `/shared-listen/sessions/:id/join` | required | Join invited session |
| POST | `/shared-listen/sessions/:id/playback` | required | Update synchronized playback state |
| POST | `/shared-listen/sessions/:id/avatar-state` | required | Update lightweight avatar/dance state |
| GET | `/shared-listen/sessions/:id` | required | Fetch session state |

## Web UI / Client Behavior
- Shared Listen entry belongs in collection/profile space after that surface is
  activated.
- The host's decorated inventory/profile atmosphere may provide the visible
  room background when the host exposes it for the session.
- Participants appear as avatars in the host's space.
- The mini dance interaction is optional and lightweight.
- Plot Feed, Events, Archive, and RADIYO remain separate from the shared listen
  space.

## Acceptance Tests / Test Plan
- Shared playback is synchronized for invited participants.
- Invite-only sessions are not visible or joinable by non-invited users.
- Private inventory items are not exposed without explicit visibility.
- Session state updates are ordered and resilient to reconnects.
- Shared Listen does not mutate Fair Play, votes, Feed ranking, or RADIYO
  rotation.

## Founder Clarification

- 2026-07-07: Shared Listen / Jam Space should be a later feature where avatars
  can be invited into a user's decorated collection/profile space for shared
  listening and a silly mini dance game. This supersedes the older default
  framing of Listening Rooms as Social-tab public rooms where the two conflict.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/founder-sessions/2026-07-07_shared-listen-jam-space.md`
