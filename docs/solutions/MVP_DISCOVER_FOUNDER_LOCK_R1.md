# MVP Discover Founder Lock R1

Status: Active  
Owner: Founder + product engineering  
Last updated: 2026-03-22

## 1) Purpose
Capture founder-confirmed Discover behavior from the 2026-03-22 walkthrough so future sessions stop reinterpreting Discover from partial specs, legacy shape alone, or philosophy-derived narrowing.

This document is the controlling lock for:
- Discover structure and entry model
- Discover search behavior
- Recommendations / Trending / Top Artists surface behavior
- Uprise retune and community-entry behavior
- Visitor-mode boundary for visited communities
- Link-resolution rules at the Discover boundary

## 2) Authority And Precedence
For Discover implementation and review, apply this order:
1. Direct founder-confirmed behavior captured in this document
2. `docs/canon/*`
3. `docs/specs/*`
4. `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
5. Other `docs/solutions/*`
6. `docs/legacy/*` (layout reference only)

Until `docs/specs/communities/discovery-scene-switching.md` is intentionally reconciled, this document overrides any narrower Discover assumptions in older spec/solution text.

## 3) Source Context Used
- Founder walkthrough in this session on 2026-03-22
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
- `docs/solutions/NARRATIVE_CARRY_FORWARD_RULES_R1.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/users/identity-roles-capabilities.md`

## 4) Discover Purpose Lock
Discover is for discovering:
- people
- places
- music

Discover is an exploration surface attached to current listening/community context. It is not just a sterile scene-switch utility.

## 5) Discover Core Structure
Discover includes:
- one search bar
- a map view accessed from the dropdown attached to that search control
- a `Recommendations` section
- a `Trending` section
- a `Top Artists` section
- swipe-based Uprise travel inside Discover

The horizontal content sections are ordered:
1. `Recommendations`
2. `Trending`
3. `Top Artists`

All three are horizontal carousel-style lists.

## 6) Search Model
### 6.1 Community/Uprise travel search
- The map/dropdown search is the community/Uprise search.
- This search is context-based on the Home Scene/community the user left from.
- Geography changes; origin community remains constant.
- The user can type a city or state.
- Predictive matches appear in a text dropdown.
- Search resolves to the matching Uprise for that same originating community in the searched geography, if it exists.
- If there is no matching Uprise, show no results.
- When no exact matching Uprise exists, the user may continue exploration manually through the map.

### 6.2 Local content search inside a community
- Once the user is in a community Discover context, they can search for artists and songs within that current community.
- Local artist/song search sits above the carousel sections.
- This local search is for known intent.
- The carousels below it provide entry points when the user does not yet know what to search for.

## 7) Map Behavior
- The dropdown attached to the search control opens the map view.
- City/state input can take the user to the relevant area on the map.
- The user can drag across the map to explore where other communities exist.

## 8) Recommendations / Trending / Top Artists
### 8.1 Recommendations
- `Recommendations` shows signals in that community recommended by listeners in that same community.
- `Recommendations` is a horizontal carousel.
- Avatar-heavy recommendation presentation is deferred to V2.
- Current MVP treatment uses minimal tiles.

### 8.2 Trending
- `Trending` is driven by user/community statistics.
- Current founder-confirmed interpretation: trending is blast-count driven.

### 8.3 Top Artists
- `Top Artists` is shown as a horizontal carousel.
- This section is stats-driven community orientation, not a blank-state filler.

### 8.4 Recommendation-engine boundary
The banned behavior is algorithmic/system-personalized recommendation behavior. This lock does not ban a founder-defined `Recommendations` section.

## 9) Uprise Travel And Entry
### 9.1 Retune behavior
When the user selects another community/Uprise through Discover travel:
- RaDIYo automatically switches to that community's Uprise.
- The user remains in the Discover/context layer first.
- Full community entry is explicit, not automatic.

### 9.2 Community entry CTA
- The explicit entry affordance is: `Visit [Community Name]`
- The community name is the blue link.
- This preserves continuity because the user is already listening to that Uprise before full entry.

### 9.3 Community page handoff
- Clicking `Visit [Community Name]` takes the user into the actual community page.
- The community page is the same community surface in visitor mode when it is not a Home Scene.

## 10) Visitor Mode Lock
For visited non-Home communities:
- no Registrar
- no voting capabilities
- no Home-Scene-only features

## 11) Link-Resolution Rule
Across Discover and the rest of the app:
- artists should be selectable wherever mentioned
- signals should be selectable wherever mentioned
- linked objects resolve to their native destination

Native destination rule:
- artist -> artist page
- single/signal -> artist page
- event -> event page
- community/Uprise -> community page

Playback-specific carry-forward confirmed in session:
- if it is an artist, RaDIYo continues through rotation until the user selects a single on the artist page
- if it is a single/signal, it goes to the artist page, RaDIYo stops, and the single streams automatically from that page

## 12) Home Scene / Preset Carry-Forward Used By Discover
- Home button returns the user to the last active Home Scene.
- Users may have multiple Home Scenes across local music communities inside their real home city.
- Home Scenes are managed from expanded profile under the Uprises section.
- Home Scenes are marked with a house icon.
- Saved Uprises also live in that Uprises section and function like saved stations/presets.

## 13) Explicit Non-Locks / Deferred Items
This document does not define:
- artist-page internal composition
- event-page internal composition
- poster ID block/avatar identity treatment beyond current V2 defer note
- deeper visual styling of map/dropdown controls already documented elsewhere in canon/spec
- final data formulas behind every stats-driven Discover carousel beyond the founder-confirmed `Trending = blast-count driven` note above

## 14) Implementation Guardrails
- Do not narrow Discover back to scene/community-only search without explicit founder approval.
- Do not remove artist/song search from community Discover contexts.
- Do not treat the presence of a `Recommendations` section as equivalent to algorithmic personalization.
- Do not auto-enter a community page immediately on retune; entry remains explicit.
- Do not add `Join Community` semantics to Discover travel.
- If future specs conflict with this lock, reconcile them intentionally instead of silently following the older narrower text.

## 15) Follow-Up Needed
- Reconcile `docs/specs/communities/discovery-scene-switching.md` and related canon/spec text against this founder lock.
- Treat that broader Discover canon/spec reconciliation as required work, but defer the full canon rewrite until V2 rather than forcing partial canon updates mid-clarification.
- Audit artist-page documentation as a separate core-surface lock gap before defining artist-page internals.
