# Ambassador System

**ID:** `V2-AMBASSADOR`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines the Ambassador system (tour guide services) for artists on the road.

## User Roles & Use Cases
- Ambassadors list services in their local area.
- Touring artists find local support.

## Functional Requirements
- Ambassador role is activated through Discovery Pass.
- Service categories include venue recommendations, lodging, transportation, and flyer distribution.
- Map view shows ambassadors by location.
- Booking history and completion tracking are supported.
- Ratings are private between artist and ambassador.
- Platform facilitates connection, not payment.

### Implemented Now
- No Ambassador models, APIs, or map UI currently exist.

### Deferred (Not Implemented Yet)
- Ambassador opt-in/availability lifecycle.
- Service offering and booking flows.
- Private bilateral review workflow.
- Discovery/map indexing for ambassador visibility.

## Non-Functional Requirements
- No algorithmic promotion of ambassadors.
- Service visibility is descriptive only.

## Architectural Boundaries
- Ambassador services do not affect Fair Play or discovery ranking.

## Data Models & Migrations
### Planned Models
- `AmbassadorProfile`
- `ServiceOffering`
- `BookingRequest`
- `BookingHistory`
- optional `ServiceReview`

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/ambassadors/profile` | required | Create/update ambassador profile |
| POST | `/ambassadors/services` | required | Publish service offering |
| POST | `/ambassadors/bookings` | required | Request booking |
| POST | `/ambassadors/bookings/:id/complete` | required | Complete booking |
| POST | `/ambassadors/bookings/:id/review` | required | Submit private review |

## Web UI / Client Behavior
- Discovery Pass users can opt into Ambassador visibility.

## Acceptance Tests / Test Plan
- Ambassador profiles visible only when opted‑in.
- Booking actions logged.
- Ambassador participation does not affect Fair Play rotation or ranking.

## References
- `docs/canon/Legacy Narrative plus Context .md`
