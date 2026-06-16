# MVP Player + Profile Expansion Interaction (R1)

Status: Historical interaction reference

Historical note:
- This file reflects an earlier Plot/Profile interaction model.
- It remains useful for historical rationale but should not override newer founder locks, current action grammar, or current route/surface doctrine.
- Current founder-corrected wording: the player is pulled down to open the user's profile / collection workspace in-place, and the player relocates to the bottom while that workspace is expanded. If space allows, it can keep normal controls/status; if space is tight, it can shrink to a compact scrolling band / song title marquee. Do not reinterpret this as a separate normal profile page navigation.


## Status
- `R1 draft`
- Source of truth for implementation slices: this doc + in-thread founder direction.

## Why this exists
The current MVP UX needs a locked interaction contract for:
- top-level RaDIYo player placement,
- in-place profile expansion (no route transition),
- deterministic switching between `radiyo` and `collection` playback modes.

This doc prevents ad-hoc implementation drift across lanes.

## Founder-directed lock (from thread)
- RaDIYo player stays in the screen flow near the top of Plot UX, not bottom-attached.
- Profile should be draggable/expandable in-place (same screen), with animation.
- Expanding profile can push/reposition player toward lower layout region during expanded state.
- Selecting a collection song switches playback source from RaDIYo to collection player mode.

## Canon/spec guardrails
- No recommendation/personalization behavior.
- No speculative economy/promo mechanics added.
- Keep player behavior deterministic and explicit.
- No automatic hidden mode switching without user action.

References:
- `docs/specs/broadcast/radiyo-and-fair-play.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md`
- `docs/solutions/MVP_UX_ALIGNMENT_REPORT_R1.md`
- `docs/solutions/MVP_FLOW_MAP_R1.md`

## UX contract

### 1) Surface placement
- **Collapsed state:** player strip is visible in top content stack of Plot.
- **Expanded profile state:** profile expands in-place and **replaces Plot body content** (not an overlay on active Plot panels). The route remains the same.
- In expanded state, the content stack is mirrored as:
  - profile info/header region (top),
  - collection workspace region (main body),
  - compact player shell (persistent, mode-aware).
- No full-screen navigation push for profile open/close.

### 2) Interaction states
- `panel_state`
  - `collapsed`
  - `peek`
  - `expanded`
- `player_mode`
  - `radiyo`
  - `collection`

### 3) State transitions
- Drag down/up on profile handle transitions `collapsed <-> peek <-> expanded`.
- Tap on profile header toggles `collapsed <-> expanded` for accessibility fallback.
- Selecting a collection track sets `player_mode=collection`.
- Explicit eject/back control sets `player_mode=radiyo`.
- Mode does **not** auto-switch unless user action triggers it.
- Expanding profile stores current Plot UI snapshot (`activeTab`, `tier`, selected community anchor) and hides Plot body.
- Collapsing profile restores Plot snapshot exactly.

### 4) Playback behavior
- Single shared player shell, two input sources:
  - `radiyo` source: broadcast rotation read contract.
  - `collection` source: user-selected collection queue.
- Preserve playhead/queue snapshot per mode when switching modes (resume behavior).
- Keep transport control semantics consistent across both modes.

### 5) Gesture/scroll conflict rules
- Profile drag has priority only when gesture starts from dedicated handle/header zone.
- Content scroll has priority inside expanded body when not at boundary.
- If scroll is at top and user drags downward, transition back toward `peek/collapsed`.

### 5.1) Smoothness and motion constraints (locked)
- Use one shared animation driver for container state (`panel_state`), not independent competing animations.
- Snap-point model only (`collapsed`, optional `peek`, `expanded`); no unconstrained freeform resting positions.
- Transition timing defaults:
  - open/expand: `220–280ms` spring-equivalent
  - collapse: `180–240ms` spring-equivalent
- Preserve compositor-friendly transforms (translate/opacity) over layout-thrashing property animation where possible.
- Defer heavy collection body work until `expanded` settles (lazy-load/virtualized list).
- `prefers-reduced-motion` / reduced-motion setting must disable spring travel and use immediate or low-motion transitions.

### 6) Accessibility fallback
- Every drag-only transition must have a tap/button equivalent:
  - `Open Profile`
  - `Collapse Profile`
  - `Back to RaDIYo`
- Keyboard and screen reader paths must expose the same state changes.

## Proposed implementation slices (pre-UI polish)

### Slice UX-01: state model + shell contract
- Add centralized UI state model for `panel_state` and `player_mode`.
- Add strict transition helpers and unit tests for invalid transitions.

### Slice UX-02: profile panel expansion container
- Implement expandable panel container in Plot route.
- Add animation for `collapsed/peek/expanded` and deterministic snap behavior.

### Slice UX-03: shared player shell + source adapter
- Extract player shell component.
- Add source adapters for `radiyo` and `collection`.
- Keep mode changes selection-driven on entry and eject-driven on exit.

### Slice UX-04: collection selection handoff
- Wire collection track selection -> `player_mode=collection` + queue load.
- Preserve RaDIYo snapshot for return.

### Slice UX-05: accessibility + fallback controls
- Add non-gesture controls and focus order.
- Verify keyboard and screen reader labels/actions.

### Slice UX-06: polish + telemetry (non-product logic)
- Add UI-only telemetry for player-mode and panel transitions.
- Tune animation timings and reduced-motion support.

## Acceptance criteria (R1)
- User can open/close profile without leaving Plot route.
- In expanded profile, Plot body is replaced by profile+collection workspace, then restored on collapse.
- Player remains within same screen context and is never detached to bottom-only global bar by default.
- Selecting collection track reliably switches to collection mode.
- User can explicitly return to RaDIYo mode via eject/back.
- No mode switch happens silently.
- Typecheck/docs checks pass.

## Open decisions to confirm before final UX lock
- Should closing profile auto-return to RaDIYo, or preserve last player mode?
  - Recommended default: preserve mode until explicit eject/back return.
- Should `peek` state be visible on desktop, or mobile only?
  - Recommended default: mobile-first `peek`; desktop uses `collapsed/expanded`.
- Should player controls differ by mode, or remain mode-specific within the locked shell?
  - Recommended default: locked mode-specific controls with tier/rotation in `RADIYO` and eject/shuffle in `Collection`.
- In expanded profile, should the compact player sit directly below profile header or pinned to collection footer region?
  - Recommended default: below profile header for consistent discovery and quicker collection entry/return visibility.

## Out of scope for this R1
- New recommendation logic.
- New backend ranking/rotation semantics.
- Monetization or promo-slot mechanics.
- Native app implementation details beyond transferable interaction contract.
