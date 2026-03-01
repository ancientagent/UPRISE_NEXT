# MVP Mobile UX Component Contracts (R1)
Status: Active planning artifact
Last updated: 2026-03-01

## Purpose
Define component-level contracts for MVP mobile-first UX without introducing new product semantics.

This contract set is constrained by:
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/solutions/MVP_MOBILE_UX_MAPPING_FROM_PLOT_PROTOTYPE_R1.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md`

## 1) Profile Header Component Contract (`SLICE-UXCOMP-513A`)

### 1.1 Responsibility
The profile header is the top-row identity/control seam for Plot route composition.
It owns display and interaction state for profile-panel expansion intent; it does not own player mode state, tier state, or tab selection state.

### 1.2 Inputs (Props)
Required props:
- `identity`: `{ displayName: string; handle?: string | null; avatarUrl?: string | null }`
- `badges`: `{ notifications?: number | null; hasOverflowMenu: boolean }`
- `expansion`: `{ isExpanded: boolean; canToggle: boolean; isTransitioning?: boolean }`
- `availability`: `{ isLoading: boolean; isError: boolean }`
- `a11y`: `{ expandLabel: string; collapseLabel: string }`

Optional props:
- `onOpenNotifications?: () => void`
- `onOpenOverflowMenu?: () => void`

### 1.3 Output Events
The component can emit only these events:
- `onToggleExpansion(nextExpanded: boolean)`
- `onExpandRequested(source: 'drag' | 'seam_toggle')`
- `onCollapseRequested(source: 'drag' | 'seam_toggle')`
- `onHeaderPressed()`

Behavioral invariants:
- Expansion intent is emitted from header seam interaction.
- No event emitted by this component may imply route navigation or player source mutation.
- Notification and overflow actions are optional and must be no-op safe when handlers are absent.

### 1.4 Internal State (Local UI State)
Allowed local state:
- visual press/hover feedback
- transient drag gesture delta
- local transition lock for animation frame sequencing

Forbidden local state:
- authoritative profile data cache
- player mode (`RADIYO`/`Collection`) source of truth
- tier (`City`/`State`/`National`) source of truth
- tab active-key source of truth

### 1.5 Ownership Boundaries
Owned by `ProfileHeader`:
- top-row rendering
- seam affordance UI
- expansion intent emission

Owned by parent container/screen:
- authoritative expanded/collapsed value
- profile data fetching and error/loading resolution
- player shell state
- tier controls state
- tab rail state

### 1.6 Loading / Empty / Error Behavior
- Loading: render stable header skeleton with seam affordance preserved.
- Empty identity fields: fall back to deterministic display placeholders; no synthetic role/entitlement labels.
- Error: preserve seam toggle affordance and emit events; error messaging is parent-owned.

### 1.7 Web Adaptation Constraint
Web adaptation must preserve this state/event contract and ownership boundaries.
Differences are limited to layout density and pointer/keyboard affordances.

## 2) Player Shell Component Contract (`SLICE-UXCOMP-514A`)

### 2.1 Responsibility
Defines mode-specific player shell behavior for `RADIYO` and `Collection` in Plot route scope.
It owns rendering/interaction dispatch only; playback source truth remains parent/system-owned.

### 2.2 Inputs (Props)
Required props:
- `mode`: `'RADIYO' | 'Collection'`
- `trackContext`: `{ title: string; artistLabel?: string | null; sourceLabel: string }`
- `playback`: `{ isPlaying: boolean; isBuffering: boolean; canPlay: boolean }`
- `rotation`: `{ pool: 'new_releases' | 'main_rotation'; canTogglePool: boolean }`
- `availability`: `{ isLoading: boolean; isError: boolean; errorLabel?: string | null }`

Optional props:
- `collectionMeta?: { itemCount?: number | null }`

### 2.3 Output Events
- `onPlayPauseRequested()`
- `onAddRequested()` (RADIYO only)
- `onPoolToggleRequested(nextPool: 'new_releases' | 'main_rotation')` (RADIYO only)
- `onBackRequested()` (Collection only)
- `onShuffleRequested()` (Collection only)

### 2.4 Mode Invariants
- Mode labels must remain exactly `RADIYO` and `Collection`.
- Mode switch changes source/state only; never route.
- RADIYO controls: play/pause, add, pool toggle.
- Collection controls: back, shuffle, play/pause.

### 2.5 Error and Loading Contract
- Loading: show deterministic shell skeleton and keep mode indicator visible.
- Error: show non-destructive playback error state; parent retains retry policy.
- Disabled controls must be explicit and mode-consistent.

## 3) Tier Controls Component Contract (`SLICE-UXCOMP-515A`)

### 3.1 Responsibility
Represents scene scope selector for `City`, `State`, `National` with no ranking/recommendation semantics.

### 3.2 Inputs (Props)
- `activeTier`: `'city' | 'state' | 'national'`
- `availableTiers`: `{ city: boolean; state: boolean; national: boolean }`
- `uiState`: `{ isLoading: boolean; isDisabled: boolean }`
- `labels`: `{ city: string; state: string; national: string }` (must map to `City/State/National`)

### 3.3 Output Events
- `onTierChangeRequested(nextTier: 'city' | 'state' | 'national')`

### 3.4 Invariants
- Tier is structural scope, not recommendation authority.
- Invalid/disabled tiers emit no change events.
- Active tier indicator must remain visible during loading/error states.

### 3.5 Ownership Boundary
- Component owns only presentation and intent emission.
- Parent owns authoritative tier state and associated data reads.

## 4) Plot Tabs Rail Component Contract (`SLICE-UXCOMP-516A`)

### 4.1 Responsibility
Defines tab selector behavior for Plot body surfaces: `Feed`, `Events`, `Promotions`, `Statistics`, `Social`.

### 4.2 Inputs (Props)
- `tabs`: `Array<{ key: 'feed'|'events'|'promotions'|'statistics'|'social'; label: string; enabled: boolean; deferred?: boolean }>`
- `activeTab`: `'feed'|'events'|'promotions'|'statistics'|'social'`
- `uiState`: `{ isLoading: boolean; isDisabled: boolean }`

### 4.3 Output Events
- `onTabChangeRequested(nextTab: 'feed'|'events'|'promotions'|'statistics'|'social')`

### 4.4 A11y + Keyboard Contract
- Arrow-key roving focus between enabled tabs.
- Enter/Space triggers active-tab change request.
- Active tab must expose deterministic selected state.

### 4.5 Deferred Tab Handling
- Tabs marked `deferred` remain visible when spec-authorized, but must not imply hidden capabilities.
- Deferred tabs may render controlled placeholder copy only when authorized by parent/surface contract.

## 5) Tab Panel Contracts Bundle (`SLICE-UXCOMP-517A`)

### 5.1 Shared Panel Interface
All panels consume:
- `context`: `{ tier: 'city'|'state'|'national'; anchorId?: string | null }`
- `uiState`: `{ isLoading: boolean; isError: boolean; errorLabel?: string | null }`
- `onRetry?: () => void`

All panels provide:
- deterministic loading state
- explicit empty state
- non-destructive error state

### 5.2 Feed Panel
- Scene-scoped activity list in chronological order.
- No recommendation/personalization behavior.

### 5.3 Events Panel
- Scene events list by active context.
- No hidden registration/payment behavior implied.

### 5.4 Promotions Panel
- Scene-scoped promotions/offers list.
- Must remain additive/read-only unless separate action contract exists.

### 5.5 Statistics Panel
- Metrics/top songs/activity snapshot presentation.
- Read-model only; no mutation side effects.

### 5.6 Social Panel
- Only explicitly authorized social interactions.
- Deferred features must remain explicitly marked as deferred in parent-owned copy.

## 6) Component Boundary and Anti-Drift Map (`SLICE-UXCOMP-518A`)

### 6.1 Forbidden Dependencies (UX component layer)
- No direct DB clients, backend service imports, or server-only modules.
- No endpoint/schema invention inside UI contracts.
- No speculative CTA/action contracts outside authorized spec surfaces.

### 6.2 Allowed Dependency Surface
- Shared typed contracts and UI primitives.
- Parent-provided handlers for data reads/mutations.
- API-backed behavior routed through existing authorized layers.

### 6.3 Anti-Trope Guardrails
- No Spotify/Instagram/TikTok-style inferred behavior imports.
- Tier controls are scope selectors only.
- Feed/social/statistics panels must not imply ranking or hidden recommendation systems.

### 6.4 Drift Detection Checklist
Before adding/changing a component contract:
1. Confirm behavior is already spec/canon authorized.
2. Confirm ownership boundary remains parent-driven for data truth.
3. Confirm no new route/endpoint/schema/role semantics are introduced.
