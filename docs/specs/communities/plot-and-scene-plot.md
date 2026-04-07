# The Plot and Scene Dashboard

**ID:** `COMM-PLOT`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-04-06`

## Overview & Purpose
Defines The Plot as the Home-side sectional system inside the `Home` surface where communities operate their Scene. The Plot is a civic interface, not a personalized discovery feed.

Shell relationship lock:
- `Home` is the left bottom-nav destination.
- `Discover` is the right bottom-nav destination.
- `Plot` lives inside `Home`; it is not a peer route to `Home`.

## User Roles & Use Cases
- Listeners view community activity and access civic actions.
- Artists and promoters publish events and updates.
- Communities review scene statistics and maps.
- Visitors can listen and act with non-civic permissions, but cannot vote.

## Functional Requirements
- The Plot is the primary Home-side participation interface inside `Home`.
- Plot tab surfaces:
  - Activity Feed (S.E.E.D Feed) (default)
  - Events
  - Promotions
  - Statistics / Scene Map (dedicated page-level surface)
  - Social (V2, hidden in MVP UI)
- Profile strip notification requirement:
  - A notification icon is present at the top-right of the profile strip, immediately next to the `...` settings menu.
  - Pioneer users receive an onboarding follow-up message in this notification surface after Home Scene context is loaded.
  - Message must explain temporary nearest-active routing and that user can establish/uprise their own city scene once sufficient local users join.
  - Followed-source updates do **not** move into this icon by default; the feed remains the primary surface for those updates.
  - The profile-strip notification icon is reserved for system/state-change notices, pioneer follow-up, and other explicit notification/inbox behavior.
- S.E.E.D stands for Support, Explore, Engage, Distribute.
- Activity Feed semantics:
  - explicit community actions and followed-source updates only
  - identical for all listeners in the same Home Scene
  - no ranking, personalization, or recommendation inference
  - followed-source updates must surface through the same feed grammar rather than a separate algorithmic notification feed
- Calendar rule:
  - calendar is a real MVP organizational layer
  - following an artist, promoter, or event automatically adds that source's events to the user's calendar/collection
  - users can also save events directly
  - calendar behavior may sync/export to Google / Apple calendars
- Promotions are distinct from Activity Feed and remain in Promotions surfaces.
- Registrar entry is part of Plot activity/civic workflow.
- Statistics / Scene Map rule:
  - Scene Map is inherent to the Scene and lives inside the Statistics surface.
  - Statistics is its own dedicated page-level surface within The Plot (not a mini widget).
  - Tier toggles scale the same Scene context from city to state to national aggregates.
  - Parent community context remains anchored to the active community identity (`city + state + music community`) during tier toggles unless explicitly changed by user.
  - City map shows local sect-level/community detail.
  - State map shows city-level macro statistics.
  - National map shows state-level macro statistics.
  - Top 40 / billboard-style lists are deferred from MVP until population supports them.

### Implemented Behavior (Current)
- Web app ships Plot shell at `apps/web/src/app/plot/page.tsx`.
- Current shell includes tab switching and Home Scene identity summary.
- Copy and framing align with canon (“anchor this dashboard”).
- Statistics surface now calls `GET /communities/:id/statistics` for tier-scoped metrics.
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
- Plot Statistics surfaces now share a unified selected-community anchor in the page state to keep tier/context reads consistent across panels.
- Plot and statistics read endpoints now flow through typed web client wrappers (`apps/web/src/lib/communities/client.ts`, `apps/web/src/lib/discovery/client.ts`) for centralized route contract management.

### Deferred Behavior (Not Implemented Yet)
- Advanced registrar lifecycle dashboard in Plot (beyond status summary + explicit registrar navigation).
- Social tab message boards/listening rooms (V2). Social tab UI remains hidden in MVP.
- Search Party and sect private channels remain explicit private-group/social constructs when enabled; they are not auto-created feed channels.

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
| GET | `/communities/:id/statistics` | required | Scene metrics aggregates (implemented) |
| GET | `/communities/:id/scene-map` | required | Scene map points/rollups by active tier (implemented) |

## Web UI / Client Behavior
- Plot is Home Scene scoped within the `Home` surface.
- Tabs are fixed civic surfaces, not algorithmic sections.
- Home Scene and optional taste tag are visible context on entry.
- Profile strip includes notification icon + settings (`...`) on the right side.
- Pioneer onboarding message is discoverable from the notification icon (not as an always-visible blocking modal).
- Feed uses explicit scene actions and followed-source updates from API; it does not rank or personalize.
- Events uses scene-scoped API listings from selected community anchor.
- Promotions uses scene-scoped API listings from selected community anchor.
- Social remains hidden in MVP until endpoint + surface contract ship.
- The profile-strip notification icon is not a second ranked activity channel; followed-source updates should continue to surface through feed grammar.

## Acceptance Tests / Test Plan
- Plot loads and displays Home Scene context from onboarding state.
- Tab selection updates panel content with no personalization behavior.
- Activity Feed copy does not imply recommendation or ranking.
- Promotions and Events remain represented as separate surfaces.
- Followed-source updates are visible in the feed without introducing a separate ranked notification feed.

## Future Work & Open Questions
- Add registrar entry component and motion lifecycle surfaces.
- Implement scene map/statistics payload contract in `docs/specs/communities/scene-map-and-metrics.md`.
- Execute statistics-page design checklist in `docs/specs/communities/statistics-page-design-task-list.md`.
- Lock the exact notification/update rendering split between feed-post expressions and the profile-strip notification icon.

## References
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- `docs/specs/communities/scene-map-and-metrics.md`
- `docs/specs/communities/statistics-page-design-task-list.md`
