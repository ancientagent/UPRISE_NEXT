# Super Admin Controls

**ID:** `ADMIN-SUPER`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-16`

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

### Implemented Now
- No dedicated super-admin role model or admin console API exists.
- No admin audit log model currently exists.

### Deferred (Not Implemented Yet)
- RBAC for super-admin and scoped admin roles.
- Audit log and policy-change ledger.
- Moderation queue and account-control endpoints.
- Configuration management for pricing/threshold flags.
- Fair Play policy controls (global only; no manual per-song or per-uprise overrides).

## Non-Functional Requirements
- Auditability of admin actions.
- Restricted access and logging.

## Architectural Boundaries
- Admin actions do not introduce algorithmic promotion or ranking.
- Admin tools cannot bypass canonical prohibitions:
  - no manual song reordering
  - no tier-progression exceptions
  - no governance authority based on payment/engagement metrics

## Data Models & Migrations
### Planned Models
- `AdminActionLog`
- `FeatureFlag`
- `PricingConfig`
- optional `PolicyChangeApproval`

### Migrations
- None yet.

## API Design
### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/audit-log` | super-admin | View platform action log |
| POST | `/admin/users/:id/suspend` | super-admin | Suspend account |
| POST | `/admin/users/:id/ban` | super-admin | Ban account |
| POST | `/admin/config/pricing` | super-admin | Update pricing config |
| POST | `/admin/config/feature-flags` | super-admin | Toggle feature flags |

## Web UI / Client Behavior
- Admin console with scoped access.

## Acceptance Tests / Test Plan
- Admin actions logged and auditable.
- Forbidden override operations are blocked and logged.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
