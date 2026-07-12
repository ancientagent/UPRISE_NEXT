# Support Reaction Model Correction Founder Session

Status: raw founder-session capture
Date: 2026-07-11
Source: current chat/session
Related lane(s): actions/signals, Home/Plot Feed, engagement, events, Print Shop, business/monetization
Owner spec candidates: `docs/specs/engagement/support-and-participation.md` (`ENG-SUPPORT`); `docs/specs/core/signals-and-universal-actions.md`; `docs/specs/economy/print-shop-and-promotions.md`

## Raw Founder Notes

> listeners dont need to "commit" or rsvp

> no  so the idea of support was originally a way people can interact with the
> post, (like reactions on fb)  so the idea would be since all the feed cards
> are actions/anouncements/updates etc.. people can "support" the posts which
> would serve the same purpose as rsvp which is something people dont do,
> "support" is a more honest metric anyway

> and because the support system has weight, people cant just say it, and are
> less willing to support everything  if they really have to act on that

> so i addressed this,  I think it could be something the artist should be able
> to correct if they can prove it (I think image recognition would be a good
> thing to have potentialyy for people who are into it, that is another proof
> of attendance

> that said,  if they never reached out to the artist no,  there can be a link
> with the qr that says dont forget to support the event.  (supporting events
> this looks good for local businesses who may want to sponsor the show (pay
> the bands guarentee)   supporting the event contract is what makes you
> eligable for the flyer, as you could support it and fix the bands gear.  once
> event contract is satisfied is when the listener gets the flyer

> im not sure you understand the sponsor angle... if so i think you saif it
> backwards.. there is supposed to be a promos page in the pot which is local
> businesses offering deals and special coupons in the area.   these business
> owners wil pay for a source account with uprise that  gives them a list of
> artists interested in sponsorship deals , events looking for sponsors, etc)
> this is why getting support for these sources and signals is important

## Clarifications

- Support is the universal Feed-card interaction primitive — reaction-like, one
  tap on any source card (announcement, update, release, event). It is not a
  commitment, RSVP, pledge, or obligation mechanic, and product language must
  not frame it as one.
- Type: settled correction; supersedes the commit/RSVP framing and the
  `Commit` wording in the 2026-07-10 `Request / Commit / Fulfill / Act`
  terminology.
- Likely owner: `docs/specs/engagement/support-and-participation.md`;
  `docs/specs/core/signals-and-universal-actions.md`.

- Support keeps its weight: the pool is finite, and supported amounts return
  only when the listener actually acts on what they supported. Scarcity plus
  act-to-restore is the honesty mechanism — people self-ration instead of
  supporting everything.
- Type: settled mechanic confirmation.
- Likely owner: `docs/specs/engagement/support-and-participation.md`.

- On event announcement cards, the aggregate support count serves the purpose
  RSVP was meant to serve — an expected-interest/turnout signal — and is a more
  honest metric because reacting is something people actually do.
- Type: settled product purpose.
- Likely owner: `docs/specs/engagement/support-and-participation.md`; Feed/event
  analytics read models.

- Supporting the event contract is what makes a listener eligible for the
  event's flyer. The flyer mints when the listener's support of that event
  contract is satisfied through a qualifying verified act. Verified attendance
  is the default satisfying act, but not the only one: other supportive acts,
  such as helping fix the band's gear, can satisfy the contract when verified
  or acknowledged.
- Type: settled eligibility/minting rule; the qualifying-act catalog and
  verification per act remain open.
- Likely owner: `docs/specs/engagement/support-and-participation.md`;
  `docs/specs/economy/print-shop-and-promotions.md`.

- The event QR can carry a link prompting "don't forget to support the event,"
  so a listener who never tapped Support beforehand can support at the show.
  Pre-event tapping is never required.
- Type: settled affordance; late-support cutoff (during vs after the event)
  remains open.
- Likely owner: `docs/specs/engagement/support-and-participation.md`;
  Event/Proof-of-Attendance contract.

- A listener who attended but never supported and never reached out to the
  artist does not receive the flyer (Participation still accrues). The artist
  should be able to correct/acknowledge a listener's support if they can prove
  it.
- Type: settled default plus settled correction path; artist-correction
  anti-abuse and evidence rules remain open.
- Likely owner: `docs/specs/engagement/support-and-participation.md`.

- Image recognition is a potential additional proof-of-attendance path for
  listeners who opt into it.
- Type: open/future verification direction; consent, privacy, accuracy, and
  data-handling contracts required before any design or implementation.
- Likely owner: future Proof-of-Attendance verification contract.

- The sponsor angle runs business-to-platform, not support-to-business: local
  businesses pay for an UPRISE business source account. That account gives
  them presence on the future Plot promos/Promotions page (local deals and
  special coupons for the area) and a sponsorship-discovery view — a list of
  artists interested in sponsorship deals and events looking for sponsors
  (for example, paying a band's guarantee).
- Support analytics on those sources and signals are the evidence that makes
  sponsorship discovery credible; this is a core reason gathering support for
  sources and signals matters.
- Type: settled business-model direction; business runtime, account pricing,
  listing eligibility, and artist sponsorship opt-in mechanics remain
  deferred/open.
- Likely owner: `docs/specs/economy/print-shop-and-promotions.md` business
  sections; future business identity/source-account contract;
  `docs/agent-briefs/BUSINESS_MONETIZATION.md` routing.

## Working Interpretation

- Two layers: the listener feels a one-tap reaction; the system underneath
  allocates a finite unit to that card's source and returns it on a qualifying
  verified act. Same ledger as the 2026-07-10 capture — the correction kills
  the contract/RSVP framing, not the weight.
- Lifecycle naming should move away from `Commit`; a candidate framing is
  `Announce / Support / Satisfy` (source announces, listener supports, support
  is satisfied by verified action). Final labels remain a naming decision.
- The flyer is a receipt for supported-and-satisfied, not an attendance prize.
  The QR's support link and the artist correction path are the two grace paths
  that keep this from feeling like a gate.
- Artist correction is a manual acknowledgment/verification affordance, not an
  open grant button; it needs evidence and anti-self-dealing limits because it
  feeds proven-support analytics.

## Promotion Targets

- Owner spec: `docs/specs/engagement/support-and-participation.md` (patched
  this session with the reaction model).
- Join points: `docs/specs/core/signals-and-universal-actions.md`;
  `docs/specs/economy/print-shop-and-promotions.md`.
- Decisions: `docs/specs/DECISIONS_REQUIRED.md` section 9 (late-support cutoff,
  artist-correction rules, image-recognition privacy, lifecycle naming).

## Do Not Drift

- Do not frame Support as RSVP, commitment, pledge, or obligation in product
  copy, specs, or UI.
- Do not make the pre-event Support tap a requirement for attending,
  participating, or earning Participation.
- Do not remove Support's weight: the pool stays finite and restores only
  through qualifying verified acts.
- Do not mint the flyer for attendance alone; eligibility requires supporting
  the event contract, satisfied through a qualifying act or a proven artist
  correction.
- Do not treat attendance as the only satisfying act; the qualifying-act
  catalog is open and includes artist-acknowledged supportive work.
- Do not implement image-recognition attendance proof without explicit consent,
  privacy, and data-handling contracts; it is opt-in only if it ever exists.
- Do not let artist corrections become uncontrolled grants that inflate
  proven-support analytics.
- Do not frame the sponsor angle as businesses merely reacting to public
  support counts; the model is paid business source accounts whose
  sponsorship-discovery and promos-page features are informed by support
  evidence.
- Do not activate the Plot promos page, business source accounts, sponsorship
  listings, or artist sponsorship opt-in from this note; all remain deferred
  business-layer work.
