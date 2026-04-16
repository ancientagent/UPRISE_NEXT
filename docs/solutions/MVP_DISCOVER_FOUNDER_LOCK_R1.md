# MVP Discover Founder Lock R1

Status: Active  
Owner: Founder + product engineering  
Last updated: 2026-04-16

## 1) Purpose
Capture founder-confirmed Discover behavior so future sessions stop reinterpreting Discover from partial specs, stale implementation shape, legacy layout memory, or philosophy-derived narrowing.

Current MVP border rule:
- MVP is local-community-only.
- listeners primarily listen to their own community while communities settle
- `Discover` is not a live active MVP surface yet and should present as `Coming Soon`
- cross-community travel / open-borders discovery is deferred until communities are stable enough to open borders intentionally
- useful stats-driven discovery material should surface intermittently inside the feed in the meantime instead of relying on a separate Discover route

This document is the controlling lock for:
- Discover structure and entry model
- Discover lookup boundary
- Discover/player relationship
- Discover ontology (`sources`, `signals`, `recommendations`, `support`)
- Discover statistics lenses
- Discover post/rendering grammar
- Popular Singles, recommendation, and conditional signal surface behavior
- Travel map expansion behavior
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

Until `docs/specs/communities/discovery-scene-switching.md` is intentionally reconciled, this document overrides narrower or conflicting Discover assumptions in older spec/solution text and in the current web implementation.

## 3) Source Context Used
- Founder walkthrough captured in `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md` on 2026-03-22
- Founder clarification in-session on 2026-04-02
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
- `docs/solutions/NARRATIVE_CARRY_FORWARD_RULES_R1.md`
- `docs/solutions/SOFTWARE_SYSTEMS_GUARDRAILS_R1.md`
- `docs/canon/Master Narrative Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/core/signals-and-universal-actions.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/users/identity-roles-capabilities.md`

## 4) Discover Purpose Lock
Discover is for discovering:
- music
- people
- places

Discover is a contextual listening-discovery surface attached to the user's current listening/community state.
It is not just a sterile scene-switch utility.
It is not a detached search page.
It is not a separate context system competing with the player.

Primary Discover success is:
- user finds strong music signals
- user carries those signals outward through adds, blasts, recommendations, or source follows

Community visit is a secondary Discover outcome, not the primary success condition.
Users do not need to enter a community page for Discover to succeed.

## 4A) Discover Ontology Lock
### 4A.1 Sources
Sources are followable origin objects.

Current source classes:
- artists
- communities
- businesses
- promoters
- events

Future source classes:
- ambassadors
- venues
- mixologists

Users follow sources to receive the signals those sources produce or carry.

### 4A.2 Signals
Signals are canonical platform objects that users receive, add, and act on.

Current signal classes:
- singles
- Uprises
- promos
- flyers

Future signal classes:
- mixes

Signals are produced or carried by sources.
Sources are not signals.

### 4A.3 Recommendations
Recommendations are a distinct object class.

A recommendation:
- is an explicit user-to-signal relationship
- references a canonical signal object
- is not a source
- is not itself a signal

### 4A.4 Support
Support is a lightweight response layer on posts.

Support:
- is not a source
- is not a signal
- is not a recommendation
- should function as a lightweight counter/reaction showing excitement for the post
- should not become a parallel authored post type

## 4B) Discover Activity/Post Grammar Lock
UPRISE uses one canonical signal-action post grammar across feed/profile/Discover.

The system grammar is:
- actor on the left
- optional action prop/device attached to the actor
- balloon tail originating from the actor or prop
- balloon style keyed to action type
- payload inside the balloon referencing the relevant signal or update payload
- canonical click-through to the native destination

Different surfaces may lay this grammar out differently, but they must not invent parallel post systems.

### 4B.1 Blast grammar
- actor: user avatar
- prop: boombox
- balloon: blast-styled balloon
- payload: blastable signal presentation
- confirmed blastable signals include:
  - song/single signals
  - Uprise signals
- blast does not widen to source-profile, event-page, or flyer-surface actions under this lock
- click target: canonical destination for the blasted signal

Rationale:
- Uprise signals are blastable because inter-community Uprises exist and must remain eligible for explicit listener amplification

### 4B.2 Recommendation grammar
- actor: user avatar
- balloon: fixed recommendation balloon
- text: `Check out "signal"`
- the balloon is not user-editable freeform text
- selecting `Recommend` on a signal replaces the user's prior active recommendation
- recommendation surfaces:
  - profile balloon
  - feed entries
  - Discover recommendation row/carousel
- both the user and the recommendation/signal can be selected

### 4B.3 Promotion grammar
- actor: promoter avatar
- prop: megaphone
- balloon: promotion-styled balloon
- payload: promo artifact or flyer artifact

### 4B.4 Community update grammar
- actor: UPRISE system/antenna
- balloon: update-styled balloon
- payload: community/Uprise update signal

### 4B.5 Imported artifact rule
- flyers remain externally authored promoter assets
- UPRISE owns only their framing, context, and click behavior
- Print Shop remains the future internal artist-authored artifact system

## 5) Discover Entry And Context Lock
- The user enters Discover from the bottom-right Discover control in the persistent app shell.
- Discover opens from the user's current Home Scene / tuned community context.
- The persistent player remains present on the Discover surface.
- The player is the active context anchor for Discover.
- Discover behavior must inherit the current player context rather than creating a parallel one.

For MVP this means:
- current listening tier matters
- current tuned/home community matters
- visitor/local status remains relevant
- Discover is context-sensitive to the active player/listening state
- Discover currently operates at `city` and `state` scope only
- `national` Discover scope is deferred from MVP until population justifies it

## 6) Discover Core Structure
Discover is anchored by one dominant top card:
1. an expanded `community player card` that also acts as the current community title card
2. player-attached `Travel` at the bottom edge of that card
3. a downward-materializing stack of contextual discovery snippets under the player/title card

Discover does **not** use a split primary model where travel/community search is one top section and local artist/song search is another independent top section.
Discover does **not** treat search, recommendations, and signal rails as peer headers competing with the player. The player/title card owns the page hierarchy, and everything else is secondary to that anchor.

## 7) Community Lookup Boundary
### 7.1 Discover is passive-first
- Discover should not depend on prior artist/song knowledge.
- Discover is for passive community reading first:
  - the current player/marquee
  - what is popular
  - what is rising/performing
  - what people are explicitly saying/recommending

### 7.2 Lookup belongs to community-native context
- Community-native artist/source lookup belongs on the `community` page, not Discover.
- That keeps lookup in a place where locals and visitors already understand the current community they are inside.
- Registrar may remain adjacent on the community side, but Discover itself should not become the lookup surface.

### 7.3 Boundary rules
- Do not split Discover into passive discovery plus a separate primary lookup/search mode.
- Do not ask the user to know names before Discover can succeed.
- Do not turn Discover into a generic all-things omnibox detached from the player/community anchor.

## 8) Content Sections
### 8.1 Popular Singles
- `Popular Singles` appears as a secondary snippet below the top player/title card.
- It is the primary music-discovery rail in Discover.
- It surfaces high-engagement single/song signals in the current Discover/player scope.
- It is signal-level surfacing, not source-level popularity and not recommendation-object surfacing.
- It is contextual and scene-driven, not algorithmically personalized.
- It must remain descriptive rather than recommendation-engine behavior.
- It should not be phrased or implemented as a generic `For You` or trending rail.
- MVP category lenses for `Popular Singles` are:
  - `Most Added`
  - `Supported Now`
  - `Recent Rises`
- Lens semantics are controlled by `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`.
- `Popular Now` is intentionally excluded from Discover because it belongs to the sacred RaDIYo/broadcast engagement system.
- `Recent Rises` is allowed in Discover because it surfaces signals that have already risen out of the current broadcast mix and helps users identify what has recently broken upward without duplicating what is currently in rotation.
- MVP `Recent Rises` behavior:
  - at `city` scope: no rail content is required
  - at `state` scope: show the most recent singles that were pulled from city-origin communities into the state player
  - preserve origin city/community identity on those surfaced singles so city communities benefit from the exposure

### 8.2 Recommendations Row / Carousel
- Below `Popular Singles`, Discover shows a row/carousel of users and their active recommendations as another contextual snippet.
- This row reuses the canonical recommendation grammar (avatar + `Check out "signal"` balloon).
- This is a listener-to-listener discovery surface, not a social leaderboard and not a separate recommendation card system.
- It helps the user understand what people in the current scope are explicitly pointing at.

### 8.3 Conditional Discover Content
- Events and promos are not universally relevant Discover defaults.
- They are conditionally relevant and should surface in Discover only when the current scope or visit/travel context makes them meaningfully relevant.
- They must not displace the primary Discover emphasis on signal/music/source discovery.

### 8.4 Community Visit Priority
- `Visit [Community Name]` remains an available deeper action.
- It is not the primary Discover success condition.
- Discover should prioritize signal/music/source discovery first and community entry second.

### 8.5 Recommendation-engine boundary
The banned behavior is algorithmic/system-personalized recommendation behavior.
This lock does **not** ban founder-defined recommendation or signal sections that are rooted in current community context and explicit descriptive system rules.

## 9) Player And Travel Lock
### 9.1 Player persistence
- The player persists on Discover.
- The player/title card is the dominant top object on Discover.
- The player ties the user to the tier they are currently listening to.
- Discover must respect that tier instead of creating an unrelated parallel tier/travel model.

### 9.2 Travel control location
- `Travel` is attached to the **bottom** of the player.
- The affordance is a downward expansion control from the bottom edge of the player.
- Travel is not a separate top-level search surface.
- Travel is not a detached discover mode unrelated to the player.

### 9.3 Travel expansion behavior
- When the user activates `Travel`, the map expands downward from the bottom of the player.
- The map expansion is part of the top player/title card experience, not a detached module.
- Snippet content remains materially below that top expansion instead of competing for top-of-page ownership.
- The map scope/zoom is determined by the current player/listening tier.
- If the user is listening at `city` tier:
  - the travel map expands to the state-level geography around that current context.
- If the user is listening at `state` tier:
  - the travel map expands to a broader zoomed-out geography appropriate to that wider listening scope.
- If the user is listening at `national` tier:
  - the travel map remains at the broadest macro travel scope for that parent music-community context.

### 9.4 Travel context rule
- Geography expands; parent music-community context remains inherited.
- Travel must not silently mutate Home Scene or civic authority.
- Travel is a transport/listening operation first.

## 10) Uprise Travel And Entry
### 10.1 Retune behavior
When the user selects another community/Uprise through Discover travel:
- RaDIYo automatically switches to that community's Uprise.
- The user remains in the Discover/context layer first.
- Full community entry is explicit, not automatic.

### 10.2 Community entry CTA
- The explicit entry affordance is: `Visit [Community Name]`
- This preserves continuity because the user is already listening to that Uprise before full entry.

### 10.3 Community page handoff
- Clicking `Visit [Community Name]` takes the user into the actual community page.
- The community page is the same community surface in visitor mode when it is not a Home Scene.

## 11) Visitor Mode Lock
For visited non-Home communities:
- no Registrar
- no voting capabilities
- no Home-Scene-only features

## 12) Link-Resolution Rule
Across Discover and the rest of the app:
- sources should be selectable wherever mentioned
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

## 13) Home Scene / Preset Carry-Forward Used By Discover
- Home button returns the user to the last active Home Scene.
- Users may have multiple Home Scenes across local music communities inside their real home city.
- Home Scenes are managed from expanded profile under the Uprises section.
- Home Scenes are marked with a house icon.
- Saved Uprises also live in that Uprises section and function like saved stations/presets.

## 14) Explicit Non-Locks / Deferred Items
This document does not define:
- artist-page internal composition
- event-page internal composition
- final visual styling of the Travel expansion control
- final visual styling of the avatar + text bubble recommendation cards
- deeper animation/motion rules for player-to-map expansion
- final exact formula details behind every Discover section beyond founder-confirmed directional behavior
- the finished Activity Score scoring matrix or decay policy
- vibe-score coupling, recommendation attribution rewards, or influence-map metrics packages

## 15) Implementation Guardrails
- Do not re-split Discover into separate primary travel and local lookup systems.
- Do not detach Discover from the active player context.
- Do not add a second competing tier/context control when the player already establishes it.
- Do not treat Travel as a separate top-level search surface.
- Do not turn Discover back into a name-first lookup surface.
- Do not treat the presence of recommendation-like sections as equivalent to banned algorithmic personalization.
- Do not auto-enter a community page immediately on retune; entry remains explicit.
- Do not add `Join Community` semantics to Discover travel.
- If future specs conflict with this lock, reconcile them intentionally instead of silently following older narrower text.

## 16) Follow-Up Needed
- Reconcile `docs/specs/communities/discovery-scene-switching.md` against this updated founder lock.
- Refactor the current web Discover implementation away from the split travel/local search model and toward the player-anchored Discover model described here.
- Audit any Discover prompts/mockups that still describe the old dropdown-attached travel search model.
