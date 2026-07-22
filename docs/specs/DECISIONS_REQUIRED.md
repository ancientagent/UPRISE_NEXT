# Decisions Required (Canon‑Blocked Items)

This file tracks canon‑blocked items marked as WORKING / UNDECIDED / Founder Lock Needed in `docs/canon/`.  
Do not implement these items until they are locked.

## 1) Scene & Broadcast Thresholds
- **City-tier community split/activation threshold**: define the numeric/evidence requirements for registered local artists/sources, committed catalog, and source activity that justify splitting a new active city-tier Home Scene from an existing major-node/music-capital community. Listener demand or onboarding counts alone must not activate a music community.
- **Community activation/cutover workflow**: define the Registrar/source workflow for creating the new active city-tier `Community`, assigning source entities, routing future uploads, and messaging listeners whose submitted/GPS city differs from their assigned major-node Home Scene.
- **Instrumental community-list placement**: decide whether `Instrumental` becomes an active selectable MVP/launch music community, remains a routing/taste tag, or becomes a future generated sect/channel category. Do not add it to `music-communities.json` or `launch-community-city-matrix.json` until this is locked, because the current launch matrix is `6` cities x `8` communities and `Spoken Word / Poetry` is already active.
- **City → State propagation threshold**
- **State → National propagation threshold**

## 2) Fair Play Two-Pool Locks
- **Main Rotation recurrence mapping** (discrete frequency tiers vs weighted scheduler implementation)
- **Practical floor/removal policy** for persistently low-recurrence songs
- **Propagation threshold formula** (minimum unique listeners + rate + optional confidence bound)
- **Graduation cap per run** (`GRADUATION_CAP_PER_RUN`)

## 3) Activity Points
- **Scoring table**
- **Decay / seasonality rules**

## 4) Moderation & Compliance
- **Report threshold for auto‑flag**
- **Appeal / dispute response timeline**

## 5) Pricing & Monetization
- **Discovery Pass pricing finalization**
- **Play Pass pricing finalization**
- **Promotional slot mechanics (hard boundary from Fair Play)**
- **Release Deck paid ad category contract**: lock categories, validation, and
  copy for `release date`, `general`, `event`, and `sponsor`.
- **Release Deck paid ad link-target contract**: define how `release date`
  links a calendar date, `event` links an event, `sponsor` links a business
  account, and `general` remains unlinked.
- **Sponsor/business account attachment**: define when local business accounts
  are active enough for sponsor ad linking and which business-role authority can
  approve or manage that link.
- **Action-wheel visit behavior for paid ad linked targets**: define whether and
  where the linked source/signal target is visitable through an action-wheel
  style affordance, without reintroducing Artist Profile engagement-wheel drift.

## 6) Founder Locks
- Any section marked **WORKING**, **UNDECIDED**, or **Founder Lock Needed** in `docs/canon/`

## 7) Scene Map & Statistics
- **Aggregation window(s)** for Scene metrics (for example rolling 7-day / 30-day / all-time)
- **Geo aggregation granularity + privacy floor** (minimum cohort size before map bucket display)
- **Tier rollup policy** for City -> State -> National map/statistics continuity
- **Top 40 tie-break policy** when songs have equal standing within the same scope

## 8) Events And Calendar
- **Source event publication contract**: define draft/private/published states,
  publication authority for band/promoter/source events, edit/unpublish rules,
  moderation/review if any, public Feed visibility, and community-calendar
  visibility.
- **Follower-calendar delivery contract**: define how followers automatically
  receive published source events in their calendars, including idempotency,
  duplicate prevention, event updates/cancellations, follower opt-out/mute, and
  external calendar sync/export behavior.

## 9) Support And Participation (owner draft: `docs/specs/engagement/support-and-participation.md`)
- **Unit scale and denomination**: confirm the `100 Support` starting allocation,
  Participation value scale, and whether the Feed-rail "support score" displays
  Support balance, Participation, or another value.
- **Participation vs Activity Points**: resolve the `ENG-ACTIVITY` conflict —
  one user-level ledger with a separately contracted Trusted-Role gate, or two
  coexisting values.
- **Support bandwidth lifecycle**: whether influence-earned bandwidth awards are
  permanent, expiring, renewable, or capped.
- **Support withdrawal/expiry**: whether and how a listener can withdraw
  unsatisfied support, and what happens at event cancellation or lineup
  change.
- **Late-support cutoff**: how late a listener can support an event (at the
  show via the QR support link vs after the event), and how late support is
  classified across perceived/proven analytics.
- **Artist correction rules**: evidence requirements, limits, and
  anti-self-dealing controls for artist-acknowledged support/attendance
  corrections that feed proven-support analytics and flyer minting.
- **Image-recognition attendance proof**: whether it ever exists; if so,
  opt-in consent, privacy, accuracy, retention, and data-handling contracts
  come first.
- **Qualifying-act catalog**: which verified acts besides attendance can
  satisfy an event support contract (e.g., artist-acknowledged gear help), and
  their values.
- **Listening Participation evidence**: qualifying listen thresholds, values,
  repeat-credit semantics, and anti-farming rules.
- **Supporter visibility/privacy**: what sources see per listener (identity,
  amounts, history) and what listeners disclose publicly.
- **Proven-support boundary**: confirm the founder leaning that uncommitted
  verified attendance earns Participation and reach but not proven Support.
- **Multi-artist attribution**: confirm primary/secondary attribution for
  multi-beneficiary events (no Participation multiplication).
- **Influence attribution**: windows, edge strength, causal confidence, caps,
  deduplication, and anti-collusion rules before any indirect credit.
- **User-facing naming**: final labels for Support, Participation, and Trusted
  Roles; no `coin`/`token`/`wallet`/`spend` language without explicit approval.
- **Trusted Role gates**: role catalog, thresholds, and Registrar/governance
  join point.
- **Registrar formation Support requirement**: whether a Sect/community/entity
  filing is accepted before Support is allocated, whether Support is optional
  or becomes mandatory only after Part 2 activation, and which formation types
  use the mechanism.
- **Formation allocation and pooling**: who contributes the proposed large
  upfront Support amount, whether multiple supporters may pool it, the required
  amount, and duplicate/collusion limits.
- **Formation satisfaction and non-activation**: confirm that local Sect Uprise
  activation restores allocated Support; define withdrawal, expiry, cancellation,
  dormancy, failure, and partial-progress behavior.
- **Community-development Participation bonuses**: qualifying Registrar and
  community-enrichment acts, evidence requirements, attribution, value scale,
  caps, and whether activation awards an additional milestone bonus.
- **Action-matrix values**: complete every required `TBD` cell in
  `support-and-participation.md#support-and-participation-action-matrix` before
  activating the corresponding action family. Do not infer shared costs,
  restoration, bonuses, proof, or caps across different action families.

## 10) Digital Artifact Lifecycle (owner section: `docs/specs/economy/print-shop-and-promotions.md`)
- **Edition semantics**: numbering scheme, public visibility of edition
  position, and whether editions carry display rank.
- **Run exhaustion for contract-attached goodies**: reserve capacity at
  commitment or mint first-fulfilled until the run is exhausted.
- **Revocation/cancellation**: what happens to commitments and already-minted
  artifacts when an event is cancelled or a lineup changes.
- **Transfer/gifting stance**: confirm the default that no listener-to-listener
  transfer exists in the closed economy.
- **Artifact class catalog**: lock the class list and the mapping from artifact
  classes to avatar digital-merch object classes.
- **Provenance display privacy**: which mint-provenance details (contract,
  event, date) appear on publicly visible collection shelves.
