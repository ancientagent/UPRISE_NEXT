# MVP Current Execution Roadmap (R1)

**Status:** Active execution roadmap
**Last Updated:** 2026-04-05
**Owner:** Founder + Codex control layer

## Purpose
This roadmap is the current execution plan for getting `UPRISE_NEXT` to a real web MVP without product drift, repo-structure drift, or infrastructure ambiguity.

This document is execution-only. Product behavior remains owned by `docs/specs/**`, canon docs, and current founder locks.

## Current Program Reality
### Already true
- `apps/web`, `apps/api`, `apps/socket`, and `apps/workers` are the active implementation tiers.
- The persistent player is a governing system and must be accounted for on every surface.
- `Home` is the left bottom-nav destination.
- `Discover` is the right bottom-nav destination.
- `Plot` lives inside `Home` as the Home-side sectional participation system.
- Current MVP Plot tabs are `Feed`, `Events`, `Promotions`, and `Statistics`.
- Local development uses Postgres + PostGIS.
- Hosted production/staging DB target is Neon Postgres + PostGIS, but the hosted cutover has not been executed yet.

### Active MVP core
The current MVP should stay focused on getting these systems working together:
- community creation / resolution / assignment
- RaDIYo and listening-context systems
- the minimum paid revenue surfaces needed to prove the model:
  - artist promotion packages
  - event promotion packages
  - the promo section / promotions surface

### Not yet true
- The whole MVP is not yet assembled into a coherent founder-reviewed web flow.
- Discover is not yet closed against the current player/scope/travel doctrine.
- Hosted/shared environment cutover is not yet complete.
- Launch/UAT readiness is not yet complete.

## Non-Negotiable Constraints
- No feature drift beyond `docs/specs/**` and explicit founder direction.
- No placeholder or speculative CTAs.
- No platform-trope drift.
- No web-tier DB access or secret leakage.
- No mobile-first planning against the current repo unless explicitly scoped as a separate mobile pass.
- DeepAgent/local infra is dev/CI only; hosted/shared environment targets are external.

## MVP Phases

## Phase 0 — Doctrine + Contract Lock
**Goal:** stop product drift before more implementation.

Required state:
- Surface contracts for `Home`, `Plot`, `Discover`, and `Community` are published and used as review gates, with `Plot` explicitly treated as the sectional system inside `Home` rather than a peer destination.
- AutoHarness + drift taxonomy are published and used for external agent control.
- Founder locks for current MVP-critical surfaces are visible and current.

Exit criteria:
- Reviewers can reject drift against one stable doctrine set.
- External builders/agents are no longer allowed to reinterpret shell relationships.

Status:
- In place enough to proceed.

## Phase 1 — Web Shell Coherence
**Goal:** make the web MVP feel like one product instead of route-level fragments.

Execution focus:
- Bottom-nav shell clarity (`Home` / `Discover`).
- The `Home` destination keeps `Plot` as its internal sectional system and does not let it drift into a peer destination.
- Persistent player remains present and coherent across shell transitions.
- Route-level empty/loading/error states feel consistent.
- Current founder-locked Home/Profile/Feed updates are carried through coherently.

Exit criteria:
- Founder can move through the shell without structural confusion.
- No route contradicts the rule that `Home` is the left destination, `Plot` lives inside `Home`, and `Discover` is the right destination.
- Player persistence rules are not broken by surface navigation.

## Phase 2 — Discover Closure
**Goal:** close Discover as a player-anchored MVP surface.

Execution focus:
- Unified Discover/player scope is implemented and stable.
- Search, Popular Signals, Active Participants, and Map share one current scope.
- Travel is attached to the player and is the explicit scope-change action.
- Map expands downward from the player.
- No invented global search, recommendation, or travel systems.

Founder decisions that still constrain this phase:
- Popular Signals metric/window/count.
- Active Participants qualification/count.
- Map visualization for each approved structural scope.

Exit criteria:
- Discover works as a coherent MVP surface under the current doctrine.
- Founder accepts the first-pass deferred list explicitly.
- No unresolved contradictions remain between player, scope, travel, and map behavior.

## Phase 3 — Core Participation Loop Closure
**Goal:** make the MVP core loop actually usable end-to-end.

Core loop:
- onboarding/home scene
- Home-side participation through `Plot`
- Discover
- artist/community/profile context
- support visibility surfaces
- event / promotion / signal actions

Execution focus:
- Support visibility remains legible across the approved surfaces.
- Profile/community reads reflect the current identity model cleanly.
- Signals / universal actions are wired into user-visible paths without turning into rankings or authority.
- Plot tabs remain structural and readable, not dashboard sludge.

Exit criteria:
- Founder can execute the MVP participation loop without hitting undefined or fake surfaces.
- Support state is visible enough to evaluate the product idea.

## Phase 4 — Hosted Environment Cutover
**Goal:** stop treating local/dev infrastructure as the practical MVP target.

Execution focus:
- Stand up the first real shared hosted environment.
- Move hosted DB target to Neon Postgres + PostGIS.
- Keep local Postgres/PostGIS for local development.
- Wire hosted env vars and migration flow cleanly.
- Ensure web/api deployment targets are explicit and non-DeepAgent.

Exit criteria:
- Shared/staging environment exists.
- Hosted database authority is Neon, not throwaway local/dev assumptions.
- Migrations and health checks run cleanly against the hosted target.

## Phase 5 — QA, UAT, and Launch Readiness
**Goal:** convert implementation progress into a launchable MVP.

Execution focus:
- Founder walkthrough on the real hosted MVP.
- Route-by-route QA/UAT checklist.
- Fix critical UX and state integrity failures.
- Publish explicit deferred list for post-MVP items.
- Final launch go/no-go checklist.

Exit criteria:
- Founder sign-off on MVP scope.
- Critical defects closed or explicitly deferred with acceptance.
- Launch checklist complete.

## Immediate Next Sequence
1. Finish the current founder-locked Home / Feed / Profile pass.
2. Close Discover planning and move into implementation against the current repo reality.
3. Run a founder walkthrough on the assembled web shell.
4. Define the hosted-environment cutover plan to Neon before real shared staging data matters.

## What Is Out of Scope For MVP
- Mobile port as a primary execution target.
- Generic social-network expansion.
- The broader social layer as a product pillar; that belongs to a later version.
- Causes and other civic-extension surfaces beyond what is already required for sect/Uprise realization.
- Metrics-as-authority systems.
- Finalized v2/community-extension features.
- Any builder-generated architecture that overrides repo truth.

## Review Gates
Every major MVP phase change must answer:
1. Does this preserve the current product doctrine?
2. Does this preserve the ownership rules for `Home` (including `Plot`), `Discover`, and `Community`?
3. Does this keep the persistent player as a governing system?
4. Does this avoid authority drift from descriptive metrics?
5. Does this move the product closer to a founder-reviewable hosted MVP?
