# 2026-06-24 Business Monetization Boundary Cleanup

## Status

Implemented on branch `docs/business-monetization-boundary`.

## Why

The launch task list asked to keep business runtime deferred while tightening
docs so agents do not accidentally implement billing, promotions, coupons,
offers, business dashboards, or analytics too early.

The active business brief already warned that business runtime is deferred, but
the economy specs still preserved rich long-term revenue doctrine in a way that
could be misread as current implementation authorization.

## Changed

- Added `docs/solutions/BUSINESS_MONETIZATION_BOUNDARY_R1.md`.
- Updated `docs/agent-briefs/BUSINESS_MONETIZATION.md` to load the boundary
  packet and reject commercial CTAs unless an active spec authorizes them.
- Updated `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md` so current MVP core
  points at source-facing creator seams rather than commercial runtime, and so
  billing/subscription/premium-analytics items are explicitly deferred.
- Updated `docs/specs/economy/revenue-and-pricing.md` with a current MVP
  boundary section.
- Updated `docs/specs/economy/print-shop-and-promotions.md` so business
  promotions, Offers, Runs, billing, artifacts, carry/redeem, and paid
  Promotions management are clearly deferred.
- Updated `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md` with the
  business boundary pointer.
- Updated `docs/CHANGELOG.md`.

## Current Boundary

- Allowed now: Release Deck source-owned track creation and Print Shop
  source/promoter event creation.
- Retained but deferred: paid ad-slot purchase, Discovery Pass purchase,
  subscription entitlement, artist capability purchase, business dashboards,
  business accounts/runtime, paid promotion package purchase/management,
  offers/coupons, carry/redeem ledgers, Print Shop Runs, artifact minting, and
  premium analytics.
- Analytics must remain descriptive only and must not become predictive,
  prescriptive, comparative, ranking-like, or governance-affecting.
- Paid behavior must never affect Fair Play, rotation, voting, tier movement,
  registrar authority, or civic/governance outcomes.

## Validation

Completed:

```bash
pnpm run docs:lint
pnpm run infra-policy-check
git diff --check
```

## Remaining Work

- Task 3 remains blocked until staging CORS is aligned for the intended Vercel
  origin, then browser/device onboarding QA can run.
