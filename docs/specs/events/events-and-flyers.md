# Events and Flyers

**ID:** `EVENTS-FLYERS`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines Scene-bound events, event discovery surfaces, and attendance flyer artifacts (materialized signals) without introducing recommendation behavior.

## User Roles & Use Cases
- Promoters (registered capability) create and manage events.
- Artists create events for shows and touring stops.
- Listeners discover local events, follow event-related entities, and collect attendance artifacts after verification.

## Functional Requirements
- Events are Scene-bound objects with explicit locality context.
- Event surfaces are descriptive and not algorithmically ranked.
- Event follow/distribution occurs through explicit user actions.
- Flyers are attendance artifacts minted from Proof-of-Support workflows.
- Event artifact issuance follows Print Shop run constraints (service issuance, not marketplace fulfillment).

### Implemented Now
- Read endpoints:
  - `GET /events`
  - `GET /events/:id`
- Backing model:
  - `Event` with core metadata, location coordinates, `communityId`, `createdById`.

### Deferred (Not Implemented Yet)
- Event creation/update/delete endpoints.
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

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/events` | required | Create event |
| PATCH | `/events/:id` | required | Update owned event |
| POST | `/events/:id/proof` | required | Submit attendance/support proof |
| POST | `/events/:id/flyers/mint` | required | Mint attendance artifact after verification |

## Web UI / Client Behavior
- Plot includes an Events tab shell.
- Event detail presentation is currently API-backed read-only.
- Flyer displays and redemption UI are deferred.

## Acceptance Tests / Test Plan
- `GET /events` and `GET /events/:id` return authenticated event data.
- Event creation must enforce registrar/capability gating when write routes are added.
- Flyer minting must require verified attendance/support proof.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
- `docs/specs/economy/print-shop-and-promotions.md`
