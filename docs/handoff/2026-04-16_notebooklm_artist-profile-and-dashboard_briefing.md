# 2026-04-16 — NotebookLM Briefing: Artist Profile + Artist Dashboard

## Purpose
This file is an upload-ready briefing for NotebookLM so it can answer artist-profile and artist-dashboard questions from the current UPRISE repo state without over-weighting stale canon or older implementation briefs.

Use this document as a curated source pack summary.
Do not treat it as higher authority than the underlying controlling docs it cites.

## How To Use This With NotebookLM
### Recommended upload set
Upload this file together with:
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/handoff/2026-04-16_discover-feed-insert-and-artist-demo-lock.md`
- `docs/handoff/2026-04-16_artist-fixture-roster-seed.md`

### Why this pack
NotebookLM tends to merge:
- older canon carry-forward
- current founder locks
- implementation reality

This pack gives it the current precedence and the recent month of important changes so it stops answering from mixed eras.

## Authority Order
For artist-profile, source-dashboard, and discovery answers, NotebookLM should prefer this order:
1. direct founder-confirmed behavior in the current founder locks
2. `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
3. active `docs/specs/*`
4. relevant canon
5. older historical implementation briefs only as background

Important:
- older docs that still say artist page actions are `Follow / Add / Support` are stale
- older docs that treat live `/discover` as active MVP are stale
- premium analytics language in canon/legacy docs is not automatically the same thing as current MVP runtime lock

## Last Month Change Digest
### 2026-04-16
- `4dad6ec` `feat: add listener fixtures for artist profile qa`
  - added 5 listener-only fixtures
  - seeded signal activity now comes from listeners, not artist owners
  - valid artist-profile QA now uses listener context
- `c3a2eaa` `docs: lock discover feed inserts and artist demo flow`
  - live `/discover` deferred while borders remain closed
  - discovery value currently comes through intermittent feed inserts
  - clicking an insert should pause `RADIYO` and open artist-profile listening
  - collect happens on the profile
  - blast stays out of the profile
- `977697d` `feat: seed artist signal activity fixtures`
  - seeded artist-owned singles/Uprises plus qualifying signal stats
- `112ec17` `feat: add artist fixture roster seed`
  - seeded deterministic artist QA roster
- `a3d828c` `feat: defer discover for local-only mvp`
  - moved active MVP away from live Discover
  - disabled Discover in nav/CTA and redirected discovery value to feed moments
- `490001a` `fix: remove discover search and keep community lookup scoped`
  - community-native lookup belongs on the community page, not Discover

### 2026-04-15
- `c590ecc` `fix: align radiyo wheel save language with collect`
  - public wheel/save language changed from `Add` to `Collect`
- `7352913` `fix: add collect alias for signal save actions`
  - added public `/signals/:id/collect` alias while preserving runtime compatibility
- `19b58e3` `fix: remove direct support from signal contract`
  - `Support` is no longer a direct live signal action
- `688a9be` `fix: keep flyers out of signal metrics`
  - flyers are artifact-side, not signal-side
- `e6409c1` `docs: restore registrar listener-side boundary`
  - Registrar is listener-side doctrine, not native source tooling

### 2026-04-14
- `f732778` `docs: lock action system matrix`
  - locked current action grammar and source/signal/artifact/event model
- `080355b` `fix: reconcile artist page actions with action matrix`
  - removed synthetic source-level signal actions from artist pages
- `09494a0` `fix: lock blast to music signals only`
  - blast narrowed to `single` and `Uprise`

### 2026-04-13 to 2026-04-12
- source account / source dashboard emergence
- release deck source-context continuity
- print shop and registrar source-side bridges
- explicit source ownership on tracks/events/profile reads

## Current Artist Profile Requirements When A Listener Views It
### Current controlling docs
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/handoff/2026-04-16_discover-feed-insert-and-artist-demo-lock.md`

### What is currently locked
The artist profile is:
- a public source page for the artist
- the direct-listen and discovery surface for that artist's music outside `RADIYO`
- not `RADIYO`
- not `Collection`
- not a wheel surface
- a place to learn about the artist and reach official artist-controlled outbound links when configured

#### Page-level actions
Current intended page-level action grammar:
- `Follow`
- donation/support-the-source link when configured

Current intended prohibitions:
- no source-level `Collect`
- no source-level `Blast`
- no source-level `Support` button

#### Song area
Current intended song area:
- `3` songs on the artist profile
- each song rendered as its own playback row
- each row provides:
  - song title
  - `Play/Pause`
  - timeline / progress bar
  - optional elapsed / duration
  - `Collect`

#### Artist-profile listening mode
This is a separate direct-listen mode:
- no wheel
- no blast controls
- no broadcast framing
- no collection-player framing

#### Handoff rules
- from an artist/source link:
  - nothing auto-plays
  - `RADIYO` keeps playing until the user explicitly selects a song row
- from a song-driven discovery handoff:
  - artist profile opens
  - selected song begins playing there
  - `RADIYO` pauses

#### Collect vs Blast on profile
- `Collect` happens from the artist-profile listening context
- `Blast` does not happen on the artist profile
- `Blast` remains tied to:
  - `RADIYO`
  - `Collection`

### What is still not fully locked on the profile
- exact section order outside the locked song-row area
- exact header composition
- exact event/calendar layout
- exact visual styling of the song rows
- exact artwork fallback hierarchy
- richer profile-wall / artifact-display behavior
- exact layout/grouping of official outbound links

## Current Artist Dashboard / Source Dashboard Requirements
### Current controlling docs
- `docs/solutions/MVP_ACCOUNT_SOURCE_SIGNAL_SYSTEM_PLAN_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/handoff/2026-04-13_release-deck-source-context-continuity.md`
- `docs/handoff/2026-04-13_source-dashboard-capability-aware-cards.md`
- relevant canon for release-deck and descriptive-analytics constraints

### Core model
UPRISE is one signed-in platform.
An artist does not use a separate app/account tree.
Instead:
- one user account
- additive capabilities
- attached source accounts/entities
- explicit in-app switching between listener context and source-account context

### Current source-side surfaces / tools
Current source dashboard system direction includes:
- `Source Dashboard`
- `Release Deck`
- `Print Shop`
- `Registrar`
- source profile access / source context visibility

### Release Deck current requirement
Locked current doctrine:
- artist-side music release is part of the source-dashboard system
- release deck exposes `3` music upload slots
- the same interface may later include a `4th` paid attached-ad slot concept
- that paid slot is interface capacity, not extra music capacity
- do not treat the ad slot as a 4th song slot

### Source dashboard constraints
Current locked constraints:
- no governance control from artist/source dashboard
- no rotation control
- no Fair Play promotion/boosting
- no prescriptive analytics
- no comparative ranking against other artists as a source-dashboard requirement

### Analytics posture
Current reliable posture:
- analytics are descriptive only
- artists may view descriptive engagement/performance data
- current MVP/source-dashboard work should not be read as authorizing prescriptive or comparative success dashboards

Important distinction:
- legacy canon contains richer premium analytics ideas
- those are valid carry-forward concepts
- they are not automatically current MVP runtime requirements unless explicitly re-locked

### Event management boundary
Current repo/system direction:
- source-side tooling may include event creation/management through Print Shop and related source context
- if a source user also has promoter capability, that capability affects what they can do
- do not flatten this into a generic “artist dashboard controls everything” answer

## Reconciliation Of The NotebookLM Answer You Pasted
### Aligned / basically right
The pasted NotebookLM answer is directionally right about:
- public profile being constrained against rankings / editorial legitimacy language
- artists using a management/dashboard surface in the web app
- release deck being tightly constrained
- analytics being descriptive only
- no governance control / no Fair Play boosting

### Stale or incomplete
The pasted answer is stale or incomplete on these points:
1. Public artist profile behavior
- It under-describes the current founder lock.
- Current lock is not just “follow and catalogue stats.”
- The newer lock explicitly adds:
  - artist-profile direct listening
  - `3` song rows
  - `Collect` from profile
  - no wheel
  - no blast on profile
  - official artist-controlled outbound links

2. Dashboard analytics detail
- The very granular premium analytics described there may be valid legacy/product carry-forward, but they should not be stated as current MVP implementation requirements without qualification.
- They need to be framed as:
  - legacy-canon / later-tier / not-yet-reactivated detail
  - not current MVP dashboard lock by default

3. Active Slots wording
- The reliable current wording is `Release Deck` with `3` music upload slots.
- Do not casually convert that into a fresh runtime requirement for “active slots in Fair Play” unless the current controlling docs explicitly do so.

### Current safest answer pattern
If NotebookLM is asked again, the safer answer pattern is:
- public artist profile:
  - source page + direct-listen/discovery surface
  - `Follow`
  - `3` song rows
  - `Collect` from profile
  - no wheel / no blast there
- artist dashboard/source dashboard:
  - one-account additive-capability model
  - source dashboard + release deck + print shop + registrar
  - `3` music upload slots in release deck
  - descriptive-only analytics
  - no Fair Play control / no governance / no boosting
- premium analytics ideas:
  - legacy/later detail, not automatically current MVP runtime requirement

## Current Runtime Reality Check
### What is already live
- source dashboard exists
- release deck route exists
- print shop source bridges exist
- registrar source bridges exist
- artist profiles exist
- seeded artist/source fixtures exist
- seeded listener fixtures now exist for valid artist-profile QA

### What is not yet implemented to match the newest lock
- the artist profile does not yet render the full final direct-listen/discovery shape even though the basic `3` song rows exist
- feed-insert discovery handoff into artist-profile listening is not yet fully implemented
- current live artist profile is still older than the newest lock

## Suggested NotebookLM Prompt
Use this once the upload set is in place:

```text
Answer from the current active UPRISE repo doctrine, not from older implementation briefs unless clearly labeled historical.

When describing the artist profile and artist dashboard:
1. separate current active MVP locks from legacy or later-version carry-forward
2. prefer the newest founder locks and action matrix
3. explicitly call out what is implemented now vs what is only locked for the next slice
4. do not say the artist profile uses Add/Support or a wheel unless a newer source explicitly says so
```
