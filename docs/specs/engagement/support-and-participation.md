# Support and Participation Civic Layer

**ID:** `ENG-SUPPORT`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-07-22`

## Overview & Purpose

Defines the Support/Participation civic layer: the contract system beneath
source announcements, listener commitments, and verified supportive action.

Two related but distinct values:

- **Support** — the Feed's card-interaction primitive with weight: a one-tap,
  reaction-like action available on eligible source Feed cards, drawing on a
  finite revolving pool. Supported amounts return when the listener acts on
  what they backed. Because the pool is finite and restores only through real
  follow-through, people self-ration — which is what makes the count an honest
  metric. Support is never an RSVP, pledge, commitment, or obligation, and
  product language must never frame it as one.
- **Participation** — a cumulative record of verified supportive acts (listening,
  attendance, fulfillment, attributable influence). Participation is the
  valuable measure that can qualify listeners for `Trusted Roles` and future
  community standing.

This layer is the motive/retention "glue" of the community model and the
staged path toward community self-support. It is a **closed, non-market
system**: units have no cash value, cannot be traded, and must never use
`coin`, `token`, `wallet`, or `spend` as user-facing language unless a later
naming decision explicitly approves it.

Consolidates founder direction from:

- `docs/founder-sessions/2026-07-09_home-feed-card-grammar-and-support.md`
- `docs/founder-sessions/2026-07-10_support-civic-loop.md`
- `docs/founder-sessions/2026-07-11_support-reaction-model-correction.md`
  (supersedes the commit/RSVP framing of the 07-10 capture)
- `docs/founder-sessions/2026-07-22_registrar-support-participation-join-point.md`
  (community-development bonuses and proposed formation Support join point)

## Draft Status And Sequencing Boundary

This contract is `draft`. Settled product rules are recorded below; material
ledger, scale, privacy, and governance decisions remain open and are tracked
in `docs/specs/DECISIONS_REQUIRED.md` (section `9`). **No runtime may be
implemented from this spec until its open decisions are locked.**

Settled architecture boundary: the city-tier music platform (Part 1) functions
independently of this civic layer (Part 2). Nothing in Part 1 — listening,
source registration, community activation, Release Deck, RADIYO/Fair Play,
Plot, events — may take a dependency on Support/Participation runtime.

## Persistent System Impact

- The Support control lives on eligible source-backed Feed cards inside
  Plot, where the player is visible and Home Scene context is active.
- Listening Participation derives from player/RADIYO playback evidence; the
  qualifying-evidence contract joins `docs/specs/broadcast/radiyo-and-fair-play.md`.
- Support and Participation actions never change player state, listening
  context, rotation, or navigation scope.

## Core Model

### Support ledger (revolving)

- Every listener starts with a fixed allocation, working figure `100 Support`
  (settled as a starting amount, not a percentage; final scale/denomination
  open).
- Supporting a card allocates units to that card's event/source contract;
  allocated units are unavailable elsewhere until restored.
- The same units can never back multiple sources simultaneously.
- Restoration paths:
  1. **Satisfaction (primary):** qualifying verified acts that advance what
     was supported — attendance, artist-acknowledged supportive work, or other
     acts from the (open) qualifying-act catalog — whose defined values total
     the allocated amount.
  2. **Attributed influence (future, open):** verified multi-hop influence may
     restore allocated Support or award extra Support bandwidth in small
     amounts. Requires the influence-attribution contract; raw downstream
     clicks never qualify on their own.
- Whether earned bandwidth awards are permanent, expiring, renewable, or
  capped is an open founder decision.

### Participation ledger (cumulative)

- Records verified supportive acts with per-action defined values, whether or
  not the listener supported a related card first.
- Listening to music is the foundational Participation act: each qualifying
  listen is recorded in the ledger (thresholds, values, repeat-credit, and
  anti-farming rules open).
- Higher-effort verified acts (attendance, fulfillment, establishment of
  community-expanding entities) may carry greater value.
- Participation — not available Support, pending commitments, money spent, or
  collectible ownership — is the measure that can satisfy `Trusted Role`
  qualification gates.
- No prescribed sequence or activity checklist: different verified actions
  contribute their defined values; listeners are never required to support the
  community in one particular way.

### Registrar community-development join point (proposed; not locked)

- Verified acts that establish, develop, expand, or enrich a community are
  intended to earn Participation and may carry higher Participation bonus
  values than routine acts. The evidence catalog, values, caps, attribution,
  and anti-gaming rules remain open.
- Registrar formation efforts, including local Sect formation, need an explicit
  Support join point. The current proposed model uses a larger upfront Support
  allocation that remains allocated during formation and is restored when the
  local Sect Uprise activates.
- Any eligible Home Scene listener may originate the Sect potential whether or
  not they operate an Artist/Band. The originator bears the highest proposed
  Support allocation; later followers bear smaller proposed allocations.
- Follower count and follower Support describe community interest only. They do
  not make the Sect Official, count as Artist/Band membership, satisfy the
  five-source threshold, or contribute eligible Release Deck minutes.
- A listener who cannot personally activate the Sect can still earn
  Participation by recruiting eligible Artist/Band sources through an
  attributable Registrar referral code. Code issuance, claim, consent,
  attribution windows, Participation values, and abuse controls remain open.
- The proposal does not yet settle exact originator/follower amounts, whether
  follower allocations pool toward a presentation threshold, whether allocation
  precedes or follows the filing, withdrawal/expiry, or treatment of dormant and
  failed formations.
- The existing Part 1 independence rule remains in force. No Registrar or Sect
  runtime may require the unimplemented Support ledger until the open decisions
  explicitly determine whether this join point becomes mandatory after Part 2
  activation.
- Support/Participation records annotate the formation lifecycle; they do not
  replace the settled Artist/Band membership and eligible-music thresholds.
  Current Registrar language that artists "support" a Sect request means
  explicit Artist/Band Sect membership, not a finite listener Support allocation.

### Lifecycle: Announce / Support / Satisfy (labels open)

Per the 2026-07-11 correction this supersedes both the agreement/debt
vocabulary and the earlier `Request / Commit / Fulfill / Act` commit framing;
final user-facing labels remain a naming decision:

1. A source **Announces** — every source Feed card (announcement, update,
   release, event) is a support-directing surface.
2. A listener **Supports** the card — one tap, reaction-like, allocating a
   unit from their pool to that card's contract. Supporting is optional
   expression, never a prerequisite, RSVP, or obligation.
3. The support is **Satisfied** by qualifying verified acts — attendance,
   artist-acknowledged supportive work, or other acts from the (open)
   qualifying-act catalog. Satisfaction restores the allocated amount and
   triggers any contract-attached reward.

Action-owned mechanics: each supported action type owns its verification
method, value, attribution rules, and duplicate/cap rules. Request templates
supply their default proof automatically; sources do not configure contract
mechanics per announcement (they may attach optional extra opportunities and
digital goodies).

## Support And Participation Action Matrix

This matrix is the required control surface for Support/Participation behavior.
It prevents action costs, restoration, Participation rewards, proof, and
activation events from being independently invented in Feed, Registrar,
events, playback, or governance code.

Before an action family becomes runtime, its row must settle:

- actor and beneficiary;
- whether Support can or must be allocated;
- Support allocation amount or calculation;
- satisfaction/activation event;
- Support restoration amount and timing;
- base Participation value and any milestone bonus;
- required evidence and verifier;
- attribution, duplicate, frequency, and anti-farming caps;
- cancellation, expiry, reversal, and dispute behavior;
- contract owner and implementation status.

`TBD` means the value is an open founder/owner-contract decision. `N/A` means
the mechanism does not apply. No runtime may convert a `TBD` cell into a default.

| Action / contract family | Actor / beneficiary | Support allocation | Satisfaction / activation | Support restoration | Participation value / bonus | Evidence / verifier | Caps / attribution | Status / owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Qualifying music listen | Listener / source and Home Scene | N/A | Qualifying playback threshold | N/A | Base value TBD | Playback completion/engagement evidence; player/RADIYO owner | Repeat, mute/background, and farming limits TBD | Open; broadcast evidence + this spec |
| Feed-card Support | Listener / card-resolved source | Action-specific amount TBD | Action-specific verified satisfaction | Amount satisfied, up to allocation; exact schedule TBD | Support tap itself earns none; verified act value TBD | Action-owned proof | One allocation per listener/card plus action caps TBD | Open; actions/signals + this spec |
| Event attendance | Listener / event beneficiaries | Event amount TBD when supported; N/A when unsupported | Valid attendance proof | Restores attributed event allocation; exact value TBD | Attendance value TBD; multi-artist bonus allocation TBD | QR, artist correction, or later approved proof | Identity/time/event replay protection; one attendance award | Open; events + this spec |
| Artist-acknowledged supportive work | Listener / source or event | Uses related active allocation when present | Source verifies qualifying act | Defined act value against allocation TBD | Defined act value/bonus TBD | Source acknowledgment plus evidence rules TBD | Anti-self-dealing, dispute, and per-act caps TBD | Open; source/event owner + this spec |
| Verified recommendation/influence | Listener / attributable downstream source or signal | No required allocation currently | Approved causal attribution threshold | Future indirect restoration or bandwidth award TBD | Influence value/bonus TBD | Influence graph; raw clicks insufficient | Window, confidence, deduplication, and collusion caps TBD | Future; attribution contract |
| Named Sect request / formation effort | Any eligible Home Scene listener / local Sect | Originator pays highest amount TBD; no Artist/Band account required | Local Sect Uprise activates after separate artist/music thresholds | Proposed restoration at activation; failure/dormancy rules TBD | Origination/work bonus and activation milestone bonus TBD | Registrar provenance, participant actions, and activation audit | Filing spam, duplicate, expiry, and attribution rules TBD | Proposed; Registrar/community + this spec |
| Follow a Sect potential | Home Scene listener / local Sect potential | Smaller follower amount TBD | Interest threshold/presentation state TBD; never Official status or activation | Proposed restoration at Sect Uprise activation; withdrawal/dormancy TBD | Follow alone earns no Participation; later verified contribution may earn it | Authenticated follow and Support allocation | One active follow per listener/potential; collusion limits TBD | Proposed; Registrar + this spec |
| Recruit an Artist/Band through a Sect referral code | Referring listener / recruited source and local Sect | No separate allocation settled; may relate to active formation allocation | Referred source completes eligible registration and explicitly joins the Sect | Does not itself restore Support unless matrix later assigns a value | Successful recruitment value/bonus TBD; activation milestone attribution TBD | Issued code, source claim, Registrar materialization, explicit Sect membership | Single-use/limited-use, self-referral, duplicate-source, expiry, and collusion rules TBD | Proposed; Registrar + this spec |
| Artist/Band joins requested Sect | Authorized source operator / local Sect | Distinct from listener Support allocation; additional allocation TBD | Registrar-held eligible membership; activation remains separate | TBD only if a Support allocation is explicitly linked later | Membership/contribution bonus TBD | Registrar membership and source authority | One eligible membership per source/Sect; exclusivity/withdrawal open | Open; Registrar + this spec |
| Local Sect Uprise activation | Verified formation participants / local Sect | Consumes no new allocation by itself | Five eligible member sources plus 45 counted Release Deck minutes | Proposed restoration of attributed formation allocations | Activation milestone bonus and distribution TBD | Registrar membership, Release Deck measurement, activation audit | One activation event; contributor attribution TBD | Proposed; community + this spec |
| City-tier Home Scene activation | Verified formation participants / new Home Scene | Formation Support join point TBD | Settled source/music activation threshold | TBD | Community-establishment bonuses TBD | Source-origin readiness and activation audit | One activation event; source/listener contribution attribution TBD | Future Support join point; community + this spec |
| Cause, venue, business, or other community-expanding entity establishment | Filing participants / community entity | Entity-specific allocation TBD | Entity-specific verified activation | Entity-specific TBD | Establishment value/bonus TBD | Registrar/entity owner evidence | Duplicate, self-dealing, and qualification rules TBD | Future; respective owner contract |

The matrix does not alter Fair Play, Sect readiness, Home Scene activation, or
Registrar authority. It defines how the separate civic ledgers may recognize
and reward verified participation around those existing lifecycle events.

`Announce` is the source-facing publication action: any eligible dashboard
signal can be Announced into the Feed, parallel to listener `Recommend`. The
per-signal-class contract matrix is owned by
`docs/specs/core/signals-and-universal-actions.md` and remains open.

### First concrete contract: upcoming-show attendance

Settled as the initial reference implementation shape:

- An Artist/Band's upcoming-show Feed announcement is the first supportable
  event card. Its aggregate support count is the honest expected-interest
  signal that RSVP was supposed to be.
- Support is **atomic**: one tap allocates exactly `1 Support`. No amount
  picker, no RSVP ceremony.
- Satisfying acts: verified attendance via the event-specific QR code is the
  default (pairing with location/time checks open); other verified or
  artist-acknowledged supportive acts — e.g., helping fix the band's gear —
  can also satisfy the event contract. Generic unrelated activity never
  substitutes.
- The event QR carries a support link ("don't forget to support the event") so
  a listener who never tapped beforehand can support at the show. The
  late-support cutoff is an open decision.
- Satisfaction restores the unit and mints the event's digital flyer into the
  listener's collection. Supporting the event contract is what makes a
  listener flyer-eligible; attendance without support still earns
  Participation but does not mint the flyer.
- **Artist correction:** when a listener reaches out with proof, the artist
  may acknowledge their support/attendance after the fact. Corrections feed
  proven-support analytics, so evidence requirements and anti-self-dealing
  limits are required before activation. No outreach, no flyer.
- **Image recognition** is a potential future opt-in attendance-proof path;
  explicit consent, privacy, and data-handling contracts are prerequisites for
  even designing it.
- Dependency: flyer/goodie minting requires Print Shop Run/Artifact issuance
  (`docs/specs/economy/print-shop-and-promotions.md`), which is currently
  deferred. The Support slice cannot ship the reward path before a scoped
  issuance slice activates, and goodies are never minted before satisfaction.

### Multi-artist events

- An event with multiple billed Artist/Band sources is a multi-beneficiary
  Support context: a ticket supports every billed artist regardless of the
  private revenue split.
- Analytics preserve **direct-supporter counts per billed artist** as an
  audience-draw measure.
- Current interpretation awaiting founder confirmation: one verified
  attendance earns Participation once for the listener; the motivating
  artist receives direct-support attribution; other billed artists receive
  secondary attribution. The listener's award is never multiplied by lineup
  size.

## Analytics Contract

Three measures must remain distinguishable and never collapse into one number:

1. **Perceived/community support** — support taps on the announcement;
   anticipated interest/turnout (the honest RSVP-replacement signal).
2. **Proven support** — support satisfied through verified acts. Attendance
   with no support tap likely does not count here (founder leaning, not
   final); artist corrections do count once acknowledged under the (open)
   correction rules.
3. **Reach** — broader verified activity around the source, including
   unsupported attendance.

Sources see pending (unsatisfied) support and proven support separately so
expressions are never mistaken for completed backing. Artists can see who
supports them and how much (settled); per-listener visibility, amounts
disclosure, and privacy rules are open.

Future business join point (deferred): local businesses will pay for UPRISE
business source accounts that include the Plot promos/Promotions surface
(local deals and coupons) and sponsorship discovery — lists of artists
interested in sponsorship deals and events looking for sponsors (e.g., paying
a band's guarantee). Support analytics on those sources and signals are the
evidence that makes sponsorship discovery credible, which is part of why
gathering support matters. All of this stays deferred with the business
layer, and none of it ever affects Fair Play.

## Hard Invariants

- Support and Participation must never affect Fair Play, rotation, tier
  progression, propagation thresholds, or song ordering.
- No weighted voting, purchased authority, or automatic council seats; pending
  or available Support conveys no standing.
- No cash value, payout, redemption, transfer between users, resale, exchange,
  bidding, or marketplace behavior.
- No conversion between Support/Participation and money, Runs, or artifacts
  outside explicitly contracted fulfillment rewards.
- Support is never framed as RSVP, commitment, pledge, or obligation in any
  user-facing language, and no flow may require a Support tap as a
  prerequisite for attending, participating, or earning Participation.
- Trivial repeatable clicks never replenish Support; raw play starts, loops,
  and muted/background farming never earn Participation.
- Unrelated activity never satisfies a Support allocation without direct or
  approved indirect attribution to that specific contract.
- Cross-source fulfillment requires explicit causal evidence and double-count
  prevention.
- The prior direct `SUPPORT` signal counter/API behavior must not be restored
  as-is (see `docs/specs/core/signals-and-universal-actions.md`).

## Relationship To Activity Points (`ENG-ACTIVITY`) — Conflict To Resolve

`docs/specs/engagement/activity-points-and-analytics.md` defines Activity
Points as descriptive participation recognition with the invariant "no
conversion of points into authority or rank." The new founder direction makes
`Participation` the qualification measure for `Trusted Roles` — a bounded form
of community authority.

This is a real conflict, not a wording gap. Options:

1. **Participation supersedes Activity Points** as the single user-level value,
   and `ENG-ACTIVITY` is amended: descriptive analytics stay non-authority,
   while the separately named Trusted-Role gate is explicitly contracted here
   and in Registrar/governance. (Recommended: one user-level ledger, two
   clearly separated uses.)
2. **Two coexisting values** — Activity Points stay purely descriptive;
   Participation is a distinct civic value with its own ledger. (Costs a third
   number and invites confusion with Support.)

Founder decision required before either spec claims the term. Until then,
neither Participation nor Activity Points may gate any role at runtime.

## Data Models & Migrations

### Prisma Models

None implemented. Do not reuse `SignalAction` or `TrackEngagement` as the
Support/Participation data model.

### Planned Models (shape guidance only, blocked on open decisions)

- `SupportAccount` — listener balance: starting allocation, allocated,
  available, earned bandwidth.
- `SupportAllocation` — listener x source support: amount, announcement
  reference, state (`active`, `satisfied`, plus open withdrawal/expiry
  states), timestamps.
- `SupportAnnouncement` — source-published supportable card context: type,
  beneficiary source(s), linked signal/event, attached goodie (Run reference),
  lifecycle.
- Satisfaction record — qualifying act type, defined value, verification
  evidence reference (QR scan, artist acknowledgment, future opt-in proofs),
  attributed allocation.
- `ParticipationEntry` — append-only ledger: action type, value, evidence
  reference, optional contract linkage; auditable per entry.
- Influence graph storage — deferred until the attribution contract exists.

### Migrations

None. No backfill; ledgers start empty at activation.

## API Design

### Implemented Endpoints

None. No Support or Participation endpoint may be added before this contract's
open decisions are locked (see `docs/specs/core/signals-and-universal-actions.md`,
which already blocks the Feed-card Support endpoint on this contract).

### Planned Endpoints (Not Implemented)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/support/announcements/:id/support` | required | One-tap atomic Support on an eligible source card |
| POST | `/support/satisfactions` | required | Submit verification evidence (QR attendance proof, artist acknowledgment) |
| GET | `/users/me/support` | required | Own Support balance, active allocations, history |
| GET | `/users/me/participation` | required | Own Participation ledger |
| GET | `/artist-bands/:id/supporters` | required | Source-facing supporter analytics (pending vs proven), privacy rules pending |

## Web UI / Client Behavior

- Eligible source-backed Feed cards may expose the Support control only after
  this contract is locked and the ledger is implemented; the control applies
  to the source resolved by the card (owner:
  `docs/specs/core/signals-and-universal-actions.md`). The control reads as a
  lightweight reaction — never RSVP/commit copy.
- The Feed identity rail shows listener username plus support score once the
  score definition is locked (which ledger value the "score" displays is an
  open decision).
- Source Dashboard gains supporter analytics read models (pending vs
  fulfilled vs reach) after activation; descriptive only.
- Followed-artist Announcements and automatic calendar delivery are owned by
  the events/calendar contracts (`docs/specs/DECISIONS_REQUIRED.md` section 8),
  not by this spec.

## Anti-Gaming Requirements

Activation requires, at minimum: idempotent support per listener/card;
verification evidence bound to identity, event, and time (no replayed,
cross-event, or unauthenticated QR scans); per-action duplicate and cap rules;
listening-evidence thresholds against farming; evidence and anti-self-dealing
limits on artist corrections; influence credit only through the approved
attribution system with deduplication and anti-collusion limits.

## Phased Implementation Proposal (not authorization)

1. **Lock decisions** in `docs/specs/DECISIONS_REQUIRED.md` section 9 and
   resolve the `ENG-ACTIVITY` conflict.
2. **Slice 1 — atomic show contract:** supportable show card, one-tap Support,
   QR Proof-of-Attendance with the at-show support link, Support restoration,
   pending-vs-proven source analytics. Flyer reward included only if a minimal
   Print Shop issuance slice is activated with it; artist correction included
   only if its evidence/anti-abuse rules are locked.
3. **Slice 2 — listening Participation:** qualifying-listen ledger from
   playback evidence, own-ledger read surface.
4. **Slice 3 — analytics read models** for sources; Feed-rail support score.
5. **Later:** influence graph, indirect fulfillment, Trusted Role gates
   (Registrar/governance contract), community-fund join points.

## Acceptance Tests / Test Plan (on activation)

- Allocated units are unavailable elsewhere and restore only through verified
  satisfaction attributed to that contract.
- One listener cannot allocate the same unit twice or support the same card
  twice.
- Replayed/cross-event QR evidence is rejected.
- Attendance without support earns Participation but mints no contract-attached
  flyer and adds nothing to proven support (absent a valid artist correction).
- No user-facing Support surface uses RSVP/commit/pledge framing.
- Perceived, proven, and reach analytics remain separate values.
- No Support/Participation write affects Fair Play, rotation, tier, or
  governance state.

## References

- `docs/founder-sessions/2026-07-10_support-civic-loop.md` (primary capture)
- `docs/founder-sessions/2026-07-09_home-feed-card-grammar-and-support.md`
- `docs/specs/core/signals-and-universal-actions.md` (action grammar owner)
- `docs/specs/engagement/activity-points-and-analytics.md` (conflict above)
- `docs/specs/economy/print-shop-and-promotions.md` (Runs/artifact minting;
  artifact identity, ownership, and collection rules live in its
  `Digital Artifact Lifecycle And Collection` owner section)
- `docs/specs/system/registrar.md` (Trusted Roles / governance join point)
- `docs/specs/DECISIONS_REQUIRED.md` section 9

## Future Work & Open Questions

Material open decisions are tracked in `docs/specs/DECISIONS_REQUIRED.md`
section 9. Long-term directions recorded but far from contract-ready:
community council governance, community-owned network transition, live-music
fund and its Print Shop spending rail, venue/business participation, and
influence-attribution ("six degrees") tracing.
