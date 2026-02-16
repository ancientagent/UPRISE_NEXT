# Print Shop and Promotions

**ID:** `ECON-PRINTSHOP`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines the Promotions surface and the Print Shop issuance model. The Print Shop is infrastructure for limited‑run digital artifacts and Proof‑of‑Support, not a marketplace.

## User Roles & Use Cases
- Artists and promoters purchase Runs to issue digital artifacts.
- Businesses publish Offers in Promotions.
- Listeners carry or redeem Offers explicitly.

## Functional Requirements
- Promotions displays local offers and paid placements within explicit scope.
- Print Shop sells **Runs** (issuance capacity), not retail inventory.
- Minting is internal database issuance (non-blockchain).
- Print Shop cannot include warehousing/shipping/fulfillment logic.
- Promotional Packs provide boost-style ad reach in Promotions surfaces only.
- Proof-of-Support may mint artifacts and award Activity Points.
- Offers propagate only by explicit user carry/redeem action.
- Print Shop and promotions must never alter Fair Play, propagation thresholds, or civic authority.

### Implemented Now
- No Print Shop API/domain model yet.
- No Promotions API/domain model yet.

### Deferred (Not Implemented Yet)
- Run purchase and issuance lifecycle.
- Offer creation/carry/redeem workflows.
- Proof-of-Support verification and artifact minting.
- Promotional pack targeting and billing integration.

## Non-Functional Requirements
- No marketplace behavior, resale, or bidding.
- No algorithmic boosting of Offers or artifacts.
- No behavioral recommendation or ranking changes from paid Promotions.

## Architectural Boundaries
- Print Shop is an issuance infrastructure surface linked to Events/Promotions workflows.
- Artifacts are participation records/signals, not commodities.
- Paid distribution is explicit-scope ad infrastructure, not algorithmic recommendation.

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
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/print-shop/runs` | required | Purchase/create issuance run |
| POST | `/print-shop/runs/:id/mint` | required | Mint artifact within run capacity |
| POST | `/offers` | required | Create offer signal |
| POST | `/offers/:id/carry` | required | Carry offer into user context |
| POST | `/offers/:id/redeem` | required | Redeem offer |
| POST | `/proof-support` | required | Submit/verify support proof |

## Web UI / Client Behavior
- Promotions surface lists Offers.
- Print Shop surfaces in Events for Run issuance.
- Promotional Pack setup requires explicit target scope selection (city/state/community).
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
