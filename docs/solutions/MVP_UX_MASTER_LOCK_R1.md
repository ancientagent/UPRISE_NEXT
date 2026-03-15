# MVP UX Master Lock (R1)

Status: Active  
Owner: Founder + product engineering  
Last updated: 2026-03-12

## 1) Purpose
Provide one deterministic UX source for current MVP implementation so agents do not drift across legacy references, partial docs, or conflicting prior drafts.

This document is the execution lock for:
- Onboarding -> Home Scene routing semantics
- Plot route structure and tab ownership
- Player/profile interaction model
- Explicit MVP vs deferred boundaries

## 2) Precedence Rule (Authoritative)
If documents conflict, apply this order:
1. `docs/canon/*`
2. `docs/specs/*`
3. This file (`docs/solutions/MVP_UX_MASTER_LOCK_R1.md`)
4. Other `docs/solutions/*` UX artifacts
5. `docs/legacy/*` (reference only)

Non-negotiable:
- Legacy UX is architecture reference only.
- If legacy differs from current lock/spec, current lock/spec wins.

## 3) Canon/Spec Anchors
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_FOUNDER_DECISION_REGISTER_R1.md`
- `docs/solutions/LEGACY_UI_REUSE_MAP_R1.md`

## 4) Locked MVP Surface Model

### 4.1 Route ownership
- `/plot` is the active scene dashboard route.
- Profile expand/collapse and player mode changes are route-stable (no route push/pop).

### 4.2 Global composition (collapsed state)
Top to bottom:
1. Profile strip
2. Player strip
3. Plot tabs
4. Active tab body
5. Bottom nav

### 4.3 Profile strip (collapsed)
Visible:
- Username
- Notifications icon
- `...` options

Expanded profile (same route) includes:
- Identity summary + activity score
- Conditional role flags (band/promoter when applicable)
- Collection workspace sections (see section 6)

### 4.4 Player contract
Modes:
- `RADIYO`
- `Collection`

Tier context:
- `City`, `State`, `National`

RADIYO:
- Tier controls select playback context
- Tapping active tier stops playback
- Rotation/source control exists (`New`/`Current` naming may vary by UI token, semantics must match locked source-rotation behavior)

Collection:
- Enter via collection selection path
- Exit via explicit eject return path to `RADIYO`
- Tier stack hidden in Collection mode

### 4.5 Bottom nav + engagement wheel
Bottom nav:
- Home (left)
- Center UPRISE wheel trigger
- Discover (right)

Engagement wheel:
- Triggered from center UPRISE button
- RADIYO and Collection action sets are mode-specific and deterministic

### 4.6 Plot tabs (collapsed view)
Primary tabs:
- Feed
- Events
- Promos/Promotions
- Statistics

Social:
- Deferred for MVP unless explicitly unlocked by spec update.

## 5) Onboarding Lock (Home Scene)
Required onboarding semantics:
- Home Scene resolution is required before stable Plot anchoring.
- GPS is a voting eligibility gate only (participation still allowed without GPS).
- If selected city-tier scene is inactive, auto-route to nearest active city scene for selected parent community.
- Persist pioneer intent and show pioneer follow-up message via profile-strip notification icon.

## 6) Expanded Profile Collection Workspace (MVP Lock)
Locked section order:
1. Singles/Playlists
2. Events
3. Photos
4. Merch
5. Saved Uprises
6. Saved Promos/Coupons

Calendar rule:
- Calendar stays in expanded header area, not inside Events collection section.

## 7) Same vs Different (Legacy Delta)

### 7.1 Same foundations retained
- Mobile-first compact composition
- Top profile strip + player + plot tabs + bottom nav architecture
- Scene-scoped tier context model

### 7.2 Different from legacy (intentional)
- Canon-first civic Plot semantics (no recommendation/ranking feed behavior)
- Deterministic onboarding Home Scene routing + pioneer fallback messaging
- Explicit MVP deferrals enforced (no speculative role/registrar/profile surfaces outside spec lock)
- Engagement and player/profile interactions constrained by locked state model, not ad-hoc UI behavior

### 7.3 Deferred (do not implement without lock)
- Social interactive workflows
- Recommendation/vibe scoring mechanics
- Unlocked registrar/admin profile surfaces beyond current approved scope
- Any monetization behavior requiring unresolved decisions in `MVP_FOUNDER_DECISION_REGISTER_R1.md`

## 8) Drift Rejection Rules
Reject any output that:
- Introduces behavior not backed by `docs/specs/*` or this file
- Reintroduces legacy-only controls/copy as if canon
- Adds placeholder CTA actions for unapproved flows
- Alters mode/tier/route semantics

## 9) Execution Use
For all UX implementation prompts and agent lanes:
- Require reading this file first.
- Require explicit file-path citations for any behavioral change.
- If canon/spec is silent, stop and request founder lock before implementing.
