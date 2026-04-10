# MVP Source And Feed Rules Founder Lock R1

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-09

## 1) Purpose
Capture founder-confirmed source, profile, feed, and registrar-entity rules so future sessions stop re-deriving them from chat fragments.

This document is the controlling lock for:
- universal source rules
- shared source profile structure
- source-entry vs follower-update behavior
- community-wide vs follower-owned update ownership
- reaction/private-action boundaries
- `cause` terminology and lifecycle direction
- currently confirmed event/source ontology

## 2) Authority And Precedence
For source/feed/profile implementation and review, apply this order:
1. Direct founder-confirmed behavior captured in this document
2. `docs/canon/*`
3. `docs/specs/*`
4. other active founder locks in `docs/solutions/*`
5. current runtime/code evidence
6. dated handoffs

Until the older specs are intentionally reconciled, this document overrides narrower or conflicting assumptions about source behavior, feed ownership, and `project` terminology.

## 3) Universal Source Rule
All sources share the same base feature model.

Do not reinvent separate source mechanics unless there is an explicit exception.

Universal source capabilities:
- public profile/page
- follow
- follower updates
- first-entry community announcement
- posts/announcements
- support on posts

Universal source rule:
- the shared system behavior is the same across source types
- what changes is the content they emit, the signals they carry, and any source-specific extra capabilities

Current source classes in active MVP understanding:
- artists
- communities
- businesses
- promoters
- events
- causes once official

Later-version source domains remain legitimate but are not widened here:
- ambassadors
- venues
- mixologists

## 4) Shared Source Profile Structure
All source profile pages use the same base profile structure.

Universal profile sections:
- header / identity
- updates / posts
- details / about
- links

Shared profile rules:
- all source profiles support links to 3rd-party sites
- sources may place a donation link on their profile
- businesses are the exception and should not expose a donation link by default

## 5) Source Update Ownership Rules
### 5.1 Community-wide updates
Community-wide updates are emitted by the community/system layer, not by the source itself.

Use a community-wide update when shared scene reality changes, including:
- a source/entity appears in the community for the first time
- a new sect is formed
- a new Uprise takes root in a city
- a new event enters the calendar
- a signal rises into the state community
- major community acknowledgments or milestones
- registrar-backed structural changes that materially affect the community
- official community/Uprise updates

Community milestone thresholds are valid system triggers, but the exact threshold math is still deferred.

### 5.2 Follower updates
After first entry, ongoing source-origin announcements go to followers only.

This rule applies to sources generally, including:
- artists
- promoters
- businesses
- causes once official

Follower updates may contain freeform source messaging.

### 5.3 Source entry rule
When a source joins or enters the community for the first time:
- the event is announced by the community update layer
- this is community-wide
- after that initial entry, the source behaves like an artist announcement model: follower-only updates

## 6) Feed Action Boundaries
### 6.1 Support
Support is reaction-level behavior on posts.

Support rules:
- support is not a standalone feed post
- support behaves like reaction/like behavior on the object itself
- multiple icon types may exist
- support contributes to metrics

### 6.2 Private / non-feed actions
These do not become standalone public feed noise by default:
- add a single to collection
- tune/start listening
- save an event
- follow a source

### 6.3 Blast
Blast is not a universal source action.

Blast rule:
- blast is specific to singles
- blast is performed by listeners

### 6.4 Backing
Backing is not a source feature.

Backing applies to registrar-stage entities, not public source profiles.

Current registrar-stage entities called out in-session:
- Uprisings
- causes

## 7) Plot Feed Priority
Current Plot tab priority order is:
1. Feed
2. Events
3. Promotions
4. Statistics

Feed is not just the default-selected tab.
Feed is the primary live pulse of the scene.

Feed purpose:
- live update of what is happening in the scene
- community activity summary
- one-screen view of active motion across the surface

Allowed feed-composition behavior:
- the main feed can include inserted summary modules
- upcoming events may appear as a recurring carousel inside the feed
- local ads/promotions may appear as a recurring carousel inside the feed

## 8) Cause Terminology And Lifecycle Lock
### 8.1 Terminology
Use `cause` as the product term going forward.

Transition note:
- existing runtime/spec contracts may still say `project`
- those older `project` surfaces should be treated as terminology debt to reconcile, not as preferred product language

### 8.2 Registrar lifecycle
A cause begins in the Registrar as a proposal.

Cause lifecycle:
1. someone registers the cause in the Registrar
2. people can register in support / second it
3. once enough support is registered, it becomes official
4. once official, it has its own identity within the community

Before officialization:
- it exists only in the Registrar as a proposal
- it is not yet treated as a public source

After officialization:
- it becomes its own source
- its first community entry is announced by the community update layer
- after that, its own announcements are follower-only like other sources

### 8.3 Cause actions after officialization
Once official and public:
- follow is available publicly
- follow provides updates only
- support works like normal post-level support
- joining participation is Registrar-governed, not a generic profile action

If someone is allowed to participate in the cause after it is public:
- that allowance is controlled through the Registrar

## 9) Event Ontology Lock
Currently confirmed event ontology:
- events are sources
- flyers are signals

Listener/event access boundary:
- listeners can follow an event
- only the promoter and artists operate/manage the event source from their listener account

Not locked here:
- paid event promo package details
- Print Shop flyer issuance mechanics
- default emission rules for flyer/promo objects after event entry

Those remain pending and must not be guessed.

## 10) Do Not Infer Beyond This Lock
This document does not finalize:
- promoter event/flyer/promo default emission rules after source entry
- Print Shop runtime behavior
- event paid-package execution rules
- community-milestone threshold formulas
- full cause runtime/contract rename from `project` to `cause`
- broader feed-card rendering grammar beyond the rules above

If implementation needs those details, extend founder lock coverage first.

## 11) Required Follow-Up Flags
The following are now flagged for deliberate development/reconciliation work:

1. Terminology migration
- reconcile registrar/spec/runtime language from `project` to `cause`

2. Source/feed runtime alignment
- codify community-wide vs follower-only emission rules in actual feed/update services

3. Shared source profile alignment
- reconcile profile surfaces to the shared source-profile structure and donation-link exception

4. Cause runtime alignment
- reconcile current registrar `project` APIs/contracts to the locked cause lifecycle and backing boundary

5. Event/source follow-up
- return later to the unresolved event/flyer/promo promotion rules before building them
