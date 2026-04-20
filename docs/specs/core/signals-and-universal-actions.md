# Signals and Universal Actions

**ID:** `CORE-SIGNALS`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-04-15`

## Overview & Purpose
Defines Signals as carried content units and the actions applied to them. This spec covers implemented contracts, intended action grammar, and the canonical constraints that prohibit algorithmic interpretation.

Precedence note:
- for the broader action/class matrix, use `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md` first
- this spec keeps the live signal API in scope while calling out known naming/runtime debt

Signals must remain distinct from sources:
- follows subscribe to source/entity updates
- signal actions apply to the carried signal object
- not every signal exposes every action

## User Roles & Use Cases
- Listeners create signals (where allowed) and perform current live signal actions.
- Users FOLLOW entities for awareness.
- Users keep signals in typed collection shelves on their profile.

## Functional Requirements
- A Signal is a discrete unit created or propagated through explicit user action.
- Signal-facing actions in the intended model:
  - `Collect`: keep/save a signal in the listener's collection
  - `Blast`: hosted amplification action for currently locked music-distribution signals from the listener's personal-player context
  - `Recommend`: direct recommendation only when the listener already genuinely holds the signal
  - `Play It Loud`: belongs to `RADIYO` listening context and is not part of the signal API contract yet
- Current runtime endpoint debt:
  - the public collect verb now has a compatibility bridge:
    - preferred endpoint: `/signals/:id/collect`
    - legacy compatibility endpoint: `/signals/:id/add`
  - live signal action rows still use `ADD`
  - direct `SUPPORT` is no longer part of the live signal API contract
  - `Support` should be treated as a derived backing state rather than a direct signal button
- Source-facing action boundary:
  - `FOLLOW` applies to the source/entity, not the signal
- Source/signal boundary:
  - signal actions apply only to signal objects
  - do not treat source pages as addable, blastable, or supportable signals
- Action application is idempotent at user/signal/action scope.
- Collections are profile-bound and separate from Fair Play.
- Public collection visibility is opt-in (`collectionDisplayEnabled`).
- Signal propagation is explicit only; no algorithmic surfacing or recommendation.
- Current confirmed signal classes:
  - `single`
  - `Uprise`
- Current confirmed blastable signals:
  - `single`
  - `Uprise`
- Current listening-context split:
  - `RADIYO` wheel uses `Play It Loud`
  - personal player / user space uses `Blast`

## Non-Functional Requirements
- Signals are descriptive, not authoritative.
- Metrics are descriptive and must not become governance inputs.
- Service behavior must remain deterministic and idempotent for repeated action calls.

## Architectural Boundaries
- Platform must not interpret, score, or rank signals.
- Signals and follows are awareness interactions; they do not grant civic authority.
- Signal actions must not affect Fair Play tier progression.
- Do not treat every source object as a blastable or addable signal.
- Do not treat artist pages, event pages, or flyer artifacts as blast targets unless a later contract explicitly widens blast semantics.
- Do not treat event-bound flyer artifacts as default signal classes under the current founder lock.

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
| POST | `/signals/:id/collect` | required | Preferred current collect/save endpoint for signals |
| POST | `/signals/:id/add` | required | Legacy compatibility alias for collect/save |
| POST | `/signals/:id/blast` | required | Record BLAST action |
| POST | `/signals/:id/recommend` | required | Record RECOMMEND action |
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
- Naming debt note:
  - signal action rows still persist `ADD` while the public-facing verb is now `Collect`

## Web UI / Client Behavior
- Feed surfaces only explicit community actions.
- Collections render as typed shelves on user profile.
- Other users only see shelves when profile display toggle is enabled.
- Follow actions subscribe users to future entity updates without changing ranking/placement logic.
- Active source-side tools remain separate from signal actions; source dashboard/Print Shop behavior must not be mistaken for signal interaction grammar.
- Artist/source pages must not surface synthetic source-level signal actions.

## Acceptance Tests / Test Plan
- `POST /signals` creates signal rows with optional metadata/community.
- Repeating `ADD`/`BLAST` for same user/signal returns idempotent result (no duplicate rows).
- Repeating `RECOMMEND` for same user/signal returns idempotent result (no duplicate rows).
- Repeating `FOLLOW` for same user/entity returns idempotent result.
- ADD maps signals to fixed shelves (`singles`, `uprises`, `posters`, `fliers`, merch shelves) and links `CollectionItem`.
- Blast coverage is validated only for currently blastable music-distribution signal classes (`single`, `Uprise`) until additional signal-specific rules are locked.
- `Play It Loud` is a player-context action only; no signal endpoint is locked for it in this spec yet.

## Future Work & Open Questions
- Add discourse signals (post/thread) service contracts (currently spec-level only).
- Reconcile `ADD` naming to intended `Collect` grammar.
- Reconcile remaining stats/docs debt that still refers to historical `support` terminology.
- Add feed projection endpoints for scene-scoped S.E.E.D rendering.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
