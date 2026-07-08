# Business Monetization Boundary R1

Status: Active boundary packet
Owner: Founder + product engineering
Last updated: 2026-06-24

## Purpose

Keep UPRISE business, promotions, billing, and analytics doctrine available
without letting agents implement deferred commercial runtime too early.

This packet resolves the active-scope reading of:

- `docs/specs/economy/revenue-and-pricing.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/canon/Master Revenue Strategy Canonon.md`
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`

## Current Decision

Business and monetization systems remain deferred for current MVP runtime.

The current launch surface may preserve:

- source-facing Print Shop event creation;
- source-owned Release Deck track creation;
- the conceptual Release Deck paid ad slot as a documented future capacity,
  including design-only category/link-target shape such as `release date`,
  `general`, `event`, and `sponsor`;
- read-only/deferred promotions infrastructure references.

The current launch surface must not implement:

- billing or subscription flows;
- Discovery Pass purchase or entitlement enforcement;
- artist capability purchase/upgrade flows;
- paid promotion package purchase;
- business dashboard runtime;
- business account management runtime;
- merchant/venue dashboard runtime;
- offer/coupon creation, carry, redeem, or ledgers;
- premium analytics products;
- predictive, prescriptive, comparative, or leaderboard-like analytics;
- paid ranking, paid voting, paid governance, or paid Fair Play influence.

## Runtime Allowed Now

Allowed current runtime:

- `POST /print-shop/events` as the minimum source-facing event-write lane.
- Promoter-capability event creation through Print Shop.
- Artist/Band event creation only with an explicitly selected managed source.
- Active city-tier Home Scene community attachment for source/promoter events.
- Release Deck URL-only source-owned track creation.
- Artist/Profile and Source Dashboard copy may mention the paid ad-slot concept
  only as defined/deferred capacity, not as purchasable runtime.
- `/communities/:id/promotions` may remain retained/deferred read
  infrastructure, but `Promotions` is not a current Plot tab and not a current
  active user flow.

## Deferred Until Explicit Activation

The following require a new spec or explicit founder lock before runtime work:

- billing provider selection and integration;
- subscription, entitlement, or invoice models;
- Discovery Pass purchase and access enforcement;
- artist Standard/Premium capability purchase or slot enforcement;
- paid ad-slot purchase and campaign lifecycle;
- paid ad-slot category/link-target persistence, business-account sponsor
  linking, and action-wheel linked-target visit behavior;
- Promotional Pack targeting and purchase;
- offer/coupon models and carry/redeem interactions;
- Print Shop Run purchase and artifact minting;
- business account dashboards and merchant/venue source dashboards;
- premium analytics packages;
- business follower-update runtime.

## Analytics Boundary

Analytics may be descriptive only.

Do not implement analytics that:

- predicts artist success;
- recommends business decisions;
- scores artists, venues, promoters, or communities comparatively;
- creates leaderboards or rankings;
- affects Fair Play, rotation, voting, propagation, tier movement, or registrar
  authority;
- implies paid users can see or control civic outcomes.

## Promotions Boundary

Promotion doctrine is retained, but current runtime is not active.

If promotions are activated later:

- paid distribution must use explicit scope selection;
- paid behavior must be labeled as paid;
- paid behavior must not alter Fair Play or governance;
- business submissions must be account-attached, not anonymous public intake;
- sponsor ad links must be business-account attached when activated, not
  anonymous sponsor text;
- offer/coupon actions need their own action grammar and tests;
- `Promotions` must not return as a Plot tab unless a newer active UI lock
  explicitly promotes it.

## Agent Guidance

When working on business/monetization:

1. Load `docs/agent-briefs/BUSINESS_MONETIZATION.md`.
2. Load this packet.
3. Treat canon/revenue specs as long-term doctrine unless the active brief and
   this packet promote a surface into current runtime.
4. Do not add placeholder CTAs such as `Upgrade`, `Buy`, `Subscribe`,
   `Promote`, `Boost`, `Redeem`, `Analytics`, or `Business Dashboard` unless a
   current spec explicitly authorizes that exact surface.

When working on source-dashboard or Print Shop without monetization scope:

- Do not load full revenue canon by default.
- Do not add billing, analytics, promo, coupon, or business dashboard cards.
- Keep the current source-dashboard launch set focused on Release Deck, Source
  Profile, Print Shop event creation, and Registrar.

## Reactivation Requirements

Before implementing any commercial runtime, create or update a dedicated spec
with:

- exact user/source roles;
- visible surfaces and route ownership;
- data models and migrations;
- payment provider and environment ownership;
- entitlement rules;
- refund/cancellation/error behavior;
- Fair Play/governance non-influence tests;
- source/listener profile separation tests;
- clear launch/staging smoke plan.
