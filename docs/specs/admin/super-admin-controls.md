# Super Admin Controls

**ID:** `ADMIN-SUPER`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines the Super Admin’s platform oversight capabilities.

## User Roles & Use Cases
- Super Admin reviews platform health, accounts, and moderation.
- Admin configures thresholds and pricing.

## Functional Requirements
- Full visibility into Users, Artists, Businesses, Events, and transactions.
- Account control: view, edit, suspend, release, or ban.
- Moderation queue access and dispute handling.
- Platform configuration:
  - Scene activation thresholds
  - Pricing for subscriptions and Runs
  - Activity Point bonuses and multipliers
- Overrides:
  - Manual Scene activation
  - Manual Activity Point adjustments
  - Feature flags
- Fair Play control:
  - Adjust evaluation periods and thresholds
  - Configure per‑Uprise tuning

## Non-Functional Requirements
- Auditability of admin actions.
- Restricted access and logging.

## Architectural Boundaries
- Admin actions do not introduce algorithmic promotion or ranking.

## Data Models & Migrations
- AdminActionLog
- FeatureFlag
- PricingConfig

## API Design
- TBD

## Web UI / Client Behavior
- Admin console with scoped access.

## Acceptance Tests / Test Plan
- Admin actions logged and auditable.

## References
- `docs/canon/Legacy Narrative plus Context .md`
