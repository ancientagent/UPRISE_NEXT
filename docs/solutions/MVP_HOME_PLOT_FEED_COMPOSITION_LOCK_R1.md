# MVP Home Plot Feed Composition Lock R1

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-23

## Purpose
Lock the current founder-corrected Home composition, player composition, Plot tab set, and Feed structure so future work stops drifting into:
- `Statistics` tab language
- extra MVP tabs
- generic shell descriptions
- vague feed descriptions that lose where content actually belongs

## Authority And Precedence
For Home / Plot composition and Feed explanation, apply this order:
1. direct founder-confirmed behavior captured in this document
2. `docs/solutions/SURFACE_CONTRACT_HOME_R1.md`
3. `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
4. `docs/specs/communities/plot-and-scene-plot.md`
5. `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
6. `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
7. `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
8. current runtime/code evidence

If older docs still say `Promotions` / `Statistics`, this document wins for current MVP design and planning language.

## 1) Home Top Composition Lock
At the top of Home:
1. the user's avatar bust is visible
2. the avatar has a text bubble showing the listener's current recommendation
3. next to that is `UPRISE <CITY>`
4. in the upper-right corner are:
   - notifications
   - settings menu
5. the avatar visually rests on top of the player, as if standing behind it

Do not translate this into a generic dashboard strip.

## 2) Player Composition Lock
Directly below that top identity layer sits the player.

Current intended player composition:
1. `Now Playing` in the upper-left area
2. beneath that, a toggle that determines whether the listener is hearing:
   - new releases
   - the regular / popular rotation
3. in the center:
   - artist
   - song
   - timeline
4. in the upper-right area of the player:
   - the Uprise identity
   - `city, state, genre`
   - `RaDIYo`

This player belongs to the Home-side listening shell.

## 2.1) Player Pull-Down Profile Rule
The profile page is not opened as a normal separate page from the Home-side shell.

Current interaction truth:
- the player starts as the top-screen listening infrastructure
- pulling the player down opens the user's profile / collection workspace
- when the profile / collection workspace opens, the player relocates to the bottom of that expanded workspace
- if screen space allows, the bottom player may retain its normal controls/status
- if screen space is tight, the bottom player may shrink into a minimal strip with a scrolling marquee for band / song title
- the profile expansion happens in-place
- Plot tabs are replaced while the profile / collection workspace is open
- collapsing the profile returns the listener to the previous Plot context

Do not describe this as:
- a separate profile route replacing the player
- a profile page that independently sits above the player
- a generic social profile navigation pattern

## 3) Plot Placement Lock
Below the player sits `Plot`.

`Plot` remains:
- the tabbed dashboard users interface with inside their community
- inside Home
- not a peer surface to Home

## 4) Current MVP Plot Tabs
For the current MVP, the Plot tab bar is:
1. `Feed`
2. `Events`
3. `Archive`

Current correction:
- there is no active `Statistics` tab in the intended MVP language
- use `Archive`

Current scope correction:
- current MVP should not be explained as `Feed`, `Events`, `Promotions`, `Statistics`

## 5) Default Plot Tab
The default Plot tab is:
- `Feed`

## 6) Feed Purpose Lock
The Feed is the live pulse of what is happening across artists, listeners, and the community itself.

It should surface:
- artist actions and updates
- listener actions
- community/system-origin updates
- followed-source updates
- intermittent informational carousels

It should not be described as:
- a generic social timeline
- an algorithmic recommendation feed
- a `For You` surface

## 7) Feed Ordering And Behavior
Current Feed rules:
- feed is deterministic within the same scene context
- no ranking / personalized ordering
- no second notification feed replacing the main feed
- the feed remains the main live community pulse

## 8) Feed Insert / Carousel Rule
The Feed can include intermittent carousels that provide current scoped updates by category.

Current active insert families:
- `Popular Singles`
- `Buzz`
- `Upcoming Events`

These are:
- read-only
- informational
- occasional feed moments

They are not:
- fixed permanent action strips
- inline engagement cards

## 9) Feed Card Interaction Boundaries
Music insert cards in Feed should not expose:
- `Collect`
- `Blast`
- `Follow`
- wheel actions

Music insert card behavior:
1. click the card
2. `RADIYO` pauses
3. artist page opens in artist listening context on the selected song

Event insert behavior:
- read-only event snapshot
- full event handling still belongs in the `Events` tab

## 10) Events Tab Boundary
`Events` is where the full event surface belongs.

Feed may mention or preview events, but `Events` is the fuller event lane.

## 11) Archive Boundary
`Archive` is the current descriptive archive/stats lane.

It should be understood as:
- descriptive
- archival
- stats-adjacent

It should not be described as:
- a legitimacy surface
- a ranking surface
- a tab literally named `Statistics`

## 12) Explicit Non-Locks
This document does not finalize:
- exact visual styling
- exact tab-bar artwork treatment
- exact archive sub-layout
- the later fuller `SPACE` blast-host composition

## 13) Current Runtime Note
Current web runtime still contains older tab/runtime language that does not fully match this lock.

This should be treated as:
- locked, spec/runtime reconciliation pending
