# Events and Flyers

**ID:** `EVENTS-FLYERS`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines event creation, distribution, and flyer artifacts within a Scene.

## User Roles & Use Cases
- Promoters create events after registering in the Registrar.
- Artists create events for their own shows.
- Listeners follow events and earn flyers by attendance.

## Functional Requirements
- Promoters and Artists can create events in the WebApp.
- Required fields: title, venue, date/time, event type, ticket price.
- Optional fields: description, flyer image, ticket link, age restrictions, capacity, co‑performers.
- Events appear in the Scene’s Events tab and calendar.
- Event distribution is locality‑based and followable.
- Flyers are attendance artifacts earned through Proof‑of‑Support.
- Event distribution is not algorithmic and not recommendation‑based.

## Non-Functional Requirements
- Event discovery is explicit and locality‑bound.
- Flyers do not affect Fair Play rotation.

## Architectural Boundaries
- Events are Scene‑bound unless explicitly marked as touring.
- Flyers are materialized signals, not marketplace items.

## Data Models & Migrations
- Event
- Venue
- FlyerArtifact
- AttendanceProof

## API Design
- TBD

## Web UI / Client Behavior
- Events tab shows calendar and list views.
- Flyers appear on event detail pages and user collections.

## Acceptance Tests / Test Plan
- Event creation requires Registrar registration (Promoter).
- Flyers mint only after verified attendance.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
