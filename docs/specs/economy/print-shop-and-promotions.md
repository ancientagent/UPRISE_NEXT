# Print Shop and Promotions

**ID:** `ECON-PRINTSHOP`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-20`

## Overview & Purpose
Defines the Promotions surface and the Print Shop issuance model. The Print Shop is infrastructure for limited‑run digital artifacts and Proof‑of‑Support, not a marketplace.

## User Roles & Use Cases
- Artists and promoters purchase Runs to issue digital artifacts.
- Promoters create events from Print Shop as the uniform event-creation entrypoint.
- Businesses submit promotions through a Print Shop-attached business account, whether or not the business has a broader in-app presence/profile.
- Listeners carry or redeem Offers explicitly.
- Print Shop itself is source-facing infrastructure, not a listener-facing creation surface.

## Functional Requirements
- Promotions displays local offers and paid placements within explicit scope.
- Print Shop sells **Runs** (issuance capacity), not retail inventory.
- Minting is internal database issuance (non-blockchain).
- Print Shop cannot include warehousing/shipping/fulfillment logic.
- Promotional Packs provide boost-style ad reach in Promotions surfaces only.
- Proof-of-Support may mint artifacts and award Activity Points.
- Offers propagate only by explicit user carry/redeem action.
- Print Shop and promotions must never alter Fair Play, propagation thresholds, or civic authority.
- For current MVP phase, purchasable print artifacts focus on event fliers for touring workflows.
- Business promotion submissions are auto-published in current phase (no pre-publish moderation queue).
- Business promotion submission remains account-attached even when the business does not maintain a broader in-app source/profile surface.

### Implemented Now
- No Print Shop API/domain model yet.
- Read-only Promotions surface endpoint:
  - `GET /communities/:id/promotions` (scene-scoped projection from promotion/offer signals).

### Deferred (Not Implemented Yet)
- Run purchase and issuance lifecycle.
- Offer creation/carry/redeem workflows.
- Proof-of-Support verification and artifact minting.
- Promotional pack targeting and billing integration.
- Dedicated Promotions domain models (`Offer`, billing linkage, carry/redeem ledger) beyond read projection.
- Limited flier minting variants are deferred (not required in current MVP phase).
- Shirt creation flows are deferred until avatar-wearable framing is implemented; shirts may appear as non-actionable "coming soon" catalog entries.

## Non-Functional Requirements
- No marketplace behavior, resale, or bidding.
- No algorithmic boosting of Offers or artifacts.
- No behavioral recommendation or ranking changes from paid Promotions.

## Architectural Boundaries
- Print Shop is an issuance infrastructure surface linked to Events/Promotions workflows.
- Artifacts are participation records/signals, not commodities.
- Paid distribution is explicit-scope ad infrastructure, not algorithmic recommendation.
- Print Shop creation/manage flows belong to source operators (artists/promoters), not to listeners acting in ordinary discovery mode.

## Data Models & Migrations
### Planned Models
- `Run`
- `Artifact` (or generalized materialized signal record)
- `Offer`
- `ProofOfSupport`
- optional redemption/carry ledger model

### Migrations
- None yet.

## API Design
### Implemented Endpoint
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/communities/:id/promotions` | required | Scene-scoped promotions/offers read surface |

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/print-shop/runs` | required | Purchase/create issuance run |
| POST | `/print-shop/events` | required | Create event via Print Shop flow |
| POST | `/print-shop/runs/:id/mint` | required | Mint artifact within run capacity |
| POST | `/offers` | required | Create offer signal |
| POST | `/offers/:id/carry` | required | Carry offer into user context |
| POST | `/offers/:id/redeem` | required | Redeem offer |
| POST | `/proof-support` | required | Submit/verify support proof |

## Web UI / Client Behavior
- Plot Promotions tab lists scene-scoped promotions/offers via `/communities/:id/promotions`.
- Print Shop is web-first for creators and is the source of event creation + flier purchasing.
- Print Shop remains source-facing only:
  - artists/promoters use it to create/manage event-related issuance flows,
  - listeners do not enter Print Shop to create events, purchase runs, or manage issuance.
- Promotional Pack setup requires explicit target scope selection (city/state/community).
- Businesses submit promotions from a Print Shop-attached account even when they do not have a broader in-app profile/presence.
- Business submission should be treated as part of a business-facing source dashboard, not as anonymous one-off intake.
- Business promotion submissions auto-publish for current phase and are handled by post-publish moderation policy.
- Artifact collections are visible on profiles.

## Acceptance Tests / Test Plan
- Runs are finite and non‑replenishable.
- Offers do not appear without explicit user action.
- Paid promotions never alter Fair Play ordering or tier progression.

## References
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Revenue Strategy Canonon.md`
