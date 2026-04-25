# MVP Stats Founder Lock R1

**Status:** `active`
**Owner:** `founder + codex`
**Last Updated:** `2026-04-15`

## Purpose
Lock the MVP statistics contract that powers:
- the `Statistics` section inside `Plot`
- current feed-insert `Popular Singles` lenses and future discovery surfaces
- future analytics and paid metrics products

This document exists to separate:
- the stats system we need now
- from the Activity Points / Activity Score system that can be finalized later

It also exists to keep Plot, current feed-insert discovery moments, and future paid analytics on one shared stats vocabulary instead of allowing each surface to invent a different one.

## Core Rules
- Statistics are **descriptive only**.
- Statistics must not become legitimacy, governance authority, or ranking power.
- UPRISE should prefer one durable stats contract over multiple parallel metric systems.
- The platform may track more than it currently displays.
- If a metric can be tracked cleanly and has operational, audit, admin, or future analytics value, it should be retained even if it is not currently surfaced.
- Super Admin should have access to retained metrics whether or not those metrics are exposed in current MVP user-facing surfaces.
- Activity Points are **not required** to lock MVP statistics.
- If a stat has no clear MVP surface, operational, or future analytics purpose, do not lock it now.

## Authority And Relationship To Other Docs
Use this document together with:
1. `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
2. `docs/specs/communities/scene-map-and-metrics.md`
3. `docs/specs/communities/plot-and-scene-plot.md`
4. `docs/specs/engagement/analytics-and-instrumentation-framework.md`
5. `docs/specs/engagement/activity-points-and-analytics.md`

If older docs imply that stats must wait on the full Activity Points engine, this lock wins for MVP implementation planning.

## Canonical Stats Vocabulary
### Sources
Use the source families and subtypes from `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`.

Current MVP source families relevant to stats:
- `creator`
- `organizer`
- `entity`
- `scene body`

Important boundary:
- events are not sources

### Signals
Current MVP signal classes relevant to the stats surfaces in scope here:
- `single`
- `Uprise`

Important boundary:
- flyers are artifacts, not signals
- promos/business offer runtime remains deferred

### Recommendations
Recommendations are explicit listener recommendation relationships.

They are:
- not sources
- not signals
- a separate relationship/projection layer when surfaced

### Support
`Support` is not a current direct MVP stats button.

Treat support as:
- a later derived backing/activity state
- separate from the direct signal and feed metrics locked here

## Stats Domains
### 1. Structural / Community Stats
These describe the current community/scope itself.

MVP structural stats:
- `memberCount`
- `activeSects`
- `activeSources`
- `activeSignals`

These are valid Plot/Statistics metrics for every community.

### 2. Signal Action Stats
These describe how users are acting on signals.

MVP signal action stats:
- `addCountAllTime`
- `recommendationCountNow`
- `blastCountNow`

Retain the broader action event stream where possible, but the MVP display contract is built around these.

### 3. Propagation Stats
These describe how a signal has moved upward through listening scope.

MVP propagation stats:
- `highestScopeReached`
- `lastRiseAt`

These are descriptive movement markers, not active RaDIYo momentum ownership.

### 4. Source Rollup Stats
These describe how a source performs through the signals it produces or carries.

MVP rollup stats:
- `followerCountAllTime`
- `signalOutputCountByType`
- rolled-up signal action totals derived from the source's signals

These are important for long-term analytics and monetization even when not all surfaced in MVP UI.

## Time Semantics
The platform must distinguish between:

### All-Time Stats
Use these for permanence / accumulated user choice.

MVP all-time stats:
- `addCountAllTime`
- `followerCountAllTime`
- `signalOutputCountByType`

### Current-Window Stats
Use these for visible current community energy.

Default MVP current window:
- `last 7 days`

MVP current-window stats:
- `recommendationCountNow`
- `blastCountNow`
- community recommendation/blast volume

### Event-Based Stats
Use these for structural movement, not rolling totals.

MVP event-based stats:
- `highestScopeReached`
- `lastRiseAt`

## Plot Statistics Contract
Every community should be able to show a stable descriptive statistics set.

MVP core community stats for Plot:
- `memberCount`
- `activeSects`
- `activeSources`
- `activeSignals`
- `recommendationVolumeNow`
- `blastVolumeNow`
- `recentRisesCount`

These are the stable descriptive stats layer.

Deferred from MVP surface priority:
- `Top 40`
- billboard-style lists

These may remain future statistics surfaces once population justifies them, but they are not part of the current MVP Plot statistics contract.

## Discover / Interim Discovery Stats Contract
Current MVP note:
- live `/discover` is deferred while borders remain closed
- the stats contract below presently powers intermittent feed-insert discovery moments rather than a full live Discover page
- future reopened discovery surfaces should still use this same stats vocabulary instead of inventing a parallel one

### Recommendations / Buzz
- recommendation objects are surfaced directly
- this is **not** a stats lens
- this is listeners + their active recommendations
- recommendation surfacing should reflect genuine listener-held relationships rather than fabricated source-side activity

### Popular Singles
`Popular Singles` is the primary stats-driven music-discovery rail for the current feed-insert system and any later reopened discovery surface.

MVP lenses:
- `Most Added`
- `Recent Rises`

#### Most Added
- object: `single` signals only
- metric: `addCountAllTime`
- purpose: show durable collection preference, not current hype

#### Recent Rises
- object: `single` signals only
- metric: propagation markers (`highestScopeReached`, `lastRiseAt`)
- purpose: show singles that recently broke upward into the next listening scope
- this is allowed because it is not the same thing as current in-mix `RADIYO` momentum
- MVP implementation rule:
  - `Recent Rises` reads the most recent city-origin singles pulled into the `state` player
  - `highestScopeReached = state`
  - `lastRiseAt = enteredPoolAt` for that state-player promotion
  - `national` rise tracking stays deferred until a later discovery/border-opening phase

### Insert presentation boundary
When these stats are surfaced during current MVP:
- they should appear as intermittent feed inserts
- they should use read-only horizontal discovery carousels
- the cards should not expose inline `Collect`, `Blast`, or `Follow` actions
- clicking a card should hand the user into artist-profile demo listening on the selected song

### Explicit Exclusion
- `Popular Now` is **not** an interim discovery lens
- current `RADIYO` / broadcast engagement score remains sacred to the broadcast system
- interim discovery must not mirror or compete with that system

## Financial Foundation Rule
The MVP display layer can stay narrow while the retained stats layer stays broader.

This is important because future revenue products may depend on:
- source rollups
- recommendation influence
- downstream conversion from recommendations
- signal travel across communities
- promotion/event performance

MVP does **not** need to surface all of that now, but the stats model should not foreclose it.

## Retained But Not Surfaced Metrics
Some metrics should remain part of the broader retained analytics layer even when they are not part of the current MVP surface contract.

These metrics may exist:
- per tier
- platform-wide
- as packaged analytics inputs for future add-ons

Future analytics add-on targets may include:
- artists
- mixologists
- venues
- businesses
- other valid later-version source domains

Retained metrics confirmed from earlier product docs include:
- `listenCountAllTime`
- `mostListenedSignals`
- `mostUpvotedSignals`
- `mixtapeAppearanceCount`
- `appearanceCountByTier`

Handling rule:
- these metrics are legitimate parts of the broader analytics foundation
- they do **not** automatically become MVP Plot/feed-insert surface requirements
- they may be retained, computed, and later packaged into analytics products without reopening the MVP display contract
- they should be available to Super Admin even when hidden from current user-facing MVP surfaces

Packaging rule:
- platform-wide metrics are allowed where they support internal reporting or future analytics packaging
- tier-level metrics are allowed where they preserve the platform's locality/progression model
- neither platform-wide nor tier-level packaging may bypass Fair Play, governance, or current MVP surface boundaries

Admin visibility rule:
- Super Admin access is broader than public MVP display scope
- all retained trackable metrics should be queryable by Super Admin
- this includes:
  - surfaced MVP metrics
  - hidden retained metrics
  - tier-level metrics
  - platform-wide metrics
  - future-domain analytics inputs where the platform is already capable of tracking them

## Explicit Non-Locks
This document does **not** lock:
- the Activity Points scoring table
- the Activity Score formula
- vibe score
- influence map formulas
- paid analytics package structure
- final UI card count/order per feed-insert discovery lens
- `Top 40` / billboard ranking semantics

Those can be layered later on top of this stats contract.

## References
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/engagement/analytics-and-instrumentation-framework.md`
- `docs/specs/engagement/activity-points-and-analytics.md`
