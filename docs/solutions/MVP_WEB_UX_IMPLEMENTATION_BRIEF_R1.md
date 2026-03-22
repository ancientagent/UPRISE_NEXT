# MVP Web UX Implementation Brief R1

Status: Active  
Owner: product engineering  
Last updated: 2026-03-22

## 1) Purpose
Provide one implementation brief for the next web UX delta pass by combining:
- the current route/runtime recovery sequence
- the cleaned harness defect backlog
- the Discover founder lock
- the artist-profile founder lock

This brief is intentionally limited to immediate implementation work. Fuller Discover map/exploration buildout remains deferred.

## 2) Controlling Sources
Implementation must use these sources together:
- `docs/solutions/MVP_WEB_UX_RECOVERY_PLAN_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`

## 3) Scope
### In scope now
1. Restore a usable web onboarding path on `/onboarding`
2. Make `/plot` reachable on web
3. Make Registrar prerequisites satisfiable through the web flow
4. Fix `/users/[id]` terminal-state resolution
5. Fix `/community/[id]` terminal-state resolution
6. Fix the incorrect/unset Discover context chip behavior
7. Rework Discover result-state behavior against the Discover founder lock

### Explicitly out of scope now
- fuller Discover map/exploration implementation
- canon/spec rewrite for Discover
- full artist-page internal section design beyond the current founder lock
- event-page detailed redesign
- monetization/pricing decisions not already locked

## 4) Immediate Backlog
### 4.1 Web onboarding
- Remove the current desktop dead-end behavior on `/onboarding`.
- Restore a completable web path for Home Scene setup.
- Preserve Home Scene, GPS, fallback-scene, and review-step behavior from the onboarding spec.

### 4.2 Plot reachability
- Stop blocking `/plot` behind a dead-end onboarding redirect path.
- Either render the shell with valid unresolved-state handling or make onboarding completable enough that the route becomes reachable through normal flow.

### 4.3 Registrar path viability
- Keep existing Registrar prerequisites.
- Make those prerequisites satisfiable from web so the artist/band registration path is not a dead-end.

### 4.4 Direct route stability
- `/users/[id]` must terminate into success, error, or not-found state.
- `/community/[id]` must terminate into success, error, or not-found state.
- Indefinite loading states are not acceptable terminal behavior.

### 4.5 Discover runtime fixes
- Fix the Discover context chip so unset contexts do not falsely render `Local`.
- Make Discover controls produce reachable and usable result states in practice.
- Validate Discover behavior against `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`, not `docs/specs/communities/discovery-scene-switching.md` alone.

## 5) Discover Implementation Constraints
For this pass, Discover implementation must preserve:
- one search bar
- map/dropdown travel model as founder-locked reference
- local artist/song search within the current community context
- `Recommendations`, `Trending`, and `Top Artists` as founder-defined structures
- retune first, explicit `Visit [Community Name]` entry second
- visitor-mode restrictions in non-Home communities
- native link-resolution behavior

But this pass does not need to finish the fuller map/exploration buildout.

## 6) Artist-Page Constraints For This Pass
This pass must respect the current artist founder lock:
- artist page uses a familiar profile-page structure
- core actions are `Follow`, `Add`, `Blast`, `Support`
- artist-link entry keeps RaDIYo playing until user selects a single
- single/signal-link entry routes to artist page, auto-streams the selected single, and stops RaDIYo

This pass must not invent additional artist-page internals beyond those locks.

## 7) Acceptance Criteria For This Brief
The implementation pass is only complete when:
- `/onboarding` is usable on web
- `/plot` is reachable without desktop dead-end behavior
- Registrar prerequisites can be satisfied from web
- `/users/[id]` and `/community/[id]` resolve terminal states correctly
- Discover context chip is correct in unset/default states
- Discover controls reach usable result states
- no Discover behavior is narrowed back to the old scene/community-only assumptions during implementation

## 8) Validation Requirements
For each implementation slice, report exact results for:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- targeted tests for touched routes/components
- relevant typecheck step

## 9) Execution Note
This brief is the handoff point for coding.

If implementation encounters new ambiguity beyond the locks above, extend the relevant founder lock first instead of solving it ad hoc in code.
