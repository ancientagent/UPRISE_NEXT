# MVP Web UX Recovery Plan R1

Status: Active  
Owner: product engineering  
Last updated: 2026-03-22

## 1) Purpose
Provide one execution order for the current web UX recovery work so implementation can proceed from stable route access, then Discover reconciliation, then artist-page lock work, instead of mixing product-definition gaps with route breakage.

## 2) Inputs
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
- harness inspection findings from 2026-03-22
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`

## 3) Execution Order
### Phase 1: Unblock core web routes
1. Restore usable web onboarding on `/onboarding`
2. Make `/plot` reachable without desktop dead-end gating
3. Make Registrar prerequisites satisfiable on web

### Phase 2: Fix broken direct-entry routes
4. Fix `/users/[id]` so it resolves to success, error, or not-found state
5. Fix `/community/[id]` so it resolves to success, error, or not-found state

### Phase 3: Stabilize current Discover runtime defects
6. Fix the unset/incorrect Discover context chip state
7. Make Discover controls produce reachable result states again

### Phase 4: Lock product definition before wider Discover buildout
8. Use `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md` as the controlling Discover source instead of the older narrower spec text
9. Create `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

### Phase 5: Build the implementation brief
10. Merge:
- cleaned harness defect list
- Discover founder lock
- Artist profile founder lock

into one implementation brief for the next delta pass.

### Phase 6: Deferred work after lock + immediate fixes
11. Reconcile and implement fuller Discover map/exploration UI against the founder lock only after:
- immediate route/runtime defects are fixed
- the artist-profile founder lock exists

## 4) Cleaned Defect Backlog
### Safe defects to keep now
- Desktop onboarding is blocked behind a mobile-only dead end.
- `/plot` is unreachable because onboarding gating stops shell render.
- Registrar prerequisites are not satisfiable from the live web flow.
- `/users/[id]` hangs instead of resolving a terminal state.
- `/community/[id]` hangs instead of resolving a terminal state.
- `/discover` context chip shows incorrect locality when unset.
- `/discover` controls do not currently produce reachable usable result states.

### Immediate implementation backlog
1. Unblock web onboarding.
2. Make `/plot` reachable.
3. Make Registrar prerequisites satisfiable on web.
4. Fix `/users/[id]` terminal-state resolution.
5. Fix `/community/[id]` terminal-state resolution.
6. Fix Discover unset context chip.
7. Rework Discover result-state behavior against the founder lock, not the old narrower spec.

### Deferred backlog
8. Reconcile and implement fuller Discover map/exploration UI against the founder lock later.

## 5) Guardrails
- Do not use `docs/specs/communities/discovery-scene-switching.md` alone as the product-definition source for Discover.
- Do not implement artist-page internals from mixed summaries alone.
- Do not begin broad Discover implementation until the artist-profile founder lock exists.
- Fix route blockers before expanding surface behavior.
- Do not hand the plan off for broad coding until `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md` exists.

## 6) Recommended Next Artifact
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`

## 7) Bottom Line
Current work should not jump straight into broad Discover or artist-surface implementation.

The correct order is:
- unblock routes
- fix hanging route states
- lock artist page
- then implement against the Discover + artist founder locks together
