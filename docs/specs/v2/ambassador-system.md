# Ambassador System

**ID:** `V2-AMBASSADOR`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

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

## Non-Functional Requirements
- No algorithmic promotion of ambassadors.
- Service visibility is descriptive only.

## Architectural Boundaries
- Ambassador services do not affect Fair Play or discovery ranking.

## Data Models & Migrations
- AmbassadorProfile
- ServiceOffering
- BookingRequest
- BookingHistory

## API Design
- TBD

## Web UI / Client Behavior
- Discovery Pass users can opt into Ambassador visibility.

## Acceptance Tests / Test Plan
- Ambassador profiles visible only when opted‑in.
- Booking actions logged.

## References
- `docs/canon/Legacy Narrative plus Context .md`
