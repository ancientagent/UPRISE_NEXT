# Surface Contract — Discover R1

**Status:** `active`
**Owner:** `founder + codex`
**Last Updated:** `2026-04-05`

## Purpose
Define the stable contract for `Discover` as the right-side bottom-nav destination and player-anchored discovery surface.

## Core Rule
- `Discover` is the **right** bottom-nav destination.
- Discover is not Home.
- Discover does not contain Plot.
- Discover is player-anchored and tier-aware.

## Primary Job
- Provide artist/song discovery and contextual scene signal amplification within the current listening scope.
- Allow explicit travel through the player-attached travel control.

## Governing Context
- Discover inherits current player/listening context.
- Search scope is bounded by the current player tier/context.
- Travel is attached to the bottom of the player.
- The map expands downward from the bottom of the player.

## Core Structure
Top to bottom:
1. one top artist/song search
2. `Popular Signals`
3. active participants with avatar + text bubble recommendations
4. persistent player
5. player-attached `Travel`
6. downward-expanding map

## What Must Remain True
- Discover remains a separate bottom-nav destination from Home.
- Discover remains tied to the player.
- Discover does not split into separate primary travel search and local search systems.
- Search / Popular Signals / active participants / map share the same current Discover/player scope.

## What Discover Must Not Become
- not a generic global search surface
- not a streaming-clone browse page
- not a second Home/Plot system
- not a detached map tool unrelated to player context

## Known Drift Patterns
- separate travel search
- map detached from player
- track-by-track scope changes
- generic `For You` or algorithmic recommendation drift
- Discover treated as a pure scene-switch utility only

## References
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/solutions/UPRISE_AUTOHARNESS_R1.md`
- `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md`
