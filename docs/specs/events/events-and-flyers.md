# Events and Flyers

**ID:** `EVENTS-FLYERS`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-07-06`

## Overview & Purpose
Defines Scene-bound events, event discovery surfaces, and event-bound flyer artifacts without introducing recommendation behavior.

## User Roles & Use Cases
- Promoters (registered capability) create and manage events via Print Shop.
- Artists create events for shows and touring stops.
- Listeners discover local events, receive published followed-source events in
  calendar context, and collect attendance artifacts after verification.
- Event creation remains source-facing; listeners are discovery/follow/attendance participants rather than event creators through Print Shop.

## Functional Requirements
- Events are Scene-bound objects with explicit locality context.
- Event creation entrypoint is Print Shop for uniform creator workflow.
- Event surfaces are descriptive and not algorithmically ranked.
- Event distribution occurs through source updates, approved calendar behavior, and flyer/artifact circulation rather than BLAST.
- Source event creation/planning may remain private or unpublished; a source
  event does not become public, community-calendar-visible, feed-visible, or
  follower-calendar-visible until its creator explicitly publishes it.
- Future social-source import/autofill may assist event creation from a band's
  official connected or supplied external accounts/links. Imported event-like
  data must enter as a source-facing draft/suggestion for creator review, not
  as an automatically published UPRISE event.
- Connected event-account sources, such as a source-owned Facebook Page,
  Eventbrite/Bandsintown profile, official site calendar, or equivalent provider
  may be explored as later structured import sources when the source owns the
  account and the provider API/terms allow it.
- When an artist/band/promoter/source publishes an event, followers of that
  source should automatically receive the published event in their calendar.
- Creator-published source events can appear on the community calendar.
- Flyers are attendance artifacts minted from Proof-of-Support workflows.
- Event artifact issuance follows Print Shop run constraints (service issuance, not marketplace fulfillment).
- Event action grammar:
  - `Add` means add to calendar where an approved event/calendar surface exists
  - current Plot Events rows are read-only and must not expose inline calendar mutation controls
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
  - promoter capability can create a promoter-lane event
  - Artist/Band event creation must include an explicitly selected managed `artistBandId`
  - event writes require an active city-tier Home Scene community anchor
- Backing model:
  - `Event` with core metadata, location coordinates, `communityId`, `createdById`.

### Deferred (Not Implemented Yet)
- Event update/delete endpoints.
- Event draft/published state contract, community-calendar visibility, and
  follower-calendar delivery.
- Social-source event import/autofill from connected official accounts or
  supplied links.
- Structured event-account connection/import from approved providers.
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
- Plot Events tab uses `/communities/:id/events` with the current Plot/Home Scene community context.
- Current listener-facing Plot Events listings are read-only and do not expose inline add-to-calendar/calendar mutation controls.
- Event detail presentation remains API-backed read-only.
- Event writes originate in Print Shop (web flow), not standalone mobile event creation.
- Event write entry remains source-facing through Print Shop; listener-facing event surfaces are read-oriented unless a specific approved calendar/attendance surface is in scope.
- Source-facing event/calendar planning may include draft or private events
  that are not visible to the community and are not delivered to followers.
- Social-source event import/autofill, when later activated, should prefill
  creator-reviewed source event drafts and preserve the original source URL or
  evidence reference. It must not scrape restricted data, bypass source
  permissions, or publish without explicit creator action.
- UPRISE-owned shared social accounts must not become the canonical owner for
  band/source events unless a future source/venue/promoter ownership policy
  explicitly approves that model.
- Published source events should automatically appear in follower calendars once
  the event publication and follower-calendar delivery contract is implemented.
- Published source events should appear on the community calendar once the
  creator-publication and community-calendar visibility contract is implemented.
- Artist/Band Print Shop event writes must attach the selected managed source via `artistBandId`; promoter-capability writes may remain promoter-lane events without an Artist/Band source link.
- Event pages are not blast targets under the current signal-action contract.
- `/print-shop` now carries the minimum creator-facing event-create form for the published write lane.
- Flyer displays and redemption UI are deferred.

## Acceptance Tests / Test Plan
- `GET /events` and `GET /events/:id` return authenticated event data.
- Event creation must enforce promoter capability or explicit managed Artist/Band source ownership.
- Event creation must reject inactive/non-city community anchors.
- Event publication must not deliver draft/unpublished events to follower
  calendars.
- Event publication must not show draft/unpublished events on the community
  calendar.
- Social-source import/autofill must create unpublished drafts/suggestions and
  require explicit owner/member permission before publish.
- Flyer minting/collection must require verified attendance/support proof or equivalent promoter-controlled claim flow.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
- `docs/specs/economy/print-shop-and-promotions.md`
