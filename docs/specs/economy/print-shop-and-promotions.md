# Print Shop and Promotions

**ID:** `ECON-PRINTSHOP`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines the Promotions surface and the Print Shop issuance model. The Print Shop is infrastructure for limited‑run digital artifacts and Proof‑of‑Support, not a marketplace.

## User Roles & Use Cases
- Artists and promoters purchase Runs to issue digital artifacts.
- Businesses publish Offers in Promotions.
- Listeners carry or redeem Offers explicitly.

## Functional Requirements
- Promotions tab displays local business Offers and off‑platform promotions.
- Print Shop sells **Runs** (finite issuance allocations).
- Print Shop issues **digital** artifacts only; no physical inventory or fulfillment.
- Minting is internal, non‑blockchain, and zero marginal cost.
- Proof‑of‑Support mints artifacts and may award Activity Points.
- Offers propagate only when explicitly carried or redeemed.
- Print Shop artifacts do not affect Fair Play, visibility, or governance.

## Non-Functional Requirements
- No marketplace behavior, resale, or bidding.
- No algorithmic boosting of Offers or artifacts.

## Architectural Boundaries
- Print Shop is an issuance surface inside the Events surface.
- Artifacts are signals, not commodities.

## Data Models & Migrations
- Run
- Artifact
- Offer
- ProofOfSupport

## API Design
- TBD

## Web UI / Client Behavior
- Promotions surface lists Offers.
- Print Shop surfaces in Events for Run issuance.
- Artifact collections are visible on profiles.

## Acceptance Tests / Test Plan
- Runs are finite and non‑replenishable.
- Offers do not appear without explicit user action.

## References
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Revenue Strategy Canonon.md`
