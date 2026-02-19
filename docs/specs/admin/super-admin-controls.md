# Super Admin Controls

**ID:** `ADMIN-SUPER`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-02-19`

## Overview & Purpose
Defines the Super Admin’s platform oversight capabilities.

## User Roles & Use Cases
- Super Admin reviews platform health, accounts, and moderation.
- Admin configures thresholds and pricing.

## Functional Requirements
- Full visibility into Users, Artists, Businesses, Events, and transactions.
- Full visibility into all analytics and instrumentation datasets (including non-UI metrics).
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
- Instrumentation governance:
  - Create/activate/deprecate tracking modules and metric definitions.
  - Configure metric retention policy windows.
  - Define metric metadata (owner, scope, cadence, source, descriptive-only classification).
- Fair Play control:
  - Adjust evaluation periods and thresholds
  - Configure per‑Uprise tuning
  - Update global Fair Play policy variables when needed:
    - `RECURRENCE_REORDER_CADENCE`
    - `RECURRENCE_ROLLING_WINDOW_DAYS`
    - `NEW_WINDOW_DAYS_BANDS`
    - `BAND_PERSIST_DAYS`
    - `GRADUATION_MIN_AGE`
    - `GRADUATION_EXECUTION_CADENCE`
    - `GRADUATION_CAP_PER_RUN`
    - propagation threshold parameters (minimum unique listeners, rate threshold, confidence gate)

### Implemented Now
- Fair Play config surface exists (global policy variables only):
  - `GET /admin/config/fair-play`
  - `POST /admin/config/fair-play`
  - current guard: authenticated user (`JwtAuthGuard`)
  - RBAC/super-admin enforcement: deferred
- No admin audit log model currently exists.

### Deferred (Not Implemented Yet)
- RBAC for super-admin and scoped admin roles.
- Audit log and policy-change ledger.
- Moderation queue and account-control endpoints.
- Configuration management for pricing/threshold flags.
- Analytics governance APIs for custom metric definitions and retention.

## Non-Functional Requirements
- Auditability of admin actions.
- Restricted access and logging.

## Architectural Boundaries
- Admin actions do not introduce algorithmic promotion or ranking.
- Admin tools cannot bypass canonical prohibitions:
  - no manual song reordering
  - no tier-progression exceptions
  - no governance authority based on payment/engagement metrics
- Admin-defined metrics are descriptive only:
  - cannot feed recommendation/personalization systems
  - cannot change Fair Play recurrence
  - cannot change propagation eligibility
- Fair Play variable changes are policy-level only:
  - no manual per-song ordering
  - no per-artist exceptions
  - no retroactive mutation of already-recorded engagement or vote history

## Data Models & Migrations
### Planned Models
- `AdminActionLog`
- `FeatureFlag`
- `PricingConfig`
- optional `PolicyChangeApproval`
- `InstrumentationMetricDefinition`
- `InstrumentationModule`
- optional `InstrumentationRetentionPolicy`

### Migrations
- None yet.

## API Design
### Implemented Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/config/fair-play` | authenticated (RBAC deferred) | View current Fair Play policy variables |
| POST | `/admin/config/fair-play` | authenticated (RBAC deferred) | Update Fair Play policy variables (global) |

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/audit-log` | super-admin | View platform action log |
| POST | `/admin/users/:id/suspend` | super-admin | Suspend account |
| POST | `/admin/users/:id/ban` | super-admin | Ban account |
| POST | `/admin/config/pricing` | super-admin | Update pricing config |
| POST | `/admin/config/feature-flags` | super-admin | Toggle feature flags |
| GET | `/admin/analytics/metrics` | super-admin | List metric definitions and status |
| POST | `/admin/analytics/metrics` | super-admin | Create metric definition |
| PATCH | `/admin/analytics/metrics/:id` | super-admin | Update or deprecate metric definition |
| GET | `/admin/analytics/query` | super-admin | Query historical telemetry datasets |

## Web UI / Client Behavior
- Admin console with scoped access.

## Acceptance Tests / Test Plan
- Admin actions logged and auditable.
- Forbidden override operations are blocked and logged.

## References
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Narrative Canon.md`
