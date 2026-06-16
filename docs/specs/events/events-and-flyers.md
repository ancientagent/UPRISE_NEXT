# Events and Flyers

**ID:** `EVENTS-FLYERS`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-04-14`

## Overview & Purpose
Defines Scene-bound events, event discovery surfaces, and event-bound flyer artifacts without introducing recommendation behavior.

## User Roles & Use Cases
- Promoters (registered capability) create and manage events via Print Shop.
- Artists create events for shows and touring stops.
- Listeners discover local events, add events into calendar context, and collect attendance artifacts after verification.
- Event creation remains source-facing; listeners are discovery/follow/attendance participants rather than event creators through Print Shop.

## Functional Requirements
- Events are Scene-bound objects with explicit locality context.
- Event creation entrypoint is Print Shop for uniform creator workflow.
- Event surfaces are descriptive and not algorithmically ranked.
- Event distribution occurs through source updates, explicit calendar behavior, and flyer/artifact circulation rather than BLAST.
- Flyers are attendance artifacts minted from Proof-of-Support workflows.
- Event artifact issuance follows Print Shop run constraints (service issuance, not marketplace fulfillment).
- Event action grammar:
  - current direct listener verb is `Add`, meaning add to calendar
  - event pages are not blast targets
  - event pages are not follow targets under the intended system model
- Flyer artifact rule:
  - flyer is event-bound artifact, not a default current MVP signal class
  - promoter controls acquisition method
  - common acquisition path is QR-based collection at the physical event

### Implemented Now
- Read endpoints:
  - `GET /events`
  - `GET /events/:id`
  - `GET /communities/:id/events` (scene-scoped listing for Plot Events surface)
- Source-facing event write endpoint:
  - `POST /print-shop/events`
- Backing model:
  - `Event` with core metadata, location coordinates, `communityId`, `createdById`.

### Deferred (Not Implemented Yet)
- Event creation endpoint inside Print Shop flow.
- Event update/delete endpoints.
- Promoter capability checks and registrar-gated creation flow.
- Attendance proof verification pipeline.
- Flyer minting and profile artifact rendering.
- Touring distribution tooling and promotional pack linkage.

## Non-Functional Requirements
- Event discovery must remain explicit and locality-bound.
- Event/flyer mechanics must not affect Fair Play rotation or tier progression.

## Architectural Boundaries
- Events are Scene-bound unless explicitly configured for multi-scene touring behavior.
- Flyers are participation records, not speculative assets.
- Print Shop issuance cannot introduce inventory/shipping logic.
- Events are objects, not sources.

## Data Models & Migrations
### Implemented Models
- `Event`

### Planned Models
- `FlyerArtifact` (or generalized materialized signal record)
- `AttendanceProof`
- optional venue normalization model (if needed)

## API Design
### Implemented Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/events` | required | List events (paginated) |
| GET | `/events/:id` | required | Fetch event detail |
| GET | `/communities/:id/events` | required | Scene-scoped events listing (supports `limit`, `includePast`) |

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| PATCH | `/events/:id` | required | Update owned event |
| POST | `/events/:id/proof` | required | Submit attendance/support proof |
| POST | `/events/:id/flyers/mint` | required | Mint attendance artifact after verification |

## Web UI / Client Behavior
- Plot includes an Events tab shell.
- Plot Events tab now uses `/communities/:id/events` and selected community anchor from Statistics.
- Event detail presentation remains API-backed read-only.
- Event writes originate in Print Shop (web flow), not standalone mobile event creation.
- Event write entry remains source-facing through Print Shop; listener-facing event surfaces are read / add-to-calendar / attendance oriented.
- Event pages are not blast targets under the current signal-action contract.
- `/print-shop` now carries the minimum creator-facing event-create form for the published write lane.
- Flyer displays and redemption UI are deferred.

## Acceptance Tests / Test Plan
- `GET /events` and `GET /events/:id` return authenticated event data.
- Event creation must enforce registrar/capability gating when write routes are added.
- Flyer minting/collection must require verified attendance/support proof or equivalent promoter-controlled claim flow.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
- `docs/specs/economy/print-shop-and-promotions.md`
