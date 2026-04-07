# MVP Phase 1 / Phase 2 Action Board (R1)

**Status:** Active near-term action board
**Last Updated:** 2026-04-07
**Owner:** Founder + Codex control layer

## Purpose
Turn the current MVP roadmap into an immediate execution board for the next two phases:
- `Phase 1 — Web Shell Coherence`
- `Phase 2 — Discover Closure`

This document is execution-only. It does not create new product behavior.

## Controlling Sources
- `docs/solutions/MVP_CURRENT_EXECUTION_ROADMAP_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_HOME_R1.md`
- `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/solutions/SURFACE_CONTRACT_COMMUNITY_R1.md`
- `docs/solutions/UPRISE_AUTOHARNESS_R1.md`
- `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md`
- current founder-in-thread direction for Home / Feed / user profile refresh

## Phase 1 — Web Shell Coherence
**Goal:** make the existing web app feel like one product with correct shell ownership and persistent-system behavior.

### Phase 1 must remain true
- `Home` is the left bottom-nav destination.
- `Discover` is the right bottom-nav destination.
- `Plot` lives inside `Home` and is not a peer route in product logic.
- The persistent player remains a governing system across shell transitions.
- Route-level polish must not rewrite product semantics.

### Phase 1 workstreams
#### 1. Home-shell reconciliation (including Plot)
Scope:
- Make Home-shell ownership explicit in active web UX.
- Ensure Plot is presented as the Home-side sectional system rather than a competing destination.
- Keep bottom-nav understanding stable across touched screens.

Blocked by founder decision:
- No.

#### 2. Current Home / Feed / user profile pass
Scope:
- Carry the current founder-locked visual and structural update through those surfaces.
- Keep support visibility, identity treatment, and shell tone coherent.
- Avoid inventing profile vanity or generic social scaffolding.

Blocked by founder decision:
- Only if the current visual direction changes materially.

#### 3. Persistent player continuity audit
Scope:
- Verify the player remains present and context-bearing through the key shell transitions.
- Remove route-level behavior that makes the player feel optional, detached, or local-only.
- Ensure shell composition does not accidentally create playerless seams.

Blocked by founder decision:
- No.

#### 4. Shell-state parity
Scope:
- Align loading / empty / error / fallback states across Home-facing routes.
- Remove obviously fake or dead-end terminal states from MVP-critical shell surfaces.
- Keep these fixes structural, not decorative.

Blocked by founder decision:
- No.

### Phase 1 explicit exclusions
- No mobile planning or React Native routing work.
- No canonical redesign of Community.
- No new social tabs, extra shell destinations, or speculative CTAs.
- No attempt to finish full Discover behavior inside Phase 1.

### Phase 1 exit gates
- Founder can move through the web shell without confusion about `Home` as the left destination, `Plot` as the sectional system inside `Home`, and `Discover` as the right destination.
- Persistent player continuity is preserved on all touched MVP paths.
- Home / Feed / profile updates are coherent enough to serve as the shell baseline for Discover closure.

## Phase 2 — Discover Closure
**Goal:** close Discover as a coherent MVP surface under the current player/scope/travel doctrine.

### Phase 2 must remain true
- Discover is player-anchored.
- Discover uses one current unified listening scope.
- Scope is stable until explicit Travel action.
- Search, `Popular Singles`, `Recommendations`, and Map share that same scope.
- Travel is attached to the bottom of the player.
- The map expands downward from the player.
- Discover does not become a generic global search or recommendation engine.

### Phase 2 workstreams
#### 1. Scope-state implementation grounding
Scope:
- Ground Discover against the current repo reality and the unified current listening scope model.
- Remove or reject any old split travel/local search behavior that conflicts with the founder lock.
- Keep the model stable and explicit.

Blocked by founder decision:
- No.

#### 2. Discover surface composition
Scope:
- Recompose Discover into the locked vertical order:
  - search
  - Popular Singles
  - Recommendations
  - persistent player
  - Travel
  - map
- Ensure the player/travel/map relationship is spatially and structurally correct.

Blocked by founder decision:
- No.

#### 3. Search closure
Scope:
- Keep one top search bar.
- Keep search artist/song-scoped to the current listening scope.
- Prevent global-search or dual-search-model drift.

Blocked by founder decision:
- No.

#### 4. Popular Singles first-pass closure
Scope:
- Build/render the section under the shared Discover scope.
- Keep it descriptive and scene/scope-bound.
- Do not invent personalization or recommendation-engine logic.

What can proceed now:
- section placement
- state handling
- scope plumbing
- the locked lens contract from `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`

#### 5. Recommendations row closure
Scope:
- Build/render the section under the shared Discover scope.
- Keep it listener-to-listener discovery, not influencer/authority behavior.
- Preserve the locked avatar + fixed-balloon recommendation grammar.

What can proceed now:
- section placement
- state handling
- shared-scope plumbing
- non-authoritative display contract

#### 6. Travel + map closure
Scope:
- Keep Travel attached to the bottom of the player.
- Keep Travel as the explicit scope-change action.
- Keep the map expanding downward from the player.
- Keep the map structural-scope based, not radius-based.

Still blocked by founder decision:
- exact map visualization per approved structural scope

What can proceed now:
- player/travel attachment
- transition ownership
- map container placement
- non-interactive first-pass structure

### Phase 2 explicit exclusions
- No mobile-specific routing or file-path planning.
- No second travel search.
- No generic `For You` feed.
- No global search detached from player context.
- No authority/ranking mechanics from metrics.
- No map interactivity requirements for first pass.
- No Travel history, breadcrumbing, or broad scene-switch menu invention.

### Phase 2 founder decisions still required
Only these should block final closure:
1. `Map visualization`
- how each already-approved structural scope is shown geographically

### Phase 2 exit gates
- Discover behaves as one coherent player-anchored surface.
- No remaining contradiction between player, scope, travel, and map behavior.
- Founder explicitly accepts the first-pass deferred list.

## Immediate Execution Order
1. Finish the current founder-locked Home-side pass (`Home`, Feed inside `Plot`, and user profile work).
2. Run a shell-coherence review against the rule that `Plot` lives inside `Home` and is not a peer destination to `Home` or `Discover`.
3. Implement/reconcile Discover against the unified scope model.
4. Close Discover structure before polishing secondary visual details.
5. Resolve the remaining founder decisions for Map visualization and any still-open statistics semantics that affect implementation.
6. Re-run founder walkthrough on the assembled shell + Discover.

## Stop Conditions
Stop and ask founder before proceeding if any of these occur:
- Discover planning tries to reopen the shell ownership model.
- Travel is reframed as a generic scene-switching or map-explore product.
- Metrics start drifting into authority, ranking power, or recommendation authority.
- Recommendations are reframed as a separate card system instead of the locked avatar + balloon grammar.
- A proposed fix requires product semantics not already covered by the current locks.
