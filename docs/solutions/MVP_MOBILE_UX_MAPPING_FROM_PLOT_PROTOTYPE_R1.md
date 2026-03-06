# MVP Mobile UX Mapping From Plot Prototype (R1)

## Purpose

Freeze how the `/plot` prototype maps into the mobile-first UX contract so later UI implementation can move without re-deciding behavior.

This document is mapping-only. It does not authorize new product behavior.

## Canon Anchors

- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`

## Mapping Summary

### 1) Page-Level Composition

- Collapsed profile strip remains at top of `/plot`.
- Player remains persistent and outside Plot tab content ownership.
- Plot tabs remain the content switcher for Feed, Events, Promotions, Statistics.
- Bottom nav remains fixed inside the mobile viewport shell.

### 2) Player Ownership and Mode

- `RADIYO` and `Collection` are player modes.
- Mode switch behavior must not change Plot tab selection.
- Tier controls are right-stacked `National`, `State`, `City`.
- Rotation selector (`New` vs `Current`) is separate from player mode.
- Collection mode uses collection controls; RADIYO mode uses broadcast controls.

### 3) Profile Expansion Contract

- Expanded profile is a panel state transition, not route navigation.
- Expanding profile pushes/locks player to bottom seam above nav.
- Collapsing profile restores standard Plot viewport.
- Expanded profile contains collection-facing surfaces and profile metadata.

### 4) Onboarding/Home Scene Resolution Tie-In

- Home scene remains required.
- GPS-verified flow supports nearest-active routing when local scene is inactive.
- Parent community selection is constrained at onboarding.
- Taste tags are deferred to in-scene configuration, not onboarding.

### 5) Deferred Scope (Explicit)

- Vibe/activity deep systems stay deferred.
- Registrar instrument onboarding enhancements stay deferred.
- Advanced recommendation expansion stays deferred beyond current MVP lock.

## Anti-Drift Rules

- Do not merge player and Plot ownership.
- Do not add new CTAs outside spec-approved scope.
- Do not replace mobile-first interaction semantics with desktop-native alternatives.
- Do not reinterpret tier switching as mode switching.

## Acceptance Checklist

- `/plot` still renders collapsed profile + persistent player + Plot tabs.
- Mode switch and rotation selector remain distinct controls.
- Tier stack remains `National/State/City` with no ownership drift.
- Expanded profile behavior keeps player anchored at bottom seam.
- No speculative CTA or non-canon feature is introduced.
