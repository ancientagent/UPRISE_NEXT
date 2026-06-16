# MVP Discover Founder Lock R1

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-16

## 1) Purpose
Capture the current founder-confirmed Discover posture so future sessions stop mixing:
- later-phase open-borders Discover doctrine,
- older player-attached travel exploration assumptions,
- and the current MVP local-community-only rule.

This document is the controlling lock for:
- the live MVP status of `/discover`
- the local-only border rule
- the interim feed-insert discovery model used while Discover is deferred
- the relationship between feed inserts, artist profile listening, and `RADIYO`
- the later-phase boundary for reopening Discover once borders open intentionally

## 2) Authority And Precedence
For Discover implementation and review, apply this order:
1. Direct founder-confirmed behavior captured in this document
2. `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
3. `docs/canon/*`
4. `docs/specs/*`
5. other active founder locks in `docs/solutions/*`
6. current runtime/code evidence
7. dated handoffs

If older Discover docs still describe live travel/open-borders behavior as if it were active MVP, this document wins.

## 3) Source Context Used
- Founder clarifications in-session on 2026-04-16
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

## 4) Current MVP Border Rule
The current MVP is local-community-only.

That means:
- listeners primarily listen to their own community while communities settle
- `/discover` is not a live active destination yet
- cross-community travel and open-borders discovery are deferred until communities are stable enough to open borders intentionally
- useful discovery/statistics material should surface intermittently inside the feed in the meantime instead of depending on a separate live Discover surface

This is not a minor visual preference.
It is the current MVP product rule.

## 5) Live `/discover` Route Rule
Current live-state rule:
- `/discover` may remain present in routing/navigation structure
- the route may render as a disabled or `Coming Soon` placeholder while borders remain closed
- the route must not pretend the full cross-community Discover system is active before borders intentionally open

Interpretation:
- do not keep building active MVP product behavior on the assumption that Discover is already the primary discovery destination
- treat the live route as deferred surface scaffolding, not the active MVP discovery engine

## 6) Interim Discovery Delivery Model
While Discover is deferred, discovery/statistics material should appear intermittently inside the feed.

This is the active MVP discovery posture.

It means:
- discovery content is not fixed permanent feed furniture
- discovery content appears every so often as inserted feed moments
- the feed remains the main live pulse of the community
- discovery inserts are occasional scoped informational modules inside that feed

This same insertion pattern may later be reused for:
- paid placement promos
- other scoped informational/promotional moments

## 7) Feed Insert Families
Current intended interim discovery families include:
- `Popular Singles`
- `Recent Rises`
- `Buzz` / recommendation-driven discovery moments

Interpretation:
- these are read surfaces derived from current stats/recommendation projections
- they help users understand:
  - what is popular in the community
  - what is performing well
  - what people are explicitly pointing at
- they should not be framed as algorithmic personalization
- they should not become a second fixed `Discover` page disguised inside the feed

## 8) Insert Composition Lock
Inserted discovery moments should render as horizontal side-scrolling sections.

Each insert should use:
- a section title at the top
- a horizontally scrollable row of album/song squares
- arrow buttons for lateral browsing

The square payload should be read-only discovery presentation, not an action strip.

Expected square content:
- band name
- song title
- logo/art
- album art when the artist uploaded that song with release art from Play Deck

Do not turn these squares into mini action cards.

## 9) Insert Interaction Lock
The discovery squares themselves should not expose:
- `Collect`
- `Blast`
- `Follow`
- wheel actions

Clicking a square should hand the user into the artist-profile listening flow instead.

This is the important boundary:
- the feed insert is browsing/discovery context
- deeper listening and collection happen after entering the artist context

## 10) Click-To-Artist Demo Flow
When the user clicks a discovery square from one of these feed inserts:
1. `RADIYO` pauses
2. the selected song begins direct demo listening from the site
3. the artist profile becomes the expanded discovery surface for that listening session

User-facing interpretation:
- it should feel like the user opened the artist and started sampling that song there

System interpretation:
- this is a direct-listen artist-profile mode, not broadcast mode and not collection mode

## 11) Artist-Profile Listening Boundary From Discover
The feed insert does not perform the collect or blast itself.

Instead:
- the insert launches artist-profile demo listening
- the artist profile is where the user can decide whether to collect the song
- `Blast` remains unavailable in this demo-listen surface

This keeps the mode separation legible:
- feed insert = discovery/browse
- artist profile = demo/listen
- `RADIYO` = broadcast
- `Collection` = owned listening

## 12) Statistics Boundary For Interim Discovery
Current interim discovery statistics should stay narrowly descriptive.

Locked MVP direction:
- `Popular Singles` remains singles-only
- recommendations are broader than singles-only, but still depend on genuine listener-held relationships
- do not widen interim discovery into a generic all-content ranking surface
- do not rebuild `Popular Now` or active broadcast momentum inside these inserts

## 13) Later-Phase Discover Reactivation Boundary
When borders open later, Discover may reactivate as a richer dedicated surface.

That later-phase Discover may include:
- a dominant top player/title card
- player-attached travel
- map expansion from the player card
- explicit cross-community tuning and visitor-mode behavior

But that is later-phase behavior.
It is not the current active MVP destination.

## 14) Explicit Non-Locks / Deferred Items
This document does not finalize:
- the exact visual styling of the inserted carousel squares
- the exact visual styling of arrow controls
- the final later-phase Discover map/travel composition after borders open
- the exact recommendation-object card styling for later richer Discover surfaces
- the final cadence algorithm for how often feed inserts appear
- paid placement runtime behavior

## 15) Implementation Guardrails
- Do not treat live `/discover` as an active MVP feature while borders remain closed.
- Do not rebuild travel-first Discover behavior into the MVP feed.
- Do not place `Collect`, `Blast`, or `Follow` directly on inserted discovery squares.
- Do not make inserted discovery rails fixed permanent feed furniture.
- Do not confuse interim feed inserts with later open-borders Discover.
- Do not turn inserted discovery into algorithmic personalization or `For You` behavior.
- If later-phase Discover is reactivated, lock that expansion intentionally before widening runtime.

## 16) Implementation Slices
### Slice A — documentation lock
- lock local-only MVP Discover doctrine
- lock interim feed-insert discovery posture
- lock click-to-artist demo flow

### Slice B — feed insert shell
- render intermittent inserted discovery modules inside feed
- use horizontal titled carousels with read-only squares and arrow controls

### Slice C — artist-profile demo handoff
- clicking a square pauses `RADIYO`
- opens artist-profile demo listening on the selected song

### Slice D — profile collection boundary
- allow song collection from the artist-profile listening context
- keep blast out of this surface

### Slice E — later open-borders Discover
- reactivate richer Discover only after communities settle and borders intentionally open

## 17) Follow-Up Needed
- reconcile any remaining active Discover docs that still read as if open-borders Discover is active MVP
- implement feed-insert discovery behavior before attempting to reactivate richer Discover UI
- keep later-phase Discover travel/map doctrine separate from current MVP feed-insert work
