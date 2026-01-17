# Deck vs. Broadcast Architecture (Artist Deck & Broadcast Entries)

**ID:** `COMMUNITY-BROADCAST-01`  
**Status:** `draft`  
**Owner:** `UPRISE Database Engineer`  
**Last Updated:** `2026-01-16`

## Overview & Purpose
- Separate **artist input** (what an artist is actively queuing/playing) from **community broadcast state** (what the platform is currently propagating).
- Persist the artist’s current hand ("deck") independently from broadcast aggregation to prevent feedback loops and simplify propagation logic.
- Introduce hierarchical community tiers to support city → state → nation propagation.

## User Roles & Use Cases
- **Artist**: Curates a current deck of tracks and an on-air message.
- **Listeners (City)**: Join city communities and see local activity.
- **Broadcast Consumers (State/Nation)**: See tracks that hit propagation thresholds across cities.

## Functional Requirements
- [ ] Persist a 1:1 **ArtistDeck** per artist user with ordered track slots and an optional on-air message.
- [ ] Add **Community tiering** with CITY, STATE, and NATION values.
- [ ] Support **Community hierarchy** via a parent relationship (City → State → Nation).
- [ ] Track **BroadcastEntry** records for state/nation communities when a track passes propagation thresholds.
- [ ] Restrict **CommunityMember** records to CITY-tier communities.

## Non-Functional Requirements
- Performance: Broadcast lookups should be indexable by community and track.
- Security: Web tier must not access Prisma or DB secrets.
- Reliability: Broadcasting should be recoverable from persisted entries.
- Observability: Broadcast propagation should be traceable via timestamps.
- Error handling: Reject membership or broadcast writes that violate tier rules.

## Architectural Boundaries
- Web tier: no DB access/secrets in `apps/web` (see `apps/web/WEB_TIER_BOUNDARY.md`).
- Contracts: shared types live in `packages/types` and should remain backwards-compatible where possible.
- Data tier: PostGIS queries must be documented and tested (see `docs/RUNBOOK.md`, `docs/PROJECT_STRUCTURE.md`).
- Environment variables: document required env vars and which tier consumes them.

## Data Models & Migrations
### Prisma Models
- Model(s) added/changed:
  - `Community` adds `tier` and `parentId` (self-relation).
  - `ArtistDeck`, `ArtistDeckSlot`, `OnAirMessage` for artist input.
  - `BroadcastEntry` for propagation output.
- Relationships:
  - `User` 1:1 `ArtistDeck`.
  - `ArtistDeck` 1:N `ArtistDeckSlot`.
  - `ArtistDeck` 0:1 `OnAirMessage`.
  - `Community` hierarchy via `parentId`.
  - `Community` 1:N `BroadcastEntry`.
  - `Track` 1:N `BroadcastEntry`.
- Indexes / constraints:
  - Unique deck slots per artist deck and position.
  - Unique broadcast entry per community + track.
  - Enforce **CITY-only** membership and **STATE/NATION-only** broadcast entries via DB/app constraints.

### Migrations
- Migration name(s): `add-community-tier-artist-deck-broadcast-entry` (proposed).
- Backfill strategy:
  - Default existing communities to `CITY`.
  - Populate `parentId` where known (if existing hierarchy data exists).
- Rollback considerations:
  - Remove tier/parent columns after safely deleting dependent rows.

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| TBD    | TBD  | TBD  | Broadcast propagation API is out of scope for this migration. |

### Request/Response
- Request schema: TBD
- Response schema: TBD
- Error codes: TBD

## Web UI / Client Behavior
- Routes/pages: No UI changes in this migration.
- Components: N/A
- Data fetching: N/A
- Real-time behavior: N/A
- Loading/empty/error states: N/A

## Acceptance Tests / Test Plan
- Unit tests:
  - Enforce deck slot position uniqueness.
  - Validate tier rules for membership and broadcast entry creation.
- Integration tests:
  - Create artist deck with ordered slots and message.
  - Propagate track into state/nation broadcast entries.
- E2E tests (if applicable): N/A
- Manual verification checklist:
  - Ensure city membership creation fails for non-CITY communities.
  - Ensure broadcast entry creation fails for CITY communities.

## Future Work & Open Questions
- Propagation thresholds and scoring algorithm.
- Deck size limits and rotation rules.
- On-air message formatting rules and expiration.
