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
- sect realization into sub-community source behavior
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

Business submission boundary:
- business promotion submission may remain narrower than a full in-app business presence
- but it should still be account-attached through the source-facing Print Shop lane rather than anonymous listener/public submission

Business source interpretation:
- businesses still participate in the shared source system
- business accounts should be treated as source dashboards with the same base profile/update structure as other sources
- current business-facing actions may differ in content, but not in the underlying source model

Later-version source domains remain legitimate but are not widened here:
- causes once official
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

Business-facing source dashboard expectation:
- business accounts should be able to create/manage promotions
- business accounts should be able to read their analytics
- business accounts should be able to issue their outward follower-facing updates/actions through the same shared source-update model
- do not invent a separate business-only profile/dashboard architecture

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
- blast applies to signals, not sources
- currently confirmed blastable signals include:
  - singles
  - Uprises
- blast is performed by listeners

Rationale:
- Uprises are not purely local-only signals
- inter-community Uprises exist, so Uprises must remain eligible for explicit listener amplification

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
2. people can register backing / second it
3. once enough backing is registered, it becomes official
4. once official, it has its own identity within the community

Before officialization:
- it exists only in the Registrar as a proposal
- it is not yet treated as a public source

After officialization:
- it becomes its own source
- its first community entry is announced by the community update layer
- after that, its own announcements are follower-only like other sources

### 8.4 Shared motion/backing system rule
Causes and sects use the same formal civic process pattern:
- motion
- backing
- threshold
- officialization

The difference is the backing threshold:
- sects reach official realization through artist backing
- causes reach official realization through listener backing

Conceptual framing:
- a sect is the community formation
- the cause/motion layer is the formal process carrying it toward realization
- when the threshold is satisfied, the sect can become an Uprise

Do not treat sects and causes as unrelated systems.
They are parallel expressions of the same underlying registrar-mediated motion/backing model, with different qualifying backers.

### 8.3 Cause actions after officialization
Once official and public:
- follow is available publicly
- follow provides updates only
- support works like normal post-level support
- joining participation is Registrar-governed, not a generic profile action

If someone is allowed to participate in the cause after it is public:
- that allowance is controlled through the Registrar

### 8.5 MVP boundary
Causes are not part of the current MVP surface.

Interpretation:
- do not require a dedicated public cause surface in the current MVP pass
- do not require cause visibility in the current MVP social/community update layer
- treat causes as later-version scope, likely V2, unless explicitly reactivated

Underlying carry-forward remains:
- causes still belong to the registrar-mediated motion/backing system
- causes may still become first-class sources later
- this rule removes cause availability from the active MVP expectation rather than deleting the model

## 9) Sect Realization And Source Behavior Lock
### 9.1 Realization result
When a sect completes its motion/backing/threshold process:
- it becomes its own source
- it becomes a sub-community / community source inside the parent community

### 9.2 Sect profile presence
Once realized as its own source:
- the sect has its own profile within the community
- that profile should be reachable from the current community information area

Minimum MVP sect-profile posture:
- a basic outline is enough for now
- it should answer the same kinds of orienting questions that the community profile answers
- it should list the bands/artists that are part of the sect
- it should include fan/community data relevant to the sect

Current founder note:
- the dry `Statistics` framing should give way to `The Scenery` as the broader community-information surface
- `Registrar` should live inside `The Scenery` as a feature/module, not as its own peer default-screen section
- the primary registrar CTA inside that surface should remain `Register`
- registrar role/capability flows should also be accessible from the source-facing side of the platform rather than being trapped only in a listener/civic entry surface

Provisional candidate, not hard-locked yet:
- the sect profile may also carry its own calendar and upcoming events view
- treat that as pending confirmation before building it as a required MVP surface

### 9.3 Sect follow behavior
Once a realized sect is its own source:
- people can follow it
- followers receive sub-community updates from that sect
- following a sect allows the user to add that sect's Uprise, because the Uprise is the signal carried by the sect source

### 9.4 Sect signal
The sect's signal is the Uprise.

Once the sect has formed, people should be able to reach that Uprise from the sect profile page and perform the normal signal actions:
- add
- blast
- recommend

### 9.5 System interpretation
Realized sects do not remain only tag/statistical constructs.
Once realized, they participate in the shared source system as sub-community/community sources.

### 9.6 Sect motion origin and tag replacement
Sects should be treated as artist-based civic motions.

Locked interpretation:
- sect initiation belongs to the artist-facing interface rather than a listener taste-tag manager
- the older tag-based sect substrate should not drive new MVP sect work
- follow relationships govern ongoing awareness/update behavior once a sect is realized as a source; they do not replace Home Scene affiliation or system-order identity

Implementation boundary:
- `homeSceneTag` remains part of the system-order model where needed for Home Scene affiliation, voting-rights logic, and visitor/local distinction
- older tag-era sect assignment flows should not be treated as sufficient by themselves for sect realization; realization still depends on artist-backing motion/backing rules
- do not collapse Home Scene affiliation into follow relationships

## 10) Event Ontology Lock
Currently confirmed event ontology:
- events are sources
- flyers are signals
- Print Shop remains source-facing; listener event interaction stays on the discovery/follow/attendance side rather than entering Print Shop itself

Listener/event access boundary:
- listeners can follow an event
- only the promoter and artists operate/manage the event source from their listener account

Not locked here:
- paid event promo package details
- Print Shop flyer issuance mechanics
- default emission rules for flyer/promo objects after event entry

Those remain pending and must not be guessed.

## 11) Do Not Infer Beyond This Lock
This document does not finalize:
- promoter event/flyer/promo default emission rules after source entry
- Print Shop runtime behavior
- event paid-package execution rules
- community-milestone threshold formulas
- full cause runtime/contract rename from `project` to `cause`
- final naming of the community information area currently reached through `Statistics`
- broader feed-card rendering grammar beyond the rules above

If implementation needs those details, extend founder lock coverage first.

## 12) Required Follow-Up Flags
The following are now flagged for deliberate development/reconciliation work:

1. Terminology migration
- reconcile registrar/spec/runtime language from `project` to `cause`

2. Source/feed runtime alignment
- codify community-wide vs follower-only emission rules in actual feed/update services

3. Shared source profile alignment
- reconcile profile surfaces to the shared source-profile structure and donation-link exception

4. Cause runtime alignment
- reconcile current registrar `project` APIs/contracts to the locked cause lifecycle and backing boundary when causes are reactivated beyond later-version scope

5. Sect realization/runtime alignment
- reconcile sect motion/runtime surfaces so realized sects become source-like sub-community profiles with followable updates and Uprise signal access

6. Community information-area follow-up
- reconcile the current `Statistics` framing with the broader community-information role the founder described

7. Event/source follow-up
- return later to the unresolved event/flyer/promo promotion rules before building them
