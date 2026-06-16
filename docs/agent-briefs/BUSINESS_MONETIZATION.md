# Business Monetization Agent Brief

Status: active
Last Updated: 2026-04-25

## Use When
Use this brief when the task is about:
- business accounts
- promos / coupons / offers
- paid promo / ad packages
- artist/event packages
- Release Deck paid ad slot
- premium analytics boundaries
- revenue / pricing / launch monetization
- business dashboard or merchant/venue surfaces

## Do Not Use For
- general UX/UI work unless business or monetization is visible
- source dashboard work that does not touch business/revenue behavior
- event creation unless paid/event package behavior is involved
- infrastructure billing implementation unless explicitly scoped

## Loading Rule
Start with the normal repo entry rules, `CONTEXT_ROUTER.md`, then this brief.

Do not load the full business/revenue canon by default for unrelated product work. Load business canon/specs only when monetization, pricing, paid promo/ad packages, coupons/offers, business accounts, or paid analytics are in scope.

## Section Pointers
Runtime files:
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/source-dashboard/release-deck/page.tsx`
- `apps/web/src/app/print-shop/page.tsx`
- `apps/api/src/events/print-shop.controller.ts`

Specs / locks:
- `docs/specs/economy/revenue-and-pricing.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_DASHBOARD_SURFACE_CONTRACT_R1.md`
- `docs/canon/Master Revenue Strategy Canonon.md`

Tests / verification files:
- source dashboard / release deck / print shop tests when touched
- `pnpm run docs:lint`
- `git diff --check`

## Current Truth
- Revenue must support infrastructure without creating visibility, ranking, rotation, or governance advantages.
- Paid behavior must not affect Fair Play, tier progression, or civic authority.
- Business runtime is deferred with the broader promo/business surface.
- Business accounts remain legitimate later/current-model source concepts, but not active MVP runtime by default.
- Business promotion submissions should be account-attached, not anonymous public-link intake.
- Print Shop is source-facing infrastructure, not a listener-facing creation surface.
- Current MVP runtime has a minimal source-facing event-write lane through Print Shop.
- Release Deck has `3` music slots plus a separate `4th` paid `10` second ad-attachment slot.
- The paid ad slot is not a fourth song and not its own rotation entry.
- Premium analytics must remain descriptive, not prescriptive or comparative ranking.
- Discovery Pass / subscription / billing / entitlement infrastructure is not implemented yet.

## Current Runtime Pointers
- `/source-dashboard` is the current source-side operating shell.
- `/source-dashboard/release-deck` exposes source-side release tooling and the paid ad-slot concept as deferred runtime.
- `/print-shop` exposes the minimum creator-facing event form for the current source-facing event-write seam.
- `/communities/:id/promotions` may remain as retained/deferred runtime surface, but `Promotions` is not a current MVP Plot tab.

## Companion Briefs
Load only if touched:
- `ARTIST_PROFILE_SOURCE_DASHBOARD.md` when business work uses source account/dashboard context.
- `EVENTS_ARCHIVE.md` when promos/offers attach to events, flyers, or calendar surfaces.
- `ACTIONS_AND_SIGNALS.md` when offers/coupons require listener actions such as carry, redeem, collect, or recommend.
- `UI_CURRENT.md` when designing visible business, promo, coupon, or paid analytics screens.
- `EXTERNAL_TOOLS.md` when drafting business/launch/marketing materials through external assistants.

## Design / Implementation Boundaries
- Do not implement a business dashboard unless explicitly activated.
- Do not reintroduce a current MVP Promotions tab.
- Do not turn paid promo/ad packages into algorithmic boosting or Fair Play influence.
- Do not create pay-to-rank, pay-to-vote, or pay-to-govern mechanics.
- Do not add billing/subscription infrastructure from spec text alone.
- Do not make premium analytics predictive, prescriptive, comparative, or leaderboard-like.
- Do not infer active merchant/venue runtime from the revenue canon unless a current lock promotes it.

## Canon Anchors
Use selectively:
- `docs/canon/Master Revenue Strategy Canonon.md` for revenue/business doctrine.
- `docs/canon/Master Identity and Philosohpy Canon.md` for anti-extractive constraints.
- `docs/canon/UPRISE_VOICE_MESSAGING_CANONICAL.md` for public-facing launch/marketing language.

## Verification
Use the narrowest relevant checks:
- `pnpm run docs:lint`
- `git diff --check`
- route/component/API tests if runtime files are changed

Use broader `pnpm run verify` before PR/closeout when feasible.

## Update Rule
Patch this brief whenever business, monetization, paid promo/ad package, premium analytics, or launch revenue truth changes.
