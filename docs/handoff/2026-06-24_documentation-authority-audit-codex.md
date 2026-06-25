# Documentation Authority Audit - Codex Baseline

Date: 2026-06-24
Agent: Codex main agent with delegated explorer lanes
Repo: `/home/baris/UPRISE_NEXT`
Branch: `docs/abacus-fusion-swarm-strategy`
HEAD: `27898c5a2d8afaabc38d7d4273ce2b299fec74af`
Status: Codex-side audit baseline for comparison with Hermes `upriseauditor`
Mode: Read-only audit plus this requested handoff write

## Scope

This file captures the Codex-side documentation authority audit requested by the founder.
It is intended for Hermes review and later reconciliation. It is not the final merged audit.

The audit focused on whether current UPRISE documentation lets an agent understand the platform before coding, especially:

- platform/community architecture
- canon/spec/brief authority
- stale or mixed-era documentation
- runtime/test alignment
- whether a phased or lane-based documentation strategy is needed

## Repo State Observed

- Branch: `docs/abacus-fusion-swarm-strategy`
- HEAD: `27898c5`
- Tracked worktree before this file: clean
- Existing unrelated untracked files: `art/**`
- Hermes report also exists as untracked: `docs/handoff/2026-06-24_documentation-authority-audit-upriseauditor.md`

## Codex Lane Split

Codex used four independent audit lanes plus a main-thread synthesis:

1. Canon and active specs
2. Agent briefs, solutions, and handoffs
3. Runtime/test cross-check
4. Documentation strategy
5. Main-thread synthesis and conflict classification

No delegated lane was asked to edit files.

## Executive Summary

The docs contain the current UPRISE model, but the authority/routing system is internally inconsistent. The app itself is more clearly defined than the agent loading path.

The highest-risk issue is not lack of product truth. It is that product truth is scattered across canon, active specs, lane briefs, founder locks, handoffs, and runtime tests while the default reading strategy is conflicted.

The strongest current truths are stable:

- A community is identified by `city + state + music community`.
- Launch communities are seed instances, not special architecture.
- Home Scene architecture is invariant across communities.
- Sects, generated channels, and subcommunities happen later through the Prime model.
- Plot lives inside Home and current MVP tabs are `Feed`, `Events`, and `Archive`.
- Listener profile, Artist Profile, Source Dashboard, Registrar, and business surfaces are separate concepts.
- Source Dashboard is the current monorepo stand-in for future source/admin tooling.
- GPS gates voting rights only, not ordinary participation.
- Business/monetization and broader media/storage systems are mostly deferred.

The highest-risk documentation problems are:

1. `AGENTS.md` and `CONTEXT_ROUTER.md` disagree about how much context agents should load by default.
2. `COMM-SCENES` still says unknown communities create inactive `Community` rows, while newer onboarding/runtime behavior says they do not.
3. Plot calendar wording is broader than the current read-only Plot Events implementation.
4. Print Shop placement is mixed across canon/specs/briefs: Events, Promotions, and source-dashboard language all appear.
5. Some active indexes and assistant briefs are stale enough to misroute agents.

## Current Platform Truths Codex Believes Are Winning

### Community Architecture

Current winning truth:

- UPRISE does not use one-off community architecture.
- Every community instance uses the same architecture.
- The identity tuple is `city + state + music community`.
- Launch community rows are seed data, not structural variants.
- Differences between communities come from membership, sources, events, signals, archive/history, and later Prime-model generated structures.

Evidence:

- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md:62` - community identity is `city + state + music community`.
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md:72` - Home Scene architecture is invariant.
- `docs/specs/users/onboarding-home-scene-resolution.md:25-28` - 48 launch tuples and invariant architecture.
- `docs/specs/seed/README.md:18-19` - no runtime/tabs/menus/actions/player/routing changes per community.
- `docs/specs/seed/launch-community-city-matrix.json:5` - launch matrix architecture rule.
- `apps/api/prisma/schema.prisma:106-139` - generic `Community` instance model and relationships.

### Onboarding / Home Scene

Current winning truth:

- Manual city/state input is authoritative when supplied.
- ZIP/postal code is preview/context only.
- GPS can supply city/state when the user chooses GPS instead of manual entry.
- GPS enables voting only.
- Users can participate without GPS.
- If selected Home Scene is inactive/unavailable, preserve pioneer intent and route to nearest active city-tier community for the same parent music community.
- Missing music-community requests are intake-only and do not create selectable communities or live scenes.

Evidence:

- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md:65-89`
- `docs/specs/users/onboarding-home-scene-resolution.md:20-40`
- `docs/specs/users/onboarding-home-scene-resolution.md:43-65`
- `apps/api/src/onboarding/onboarding.service.ts` runtime lane evidence for exact/fallback/pioneer handling.

### Plot / Events / Archive

Current winning truth:

- Plot is inside Home, not standalone.
- Current MVP tabs are exactly `Feed`, `Events`, and `Archive`.
- `Archive` is user-facing descriptive stats/history context, not a current `Statistics` tab.
- `Promotions` and `Social` are deferred from current MVP Plot tabs.
- Current Plot Events listings are read-only and scene-scoped.

Evidence:

- `docs/specs/communities/plot-and-scene-plot.md:32-38`
- `docs/specs/communities/plot-and-scene-plot.md:78-84`
- `docs/specs/communities/plot-and-scene-plot.md:151-162`
- `docs/agent-briefs/EVENTS_ARCHIVE.md:61-78`
- `docs/agent-briefs/UI_CURRENT.md:78-80`
- `apps/web/src/app/plot/page.tsx:48` from runtime lane.

### Source / Artist / Registrar Separation

Current winning truth:

- Base user identity is the listener/community identity.
- Artist/Band/Promoter are separate source entities or additive capabilities.
- Source tools do not live inside listener profile.
- `/source-dashboard` is the current monorepo stand-in for future source/admin tooling.
- Registrar remains listener-side/Home Scene-bound civic/formalization infrastructure.
- Source routes may bridge into Registrar, but this does not make Registrar a source-native surface.

Evidence:

- `docs/specs/users/identity-roles-capabilities.md:20-26`
- `docs/specs/users/identity-roles-capabilities.md:166-176`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md:70-90`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md:50-67`
- `docs/specs/system/registrar.md:20-23`
- `docs/specs/system/registrar.md:191-195`
- `docs/specs/system/registrar.md:264-267`

### Business / Media / Monetization

Current winning truth:

- Revenue doctrine exists.
- Current MVP business runtime, billing, offers/coupons, business dashboard, paid promotions management, and premium analytics runtime are deferred.
- Paid behavior must not affect Fair Play, ranking, visibility, tier progression, or governance.
- Release Deck currently has 3 music slots plus a deferred 4th ad-attachment concept.
- Media upload/storage/transcoding is deferred; current Release Deck is URL-only.

Evidence:

- `docs/agent-briefs/BUSINESS_MONETIZATION.md:49-67`
- `docs/solutions/BUSINESS_MONETIZATION_BOUNDARY_R1.md`
- `docs/specs/economy/revenue-and-pricing.md:11-18`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md:81-85`

## Cross-Lane Inconsistency Table

| Topic | Winning Truth | Conflicting Docs / Runtime | Risk | Recommended Fix | Founder Decision? |
| --- | --- | --- | --- | --- | --- |
| Default reading strategy | Use `AGENTS.md`, platform mental model, lane router, one lane brief, then exact files | `AGENTS.md:7-13` requires six docs; `CONTEXT_ROUTER.md:20-27` says lean lane loading | High | Update `AGENTS.md`, `docs/README.md`, `CONTEXT_ROUTER.md`, docs framework to one layered strategy | No, unless founder wants heavy default context |
| Community architecture | One generic `Community` instance model; no one-off community architecture | Some older docs imply inactive pioneer rows or old scene creation behavior | High | Patch stale `COMM-SCENES` implemented/current behavior language | No |
| Unknown/unavailable Home Scene | Preserve pioneer intent, route to nearest active same parent community, do not create inactive `Community` | `docs/specs/communities/scenes-uprises-sects.md:31`, `:114` says create inactive pioneer Scene | High | Mark those lines superseded by onboarding spec/runtime | No |
| Missing music-community request | Intake only, no selectable option or live scene until review | Mostly aligned; risk is older docs/agents treating request as creation | Medium | Add cross-link from request docs to activation lifecycle | Threshold decision still open |
| Calendar/Event behavior | Current Plot Events rows are read-only; calendar layer is real but not inline Plot mutation | `COMM-PLOT` says users add events directly to calendar; events spec says no inline calendar controls | Medium | Clarify current Plot list vs future/approved calendar action surface | Possibly timing/surface decision |
| Print Shop placement | Current event-write lane is source-facing/source-dashboard tooling; broader commercial/artifact behavior deferred | Narrative/canon/specs mention Events, Promotions, source-dashboard in different ways | Medium-high | Add current-MVP placement note in Print Shop/event/source docs | Maybe long-term IA wording |
| Promotions endpoint wording | Retained/deferred endpoint, not current Plot tab | API comment says “Plot Promotions tab” | Low | Patch comment/test wording | No |
| Registrar UI Print Shop copy | Print Shop event-write exists; broader Print Shop/promo/artifact behavior deferred | Registrar copy says event creation pending/once published | Medium | Patch UI copy to say event-write lane exists but capability/artifact/promos remain scoped | No |
| Taste tags onboarding | Taste tags are not collected in onboarding | API still accepts optional `tasteTag` and persists tags if supplied | Medium | Either ignore/reject API field or document as legacy-compatible API debt | Product call if keeping compatibility |
| Hermes auditor branch defaults | Hermes broad auditor should not be pinned to old branch | `UPRISE_HERMES_AUDITOR_AGENT.md` names old launch branch/task | Medium | Remove branch-specific default; make branch supplied per task | No |
| Handoff index freshness | Handoffs are searched; high-value list should be current | `docs/handoff/README.md` misses newer 2026-06-24 handoffs | Medium | Refresh current high-value list or add generated/latest-index guidance | No |
| Active old phase docs | Old execution plans should be historical unless explicitly current | Some 2026-02 phase docs still say active | Medium | Mark superseded/historical and point to current roadmap/strategy | No |
| Brief metadata freshness | `Last Updated` should track material changes | Some briefs updated by handoff but metadata still old | Low | Refresh metadata during doc strategy cleanup | No |

## Runtime / Test Cross-Check Summary

The runtime lane found that most current active docs match runtime.

Docs match runtime:

- generic `Community` instance architecture
- launch seed matrix
- missing music-community request isolation
- onboarding exact/fallback/pioneer flow
- Plot Feed/Events/Archive
- source dashboard separation
- Artist Profile direct listen/no wheel/no Blast boundary
- Registrar Home Scene scope
- business/media deferred boundary

Docs or comments do not match runtime:

- taste tag API acceptance vs docs saying taste tags are not collected
- “Plot Promotions tab” API comment
- Registrar UI copy implying Print Shop event creation pending

Runtime lane reported focused validation passed:

- API: 11 suites / 45 tests
- Web: 12 suites / 54 tests

Main Codex did not rerun those tests directly; this is delegated runtime-lane evidence.

## Documentation Strategy Recommendation

### Do Not Make The System Only Smaller

The original lean-router strategy solved real context-window overload and stale-doc problems. But the founder correctly noted that newer Codex skill/context handling may make heavier curated context viable.

Therefore the proposed strategy is layered, not merely minimal:

- preserve a heavy platform knowledge layer
- keep default task loading intentional
- let audits/planning/architecture use a heavier authority pack
- prevent uncontrolled bulk-loading of stale handoffs/legacy docs

### Proposed Context Tiers

#### Tier 0 - Operating Rules

Always loaded or always known by agents.

- `AGENTS.md`
- Non-negotiables
- branch/worktree/PR/package-manager rules
- no drift / no one-off architecture / web-tier boundary

#### Tier 1 - Platform Mental Model

Loaded for meaningful UPRISE work.

Proposed file:

- `docs/PLATFORM_START_HERE.md`

Purpose:

- explain what UPRISE is
- define community identity
- explain Home / Plot / player / profile / source / registrar / business separation
- distinguish current MVP from deferred/later domains
- route agents to lane briefs

This should be explicitly non-authoritative:

- Instruction authority: `AGENTS.md`
- Product semantics: `docs/canon/**`
- Behavior/contracts: active `docs/specs/**`
- Routing: `docs/agent-briefs/CONTEXT_ROUTER.md`
- Execution notes: search `docs/handoff/**`, do not bulk-read

#### Tier 2 - Lane Pack

Loaded by task.

Current lane docs remain valuable:

- `UI_CURRENT.md`
- `ONBOARDING_HOME_SCENE.md`
- `ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `REGISTRAR_GOVERNANCE.md`
- `EVENTS_ARCHIVE.md`
- `ACTIONS_AND_SIGNALS.md`
- `BUSINESS_MONETIZATION.md`
- `EXTERNAL_TOOLS.md`
- Infra/runtime lane in router

#### Tier 3 - Heavy Authority Pack

Loaded only for audits, major planning, architecture work, or onboarding a high-capacity agent.

Contents:

- selected canon files
- active specs for relevant domains
- relevant founder locks/solution packets
- latest relevant handoffs
- runtime/test files for verification

This can be a documented “heavy mode,” not the default for all tasks.

## Recommended Documentation Changes

### Immediate Slice

Create a docs strategy cleanup branch/slice with these goals:

1. Create `docs/PLATFORM_START_HERE.md`.
2. Update `AGENTS.md` required reading into a layered strategy.
3. Update `docs/README.md` to include platform start here.
4. Update `docs/agent-briefs/CONTEXT_ROUTER.md` to align with `AGENTS.md` and add a documentation-maintenance lane if useful.
5. Update `docs/specs/system/documentation-framework.md` from 2025 assumptions to current tiered/lane strategy.
6. Refresh `docs/handoff/README.md` current high-value list or replace with “latest by search/topic” stronger guidance.
7. Remove stale branch-specific assumptions from `UPRISE_HERMES_AUDITOR_AGENT.md`.
8. Add a dated handoff and changelog entry.

### Follow-Up Cleanup

1. Patch `COMM-SCENES` inactive pioneer-community creation language.
2. Clarify Plot calendar/current read-only Events boundary.
3. Clarify Print Shop current placement and deferred domains.
4. Patch stale runtime comments/UI copy.
5. Decide whether API `tasteTag` compatibility should be removed, ignored, or documented as legacy-compatible debt.
6. Mark older phase/execution docs historical/superseded where needed.
7. Refresh stale `Last Updated` metadata on affected briefs.

## Immediate Fix List

### 1. Add Platform Start Here

Priority: P0
Files:

- `docs/PLATFORM_START_HERE.md`
- `docs/README.md`
- `docs/CHANGELOG.md`
- dated handoff

Acceptance criteria:

- New doc explains UPRISE in one short platform mental model.
- It includes community identity, current MVP surfaces, deferred domains, and lane routing.
- It states it is not a replacement for canon/specs.

### 2. Reconcile AGENTS Required Reading With Lane Router

Priority: P0
Files:

- `AGENTS.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`

Acceptance criteria:

- One default reading strategy exists.
- Operational docs become conditional by task type.
- Heavy context mode is documented for audits/planning/architecture.

### 3. Update Documentation Framework Spec

Priority: P0
Files:

- `docs/specs/system/documentation-framework.md`

Acceptance criteria:

- Reflects `AGENTS.md` + `PLATFORM_START_HERE.md` + lane briefs.
- Retires 2025-only “docs/README is single entrypoint” framing.
- Keeps <5 minute orientation goal.

### 4. Fix Pioneer Community Creation Docs

Priority: P0
Files:

- `docs/specs/communities/scenes-uprises-sects.md`
- possibly `docs/specs/system/edge-cases-and-compliance.md`
- possibly `docs/specs/users/onboarding-home-scene-resolution.md`

Acceptance criteria:

- No active spec says onboarding creates inactive pioneer `Community` rows.
- Current behavior is clearly fallback route + preserved pioneer intent.

### 5. Clarify Community Template / Instance Language

Priority: P1
Files:

- `docs/PLATFORM_START_HERE.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/seed/README.md`

Acceptance criteria:

- Agents understand launch matrix as seeded community instances.
- Agents understand same architecture applies to all communities.
- Prime-model future structures are named as later generated, not launch variants.

### 6. Clarify Calendar/Event Current Boundary

Priority: P1
Files:

- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`

Acceptance criteria:

- Current Plot Events rows are explicitly read-only.
- Calendar is acknowledged as real/approved layer only where currently scoped.
- No agent should add inline calendar mutation to Plot Events without new approval.

### 7. Clarify Print Shop Placement

Priority: P1
Files:

- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`

Acceptance criteria:

- Current MVP Print Shop event-write lane is source-facing.
- Broader Print Shop artifacts/promos/business behavior remains deferred.
- Canon long-term placement and current MVP route placement are separated.

### 8. Patch Taste Tag API/Docs Mismatch

Priority: P1
Files:

- `apps/api/src/onboarding/dto/onboarding.dto.ts`
- `apps/api/src/onboarding/onboarding.service.ts`
- onboarding API tests
- onboarding docs if compatibility is retained

Acceptance criteria:

- Either API rejects/ignores `tasteTag`, or docs clearly mark it legacy-compatible and not collected by web onboarding.
- Test coverage prevents accidental reactivation in onboarding UI.

### 9. Patch Stale Comments / UI Copy

Priority: P2
Files:

- `apps/api/src/communities/communities.controller.ts`
- `apps/web/src/app/registrar/page.tsx`
- related tests if snapshots/static tests exist

Acceptance criteria:

- Promotions endpoint comment does not call it a current Plot Promotions tab.
- Registrar copy does not say Print Shop event creation is unpublished if the event-write lane exists.

### 10. Refresh Handoff Index

Priority: P2
Files:

- `docs/handoff/README.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md` if needed

Acceptance criteria:

- New 2026-06-24 high-value docs are discoverable or the index says search latest by topic.
- External agents are not sent to stale carry-forward lists.

### 11. Remove Stale Hermes Branch Defaults

Priority: P2
Files:

- `docs/agent-briefs/UPRISE_HERMES_AUDITOR_AGENT.md`

Acceptance criteria:

- Hermes auditor brief is branch-agnostic.
- Prompts require caller-provided branch/HEAD.
- Old branch-specific audit remains historical example only if preserved.

### 12. Mark Old Execution Plans Historical/Superseded

Priority: P2
Files:

- `docs/solutions/MVP_HARD_ROADMAP_EXECUTION_PLAN.md`
- other active-labeled old phase docs identified during cleanup
- `docs/solutions/README.md`

Acceptance criteria:

- Current active docs are not competing with old execution plans.
- Historical docs remain available but not default-loading material.

## Founder Decisions Still Needed

Only these seem to require founder/product input rather than ordinary cleanup:

1. Should the default agent read path stay lean, or should high-capacity Codex/Hermes sessions load a heavier curated platform primer by default?
   - Suggested answer: layered strategy; lean default plus heavy mode.

2. What exact threshold makes a missing music-community request eligible for review?
   - Current docs say repeated submissions from distinct people in distinct cities, but no number.

3. Should API `tasteTag` compatibility be removed now, ignored silently, or preserved as legacy-compatible debt?
   - Current user-facing onboarding says no taste tags.

4. What is the exact current/future calendar surface?
   - Current Plot Events rows are read-only, but calendar is real. Need current surface/timing if calendar becomes active.

5. Long-term Print Shop IA wording.
   - Current MVP source-facing event-write lane is clear. Long-term relation among Events, Promotions, source dashboard, artifacts, and business surfaces needs crisp wording when activated.

## Proposed Final Reconciliation Process With Hermes

When Hermes output is reviewed, compare against this file on these axes:

1. Did Hermes find additional canon/spec conflicts not listed here?
2. Did Hermes disagree on winning truth for any topic?
3. Did Hermes classify any item as founder decision that Codex classified as stale cleanup?
4. Did Hermes recommend a different documentation strategy than layered `PLATFORM_START_HERE` + lane briefs + heavy mode?
5. Did Hermes identify docs that should be archived rather than annotated?

Final founder-facing result should be a merged table with:

- Topic
- Winning current truth
- Conflicting docs
- Risk
- Fix
- Founder decision yes/no
- Suggested implementation slice

## Commands / Evidence Sources Used By Main Codex

Main-thread commands included:

```bash
cat /home/baris/.codex/skills/uprise-skill-router/SKILL.md
git status --short --branch
git rev-parse --short HEAD
git remote -v
sed -n '1,220p' AGENTS.md
sed/nl reads of required docs and active lane docs
rg sweeps for Community, Promotions, Statistics, Print Shop, Registrar, source-dashboard, inactive/pioneer wording
find docs -maxdepth 2 -type f
```

Main-thread docs read or sampled:

- `AGENTS.md`
- `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
- `docs/RUNBOOK.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `docs/architecture/UPRISE_OVERVIEW.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/README.md`
- `docs/specs/README.md`
- `docs/solutions/README.md`
- `docs/handoff/README.md`
- `docs/agent-briefs/README.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`
- `docs/agent-briefs/BUSINESS_MONETIZATION.md`
- `docs/specs/users/onboarding-home-scene-resolution.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/system/edge-cases-and-compliance.md`
- `docs/specs/system/registrar.md`
- `docs/specs/system/documentation-framework.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/seed/README.md`
- `docs/specs/seed/launch-community-city-matrix.json`
- `docs/specs/seed/music-communities.json`
- `docs/blueprints/MULTI_AGENT_DOCUMENTATION_STRATEGY.md`
- `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
- `docs/solutions/AGENT_WIKI_STEERING_R1.md`

Delegated lanes read runtime and test files as needed and reported no edits.

## No-Edit Confirmation

Codex did not edit source/runtime files during the audit.
This handoff file was written only after explicit founder request to save the Codex-side audit for Hermes review.
