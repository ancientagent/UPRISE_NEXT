# Statistics Page Design Task List

**ID:** `COMM-STATS-DESIGN`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-16`

## Purpose
Creates a non-code task track for designing the Statistics page so progress can continue when engineering capacity is low. This page is the dedicated Scene Map + metrics surface in The Plot.

## Design Guardrails
- Statistics is descriptive only.
- No ranking, recommendation, or authority assignment.
- Parent music-community context persists across tier toggles.
- Tier behavior:
  - `city`: local scene + sect detail
  - `state`: city-level macro view
  - `national`: state-level macro view

## Task Board

### Phase 1 — Information Architecture
- [ ] Define page sections and reading order:
  - Scene header context
  - Map panel
  - Metric cards
  - Sect/module breakdown
  - Time-window controls
- [ ] Define what changes on tier toggle vs what stays fixed.
- [ ] Define empty/low-data states per tier.
- [ ] Define copy for “descriptive only” analytics framing.

### Phase 2 — Metrics Catalog (Design Inputs)
- [ ] Finalize city-tier cards:
  - members
  - activity totals
  - sect density and top sects
  - local engagement summaries
  - city Top 40 songs list panel
- [ ] Finalize state-tier cards:
  - number of active citywide scenes in scope
  - per-city uprise macro activity
  - top sects by city (macro only)
  - state Top 40 songs list panel
- [ ] Finalize national-tier cards:
  - number of active states in scope
  - per-state macro activity
  - top sects by state (macro only)
  - national Top 40 songs list panel
- [ ] Define metric definitions/tooltips for each card.
- [ ] Define Top 40 song list card behavior:
  - tie handling display
  - metadata shown per song row
  - click-through behavior into song/signal detail

### Phase 3 — Map Behavior and Interaction
- [ ] Define city map interactions:
  - sect overlays
  - local clusters
  - hover/click behavior
- [ ] Define state map interactions:
  - city markers
  - city macro card drill-in
- [ ] Define national map interactions:
  - state markers
  - state macro card drill-in
- [ ] Define privacy floor behavior for low-count geography buckets.

### Phase 4 — Wireframes and UI States
- [ ] Produce low-fidelity wireframes for city/state/national statistics pages.
- [ ] Produce loading, no-data, and error state layouts.
- [ ] Produce responsive behavior notes (desktop/tablet/mobile).
- [ ] Validate labels against canon terminology.

### Phase 5 — Handoff Readiness
- [ ] Convert design decisions into API contract requirements.
- [ ] Cross-link required backend endpoints:
  - `GET /communities/:id/statistics`
  - `GET /communities/:id/scene-map`
- [ ] Add acceptance criteria updates to:
  - `docs/specs/communities/scene-map-and-metrics.md`
  - `docs/specs/communities/plot-and-scene-plot.md`
- [ ] Publish a handoff note in `docs/handoff/` when design phase is complete.

## Dependencies
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/engagement/activity-points-and-analytics.md`
- `docs/specs/DECISIONS_REQUIRED.md` (aggregation windows/privacy floor/tier rollup policy)

## Not In Scope
- Implementing backend endpoints.
- Implementing frontend components.
- Finalizing founder-lock numeric thresholds.
