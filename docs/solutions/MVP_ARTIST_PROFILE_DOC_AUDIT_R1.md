# MVP Artist Profile Documentation Audit R1

Status: Active  
Owner: product engineering  
Last updated: 2026-04-14

## 1) Purpose
Capture the current state of artist-profile documentation so future sessions stop treating mixed narrative summaries, external synthesis, and under-specified product behavior as settled canon.

This document does not define final artist-page UX. It separates:
- what is already supported in repo canon/spec
- what remains valid legacy-canon carry-forward
- what is too weak or mixed to treat as active behavior
- what still needs explicit founder lock

## 2) Sources Reviewed
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Revenue Strategy Canonon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/economy/revenue-and-pricing.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/engagement/analytics-and-instrumentation-framework.md`
- `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md`
- Founder correction in this session regarding printed artifacts vs default business-signal interpretation

## 3) Confirmed In Repo Canon/Spec
### 3.1 Identity and capability model
- Artist identity is not a separate account tree; creator capabilities layer onto a unified user identity model.
- Additive capability language is already present in repo docs for role/capability handling.
- Artist registration remains structurally anchored to Home Scene context.

Sources:
- `docs/specs/communities/scenes-uprises-sects.md:13`
- `docs/specs/users/identity-roles-capabilities.md:156`
- `docs/specs/users/README.md:7`

### 3.2 Core actions and follow semantics
- `FOLLOW` exists and is an awareness subscription to an entity.
- Current repo runtime exposes `ADD`, `BLAST`, `SUPPORT`, and `FOLLOW`, but the controlling action matrix now treats that as terminology debt rather than final doctrine.
- Intended public model is:
  - source pages: `Follow`
  - music-distribution signals surfaced on artist pages: `Collect`, `Blast`, and `Recommend` once genuinely held
  - social post surfaces: `React`
- Repo canon/spec does not support treating follow as automatic ranked feed-channel creation.

Sources:
- `docs/specs/core/signals-and-universal-actions.md:13`
- `docs/specs/core/signals-and-universal-actions.md:22`
- `docs/canon/Master Narrative Canon.md:299`
- `docs/canon/Legacy Narrative plus Context .md:228`
- `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md:44`

### 3.3 Artist-management / release-deck constraints
- Artist-management surfaces exist post-Registrar.
- Release Deck exists and is constrained.
- Early beta lock supports up to 3 songs in the release deck.
- Slot pressure exists; release-deck slots are not rotation positions.
- A separate 4th promotional slot concept exists in canon/revenue docs.

Sources:
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md:39`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md:56`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md:60`
- `docs/canon/Master Revenue Strategy Canonon.md:79`
- `docs/canon/Master Revenue Strategy Canonon.md:80`
- `docs/canon/Master Revenue Strategy Canonon.md:82`
- `docs/specs/economy/revenue-and-pricing.md:24`
- `docs/specs/economy/revenue-and-pricing.md:30`
- `docs/specs/economy/revenue-and-pricing.md:31`

### 3.4 Analytics
- Artist-related analytics exist as descriptive, not prescriptive, data.
- Enhanced analytics tie to capability tiers.
- Per-song engagement statistics persisting on artist profile/catalogue surfaces is explicitly mentioned in canon.

Sources:
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md:93`
- `docs/canon/Master Revenue Strategy Canonon.md:28`
- `docs/specs/economy/revenue-and-pricing.md:31`
- `docs/specs/economy/revenue-and-pricing.md:49`
- `docs/specs/engagement/analytics-and-instrumentation-framework.md`

### 3.5 Print Shop / Runs / issuance boundaries
- Print Shop and Runs are real canon concepts.
- Print Shop is issuance infrastructure, not a marketplace.
- Print Shop is event/promotions-linked infrastructure and must not affect Fair Play, visibility, ranking, or civic authority.
- Printed or issued artifacts such as flyers, coupons, posters, patches, and similar items are valid artifact examples in canon.

Sources:
- `docs/canon/Master Narrative Canon.md:253`
- `docs/canon/Master Narrative Canon.md:268`
- `docs/canon/Master Narrative Canon.md:272`
- `docs/canon/Master Glossary Canon.md:277`
- `docs/canon/Master Glossary Canon.md:279`
- `docs/specs/economy/print-shop-and-promotions.md:9`
- `docs/specs/economy/print-shop-and-promotions.md:19`
- `docs/specs/economy/print-shop-and-promotions.md:25`

## 4) Valid Legacy Carry-Forward That Still Matters
### 4.1 Calendar/event linkage
- Legacy canon ties following an artist and/or promoter to automatic event/calendar population, including sync language.
- This is useful carry-forward context, but it is not currently strong enough in active spec to treat the full mechanic as implementation-locked without review.

Sources:
- `docs/canon/Legacy Narrative plus Context .md:452`

### 4.2 One-way follower communication
- Legacy canon supports one-way artist/promoter messaging to followers.
- This remains background product context, not a currently locked MVP artist-page surface contract.

Sources:
- `docs/canon/Legacy Narrative plus Context .md:314`
- `docs/canon/Legacy Narrative plus Context .md:318`

### 4.3 Private reviews exist in background canon, not public comments
- Legacy canon references private review systems in specialized contexts.
- This does not authorize public comment/review sections on artist pages.

Sources:
- `docs/canon/Legacy Narrative plus Context .md:839`
- `docs/canon/Master Revenue Strategy Canonon.md:381`
- `docs/canon/Master Revenue Strategy Canonon.md:387`

### 4.4 Business/artist affiliation display exists, but should not be overinterpreted
- Legacy canon preserves the concept that business-artist affiliations can be explicit and visible.
- Founder correction in this session: do not default this to "artist wears a business signal". Printed or issued artifacts such as flyers/coupons are safer examples unless a later lock says otherwise.

Sources:
- `docs/canon/Legacy Narrative plus Context .md:562`
- founder correction in this session

## 5) Not Sufficiently Locked In Active Docs
These items may be plausible, but are not bulletproof enough in active repo docs to treat as settled artist-page behavior:
- exact public artist-page section inventory (bio, photos, videos, contact, events, links, songs, etc.)
- exact artist-page playback handoff behavior when arriving from a single/signal
- exact artist-page action rail / button inventory
- exact event/calendar behavior triggered by following an artist
- exact external support-link set (website, Bandcamp, merch, donation)
- exact public prohibition text for comments/reviews on artist pages
- exact public song ordering rules on artist page
- exact direct relationship between artist page and Print Shop purchase entry
- exact avatar/profile artifact display rules for artists

## 6) Unsafe To Treat As Canon Without Further Lock
These patterns showed up in external synthesis or mixed summaries and should not be treated as active repo truth yet:
- follow creates a dedicated artist-update feed channel
- Print Shop is owned by the artist profile as the primary purchase origin
- a full artist-specific REST endpoint set from external summaries
- exact database schema/table names from external summaries
- exact public-profile field inventory unless confirmed in repo docs
- default assumption that artist avatar display is specifically a business signal

Sources:
- `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md:44`
- `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md:45`
- external mixed summaries reviewed in-session

## 7) Practical Carry-Forward Rules For Future Sessions
- Treat additive capability + unified identity as settled.
- Treat Home Scene anchoring as settled.
- Treat the action split in `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md` as the controlling authority when artist-page action wording conflicts with older `ADD`/`SUPPORT` language.
- Treat release-deck slot constraints and descriptive analytics as settled.
- Treat Print Shop / Runs / issuance as event/promotions-linked infrastructure, not artist-profile commerce by default.
- Do not answer artist-page UX questions by inventing a full section list from memory.
- Do not promote external schema/API summaries into product truth.
- If a user asks what happens on the artist page, separate:
  - confirmed in docs
  - valid legacy carry-forward
  - not sufficiently locked
  - founder decision needed

## 8) Founder Lock Needed
A dedicated founder lock is still needed for:
- public artist-page composition
- artist-page actions and CTA order
- song list/display structure on artist page
- playback handoff on artist-page entry and song selection
- event/calendar surface behavior on artist page
- external support-link behavior
- artifact/display rules on the artist profile surface

Recommended next artifact:
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

## 9) Bottom Line
The repo already supports the architecture around artists better than recent narrow working assumptions suggested.

But the full artist-page UX contract is still underlocked.

The safe position is:
- architecture/capability/issuance/slot constraints = largely supported
- full artist-page UX = not yet bulletproof
- do not implement the full artist-page surface from mixed summaries alone
