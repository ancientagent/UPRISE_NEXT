# Signals and Universal Actions

**ID:** `CORE-SIGNALS`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-19`

## Overview & Purpose
Defines Signals as atomic units of interaction and the universal actions applied to them. This spec covers implemented contracts and the canonical constraints that prohibit algorithmic interpretation.

## User Roles & Use Cases
- Listeners create signals (where allowed) and perform ADD, BLAST, and SUPPORT.
- Users FOLLOW entities for awareness.
- Users save signals to typed collection shelves on their profile.

## Functional Requirements
- A Signal is a discrete unit created or propagated through explicit user action.
- Universal actions:
  - `ADD`: save to personal collection
  - `BLAST`: explicit public amplification action
  - `SUPPORT`: explicit support action
  - `FOLLOW`: awareness subscription to an entity
- Action application is idempotent at user/signal/action scope.
- Collections are profile-bound and separate from Fair Play.
- Public collection visibility is opt-in (`collectionDisplayEnabled`).
- Signal propagation is explicit only; no algorithmic surfacing or recommendation.

## Non-Functional Requirements
- Signals are descriptive, not authoritative.
- Metrics are descriptive and must not become governance inputs.
- Service behavior must remain deterministic and idempotent for repeated action calls.

## Architectural Boundaries
- Platform must not interpret, score, or rank signals.
- Signals and follows are awareness interactions; they do not grant civic authority.
- Signal actions must not affect Fair Play tier progression.

## Data Models & Migrations
### Prisma Models
- `Signal` (`type`, `metadata`, optional `communityId`, optional `createdById`)
- `SignalAction` (`type`, `userId`, `signalId`) with unique constraint:
  - `(userId, signalId, type)`
- `Follow` (`followerId`, `entityType`, `entityId`) with unique constraint:
  - `(followerId, entityType, entityId)`
- `Collection` (`userId`, `name`) with unique constraint:
  - `(userId, name)`
- `CollectionItem` (`collectionId`, `signalId`) with unique constraint:
  - `(collectionId, signalId)`

### Migrations
- `20260213155806_add_signals_and_collections`

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signals` | required | Create a signal |
| POST | `/signals/:id/add` | required | Add signal to typed shelf + record ADD action |
| POST | `/signals/:id/blast` | required | Record BLAST action |
| POST | `/signals/:id/support` | required | Record SUPPORT action |
| POST | `/follow` | required | Follow an entity by type/id |

### Request/Response
- `POST /signals` request:
  - `type: string`
  - `metadata?: unknown`
  - `communityId?: uuid`
- `POST /follow` request:
  - `entityType: string`
  - `entityId: string`
- Action endpoints are idempotent via upsert and return existing or newly created records.

## Web UI / Client Behavior
- Feed surfaces only explicit community actions.
- Collections render as typed shelves on user profile.
- Other users only see shelves when profile display toggle is enabled.
- Follow actions subscribe users to future entity updates without changing ranking/placement logic.

## Acceptance Tests / Test Plan
- `POST /signals` creates signal rows with optional metadata/community.
- Repeating `ADD`/`BLAST`/`SUPPORT` for same user/signal returns idempotent result (no duplicate rows).
- Repeating `FOLLOW` for same user/entity returns idempotent result.
- ADD maps signals to fixed shelves (`singles`, `uprises`, `posters`, `fliers`, merch shelves) and links `CollectionItem`.

## Future Work & Open Questions
- Add discourse signals (post/thread) service contracts (currently spec-level only).
- Add proof-of-support verification signal contracts.
- Add feed projection endpoints for scene-scoped S.E.E.D rendering.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
