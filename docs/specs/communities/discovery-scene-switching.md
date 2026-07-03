# Scene Discovery and Switching

**ID:** `COMM-DISCOVERY`
**Status:** `active`
**Owner:** `platform`
**Last Updated:** `2026-07-03`

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
- Listener transport means leaving the user's Home Scene context for an Away Scene/listening context. The current intended entry points are Discover and saved/custom Uprises when surfaced inside Discover/collection-owned playback. Transport must not originate from the Plot top shell or Plot profile pull-down.

## Discover Transport Model

Discover transport is a later-phase Away Scene/listening-context system. It is not part of Plot and does not grant civic authority in the visited community.

### Front Door

The Discover `front door` starts from the listener's current Home context:

- the listener has not left their Home Scene yet;
- the Home Scene Uprise/player context may continue while the listener explores options;
- content points outward to music outside the listener's own community, but related enough to help them start checking things out;
- example module families include neighboring citywide Uprises from the listener's primary music community, artists touring through the listener's city, and outside-community suggestions surfaced through explicit community signals;
- front-door modules must remain deterministic/scoped and must not become a hidden recommendation engine.

### Map View

Discover map view is entered from the Discover front door when later-phase transport is enabled.

- The working visual direction is a landscape-oriented player + map surface.
- Map points represent existing communities and should communicate community presence, size, and activity level.
- If the listener enters map view while listening at citywide scope, the default map view should show city communities in the current state.
- If the listener enters map view while listening at statewide scope, the default map view should open at statewide scale.
- The default map filter should inherit the listener's current/Home music community, with an explicit way to unfilter and inspect other music communities.
- Future touring/event visibility may appear on the map only when the Events/touring contracts are ready.

### Seek Mode

Seek mode is an explicit random-discovery control, not a recommendation engine.

- Working direction: one seek control can jump to a random state and another can jump to a random city within the selected/current state.
- Seek should default to the inherited/current music community unless the listener has explicitly removed that filter.
- Player-swipe transport is not the approved final control. Do not assume swipe gestures for transport while Home Scene selector/swiper semantics occupy the active Home/Plot shell.

### Back Door

Arriving at another community through Discover lands the listener at that community's `back door`:

- visitor-facing community preview, not the member Plot/community dashboard;
- content is about the visited community according to that community: highlights, popular material, artists, events, and listening context;
- visitor listening and browsing are allowed;
- Home Scene membership, voting authority, and civic actions do not change;
- the back door must not flatten into the same generic page as the front door.

### Saved Uprises

Saved Uprises/custom Uprises are Discover-owned collection playback contexts.

- Loading a saved/custom Uprise belongs to Discover/collection-owned personal-player or Away Scene listening context.
- Saved Uprises do not appear in the Home Scene selector.
- Saved Uprise listening does not grant voting authority.
- Saved/custom Uprise playback must not launch from the Plot top shell, the Plot Home Scene selector, or the Plot profile pull-down. Plot may show collection/profile inventory, but Discover owns the visitor/playback context that lets a user listen to a saved/custom Uprise and decide whether to learn more about that community.

## Functional Requirements
- Discovery is explicit user action only:
  - Scene switching via approved Discover controls.
  - Manual Scene selection in Discover map/list.
  - Seek-mode traversal when implemented.
  - Tier toggling (city/state/national).
  - Selecting saved/custom Uprises from the user's collection only when that collection playback is surfaced inside Discover, not from Plot.
- No recommendation feed, ranking, or personalization in discovery flows.
- Current MVP does not expose active cross-community discovery on the live `/discover` route.
- Discover transport/travel remains deferred until the platform has enough community activity for cross-community travel to matter.
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
- Transport is Away Scene/listening-context movement. It must not be used for Home Scene selector switching, which stays in the user's Home Scene context.
- Transport must not originate inside Plot. Plot may contain links to Artist Profiles, event/calendar actions, or other related surfaces, but those outbound links are not Discover transport.
- Transport arrival must not drop visitors into the member Plot/community dashboard. Use the Discover back-door visitor surface for visited communities.
- Feed/Plot cards may load a listening context or hand off to Artist Profile/demo listening, but any deeper community visit must hand off into Discover/back-door context. Do not add a `Transport`, `Visit Community`, map, seek, saved/custom Uprise launcher, or equivalent Away Scene control to Plot.
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
- Later-phase Discover front door should show outward-looking, deterministic modules about music outside the listener's own community.
- Later-phase Discover back door should show the visited community's own highlights and popular material according to that community.
- Saved/custom Uprise playback belongs to the Discover/collection playback context and may lead to a back-door community preview. It does not run through the Plot top shell.
- Later-phase map view should show community markers with size/activity meaning; marker design is not locked here.
- Seek controls are explicit Discover controls and must not be implemented as hidden personalization.
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
- Plot contains no Discover transport UI.
- Discover front-door and back-door content are distinct: front door is outward-looking from the user's Home context; back door is inward-looking for the visited community.
- Seek does not mutate Home Scene or voting authority.
- Saved Uprises do not appear in the Home Scene selector and do not grant voting authority.
- Saved/custom Uprise playback is not launched from Plot top shell/profile pull-down.

## Future Work & Open Questions
- Finalize the Discover transport control design. Swipe gestures are not currently approved as the final transport control because Home Scene selector/swiper behavior already uses nearby interaction semantics.
- Finalize discover pagination windows and caching strategy.
- Define map marker visual/data contract for community size and activity.
- Define Discover-owned collection/personal-player saved/custom Uprise transport contract.

## References
- `docs/canon/Master Narrative Canon.md` (2.3, 6.x)
- `docs/canon/Master Glossary Canon.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/scenes-uprises-sects.md`
