# The Plot and Scene Dashboard

**ID:** `COMM-PLOT`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-25`

## Overview & Purpose
Defines The Plot as the Home Scene dashboard where communities operate their Scene. The Plot is a civic interface, not a personalized discovery feed.

## User Roles & Use Cases
- Listeners view community activity and access civic actions.
- Artists and promoters publish events and updates.
- Communities review scene statistics and maps.
- Visitors can listen and act with non-civic permissions, but cannot vote.

## Functional Requirements
- The Plot is the primary Home Scene interface.
- Plot tab surfaces:
  - Activity Feed (S.E.E.D Feed) (default)
  - Events
  - Promotions
  - Statistics / Scene Map (dedicated page-level surface)
  - Social (V2)
- S.E.E.D stands for Support, Explore, Engage, Distribute.
- Activity Feed semantics:
  - explicit community actions only (blast/registration/release entry)
  - identical for all listeners in the same Home Scene
  - no ranking, personalization, or recommendation inference
- Promotions are distinct from Activity Feed and remain in Promotions surfaces.
- Registrar entry is part of Plot activity/civic workflow.
- Statistics / Scene Map rule:
  - Scene Map is inherent to the Scene and lives inside the Statistics surface.
  - Statistics is its own dedicated page-level surface within The Plot (not a mini widget).
  - Tier toggles scale the same Scene context from city to state to national aggregates.
  - Parent music-community context remains constant during tier toggles unless explicitly changed by user.
  - City map shows local sect-level/community detail.
  - State map shows city-level macro statistics.
  - National map shows state-level macro statistics.
  - Each tier view includes a Top 40 songs list for that same scope.

### Implemented Behavior (Current)
- Web app ships Plot shell at `apps/web/src/app/plot/page.tsx`.
- Current shell includes tab switching and Home Scene identity summary.
- Copy and framing align with canon (“anchor this dashboard”).
- Statistics surface now calls `GET /communities/:id/statistics` for tier-scoped metrics and Top 40 payload.
- Statistics Scene Map now calls `GET /communities/:id/scene-map` for tier-scoped map points/rollups.
- Feed tab now renders server-driven S.E.E.D activity via `GET /communities/:id/feed` (cursor-paginated, non-personalized).
- Events tab now renders scene-scoped listings via `GET /communities/:id/events`.
- Promotions tab now renders scene-scoped listings via `GET /communities/:id/promotions`.
- Plot now resolves default community anchor from Home Scene tuple via `GET /communities/resolve-home` before GPS-nearby fallback.
- Plot read surfaces now support active-scene fallback (tuned scene first, Home Scene fallback) when no explicit scene anchor is selected:
  - `GET /communities/active/feed`
  - `GET /communities/active/events`
  - `GET /communities/active/promotions`
  - `GET /communities/active/statistics`
- Statistics panel now consumes active-scene statistics fallback when no explicit community anchor is selected, then resolves tier map payload via the returned active-scene anchor.
- Plot Scene Activity panel now integrates registrar status read context:
  - fetches submitter-owned Artist/Band registrar entry summary from `GET /registrar/artist/entries`,
  - displays registration totals/status summary while retaining explicit `Open Registrar` navigation.

### Deferred Behavior (Not Implemented Yet)
- Advanced registrar lifecycle dashboard in Plot (beyond status summary + explicit registrar navigation).
- Social tab message boards/listening rooms (V2).

## Non-Functional Requirements
- No personalized ranking or algorithmic feed ordering.
- Activity Feed reflects explicit community actions only.
- Plot surfaces are Scene-scoped and deterministic.

## Architectural Boundaries
- Plot is a civic interface, not a recommendation surface.
- Promotions are non-governing signals and must not affect Fair Play.
- Web tier may not import DB/server modules directly; data flows through API endpoints.

## Data Models & Migrations
### Data Dependencies
- `User` home-scene fields (`homeSceneCity`, `homeSceneState`, `homeSceneCommunity`, `homeSceneTag`)
- `Signal` + `SignalAction` for explicit community actions
- `Event` for scene event surfaces
- `Follow` for user/entity awareness links

### Migrations
- No Plot-specific migration exists yet.
- Plot relies on existing onboarding and signals/event tables.

## API Design
### Current
- No dedicated `/plot` API endpoint is implemented yet.
- Plot currently reads local onboarding state in web store.
- `GET /communities/:id/feed` is implemented for scene-scoped S.E.E.D feed projection.
- `GET /communities/resolve-home` resolves exact Home Scene tuple for deterministic Plot anchoring.
- `GET /communities/active/feed|events|promotions|statistics` is implemented for active-scene read defaults.

### Required for Full Surface
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/communities/:id/events` | required | Scene event listing for Plot events surface |
| GET | `/communities/:id/promotions` | required | Scene promotions/offers surface |
| GET | `/communities/:id/statistics` | required | Scene metrics and top songs aggregates (implemented) |
| GET | `/communities/:id/scene-map` | required | Scene map points/rollups by active tier (implemented) |

## Web UI / Client Behavior
- Plot is Home Scene scoped.
- Tabs are fixed civic surfaces, not algorithmic sections.
- Home Scene and optional taste tag are visible context on entry.
- Feed uses explicit scene actions from API; it does not rank or personalize.
- Events uses scene-scoped API listings from selected community anchor.
- Promotions uses scene-scoped API listings from selected community anchor.
- Social remains placeholder until endpoint ships.

## Acceptance Tests / Test Plan
- Plot loads and displays Home Scene context from onboarding state.
- Tab selection updates panel content with no personalization behavior.
- Activity Feed copy does not imply recommendation or ranking.
- Promotions and Events remain represented as separate surfaces.

## Future Work & Open Questions
- Add registrar entry component and motion lifecycle surfaces.
- Implement scene map/statistics payload contract in `docs/specs/communities/scene-map-and-metrics.md`.
- Execute statistics-page design checklist in `docs/specs/communities/statistics-page-design-task-list.md`.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/statistics-page-design-task-list.md`
