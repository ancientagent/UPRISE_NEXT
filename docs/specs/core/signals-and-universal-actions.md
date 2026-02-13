# Signals and Universal Actions

**ID:** `CORE-SIGNALS`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines Signals as the atomic units of interaction and the universal actions that can be applied to them.

## User Roles & Use Cases
- Listeners ADD, BLAST, and SUPPORT signals.
- Users FOLLOW entities to receive updates.
- Projects and offers propagate only through explicit actions.

## Functional Requirements
- A Signal is a discrete unit of meaning created or promoted through explicit action.
- Signal types include:
  - Core Signals: Songs, Events
  - Discourse Signals: Posts, Threads
  - Economic Signals: Offers
  - Intent Signals: Projects
  - Materialized Signals: Wearables, Flyers, Posters
  - Verification Signals: Proof-of-Support
- Followable entities are not Signals: Artists, Businesses, Promoters. Events may be followed but remain Signals.
- Universal actions:
  - ADD: save a signal to a personal collection
  - FOLLOW: subscribe to an entity’s updates
  - BLAST: public amplification to the community feed
  - SUPPORT: solidarity or material backing for a Project or Artist
- Collections are private, on-demand, and separate from Fair Play.
- Signal propagation is explicit only; no algorithmic surfacing or recommendation.

## Non-Functional Requirements
- Signals are descriptive, not authoritative.
- Signal visibility does not imply legitimacy.

## Architectural Boundaries
- The platform must not interpret, score, or rank signals.
- Metrics are descriptive only and never change propagation rules.

## Data Models & Migrations
### Prisma Models
- Signal (type, metadata, origin Scene)
- SignalAction (ADD, BLAST, SUPPORT)
- Follow
- Collection

### Migrations
- TBD

## API Design
### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signals` | required | Create a signal |
| POST | `/signals/:id/add` | required | Add to collection |
| POST | `/signals/:id/blast` | required | Blast signal |
| POST | `/signals/:id/support` | required | Support signal |
| POST | `/follow` | required | Follow an entity |

## Web UI / Client Behavior
- Feed surfaces only explicit community actions.
- Collections are private and on-demand.

## Acceptance Tests / Test Plan
- Signals never appear without explicit action.
- Collections do not affect Fair Play rotation.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Glossary Canon.md`
