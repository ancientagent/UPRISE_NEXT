# Mixologist and Mixes

**ID:** `V2-MIXES`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

## Overview & Purpose
Defines Mixologist capability and curated Mixes as a V2 feature.

## User Roles & Use Cases
- Listener upgrades to Mixologist to create and sell mixes.
- Users explore mixes and view attribution.

## Functional Requirements
- Mixologist upgrade requires Discovery Pass (+$4/mo).
- Mixes are curated collections of songs.
- Personal mixes are free to create and share.
- Commercial mixes require artist approval.
- Mix Market supports premium mixes and tip jar.
- Attribution is mandatory for all artists and songs.
- Mixes can display community resonance and trending stats.

### Implemented Now
- No Mix/Mixologist models or APIs currently exist.
- No billing/entitlement support exists yet for mixologist upgrade.

### Deferred (Not Implemented Yet)
- Mix creation, publishing, and attribution APIs.
- Commercial mix approval workflow.
- Mix Market pricing/tip and payout logic.
- Community resonance/trending stats surface for mixes.

## Non-Functional Requirements
- Mixes do not affect Fair Play rotation.
- No automated recommendation of mixes.

## Architectural Boundaries
- Mixes are user‑generated and opt‑in.

## Data Models & Migrations
### Planned Models
- `Mix`
- `MixItem`
- `MixAttribution`
- `MixApproval`
- optional `MixSale` / `MixTip`

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/mixes` | required | Create mix |
| POST | `/mixes/:id/items` | required | Add item to mix |
| POST | `/mixes/:id/submit-commercial` | required | Submit commercial approval request |
| POST | `/mixes/:id/approve` | required | Artist approval action |
| POST | `/mix-market/:id/purchase` | required | Purchase premium mix |

## Web UI / Client Behavior
- Mix detail pages show attribution and Scene context.
- Mixologists can manage approvals and pricing.

## Acceptance Tests / Test Plan
- Commercial mixes blocked without artist approval.
- Attribution displayed on all mixes.
- Mix actions never write to Fair Play ranking/propagation systems.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Revenue Strategy Canonon.md`
