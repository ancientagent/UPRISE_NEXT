# The Plot and Scene Dashboard

**ID:** `COMM-PLOT`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines The Plot as the Home Scene dashboard where communities S.E.E.D. their Scene.

## User Roles & Use Cases
- Listeners view community activity and access civic actions.
- Artists and promoters publish events and updates.
- Communities review scene statistics and maps.

## Functional Requirements
- The Plot is the primary Home Scene interface.
- Tabs include:
  - Feed (default)
  - Events
  - Promotions
  - Statistics / Scene Map
  - Social (V2)
- Feed surfaces community actions such as Blasts, new releases, and followed entity updates.
- Registrar is accessed from the Feed.
- Statistics include Activity Score and scene health metrics.
- Events tab shows calendar and upcoming events.
- Promotions tab shows Offers.
- Print Shop issuance is accessed through the Events surface.
- Social tab hosts message boards and listening rooms (V2).

## Non-Functional Requirements
- No personalized ranking or algorithmic feed ordering.
- Feed reflects explicit community actions only.

## Architectural Boundaries
- Plot is a civic interface, not a recommendation surface.
- No private DMs outside group contexts.

## Data Models & Migrations
- TBD

## API Design
- TBD

## Web UI / Client Behavior
- Plot is Home Scene scoped.
- Scene Map and statistics are visible within the Plot.

## Acceptance Tests / Test Plan
- Feed shows community actions only.
- Registrar entry is visible in Feed.
- Promotions and Events surfaces are Scene-bound.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
