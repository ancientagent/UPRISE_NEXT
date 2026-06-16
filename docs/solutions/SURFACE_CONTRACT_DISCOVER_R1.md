# Surface Contract — Discover R1

**Status:** `active`
**Owner:** `founder + codex`
**Last Updated:** `2026-04-16`

## Current MVP State
- `Discover` is currently deferred as a live MVP surface.
- the route may exist as a disabled / `Coming Soon` placeholder, but the active product behavior is local-community-only listening
- while borders remain closed, useful discovery/statistics material should surface intermittently inside the feed rather than as a fixed Discover destination

## Purpose
Define the stable contract for `Discover` across two phases:
1. current MVP deferred-route behavior
2. later-phase reactivation once borders intentionally open

## Current MVP Contract
### Route state
- `Discover` remains the right-side bottom-nav conceptually
- the live route is deferred while borders remain closed
- it must not pretend the richer travel/discovery system is already active MVP

### Interim discovery delivery
- discovery material currently lives as intermittent feed inserts, not as the main `/discover` experience
- those inserts are scene-scoped, deterministic, and occasional rather than fixed furniture
- they are horizontally scrolling titled sections with read-only squares/cards
- card clicks hand the user into artist-profile demo listening and pause `RADIYO`
- cards do not expose inline `Collect`, `Blast`, or `Follow` actions

## Later-Phase Discover Contract
Once borders open intentionally, Discover may resume as:
- a separate bottom-nav destination from Home
- a player-anchored and tier-aware surface
- one dominant top player/title card
- player-attached travel
- downward-expanding map from that card
- secondary snippet content below the player/title anchor
- community-native lookup remaining on the `community` page rather than Discover

## What Must Remain True
- current MVP does not treat Discover as the active discovery engine
- deferred feed inserts must not mutate into a second fixed Discover route by accident
- later-phase Discover, when reopened, must remain player-anchored and separate from Home/Plot
- community-native lookup belongs on the `community` page, not Discover

## What Must Not Happen
- do not rebuild open-borders travel as if it were active MVP now
- do not turn feed inserts into inline action grids
- do not confuse artist-profile demo listening with `RADIYO` or `Collection`
- do not split future Discover into separate primary travel and lookup systems

## References
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
