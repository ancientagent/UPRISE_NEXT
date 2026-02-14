# Revenue and Pricing

**ID:** `ECON-REVENUE`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines the canonical revenue streams and subscription tiers. Revenue is infrastructure‑aligned and cannot create visibility or governance advantages.

## User Roles & Use Cases
- Listeners choose Free or Discovery Pass access.
- Artists activate Standard or Premium capability tiers.
- Businesses purchase Promotions and Print Shop Runs.

## Functional Requirements
- Revenue constraints:
  - No prediction of success or taste.
  - No pay‑for‑placement in Fair Play.
  - No conversion of spending into civic authority.
- Print Shop revenue comes from Runs (issuance capacity), not goods.
- Promotional Packs provide paid boost-style reach (similar to Facebook Boost) across selected
  Scenes/communities in Promotions surfaces only.
- On‑air promotional ads use the 4th Release Deck slot.
- Promotions surface supports paid business offers.
- Listener tiers:
  - Free Listener: Home Scene only.
  - Discovery Pass: global access to all Scenes; voting remains Home Scene only.
- Artist capability tiers:
  - Standard: 1 active slot.
  - Premium: 3 active slots + enhanced analytics.
- Mixologist and Ambassador upgrades are V2 add‑ons.

## Non-Functional Requirements
- All analytics are descriptive, not prescriptive.
- Revenue never alters rotation, tier progression, or governance.

## Architectural Boundaries
- Revenue surfaces must align with Print Shop constraints.
- Promotional packs are confined to Promotions surfaces.
- Promotional targeting is explicit scope selection, not behavioral personalization.

## Data Models & Migrations
- Subscription
- CapabilityTier
- PromotionOffer
- Run

## API Design
- TBD

## Web UI / Client Behavior
- Subscription management surfaces show tier capabilities clearly.
- Promotions and ads are labeled as paid surfaces.

## Acceptance Tests / Test Plan
- Premium capability increases active slots only.
- Discovery Pass unlocks transport without voting changes.

## References
- `docs/canon/Master Revenue Strategy Canonon.md`
- `docs/canon/Master Narrative Canon.md`

## Future Work & Open Questions
- Finalize pricing for Discovery Pass and Play Pass. See `docs/specs/DECISIONS_REQUIRED.md`.
- Artist catalog / label visibility services are post-V1 and not part of the initial build scope.
- Revenue sharing is reserved for Mix Market (V2) only.
