# Print Shop and Promotions

**ID:** `ECON-PRINTSHOP`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-07-12`

## Overview & Purpose
Defines the Promotions surface and the Print Shop issuance model. The Print Shop is infrastructure for limited‑run digital artifacts and Proof‑of‑Support, not a marketplace.

## Current MVP Boundary
This spec preserves Print Shop and Promotions doctrine, but current MVP runtime
only implements the source-facing event-write lane. Business promotions, Offers,
Runs, billing, artifacts, carry/redeem, and paid Promotions management remain
deferred.

Use `docs/solutions/BUSINESS_MONETIZATION_BOUNDARY_R1.md` before promoting any
commercial Print Shop or Promotions behavior into runtime.

## User Roles & Use Cases
- Artists and promoters purchase Runs to issue digital artifacts.
- Promoters create events from Print Shop as the uniform event-creation entrypoint.
- Businesses submit promotions through a Print Shop-attached business account, whether or not the business has a broader in-app presence/profile.
- Listeners carry or redeem Offers explicitly.
- Print Shop itself is source-facing infrastructure, not a listener-facing creation surface.

## Functional Requirements
- Promotions displays local offers and paid placements within explicit scope.
- Print Shop sells **Runs** (issuance capacity), not retail inventory.
- Minting is internal database issuance (non-blockchain).
- Print Shop cannot include warehousing/shipping/fulfillment logic.
- Promotional Packs provide boost-style ad reach in Promotions surfaces only.
- Proof-of-Support may mint artifacts and award Activity Points.
- Offers propagate only by explicit user carry/redeem action.
- Print Shop and promotions must never alter Fair Play, propagation thresholds, or civic authority.
- For the current MVP event-write phase, Print Shop supports event creation but
  not purchasable artifact Runs.
- Business promotion submissions, when later activated, must remain
  account-attached even when the business does not maintain a broader in-app
  source/profile surface.
- Future Release Deck `sponsor` ad attachments must link to an activated
  business account; anonymous sponsor linking is not approved.

### Implemented Now
- Minimal source-facing event-write lane:
  - `POST /print-shop/events`
  - promoter-capability event creation through the Print Shop seam
  - Artist/Band event creation only when the request includes an explicitly selected managed `artistBandId`
  - active city-tier Home Scene community attachment for all event writes
- Read-only Promotions surface endpoint:
  - `GET /communities/:id/promotions` (scene-scoped projection from promotion/offer signals).

### Deferred (Not Implemented Yet)
- Run purchase and issuance lifecycle.
- Offer creation/carry/redeem workflows.
- Proof-of-Support verification and artifact minting.
- Promotional pack targeting and billing integration.
- Dedicated Promotions domain models (`Offer`, billing linkage, carry/redeem ledger) beyond read projection.
- Limited flier minting variants are deferred (not required in current MVP phase).
- Shirt creation flows are deferred until avatar-wearable framing is implemented; shirts may appear as non-actionable "coming soon" catalog entries.
- Avatar-wearable framing should treat the avatar as a stable fit model for
  merch, not as the primary collectible object: reuse a shared base/body model
  and layer interchangeable pieces such as shirts, jackets, pants, shoes, hats,
  and accessories so band artwork stays readable and clothing swaps do not
  require regenerating the full avatar.
- Avatar visibility in MVP does not activate avatar-editor or dress-up runtime.
  It does require future wearable merch to preserve a modular contract: separate
  head base, hair, headwear, top, outerwear/strap layer, face details, neck
  details, and digital merch objects. Buttons, pins, patches, and similar
  printable/digital merch objects are not just baked clothing decoration; they
  should attach to explicit targets such as suspenders, hats/beanies, lapels,
  vest panels, jacket panels, straps, and shirt print zones when the wearable
  system is activated.
- Business promotion submission and auto-publish runtime.
- Local business layer visibility inside Home Scene beta infrastructure.
- Business sponsorship discovery: paid business source accounts, when
  activated, are intended to include lists of artists interested in
  sponsorship deals and events looking for sponsors, informed by Support
  analytics (`docs/specs/engagement/support-and-participation.md`). Account
  pricing, listing eligibility, and artist sponsorship opt-in remain open.
- Release Deck sponsor ad link-target runtime and business-account selection.

## Non-Functional Requirements
- No marketplace behavior, resale, or bidding.
- No algorithmic boosting of Offers or artifacts.
- No behavioral recommendation or ranking changes from paid Promotions.

## Architectural Boundaries
- Print Shop is an issuance infrastructure surface linked to Events/Promotions workflows.
- Artifacts are participation records/signals, not commodities.
- Paid distribution is explicit-scope ad infrastructure, not algorithmic recommendation.
- Print Shop creation/manage flows belong to source operators (artists/promoters), not to listeners acting in ordinary discovery mode.

## Digital Artifact Lifecycle And Collection (Draft Owner Section)

Status: draft contract for the closed digital-merch economy. Runtime remains
deferred; open decisions are tracked in `docs/specs/DECISIONS_REQUIRED.md`
section 10. Join points: `docs/specs/engagement/support-and-participation.md`
(`ENG-SUPPORT`, mint triggers) and the future avatar/customization owner spec
(wearable rendering).

### Artifact identity

Each minted artifact is an internal, non-blockchain issuance record carrying:

- artifact id, artifact class (`flyer`, `button`, `pin`, `patch`, `sticker`,
  `poster`, `special`), and artwork reference;
- run reference plus edition position within the run's finite,
  non-replenishable capacity;
- source attribution (the issuing Artist/Band, promoter, or later business
  account);
- mint-event provenance: which fulfilled Support contract, Proof-of-Support
  verification, or future purchase minted it, with timestamp;
- optional context object (event, release, cause).

### Funding precondition: paid Runs

- Artists/promoters (and later activated business accounts) purchase Runs with
  real money. A Run fee buys finite issuance capacity only — never placement,
  reach, rotation, or any Fair Play effect.
- Run purchases are part of UPRISE's initial revenue engine; community
  live-music funds may later purchase Print Shop digital marketing per the
  deferred community-fund direction.
- Listeners never pay for artifacts. Artifacts reach listeners only through
  verified fulfillment of the contracts defined below.

### Mint triggers

- Support-contract fulfillment (e.g., verified show attendance mints the
  event's flyer) — never commitment alone.
- Proof-of-Support verification.
- Additional issuance paths only if a future owner contract defines them.

All triggers consume the purchased run's capacity. Run-exhaustion behavior for
contract-attached goodies (reservation at commitment vs first-fulfilled) is an
open decision.

### Ownership and the closed economy

- Artifacts bind to the owning listener account. No resale, trade, bidding,
  exchange market, cash-out, or external ledger; listener-to-listener transfer
  or gifting does not exist unless a later decision explicitly adds it.
- Holding artifacts grants no Fair Play, ranking, tier, propagation, or
  governance effect.
- Artifacts are evidence of a listener's relationship to an artist, event, or
  community — participation records, not commodities.
- No `coin`/`token`/`wallet`/`spend` user-facing language.

### Collection display

- Owned artifacts appear in the listener collection workspace `Merch` shelf.
- Public visibility follows the existing profile collection opt-in
  (`collectionDisplayEnabled`); no separate public artifact showcase without
  owner-spec support.
- Display preserves provenance (edition, source, context) as descriptive
  metadata only.

### Future wearable join

- Artifact classes `button`, `pin`, `patch`, and `sticker` correspond to
  avatar digital-merch objects. When the avatar wearable system activates, an
  owned artifact of these classes may be equipped onto a compatible worn item
  through that garment's designer-authored attachment manifest, from the
  listener's Personal Space/Inventory equipment context. Base listener-avatar
  creation and core edits remain account/profile-owned under
  `docs/specs/users/identity-roles-capabilities.md#listener-avatar-and-personal-space-boundary`.
- Equipping is presentation only: it never changes artifact ownership or
  provenance and grants no economy or gameplay effect.
- The rendering/attachment contract belongs to the future avatar/customization
  owner spec; this section owns artifact identity, minting, and ownership.

## Data Models & Migrations
### Planned Models
- `Run`
- `Artifact` (or generalized materialized signal record)
- `Offer`
- `ProofOfSupport`
- optional redemption/carry ledger model

### Migrations
- None yet.

## API Design
### Implemented Endpoint
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/communities/:id/promotions` | required | Scene-scoped promotions/offers read surface |

### Planned Endpoints (Not Implemented)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/print-shop/runs` | required | Purchase/create issuance run |
| POST | `/print-shop/runs/:id/mint` | required | Mint artifact within run capacity |
| POST | `/offers` | required | Create offer signal |
| POST | `/offers/:id/carry` | required | Carry offer into user context |
| POST | `/offers/:id/redeem` | required | Redeem offer |
| POST | `/proof-support` | required | Submit/verify support proof |

## Web UI / Client Behavior
- The scene-scoped promotions/offers read surface at `/communities/:id/promotions` is retained/deferred runtime infrastructure; `Promotions` is not a current MVP Plot tab.
- Print Shop is web-first for creators and is the source of event creation + flier purchasing.
- Print Shop should be understood as a source-dashboard tool:
  - creators reach it from the source-facing side of the platform,
  - it lives conceptually inside the source dashboard/tool layer rather than as a listener/public utility surface.
- Print Shop remains source-facing only:
  - artists/promoters use it to create/manage event-related issuance flows,
  - listeners do not enter Print Shop to create events, purchase runs, or manage issuance.
- `/source-dashboard` is the first explicit source-side shell for current MVP runtime.
- `/print-shop` should present the current source operating context when one has been selected from that dashboard/switcher layer.
- `/print-shop` now provides the minimum creator-facing event form for the published event-write seam.
- linked Artist/Band members can reach `/print-shop` directly from their artist-facing source page via `Open Print Shop`.
- linked Artist/Band members must carry the active source context into `/print-shop`; generic membership without a selected managed source must not create an unattached Artist/Band event.
- promoter-capability users may create promoter-lane events without an `artistBandId`, but the event still attaches to the resolved active city-tier Home Scene community.
- Promotional Pack setup is deferred; when later activated it requires explicit target scope selection (city/state/community).
- Business promotion submission is deferred; when later activated it should come from a Print Shop-attached account even when the business does not have a broader in-app profile/presence.
- Release Deck sponsor ad attachment is deferred; when later activated it should
  use the same business-account-attached principle rather than a free-text or
  anonymous sponsor field.
- Business submission should be treated as part of a business-facing source dashboard, not as anonymous one-off intake.
- Business promotion auto-publish and post-publish moderation policy are deferred until business promotion submission is activated.
- Artifact collections are visible on profiles.

## Acceptance Tests / Test Plan
- Runs are finite and non‑replenishable.
- Offers do not appear without explicit user action.
- Paid promotions never alter Fair Play ordering or tier progression.

## References
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Revenue Strategy Canonon.md`
