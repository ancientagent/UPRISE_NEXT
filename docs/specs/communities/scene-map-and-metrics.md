# Scene Map and Metrics

**ID:** `COMM-SCENEMAP`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-19`

## Overview & Purpose
Defines the Scene Map and Statistics contract as an inherent Scene surface inside The Plot. The map is not a separate product; it is the descriptive structural view of a Scene and its community activity.

## User Roles & Use Cases
- Listeners inspect Scene structure and activity health.
- Artists inspect local/regional/national context for their parent music community.
- Community members inspect sect density and growth readiness.
- Visitors can view metrics but cannot use map data for civic authority outside Home Scene rules.

## Functional Requirements
- The Scene Map is inherent to the currently selected Scene context.
- The Statistics surface is Scene-scoped and descriptive only.
- Parent context rule:
  - Users select a parent music community context.
  - Tier toggles (`city` -> `state` -> `national`) keep the same parent context.
  - Toggling tiers changes aggregation scope only; it does not switch parent context.
- Map + metrics do not change ranking, Fair Play rotation, or governance authority.

### Tier-Specific Map Behavior (Locked)
- `city` tier map:
  - local scene map for the selected city Scene.
  - includes sect-level composition/density and local community distribution.
  - includes a city-scope Top 40 songs list for the selected Scene/Uprise context.
- `state` tier map:
  - state map of cities for the same parent music-community context.
  - does **not** expand into full sect-level local detail for every city.
  - shows city-level macro statistics per city, including:
    - number of active citywide Scenes in scope
    - Uprise macro activity metrics per city
    - top/most active sects per city (macro summary only)
  - includes a state-scope Top 40 songs list aggregated from eligible city outputs.
- `national` tier map:
  - national map of states for the same parent music-community context.
  - shows state-level macro statistics per state.
  - includes a national-scope Top 40 songs list aggregated from eligible state outputs.
- Parent context remains constant while toggling tiers; only the aggregation unit changes (`sect/local` -> `city` -> `state`).

### Required Metrics Domains
- Scene identity:
  - `city`, `state`, `musicCommunity`, `tier`, `isActive`
- Community composition:
  - total members
  - locally affiliated users
  - GPS-verified voting-eligible users
  - visitor counts (when tracked)
- Sect composition:
  - sect tag distribution
  - sect membership density
  - sect threshold progress (descriptive)
- Activity:
  - explicit signal action counts (`ADD`, `BLAST`, `FOLLOW`, `SUPPORT`)
  - scene activity score (when Activity Points engine ships)
- Broadcast health (descriptive):
  - active tracks
  - engagement totals/distribution by tier (when rotation engine ships)
- Top 40 broadcast list (descriptive):
  - a maximum of 40 songs for the active scope (`city`, `state`, or `national`)
  - reflects current tier broadcast standing for the selected parent context
- Geography:
  - coarse member/activity distribution map for the active Scene scope

### Scope by Tier (Metrics)
- `city`:
  - local sect composition and local activity/broadcast metrics
  - city Top 40 songs list
- `state`:
  - per-city macro rollups (for example: member totals, activity totals, active tracks, top sects)
  - state Top 40 songs list
- `national`:
  - per-state macro rollups (for example: member totals, activity totals, active tracks)
  - national Top 40 songs list

### Implemented Now
- Plot shell includes a Statistics tab in `apps/web/src/app/plot/page.tsx`.
- `GET /communities/:id/statistics?tier=city|state|national` is implemented and returns:
  - tier-scoped metrics (`members`, `activeSects`, `eventsThisWeek`, `activityScore`, `activeTracks`)
  - deterministic Top 40 payload (`topSongs`)
  - rollup metadata (`tierScope`, `rollupUnit`, `timeWindow`)
- `GET /communities/:id/scene-map?tier=city|state|national` is implemented and returns:
  - `points[]` with tier-scoped markers/rollups (`community` at city scope, city rollups at state scope, state rollups at national scope)
  - `center` and rollup metadata (`tierScope`, `rollupUnit`, `timeWindow`)
- Web Statistics panel consumes the statistics endpoint for metrics across tiers.
- Web Scene Map now consumes `/communities/:id/scene-map` for city/state/national map data.
- Top Songs panel now consumes `topSongs` from the statistics endpoint (instead of feed-derived approximation).

### Deferred (Not Implemented Yet)
- Activity Points engine integration into scene-level score semantics.
- Final geo aggregation/privacy floor policy locks from `docs/specs/DECISIONS_REQUIRED.md`.
- Advanced clustering and pagination controls for very large national map payloads.

## Non-Functional Requirements
- No personalization or recommendation behavior.
- Deterministic metrics for the same time window and filters.
- Descriptive analytics only; no conversion into authority signals.

## Architectural Boundaries
- Scene Map is a Plot Statistics surface, not a feed.
- Metrics must not influence Fair Play outcomes.
- Parent context persistence across tier toggle is mandatory.
- Web tier consumes stats/map through API only.

## Data Models & Migrations
### Implemented Dependencies
- `Community` (identity, tier, location fields)
- `CommunityMember` (membership counts)
- `SectTag` + `UserTag` (sect composition)
- `SignalAction` + `Follow` (explicit action counts)
- `TrackEngagement` (broadcast engagement input, not authority)

### Planned Models
- `ActivityPoint` / `ActivityScore` (from `ENG-ACTIVITY`)
- optional materialized aggregates for statistics windows

### Migrations
- No Scene Map-specific migration exists yet.

## API Design
### Implemented Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/communities/:id/statistics` | required | Scene statistics summary for active tier |
| GET | `/communities/:id/scene-map` | required | Scene map payload for active tier |

### Response Contract (Current)
- `community`: selected scene identity payload
- `parentContext`: selected parent music community (persistent across tiers)
- `tierScope`: one of `city`, `state`, `national`
- `metrics`: grouped metric domains (community, sect, activity, broadcast)
- `topSongs`: ordered list of up to 40 songs for the active scope
- `map`: geo buckets/clusters for active scope
- `timeWindow`: aggregation window metadata
- `rollupUnit`: one of `local_sect`, `city`, `state`

## Web UI / Client Behavior
- Statistics tab renders Scene Map + metrics together.
- Tier toggle updates scope while preserving parent context.
- Parent context changes only via explicit user selection.
- City view emphasizes sect/local structure.
- State view emphasizes city-level macro cards/labels.
- National view emphasizes state-level macro cards/labels.
- Every tier view includes a Top 40 songs list panel for that scope.

## Acceptance Tests / Test Plan
- Tier toggle keeps parent context unchanged.
- Statistics/map values change by scope only (`city` vs `state` vs `national`).
- City map renders sect/local detail; state/national maps render macro rollups only.
- `topSongs` list returns at most 40 entries for each tier scope.
- `topSongs` ordering is deterministic for the same snapshot/time window.
- No stats value affects voting authority or rotation ordering.
- Metrics remain visible as descriptive-only labels in UI.

## Future Work & Open Questions
- Finalize geo aggregation granularity and privacy floor rules.
- Lock activity score formula in `docs/specs/DECISIONS_REQUIRED.md`.
- Lock broadcast-health rollup timing with Fair Play timing decisions.
- Lock Top 40 tie-break policy for equal standing rows.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Glossary Canon.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/engagement/activity-points-and-analytics.md`
