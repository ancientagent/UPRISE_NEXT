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

Expanded profile contains:
- Enlarged avatar + identity summary
- User stats block
- Collection shelves/items

Non-gesture fallback:
- Tap seam toggle for expand/collapse.

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

Events:
- Scene events based on active community anchor.

Promotions:
- Scene-scoped promotions/offers.

Statistics:
- Metrics, top songs, activity snapshot.

Social:
- Placeholder or deferred surface unless spec explicitly enables behavior.

## 9) Web Adaptation Rules
Web must preserve mobile semantics while adapting layout:
- Same state machine, different spacing/density.
- No web-only product semantics.
- Desktop may split panes, but action flow remains identical to mobile states.
- Any interaction not feasible on desktop gets explicit click fallback mirroring mobile intent.

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
