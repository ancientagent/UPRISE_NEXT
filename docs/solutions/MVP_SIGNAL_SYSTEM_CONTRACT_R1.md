# MVP Signal System Contract (R1)

Status: Active  
Owner: Founder + product engineering  
Last updated: 2026-04-15

## 1) Purpose
Define the current MVP signal system explicitly so source behavior and signal behavior stop getting mixed in runtime and review.

This contract does not replace canon or `docs/specs/core/signals-and-universal-actions.md`.
It narrows current MVP implementation truth using the founder locks already established this week.

Precedence note:
- for the broader action grammar and class taxonomy, use `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md` first
- this document now reflects a narrower music-signal lock and contains known terminology debt around `ADD` and `flyer`
- reconciliation is pending rather than complete

## 2) Core Rule
Sources and signals are different systems.

Source rules govern:
- identity/profile
- follow
- follower updates
- first-entry community announcement
- source dashboard/tool access

Signal rules govern:
- listener-facing actions on carried content
- collection shelves
- blastability
- recommendation targeting
- propagation behavior where explicitly allowed

Do not:
- blast a source
- treat follow as a signal action
- treat backing as a source-profile action
- widen blast onto artist pages, event pages, or flyer artifacts

## 3) Current Confirmed Signal Classes
### Active MVP / current locked ontology
- `single`
- `Uprise`

### Relationship to sources
- artist/band source carries `single` signals
- realized sect/sub-community source carries its `Uprise` signal
- event pages are object surfaces, not source pages
- flyers are event-bound artifacts, not default current MVP signal classes

Artist release-deck clarification:
- artist-side release workflow belongs to the source dashboard system
- the paid `10` second ad attached to a new release must not be assumed to be a separate music signal slot
- the paid ad slot does not increase music upload capacity beyond the locked `3` song slots
- do not widen that ad attachment into a general independent signal class without a dedicated lock

### Later-version / not widened here
- mixes
- broader discourse/social signals
- fuller artifact families

## 4) Action Applicability Rule
Not every signal exposes every action.

Action availability depends on signal type and locked product semantics.

### Confirmed now
#### Singles
- `Collect` (runtime endpoint debt still uses `ADD`)
- `Blast`
- `Recommend`

#### Uprises
- `Collect` (runtime endpoint debt still uses `ADD`)
- `Blast`
- `Recommend`

## 5) Follows vs Signal Actions
Follow applies to the source/entity.

Implication:
- users follow a source to receive the signals it carries or emits
- users do not follow the signal itself as the default relationship

Current explicit example:
- following a realized sect allows the listener to reach and collect that sect's Uprise because the Uprise is the signal carried by the sect source

## 6) Blast Rule
Blast applies to signals, not sources.

Blast is the public carry/spread action for currently locked music-distribution signals.

Current confirmed blastable signals:
- singles
- Uprises

Rationale already locked:
- inter-community Uprises exist
- Uprises must remain eligible for explicit listener amplification
- artist pages are source pages, not blast targets
- event pages are event surfaces, not blast targets
- flyers remain artifacts without current blast parity

## 7) Recommendation Rule
Recommendation is a user-to-signal relationship.

It is:
- not a source
- not a signal itself
- not algorithmic personalization

Current confirmed recommendation targets:
- held singles
- held Uprises

## 8) Shelf Mapping Rule
Signals map into collection shelves.

Current relevant shelf families in runtime/spec truth:
- `singles`
- `uprises`
- `fliers`

Collection shelves remain:
- profile-bound
- descriptive
- non-governing

## 9) Implementation Guidance
When implementing a surface:
1. determine whether the object is a source or a signal
2. apply source rules first for identity/follow/update behavior
3. apply signal rules only to the carried signal object
4. do not widen unsupported action sets just because another signal type has them

## 10) Current Follow-Up Work
The next runtime reconciliations should use this contract to:
- keep Source Dashboard separate from signal actions
- keep Print Shop and event creation source-facing
- keep artist profiles on source actions only rather than synthetic source-level signal buttons
- avoid treating flyers as signal classes or blast targets
- reconcile remaining runtime `ADD` debt to the intended `Collect` model
