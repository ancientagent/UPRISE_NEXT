# MVP Mobile UX System (R1)
Status: Active planning artifact (mobile-first UX source of truth)  
Owner: Founder + product engineering  
Last updated: 2026-03-01

## 1) Purpose
Define a mobile-first UX system for MVP so implementation is driven by a locked interaction model, not emulator trial-and-error.

This document is the execution baseline for:
- Screen composition
- Gesture behavior
- State transitions
- Component responsibilities
- Web adaptation boundaries

## 2) Canon Anchors
- `docs/solutions/MVP_FLOW_MAP_R1.md`
- `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- `docs/solutions/LEGACY_UI_REUSE_MAP_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/system/registrar.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md`

## 3) Mobile-First Principle
1. Mobile interaction model is the source of truth.
2. Web is an adaptation of the same states and semantics.
3. Do not introduce new product behavior in web adaptation.
4. If canon/spec is ambiguous, founder decision is required before implementation.

## 4) Plot Mobile Layout Contract
Primary order for Plot screen (mobile):
1. Profile Header Row
2. RaDIYo/Collection Player Shell
3. Plot Tabs (Feed, Events, Promotions, Statistics, Social)
4. Active Tab Content

Notes:
- “Home Scene” should be represented by player context/broadcast identity, not redundant stacked boxes.
- Tab system is “The Plot” body.

## 5) Profile Pull-Down Contract (Mobile)
Gesture source:
- Drag starts from profile header seam.

Behavior:
- Pull down from collapsed state expands profile panel.
- Expanded profile pushes player and Plot body downward in the same route.
- Pull up from expanded state collapses back to baseline.
- Mid-drag/partial-open is treated as `peek` only; no additional steady states.

Expanded profile contains:
- Enlarged avatar + identity summary
- User stats block
- Collection shelves/items

Non-gesture fallback:
- Tap seam toggle for expand/collapse.

### 5.1) State Transition Table (Locked R1)

Threshold constants (normalized to full expandable travel distance):
- `T_PEEK_ENTER = 0.15`
- `T_EXPAND_COMMIT = 0.60`
- `T_COLLAPSE_COMMIT = 0.40`
- `V_COMMIT = 900 px/s` (gesture-end velocity override)

State definitions:
- `collapsed`: baseline profile header only; player/tabs in default vertical position.
- `peek`: transient partial-open preview between `T_PEEK_ENTER` and `T_EXPAND_COMMIT`.
- `expanded`: committed open profile panel.

| Current State | Trigger | Threshold Rule | Next State | Allowed |
|---|---|---|---|---|
| `collapsed` | Seam drag down | drag progress `< T_PEEK_ENTER` | `collapsed` | Yes |
| `collapsed` | Seam drag down | `T_PEEK_ENTER <= progress < T_EXPAND_COMMIT` | `peek` | Yes |
| `collapsed` | Release after down drag | progress `>= T_EXPAND_COMMIT` OR end velocity `>= V_COMMIT` | `expanded` | Yes |
| `collapsed` | Seam tap toggle | n/a | `expanded` | Yes |
| `peek` | Continue drag down | progress `>= T_EXPAND_COMMIT` | `expanded` | Yes |
| `peek` | Drag up OR release | progress `< T_EXPAND_COMMIT` AND end velocity `> -V_COMMIT` | `collapsed` | Yes |
| `expanded` | Seam drag up | progress `> T_COLLAPSE_COMMIT` | `expanded` | Yes |
| `expanded` | Release after up drag | progress `<= T_COLLAPSE_COMMIT` OR end velocity `<= -V_COMMIT` | `collapsed` | Yes |
| `expanded` | Seam tap toggle | n/a | `collapsed` | Yes |

Guardrails:
- No direct `collapsed -> expanded` transition from content-body drag; seam-origin trigger only.
- `peek` is non-persistent and must resolve to `collapsed` or `expanded` on release.
- State transition must be deterministic and single-path per gesture end event.

### 5.2) Gesture Priority and Conflict Rules (Locked R1)

Priority order:
1. Seam-origin profile pull gesture
2. Active profile-panel vertical gesture (while `peek` or `expanded`)
3. Plot content-body vertical scroll gesture

Deterministic ownership rules:
- If touch-start occurs inside seam hit area, profile pull recognizer owns the gesture until release/cancel.
- If touch-start occurs inside profile panel body while state is `peek` or `expanded`, profile panel recognizer owns vertical drag.
- Content-body scroll recognizer may own vertical drag only when state is `collapsed` and touch-start is outside seam hit area.

Conflict handoff:
- No mid-gesture ownership transfer between profile pull recognizer and content-body scroll recognizer.
- On gesture end/cancel, ownership resets and next gesture may resolve ownership again from touch-start rules.
- If profile recognizer is active, content scroll position must remain frozen for that gesture.
- If content scroll recognizer is active, profile state must remain unchanged for that gesture.

Tie-breakers:
- In ambiguous edge overlap, seam-origin rule wins.
- Horizontal motion does not change profile state ownership; only vertical gesture path is stateful in R1.

### 5.3) Seam Pull-Tab Affordance Contract (Locked R1)

Affordance behavior:
- Seam is always visible at the profile/player boundary in `collapsed`, `peek`, and `expanded`.
- Seam indicates current state (collapsed vs expanded) and remains the canonical gesture origin.
- Seam tap behavior mirrors profile expand/collapse toggle exactly (no route change).

Hit area contract:
- Minimum touch target: `44px` height x full seam width.
- Center-aligned visual handle/tab must sit within the touch target.
- Hit area remains active even when panel content is loading.

Label/indicator contract:
- Collapsed indicator text: `Pull down profile`.
- Expanded indicator text: `Collapse profile`.
- Labels are descriptive-only and must not imply new capabilities.

Fallback controls:
- Tap seam toggle is required as non-gesture fallback.
- Keyboard/web parity fallback keeps equivalent expand/collapse control with same state semantics.
- If gesture recognition is unavailable, seam tap remains sufficient to reach both `collapsed` and `expanded`.

### 5.4) Motion Timing and Snap Contract (Locked R1)

Timing contract:
- Expand animation target duration: `220ms` (ease-out).
- Collapse animation target duration: `200ms` (ease-in-out).
- Peek settle animation target duration: `140ms` (quick settle to collapsed or expanded).

Snap behavior:
- Snap decision follows section `5.1` thresholds and velocity rules (`T_EXPAND_COMMIT`, `T_COLLAPSE_COMMIT`, `V_COMMIT`).
- On gesture release, exactly one snap target is selected (`collapsed` or `expanded`).
- No free-floating resting position between committed states.

Interruption handling:
- New seam gesture during in-flight animation cancels current animation and re-enters gesture-driven state immediately.
- Gesture cancellation event resolves to nearest committed state using current progress + velocity.
- Route/tab/player mode state must remain unchanged during profile motion interruption.

Determinism rule:
- Same start state + same release progress/velocity must always produce the same final state.

### 5.5) Accessibility Fallback Controls (Locked R1)

Non-gesture controls:
- Seam toggle is mandatory and fully equivalent to gesture expand/collapse behavior.
- Player mode switch (`RADIYO` / `Collection`) remains operable via tap/click controls independent of drag gestures.
- No essential profile/player action may require drag-only interaction.

Focus order contract:
1. Profile seam toggle
2. Mode switch control group (`RADIYO`, `Collection`)
3. Active mode primary controls (play/pause and mode-specific controls)
4. Tier controls (`City`, `State`, `National`)
5. Plot tabs
6. Active tab body

Reduced-motion behavior:
- If reduced motion is enabled, profile transitions use near-instant state changes with minimal opacity/position interpolation.
- Transition semantics remain unchanged (`collapsed`, `peek`, `expanded` resolution rules still apply).
- No state becomes unreachable under reduced-motion mode.

### 5.6) Gesture Contract Closeout (R1)

Terminology lock:
- Gesture and panel terms are now normalized in `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`.
- This document and the companion interaction doc must use identical meanings for `seam`, `pull-tab`, `collapsed`, `peek`, `expanded`, and `commit`.

Ambiguity removals:
- `pull-tab` refers only to the seam affordance and never to Plot tab navigation.
- `peek` is transient and cannot persist after gesture release.
- Profile expansion/collapse and player mode changes remain route-stable interactions.

## 6) Player Mode Contract
Modes:
- `RADIYO`
- `Collection`

Required invariants:
- Mode switch must be explicit and visible.
- Mode changes only switch player source/state, not route.
- Mode labels remain exactly `RADIYO` and `Collection`.

RADIYO mode controls:
- Play/Pause
- Add (`+`) action
- Rotation source toggle (`New Releases` / `Main Rotation`)

Collection mode controls:
- Back
- Shuffle
- Play/Pause

## 7) Tier + Context Contract
Tier controls:
- `City`, `State`, `National`

Rules:
- Tier changes update scene-context reads.
- Tier does not imply ranking/recommendation authority.
- Scene context wording must stay additive/descriptive.

## 8) Tab Content Contract
Feed:
- Scene-scoped non-personalized feed surfaces.
- IA Contract (R1):
  - Purpose:
    - Provide a scene-scoped activity stream for the active Plot context (city/state/national) without recommendation or ranking semantics.
  - Required data:
    - Active scene context identity (tier + community anchor).
    - Feed items that are already canonical/system-produced for that context.
    - Item timestamp (or canonical chronology field) for deterministic ordering.
    - Item type label and minimal actor/context metadata needed to render the row.
  - Ordering:
    - Reverse-chronological by canonical item timestamp (newest first).
    - No algorithmic personalization, relevance ranking, or speculative weighting.
  - Loading state:
    - Show feed skeleton rows in the tab body while fetch is pending.
    - Preserve tab header and scene context controls while loading.
  - Empty state:
    - Show explicit scene-scoped empty copy indicating there is no current feed activity for the active context.
    - Empty state must not imply hidden ranking, shadow filtering, or paywall behavior.
  - Error state:
    - Show retryable, non-destructive error copy for feed read failure.
    - Error UI must preserve current tab selection and context controls.
  - Deferred flags:
    - No personalized ranking, recommendation rail, or follow-graph sorting in R1.
    - No push/subscribe semantics implied by Feed alone in R1.

Events:
- Scene events based on active community anchor.
- IA Contract (R1):
  - Purpose:
    - Present scene-scoped event inventory for the active Plot context with clear chronology and no recommendation semantics.
  - Required data:
    - Active scene context identity (tier + community anchor).
    - Event identity fields (id, title, canonical start time).
    - Minimal venue/location label and organizer/source label required for row-level context.
    - Event status marker needed to distinguish upcoming vs concluded surfaces when applicable.
  - Ordering:
    - Primary sort by canonical event start time (upcoming first by nearest start time).
    - Secondary deterministic tie-break by stable event identity key.
    - No personalized ordering, popularity rank, or paid-priority rank in R1.
  - Loading state:
    - Show events skeleton rows in the tab panel while read is pending.
    - Keep tab rail and tier/scene controls visible and interactive.
  - Empty state:
    - Show explicit scene-scoped empty copy when no events are available for the active context.
    - Empty copy must not imply hidden algorithmic filtering or pay-to-surface controls.
  - Error state:
    - Show retryable, non-destructive error copy for event read failures.
    - Preserve selected tab and active context controls on error.
  - Deferred flags:
    - No recommendation rail, ranking model, or dynamic “because you listened” logic in R1.
    - No implied RSVP/ticketing workflow unless separately authorized by canon/spec.

Promotions:
- Scene-scoped promotions/offers.
- IA Contract (R1):
  - Purpose:
    - Surface scene-scoped promotion inventory for the active Plot context with explicit non-ranking semantics.
  - Required data:
    - Active scene context identity (tier + community anchor).
    - Promotion identity fields (id, title/label, validity window).
    - Promotion source/owner label required for row-level trust context.
    - Canonical availability state needed to suppress expired-only rows in active lists.
  - Ordering:
    - Primary sort by active validity priority (currently active before future-scheduled).
    - Secondary deterministic sort by canonical start timestamp (nearest start first).
    - No algorithmic “best offer”, sponsored ranking, or personalized ordering in R1.
  - Loading state:
    - Show promotions skeleton rows while read is pending.
    - Keep tab rail and context controls stable during load.
  - Empty state:
    - Show explicit scene-scoped empty copy when no promotions exist for active context.
    - Empty copy must not imply hidden premium gates or recommendation filtering.
  - Error state:
    - Show retryable, non-destructive error copy for promotion read failures.
    - Preserve selected tab and active context controls on error.
  - Deferred flags:
    - No dynamic pricing rank, recommendation model, or behavior-scored ordering in R1.
    - No implied checkout/payment flow from this tab unless canon/spec explicitly authorizes it.

Statistics:
- Metrics, top songs, activity snapshot.
- IA Contract (R1):
  - Purpose:
    - Present a scene-scoped statistics snapshot for the active Plot context without recommendation or ranking-authority semantics.
  - Required data:
    - Active scene context identity (tier + community anchor).
    - Metrics summary block fields (canonical metric ids + values + capture window label).
    - Top songs list fields (track identity + deterministic display label + canonical activity metric).
    - Activity list fields (activity identity/type + canonical timestamp + minimal actor/context label).
  - Ordering:
    - Metrics block order is fixed and explicit by canonical metric key sequence.
    - Top songs sorted by canonical activity metric descending, tie-break by stable track identity.
    - Activity list sorted reverse-chronological by canonical activity timestamp.
    - No personalization, recommendation score, or opaque ranking heuristic in R1.
  - Loading state:
    - Show statistics skeleton placeholders for metrics, top songs, and activity sections.
    - Keep active tab and context controls stable while loading.
  - Empty state:
    - Show explicit scene-scoped empty copy when statistics data is unavailable for active context.
    - Empty copy must not imply hidden premium data gates or algorithmic suppression.
  - Error state:
    - Show retryable, non-destructive error copy when statistics reads fail.
    - Preserve selected tab and context controls on error.

Social:
- Placeholder or deferred surface unless spec explicitly enables behavior.
- Deferred Contract (R1):
  - Status:
    - Social tab is explicitly deferred in R1 unless and until canon/spec enables concrete behavior.
  - Allowed surface:
    - Informational deferred-state panel only (no active social interaction controls).
    - Copy may state that Social workflows are deferred for current MVP phase.
  - No-drift placeholder rules:
    - Do not imply unavailable capabilities as active actions.
    - Do not introduce speculative CTA language (for example: follow, join, invite, boost, upgrade) unless explicitly authorized.
    - Do not imply ranking/recommendation/feed authority from deferred content.
    - Do not imply hidden unlock conditions or paywall semantics for deferred behavior.
  - Interaction constraints:
    - Tab selection behavior remains functional and state-consistent with other tabs.
    - Deferred panel must preserve active context controls and route stability.
  - Error/loading constraints:
    - Deferred panel does not depend on social backend reads in R1.
    - If any read is attempted by adaptation layer, fallback remains non-destructive deferred copy with no semantic drift.

### Cross-Tab IA Consistency Rules (R1 Consolidation)
- Canon-consistent terminology:
  - Use `RADIYO`, `Collection`, `City`, `State`, `National`, and `Plot` exactly as written.
  - Use “scene-scoped” wording for Feed/Events/Promotions/Statistics reads.
- Ordering language:
  - All tab ordering rules must reference explicit canonical sort fields.
  - Do not use ambiguous “best”, “smart”, “recommended”, or “for you” ordering language.
- Recommendation/ranking guardrail:
  - Feed/Events/Promotions/Statistics in R1 are descriptive context reads, not recommendation engines.
  - No personalization, behavioral weighting, or opaque ranking semantics may be implied.
- Deferred-surface guardrail:
  - Social tab copy must remain explicit about deferred status and must not imply hidden active workflows.
  - Deferred copy cannot introduce speculative CTAs or unlock narratives not backed by canon/spec.
- State semantics parity:
  - Loading, empty, and error states remain non-destructive and context-preserving across all tabs.
  - Tab selection and active context controls remain stable through all state transitions.

## 9) Web Adaptation Rules
Web must preserve mobile semantics while adapting layout:
- Same state machine, different spacing/density.
- No web-only product semantics.
- Desktop may split panes, but action flow remains identical to mobile states.
- Any interaction not feasible on desktop gets explicit click fallback mirroring mobile intent.

### Mobile Parity Required Matrix (Behavior-Locked)
| Interaction Surface | Mobile Interaction | Required Web Adaptation (Parity Required) |
| --- | --- | --- |
| Profile seam panel | Drag down to expand; drag up to collapse | Click seam toggle must expand/collapse the same panel state in-place, without route change |
| Profile seam panel fallback | Tap seam toggle | Click seam toggle performs identical expand/collapse transition |
| Player mode switch | Explicit `RADIYO` / `Collection` mode switch | Mode switch labels and state transitions remain exactly `RADIYO` / `Collection`, no extra mode semantics |
| `RADIYO` controls | Play/Pause, Add (`+`), source toggle (`New Releases` / `Main Rotation`) | Same controls and source toggle semantics; control order may adapt visually only |
| `Collection` controls | Back, Shuffle, Play/Pause | Same controls and intent; no additional queue/recommendation behavior introduced |
| Tier context controls | `City` / `State` / `National` context switch | Same tier set and read-context update behavior; no ranking/authority implications added |
| Plot tabs | Feed / Events / Promotions / Statistics / Social tab switching | Same tab set and tab state model; desktop layout may split panes without changing tab semantics |
| Feed ordering | Scene-scoped, reverse-chronological | Same canonical reverse-chronological ordering; no personalization/relevance sort |
| Loading/empty/error states | Deterministic tab-body states | Same loading/empty/error semantics with retry preserved; current tab/context remains unchanged |
| Route invariants | Profile expansion and player mode changes stay on same route | Web adaptation must keep these interactions route-stable; layout shifts allowed, route drift disallowed |

### Web-Only Adaptation Allowed Matrix (No Behavior Drift)
| Surface Area | Allowed Web-Only Adaptation | Non-Negotiable Constraint |
| --- | --- | --- |
| Top-level layout density | Increase whitespace/grid density for desktop viewport | Must preserve identical state transitions and control semantics |
| Panel composition | Split player/profile/tab body into adjacent panes on wide screens | Must remain one logical route with same interaction outcomes |
| Label visibility | Persist helper labels/tooltips where mobile uses compact icon affordances | Labels/tooltips cannot introduce new actions or alternate flows |
| Control hit areas | Expand click targets for pointer usability | Control intent and side effects remain identical to mobile |
| Scroll containers | Use independent scroll regions per pane where needed | Tab/context/player state continuity must remain unchanged |
| Empty/loading placements | Reposition empty/loading/error blocks for desktop readability | Messaging and retry behavior must match mobile semantics |
| Tab presentation | Convert tab row into segmented control or sidebar tabs | Tab set, order, and selected-state behavior must be unchanged |
| Profile panel footprint | Render expanded profile in fixed column/panel instead of push-down animation | Expand/collapse state model remains identical; no route/modal substitution |

### Desktop Fallback Controls Parity Matrix
| Mobile Interaction Intent | Desktop Click Fallback | Desktop Keyboard Fallback | Parity Rule |
| --- | --- | --- | --- |
| Pull down seam to expand profile | Click seam toggle button | `Enter`/`Space` on focused seam toggle | Same expanded state transition and same route |
| Pull up seam to collapse profile | Click seam toggle button in expanded state | `Enter`/`Space` on focused seam toggle | Same collapsed baseline state restoration |
| Toggle player mode (`RADIYO`/`Collection`) | Click mode toggle control | Arrow keys between mode options + `Enter` to confirm | Mode labels and resulting player state remain identical |
| Toggle rotation source (`New Releases`/`Main Rotation`) | Click source toggle control | Arrow keys/select + `Enter` | Source semantics unchanged; no ranking behavior introduced |
| Switch Plot tabs | Click tab item | Arrow keys to move focus + `Enter` to activate | Tab set/order/state machine unchanged |
| Change tier context (`City`/`State`/`National`) | Click tier control | Arrow keys/select + `Enter` | Context read scope changes only; no authority/ranking semantics |
| Retry feed/error recovery | Click retry action | Focus retry + `Enter` | Retry behavior must preserve active tab + context state |

### Responsive Breakpoint Behavior Table (Semantics Preserved)
| Viewport Class | Suggested Breakpoint | Layout Adaptation | Behavior Invariants |
| --- | --- | --- | --- |
| Mobile narrow | `< 768px` | Single-column stack: header -> player -> tabs -> tab body | Mobile interaction model is canonical source of truth |
| Tablet | `768px - 1023px` | Single-column or two-region stack with persistent tab controls | Same state machine, route stability, and mode/tier/tab semantics |
| Desktop | `1024px - 1439px` | Multi-pane optional split (profile/player + tab body) | No new actions, no semantic drift, same control outcomes |
| Desktop wide | `>= 1440px` | Expanded spacing, optional fixed side pane for profile context | Expand/collapse, mode switch, tab switch, and tier switch semantics unchanged |

Breakpoint implementation rules:
1. Breakpoint changes may alter presentation density and pane arrangement only.
2. Breakpoint changes must not change ordering semantics of feed items or mode/tier/tab outcomes.
3. Loading/empty/error states remain functionally identical across viewport classes.

### Terminology Consistency (Adaptation Docs)
Use these canonical terms consistently across all web adaptation docs:

| Concept | Canonical Term | Notes |
| --- | --- | --- |
| Player mode A | `RADIYO` | Keep uppercase spelling exactly as-is. |
| Player mode B | `Collection` | Use singular title-case form. |
| Tier 1 | `City` | Structural context tier. |
| Tier 2 | `State` | Structural context tier. |
| Tier 3 | `National` | Structural context tier. |
| Plot container | `Plot` | Primary tabbed body surface. |

Normalization rules:
1. Do not introduce alternate spellings (`Radio`, `RaDIYo`, `Collections`) in adaptation docs.
2. Do not rename tier labels (`Local/Regional/Nationwide`) in adaptation docs.
3. Keep mode/tier labels stable across matrix tables, examples, and fallback notes.

## 10) Web Adaptation Implementation Run Notes (R1)
Use this checklist when executing future web UX adaptation slices:

1. Confirm slice scope is docs/system-state only unless a spec-authorized implementation slice explicitly says otherwise.
2. Re-read parity/allowed/fallback/breakpoint matrices before editing adaptation docs or UI implementation plans.
3. Validate that every web adaptation note maps to an existing mobile interaction intent.
4. Reject any adaptation proposal that introduces new product semantics, route changes, or recommendation/ranking behavior.
5. Keep all examples copy-safe and deterministic (explicit variables/labels; no ambiguous placeholders).

### Anti-Drift Checks (Required per future slice)
Before completing a web adaptation slice, verify:
1. `RADIYO`/`Collection` labels remain unchanged.
2. `City`/`State`/`National` tier labels remain unchanged.
3. Plot tab behavior and ordering semantics remain unchanged.
4. Desktop click/keyboard fallbacks preserve mobile intent (no net-new actions).
5. Loading/empty/error handling remains parity-safe and context-preserving.

## 10) Execution Plan (UX Build)
Phase UX-A: Mobile interaction lock
- Lock pull-down profile behavior + seam controls + player mode semantics.

Phase UX-B: Tab-by-tab information architecture
- For each tab, finalize sections, ordering, and empty/loading/error states.

Phase UX-C: Web adaptation pass
- Apply mobile-locked states to web layout rules without behavior drift.

Phase UX-D: QA + acceptance
- Founder walkthrough on each major flow.
- Capture decision deltas in R1/R2 decision docs before additional implementation.

## 11) Founder Decision Gates (Required)
Before broad UX implementation, confirm:
1. Final profile-expanded composition order (stats vs collection priority).
2. Exact top-row controls per mode.
3. Statistics contents that stay in Plot vs move to dedicated views.
4. Discovery/search placement and limits for non-paying users.
5. Any deferred tab behavior language shown in UI.

## 12) Acceptance Criteria
- Team can describe and implement Plot flow without adding net-new behavior.
- Mobile interaction model is stable across screens with explicit fallback controls.
- Web implementation references this doc for adaptation, not invention.
- All unresolved behavior questions are tracked as explicit founder decisions.
