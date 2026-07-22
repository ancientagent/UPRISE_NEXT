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
