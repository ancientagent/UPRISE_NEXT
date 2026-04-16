# Scene Discovery and Switching

**ID:** `COMM-DISCOVERY`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-04-16`

## Overview & Purpose
Defines explicit, non-algorithmic discovery flows for changing listening context across Scenes and tiers once borders open. Discovery is user-initiated only and does not alter civic authority unless the user explicitly changes Home Scene.

Community identity is represented by `city + state + music community`.
This spec governs later-phase scene-switching and travel rules inside Discover, not the full visual hierarchy of the Discover page.
Current live MVP note:
- the `/discover` route is presently reduced to a `Coming Soon` placeholder while borders remain closed
- active MVP listening stays inside the listener's own community while communities settle
- useful discovery/statistics material should appear only as intermittent inserted feed moments during MVP, not as fixed Discover furniture
- those interim feed moments should use read-only horizontal discovery carousels rather than inline action strips
- clicking an interim discovery card should pause `RADIYO` and hand the user into artist-profile demo listening on the selected song
- the richer cross-community discovery surface described below is deferred until communities settle and borders open

## User Roles & Use Cases
- Listener explores other Scenes via explicit controls (swipe, manual map selection, tier toggle) after borders open.
- Listener tunes into another Scene broadcast as a visitor once cross-community travel is live.
- Listener can set a new Home Scene explicitly (outside passive discovery).
- Artist/listener travels Discover across city/state/national scopes while keeping the current community context inherited from the active Home Scene or tuned community.

## Functional Requirements
- Discovery is explicit user action only:
  - Scene switching via swipe.
  - Manual Scene selection in Discover map/list.
  - Tier toggling (city/state/national).
- No recommendation feed, ranking, or personalization in discovery flows.
- Current MVP does not expose active cross-community discovery on the live `/discover` route.
- Discovery remains bounded by the inherited current player/community scope when later-phase travel reopens.
- Community-native lookup should live on the `community` page rather than inside Discover itself.
- Discovery does not imply “join” semantics:
  - User can visit/tune to a Scene.
  - User can set Home Scene only through explicit state change action.
- Visitor rule:
  - Tuning to non-Home Scene keeps user in visitor status for that Scene.
  - Visitor status does not grant civic voting authority in that Scene.

### Clarification: `Recommended` label vs recommendation engine behavior
- The banned behavior is algorithmic recommendation/personalization, not the literal presence of the word `Recommended`.
- A `Recommended` Discover grouping must not imply or perform:
  - predictive personalization
  - taste modeling
  - engagement-ranked ordering
  - hidden system-directed surfacing
  - cross-user similarity inference

### Implemented Behavior (Current)
- API endpoint `GET /discover/scenes` is implemented with deterministic results by:
  - `tier=city|state`: city-scene entries
  - `tier=national`: state rollups derived from city scenes
- API endpoint `GET /discover/context` is implemented to return persisted tune context for the current user.
- API endpoint `POST /discover/set-home-scene` is implemented for explicit Home Scene reassignment:
  - target must be `city` tier
  - cross-state switches are rejected when the user already has a Home Scene state
  - action is separate from tune transport context
- API endpoint `POST /discover/tune` persists tuned-scene transport context on the user record.
- Current web `/discover` route is reduced to a `Coming Soon` placeholder.
- Current MVP feed may carry intermittent inserted discovery/statistics moments instead of a live Discover destination.
- Those interim feed inserts are read-only discovery launchers; they do not expose inline `Collect`, `Blast`, or `Follow` actions on the cards themselves.
- Discovery route calls and typed client wrappers remain in the repo for the deferred later-phase surface:
  - `apps/web/src/lib/discovery/client.ts`
  - `apps/web/src/lib/discovery/context.ts`
- Discovery context store patching is centralized via `apps/web/src/lib/discovery/context.ts` for consistent tuned-scene fallback behavior across Discover and Plot.
- Plot surface consumes persisted discovery context for default scene selection.
  - read-only context chip is rendered in Plot header for visibility of transport vs authority context
  - when no explicit scene is selected, Plot read surfaces resolve active scene as tuned scene first, then Home Scene fallback

### Scope Model (Locked)
- `city` scope:
  - Discover map/list shows city Scene options for the inherited current community context.
  - User can tune into available city Scenes.
- `state` scope:
  - Discover map/list shows city-level entries within a state for the inherited current community context (macro view).
  - No sect-level deep detail expansion by default.
- `national` scope:
  - Discover map/list shows state-level entries for the inherited current community context (macro view).

### Home Scene Change Boundary
- Home Scene changes are explicit profile/onboarding actions.
- Discover tuning and Home Scene assignment are separate actions and separate UI controls.
- Setting Home Scene updates civic anchor fields and membership resolution via onboarding/home-scene contract.

## Non-Functional Requirements
- Deterministic behavior for identical filters and scope inputs.
- No hidden context changes; tuned Scene and Home Scene must always be visible in UI.
- Discovery controls must not mutate Fair Play ranking or propagation logic.

## Architectural Boundaries
- Discovery is transport/navigation behavior, not authority behavior.
- Upvotes and governance actions remain Home Scene-gated by GPS rules.
- Web tier discovery surfaces must consume API endpoints only.

## Data Models & Migrations
### Current Dependencies
- `Community` (`city`, `state`, `musicCommunity`, `tier`, `isActive`)
- `User` home-scene affinity fields and `gpsVerified`
- Optional playback/session surfaces that track current tuned Scene context

### Migrations
- No dedicated discovery migration required yet.

## API Design
### Implemented Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/communities/nearby` | required | Nearby city-scene lookup by coordinates |
| GET | `/communities/resolve-home` | required | Resolve exact Home Scene tuple for anchor/switch correctness |
| GET | `/discover/scenes` | required | Deterministic scene search/list by scope + music community |
| GET | `/discover/context` | required | Read persisted tuned-scene context + visitor status for current user |
| POST | `/discover/tune` | required | Set tuned Scene context for the active listener session |
| POST | `/discover/set-home-scene` | required | Explicit Home Scene reassignment with discovery guardrails |
| GET | `/communities/active/feed` | required | Active-scene S.E.E.D feed projection (tuned -> home fallback) |
| GET | `/communities/active/events` | required | Active-scene events projection (tuned -> home fallback) |
| GET | `/communities/active/promotions` | required | Active-scene promotions projection (tuned -> home fallback) |
| GET | `/communities/active/statistics` | required | Active-scene statistics projection (tuned -> home fallback) |

### Request/Response Contract (Required)
- `GET /discover/scenes` query:
  - `tier`: `city | state | national`
  - `musicCommunity`: `string`
  - optional location scope (`city`, `state`, `lat/lng`) based on tier
- response:
  - deterministic list of scene entries with scope metadata
  - includes whether each entry equals current Home Scene
- `POST /discover/tune`:
  - sets current listening context and persists tuned scene id for user transport state
  - returns `{ tunedSceneId, isVisitor, homeSceneId }`
- `GET /discover/context`:
  - returns persisted tuned scene context
  - falls back to Home Scene when tuned scene has not been set

## Web UI / Client Behavior
- Later-phase Discover surface must show:
  - one dominant top player/title card that establishes the current community scope
  - inherited current community identity (`city + state + music community`)
  - scope toggle (`city/state/national`)
  - current tuned Scene vs Home Scene badges
  - read-only context chip with `Home Scene`, `Tuned Scene`, and `Visitor/Local` status
- Snippet content must remain subordinate to the player/title card and inherit the same current scope.
- Community-native lookup belongs on the `community` page, not Discover.
- Access-limit/entitlement messaging is deferred in MVP until pricing/entitlement contracts are locked in canon/spec.
- If a Discover subsection/header uses `Recommended`, it must not imply predictive personalization or system-personalized recommendation behavior.
- Tune action:
  - explicit button: “Tune to Scene”
  - does not say “Join”
- Home Scene action:
  - explicit separate control: “Set as Home Scene”
  - confirmation required before changing civic anchor

## Acceptance Tests / Test Plan
- Tuning to another Scene does not change Home Scene fields.
- Visitor-tuned sessions cannot vote in non-Home Scene.
- Discovery results are deterministic for identical queries.
- No UI copy uses “Join Community” for discovery/tuning.
- Tier scope changes only aggregation/result scope, not parent music-community filter.

## Future Work & Open Questions
- Add “swipe” gesture semantics once mobile interaction layer is implemented.
- Finalize discover pagination windows and caching strategy.

## References
- `docs/canon/Master Narrative Canon.md` (2.3, 6.x)
- `docs/canon/Master Glossary Canon.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/scenes-uprises-sects.md`
