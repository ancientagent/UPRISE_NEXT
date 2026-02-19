# Message Boards, Groups, and Blast

**ID:** `SOCIAL-MSG`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines scene communication surfaces and BLAST behavior. Public discourse is Scene-bound; private communication is group-scoped; BLAST remains a signal action, not a chat primitive.

## User Roles & Use Cases
- Listeners participate in Scene-wide public discussions.
- Group members coordinate privately (for example Search Parties in V2).
- Artists, businesses, events, and promoters can publish one-way updates to followers.
- Users use BLAST to publicly carry signals into Scene activity surfaces.

## Functional Requirements
- Public communication is restricted to Scene-bound boards/threads.
- Group communication is private to group membership.
- Sect-level discourse occurs inside Scene social structures, not as separate authority layers.
- One-way entity-to-follower messaging is supported for registered entities.
- No user-to-user open DM surface outside approved group contexts.
- BLAST is an explicit signal propagation action and appears in S.E.E.D activity context.

### Implemented Now
- BLAST action persistence exists:
  - `POST /signals/:id/blast` upserts `SignalAction(type='BLAST')`.
- Follow graph exists:
  - `POST /follow` creates/upserts entity follow rows.
- No message board/group/chat models or endpoints currently exist.

### Deferred (Not Implemented Yet)
- Scene message boards, posts, and threads.
- Group membership + group messaging.
- Sect thread/room surfaces.
- One-way entity messaging timelines.

## Non-Functional Requirements
- No algorithmic amplification, ranking, or recommendation in social communication.
- Clear channel separation (public Scene vs private group).
- Auditability for moderation actions on social content.

## Architectural Boundaries
- Social discourse is Scene-scoped by default.
- BLAST is a signal action and cannot become private messaging transport.
- Social systems must not bypass canon locality and authority constraints.

## Data Models & Migrations
### Implemented Models
- `SignalAction` (includes BLAST action rows)
- `Follow`

### Planned Models
- `MessageBoard`
- `Post`
- `Thread`
- `Group`
- `GroupMessage`
- `SectChannel` or equivalent scoped-thread model

## API Design
### Implemented Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signals/:id/blast` | required | Record BLAST action for a signal |
| POST | `/follow` | required | Follow an entity |

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/social/boards/:sceneId` | required | List scene boards |
| POST | `/social/boards/:sceneId/posts` | required | Create scene post |
| POST | `/social/groups` | required | Create group |
| POST | `/social/groups/:id/messages` | required | Send group message |

## Web UI / Client Behavior
- Current Plot shell includes a Social tab placeholder only.
- Future Social tab hosts boards, threads, and group access.
- BLAST-origin activity is visible through shared activity surfaces (non-personalized).

## Acceptance Tests / Test Plan
- BLAST action is idempotent per user/signal/action type.
- Follow action is idempotent per user/entity.
- When social boards ship, enforce Scene scoping and group-only private messaging.

## Future Work & Open Questions
- Finalize moderation and report taxonomy for social content.
- Define cross-scene group constraints for V2 Search Parties.
- Lock social retention and archival policy.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
