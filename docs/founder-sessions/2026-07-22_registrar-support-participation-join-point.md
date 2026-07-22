# Registrar Support And Participation Join Point Founder Session

Status: raw founder-session capture; design in progress
Date: 2026-07-22
Source: current chat/session
Related lane(s): Proof-of-Support, Participation, Registrar/governance, Sects, community activation
Owner spec candidates: `docs/specs/engagement/support-and-participation.md`, `docs/specs/system/registrar.md`, `docs/specs/communities/scenes-uprises-sects.md`

## Raw Founder Notes

> its important to remember that those who participate in this process, as well as any other that adds to the enrichment/ development of a community will be awarded participation bonuses, that said, we should make note of how to icorporate the support system in the registration process. understand?

> right, the likely solution is these would require large support commitments up front and will be repayed upon activation of the sect uprise

> we should likely develop a support matrix that lists all actions / costs/ activation / support value / etc

> I think there can be requests or submissions/potentials in the registrar the user who puts it out there pays the highest support cost in which it remains until it has enough followers, each follower pays a smaller support cost

> it only proves community interest, however, none of this matters unless there are artists to support it, (i think the idea here is that a listener with an artist account would be the ones doing this, (they would be committing their band)

> Im thinking yes? however they may not want to because of the support cost since they themself cant be an activator? however What we can do is give them a "refer a friend" code.  that way they could go to their school and give it to bands in their school.  This would absolutely qualify the user as someone who has actively contributed to the development of their sect/community even if they dont have a band

## Clarifications

- Verified work that establishes, develops, expands, or enriches a community is
  intended to earn Participation, with higher-value community-development acts
  eligible for Participation bonuses.
  - Type: settled direction; exact evidence, values, caps, and anti-gaming rules remain open
  - Likely owner: `docs/specs/engagement/support-and-participation.md`
- Sect formation and other Registrar establishment flows need an explicit
  Proof-of-Support join point rather than remaining disconnected civic filings.
  - Type: settled architecture direction; exact integration remains open
  - Likely owner: `docs/specs/engagement/support-and-participation.md` with Registrar join points
- The current proposed mechanism is a large upfront Support allocation for a
  formation effort, restored when the local Sect Uprise activates.
  - Type: proposed solution, not yet a locked ledger contract
  - Open: who allocates, whether allocations are pooled, required amount,
    pre-filing versus post-filing timing, withdrawal/expiry, failed or dormant
    formation, and whether activation restores only Support or also awards a
    Participation bonus
- Support and Participation need one matrix that lists every eligible action,
  allocation cost, satisfaction/activation event, restoration amount,
  Participation value or bonus, proof, attribution, and anti-gaming limits.
  - Type: settled documentation/contract requirement
  - Likely owner: `docs/specs/engagement/support-and-participation.md#support-and-participation-action-matrix`
- Any Home Scene listener may submit the potential. The originator allocates the
  highest Support amount; followers allocate smaller amounts that prove
  community interest only.
  - Type: settled actor and signal boundary; exact costs and follower-state threshold remain open
  - Likely owner: `docs/specs/engagement/support-and-participation.md`
- Listener interest does not make the Sect Official and does not activate it.
  Eligible Artist/Band membership and Release Deck music remain the legitimacy
  and activation authorities.
  - Type: settled authority boundary
  - Likely owner: `docs/specs/system/registrar.md#sect-request-and-artistband-membership-authority`
- A listener who does not operate a band can still materially develop the Sect
  by recruiting bands through an attributable referral code. Successful
  attributed recruitment qualifies for Participation even though the listener
  cannot personally supply Artist/Band membership or music.
  - Type: settled Participation direction; code lifecycle, attribution window, values, and abuse controls remain open
  - Likely owner: Support/Participation matrix plus Registrar referral contract

## Feature Sets

### Registrar Formation Support

- A Registrar formation effort can become a Support-addressable civic object.
- Participants may allocate meaningful Support to demonstrate bounded backing
  and later earn Participation for verified work that advances the effort.
- Sect Uprise activation is the proposed satisfaction event that restores the
  formation Support allocation.
- Existing artist-count and Release Deck music thresholds remain the activation
  authority unless separately changed; raw Support totals must not silently
  replace them.
- The originating listener bears the largest proposed Support allocation.
  Subsequent followers bear smaller proposed allocations; their count and
  allocations describe interest, not source eligibility or music readiness.
- A Registrar-issued referral code can attribute recruited Artist/Band
  registrations to a non-artist listener who helped develop the potential.

## Open Contract Boundary

- Current Part 1 documentation requires registration and activation to function
  without Support/Participation runtime. This capture does not silently remove
  that sequencing boundary.
- A later founder decision must determine whether formation Support remains an
  optional parallel civic layer or becomes required after the Part 2 ledger is
  activated.
- "Artist support" in the current Sect threshold means explicit Registrar-held
  Artist/Band membership. It is not automatically the same record as a listener
  Support allocation.
- A listener follower threshold may affect potential-state presentation, but it
  cannot create Official status, replace the five-source requirement, or count
  music toward activation.

## Do Not Drift

- Do not implement Support or Participation runtime from this capture.
- Do not change the settled five-source and 45-minute Sect thresholds.
- Do not award Participation from unverified clicks or mere filing volume.
- Do not use an unresolved Support amount, pooling rule, or dormant-request rule
  as an API or schema contract.
- Do not conflate Artist/Band Sect membership with the finite listener Support
  ledger.
- Do not activate an action whose matrix row still has unresolved required
  values, evidence, attribution, or cap semantics.
- Do not require the originating listener to operate an Artist/Band source.
- Do not count follows, Support allocations, or referral-code distribution as
  Artist/Band membership. Only a completed eligible source registration and
  explicit Sect membership can supply that authority.
