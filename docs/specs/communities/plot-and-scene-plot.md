# The Plot and Scene Dashboard

**ID:** `COMM-PLOT`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-16`

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
  - Statistics / Scene Map
  - Social (V2)
- S.E.E.D stands for Support, Explore, Engage, Distribute.
- Activity Feed semantics:
  - explicit community actions only (blast/registration/release entry)
  - identical for all listeners in the same Home Scene
  - no ranking, personalization, or recommendation inference
- Promotions are distinct from Activity Feed and remain in Promotions surfaces.
- Registrar entry is part of Plot activity/civic workflow.

### Implemented Behavior (Current)
- Web app ships Plot shell at `apps/web/src/app/plot/page.tsx`.
- Current shell includes tab switching and Home Scene identity summary.
- Copy and framing align with canon (“anchor this dashboard”).

### Deferred Behavior (Not Implemented Yet)
- Server-driven S.E.E.D feed data endpoint and rendering.
- Registrar module integration into Plot UI.
- Scene statistics/map data service integration.
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

### Required for Full Surface
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/communities/:id/feed` | required | Scene-scoped S.E.E.D activity feed |
| GET | `/communities/:id/events` | required | Scene event listing for Plot events surface |
| GET | `/communities/:id/promotions` | required | Scene promotions/offers surface |
| GET | `/communities/:id/statistics` | required | Scene metrics and map aggregates |

## Web UI / Client Behavior
- Plot is Home Scene scoped.
- Tabs are fixed civic surfaces, not algorithmic sections.
- Home Scene and optional taste tag are visible context on entry.
- Placeholder panels remain until API surfaces are implemented.

## Acceptance Tests / Test Plan
- Plot loads and displays Home Scene context from onboarding state.
- Tab selection updates panel content with no personalization behavior.
- Activity Feed copy does not imply recommendation or ranking.
- Promotions and Events remain represented as separate surfaces.

## Future Work & Open Questions
- Implement `/communities/:id/feed` and wire S.E.E.D surface to API.
- Add registrar entry component and motion lifecycle surfaces.
- Define statistics payload contract for scene map/health metrics.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
