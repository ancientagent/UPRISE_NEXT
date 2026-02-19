# Revenue and Pricing

**ID:** `ECON-REVENUE`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

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
- Artist catalog for potential label signing is optional, opt-in, and long-term; not part of initial build scope.
- Revenue sharing is excluded from V1; only Mix Market (V2) may include revenue-sharing mechanics.

### Implemented Now
- No subscription billing or entitlement model is implemented yet.
- No ad, offer, run, or payment infrastructure is implemented yet.
- This spec currently defines business constraints and rollout boundaries.

### Deferred (Not Implemented Yet)
- Discovery Pass purchase, renewal, and entitlement enforcement.
- Play Pass purchase and slot entitlement enforcement.
- On-air ad slot purchase and campaign lifecycle.
- Promotions billing and run purchase flows.
- Optional label-catalog service (future phase).

## Non-Functional Requirements
- All analytics are descriptive, not prescriptive.
- Revenue never alters rotation, tier progression, or governance.

## Architectural Boundaries
- Revenue surfaces must align with Print Shop constraints.
- Promotional packs are confined to Promotions surfaces.
- Promotional targeting is explicit scope selection, not behavioral personalization.
- Revenue mechanisms cannot bypass canonical locality/governance constraints.
- No infrastructure-reciprocity framing or cross-party revenue sharing in V1.

## Data Models & Migrations
### Planned Models
- `Subscription`
- `CapabilityTier`
- `PromotionOffer`
- `Run`
- optional billing ledger/invoice model

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/billing/subscriptions` | required | Create/upgrade subscription |
| GET | `/billing/subscriptions/me` | required | Read current entitlements |
| POST | `/billing/promotions` | required | Purchase promotion pack/scope |
| POST | `/billing/on-air-ads` | required | Purchase ad slot campaign |

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
- Finalize pricing and entitlement edge cases in `docs/specs/DECISIONS_REQUIRED.md`.
- Artist opt-in catalog service remains explicitly post-V1.
- Mix Market revenue-share policy remains V2-only.
