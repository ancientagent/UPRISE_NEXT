# MVP Stats Founder Lock R1

**Status:** `active`
**Owner:** `founder + codex`
**Last Updated:** `2026-04-07`

## Purpose
Lock the MVP statistics contract that powers:
- the `Statistics` section inside `Plot`
- Discover's `Popular Singles` lenses
- future analytics and paid metrics products

This document exists to separate:
- the stats system we need now
- from the Activity Points / Activity Score system that can be finalized later

It also exists to keep Plot, Discover, and future paid analytics on one shared stats vocabulary instead of allowing each surface to invent a different one.

## Core Rules
- Statistics are **descriptive only**.
- Statistics must not become legitimacy, governance authority, or ranking power.
- UPRISE should prefer one durable stats contract over multiple parallel metric systems.
- The platform may track more than it currently displays.
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
Sources are followable origin objects.

Current source classes:
- artists
- communities
- businesses
- promoters
- events

Future source classes:
- ambassadors
- venues
- mixologists

### Signals
Signals are canonical objects users receive, add, and act on.

Current signal classes:
- singles
- Uprises
- promos
- flyers

Future signal classes:
- mixes

### Recommendations
Recommendations are explicit user-to-signal relationships.

They are:
- not sources
- not signals
- their own stats-bearing object class when needed

### Support
Support is a lightweight reaction/counter on a post or surfaced expression.

It is:
- not an Activity Point
- not a source
- not a signal
- not a recommendation

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
- `supportCountNow`
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
- `supportCountNow`
- `recommendationCountNow`
- `blastCountNow`
- community support/recommendation/blast volume

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
- `supportVolumeNow`
- `recommendationVolumeNow`
- `blastVolumeNow`
- `recentRisesCount`

These are the stable descriptive stats layer.

Deferred from MVP surface priority:
- `Top 40`
- billboard-style lists

These may remain future statistics surfaces once population justifies them, but they are not part of the current MVP Plot statistics contract.

## Discover Stats Contract
Discover uses a narrower stats read than Plot.

### Recommendations Row
- recommendation objects are surfaced directly
- this is **not** a stats lens
- this is users + their active recommendations

### Popular Singles
`Popular Singles` is the primary stats-driven Discover rail.

MVP lenses:
- `Most Added`
- `Supported Now`
- `Recent Rises`

#### Most Added
- object: `single` signals only
- metric: `addCountAllTime`
- purpose: show durable library preference, not current hype

#### Supported Now
- object: `single` signals only
- metric: `supportCountNow`
- support comes from surfaced post/balloon expressions carrying that single
- support is **not** part of the playback engagement wheel
- if support is later enabled directly on the artist/single page, that can feed the same stat without changing the lens meaning

#### Recent Rises
- object: `single` signals only
- metric: propagation markers (`highestScopeReached`, `lastRiseAt`)
- purpose: show singles that recently broke upward into the next listening scope
- this is allowed in Discover because it is not the same thing as current in-mix RaDIYo momentum

### Explicit Exclusion
- `Popular Now` is **not** a Discover lens
- current RaDIYo / broadcast engagement score remains sacred to the broadcast system
- Discover must not mirror or compete with that system

## Financial Foundation Rule
The MVP display layer can stay narrow while the retained stats layer stays broader.

This is important because future revenue products may depend on:
- source rollups
- recommendation influence
- downstream conversion from recommendations
- signal travel across communities
- promotion/event performance

MVP does **not** need to surface all of that now, but the stats model should not foreclose it.

## Explicit Non-Locks
This document does **not** lock:
- the Activity Points scoring table
- the Activity Score formula
- vibe score
- influence map formulas
- paid analytics package structure
- final UI card count/order per Discover lens
- `Top 40` / billboard ranking semantics

Those can be layered later on top of this stats contract.

## References
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/engagement/analytics-and-instrumentation-framework.md`
- `docs/specs/engagement/activity-points-and-analytics.md`
