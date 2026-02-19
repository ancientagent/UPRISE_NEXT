# Scene Discovery and Switching

**ID:** `COMM-DISCOVERY`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2026-02-19`

## Overview & Purpose
Defines explicit, non-algorithmic discovery flows for changing listening context across Scenes and tiers. Discovery is user-initiated only and does not alter civic authority unless the user explicitly changes Home Scene.

## User Roles & Use Cases
- Listener explores other Scenes via explicit controls (swipe, manual map selection, tier toggle).
- Listener tunes into another Scene broadcast as a visitor.
- Listener can set a new Home Scene explicitly (outside passive discovery).
- Artist/listener can filter discovery by music community across city/state/national scopes.

## Functional Requirements
- Discovery is explicit user action only:
  - Scene switching via swipe.
  - Manual Scene selection in Discover map/list.
  - Tier toggling (city/state/national).
- No recommendation feed, ranking, or personalization in discovery flows.
- Discovery does not imply “join” semantics:
  - User can visit/tune to a Scene.
  - User can set Home Scene only through explicit state change action.
- Visitor rule:
  - Tuning to non-Home Scene keeps user in visitor status for that Scene.
  - Visitor status does not grant civic voting authority in that Scene.

### Implemented Behavior (Current)
- API endpoint `GET /discover/scenes` is implemented with deterministic results by:
  - `tier=city|state`: city-scene entries
  - `tier=national`: state rollups derived from city scenes
- Web discovery surface is implemented at `apps/web/src/app/discover/page.tsx`:
  - explicit scope toggle (`city/state/national`)
  - explicit music-community filter
  - city-scene rows expose `Open Scene` and `Set as Home Scene` actions
  - no “Join Community” language or behavior

### Scope Model (Locked)
- `city` scope:
  - Discover map/list shows city Scene options for selected music community.
  - User can tune into available city Scenes.
- `state` scope:
  - Discover map/list shows city-level entries within a state for selected music community (macro view).
  - No sect-level deep detail expansion by default.
- `national` scope:
  - Discover map/list shows state-level entries for selected music community (macro view).

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

### Required Endpoints (Not Implemented Yet)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/discover/tune` | required | Set current tuned Scene for listener session (visitor-safe) |
| POST | `/users/home-scene` | required | Explicit Home Scene reassignment (separate from tune action) |

### Request/Response Contract (Required)
- `GET /discover/scenes` query:
  - `tier`: `city | state | national`
  - `musicCommunity`: `string`
  - optional location scope (`city`, `state`, `lat/lng`) based on tier
- response:
  - deterministic list of scene entries with scope metadata
  - includes whether each entry equals current Home Scene
- `POST /discover/tune`:
  - sets current listening context only
  - returns `{ tunedSceneId, isVisitor, homeSceneId }`

## Web UI / Client Behavior
- Discover surface must show:
  - selected music community filter
  - scope toggle (`city/state/national`)
  - current tuned Scene vs Home Scene badges
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
- Decide whether tune context persists across sessions or resets per login.

## References
- `docs/canon/Master Narrative Canon.md` (2.3, 6.x)
- `docs/canon/Master Glossary Canon.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/scenes-uprises-sects.md`
