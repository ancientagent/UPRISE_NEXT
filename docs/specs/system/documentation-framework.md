# Documentation Framework

**ID:** `DOCS-FRAMEWORK`
**Status:** `active`
**Owner:** `context-steward`
**Last Updated:** `2026-06-26`

## Overview & Purpose

UPRISE is built by multiple agents across product, code, design, QA, and provider lanes. This framework defines how those agents stay aware of what they are building without loading the entire repository history or inventing new product truth.

The goal is a contract-owned, lane-routed documentation system:

- orientation docs explain the platform quickly;
- lane briefs route agents to the right context;
- owner specs hold durable product/runtime contracts;
- operations docs track current execution state without becoming product truth;
- handoffs capture temporary execution history;
- Linear tracks work execution, not product truth;
- the AI stack/lane map summarizes which tool or external agent should handle each task shape;
- reviewers check outputs against owner contracts.

This framework exists to prevent two failure modes:

1. agents lack enough context and build the wrong thing;
2. agents load too much stale context and drift into contradictions or micro-question loops.

## Authority Model

Authority order remains:

1. `AGENTS.md`
2. `docs/canon/**` for doctrine and terminology
3. active specs under `docs/specs/**`
4. founder locks, active execution docs, and `docs/agent-briefs/**`
5. current runtime code and tests
6. dated handoffs under `docs/handoff/**`
7. chat memory, external-agent output, and legacy docs

If a newer active spec/brief intentionally overrides older canon wording, report the override and update routing docs as needed. Do not flatten the conflict by bulk-editing canon.

## Document Layers

### Layer 1: Orientation

Purpose: give every agent a fast, current mental model.

Files:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/README.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`

Rules:

- Keep orientation concise.
- Include current truths, wrong assumptions, and where to load next.
- Do not store detailed edge cases here.
- Link to owner specs instead of duplicating contract detail.

### Layer 2: Lane Briefs

Purpose: route agents by work area.

Files:

- `docs/agent-briefs/*.md`

Rules:

- State the lane's current truth in short form.
- Link the owner contract(s).
- List exact runtime/test files likely touched.
- Include forbidden drift.
- Do not become full product specs.

### Layer 3: Owner Specs

Purpose: hold durable product, runtime, data, and API contracts.

Files:

- `docs/specs/**`

Rules:

- Each cross-system behavior has one owner spec or one clearly named owner section.
- If a founder clarification changes behavior, promote it into the owner spec in the same slice.
- Briefs and handoffs should point to the owner spec instead of repeating the full rule.
- Owner specs include settled questions when repeated misunderstandings occur.

### Layer 4: Handoffs And Audit Artifacts

Purpose: record execution history, reviewer output, and temporary synthesis.

Files:

- `docs/handoff/**`

Rules:

- Handoffs are context, not permanent authority.
- A handoff should say whether accepted truths need promotion to an owner spec.
- Prefer one reconciliation note over parallel memory artifacts.
- After promotion, future agents should load the owner spec first and the handoff only when they need historical evidence.

### Layer 4b: Operations / Active PM

Purpose: show current execution state so agents do not restart stale work, miss active blockers, or load old handoffs before checking the current queue.

Files:

- `docs/operations/ACTIVE_PM.md`

Rules:

- Operations docs are execution state, not product doctrine.
- Keep them short and current: active branch/PR queue, blockers, worktrees to preserve, next execution signal, and validation seed.
- Link to owner specs, handoffs, PRs, and Linear instead of duplicating long reports.
- Refresh when active branch, PR queue, blocker, preserved-worktree list, or next execution signal changes.
- If operations state conflicts with owner specs or runtime evidence, report the conflict and update operations state; do not rewrite product truth from operations notes.

### Layer 4c: Branch / Workspace Registry

Purpose: prevent off-book branches, worktrees, external-agent workspaces, and preserved prototype refs.

Files:

- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`

Rules:

- Branch/worktree/workspace creation is incomplete until the registry has an entry.
- Every entry must state branch name, worktree/path if any, PR/Linear link if any, base/head, status, accountable owner, assigned agents, what is on it, last update date, and closeout plan.
- Update the registry when creating, assigning, pushing, opening a PR, preserving, merging, closing, deleting, or archiving branch/worktree work.
- Run `pnpm run workspace:audit` before push, PR creation, branch cleanup, and closeout. The audit fails on unregistered local branches, worktree branches, and open PR heads.
- Remote-only historical branches may require a dedicated cleanup pass; use `node scripts/workspace-registry.mjs audit --include-remote` to inventory them without making them product truth.
- This registry is execution state, not product doctrine. It should point to owner specs, PRs, handoffs, and Linear instead of duplicating product rules.
- Do not create a follow-up PR solely to mark a just-merged operations/registry refresh PR as merged. GitHub/`gh pr view` is live PR truth; `ACTIVE_PM` and the registry are routing snapshots. Update stale self-closing refresh rows in the next real work branch, or immediately only when stale state would misroute, hide an unsafe branch/worktree, or affect branch cleanup.

### Layer 5: Legacy / External Imports

Purpose: retain reference material without letting it become accidental current truth.

Files:

- `docs/legacy/**`
- raw NotebookLM / external exports staged under `docs/legacy/` or a clearly labeled inventory folder

Rules:

- Never bulk-overwrite `docs/canon/**` from imports.
- Treat external sources as scouting/context until reconciled into owner specs.
- Use imports to find gaps, not to override current contracts.

## Contract Ownership

A rule belongs in an owner contract when it affects more than one system, such as API, UI, data model, source registration, voting, community activation, or agent behavior.

Current owner contracts:

| Contract | Owner Spec |
| --- | --- |
| Music-community preferences, default Home Scene, selector, city move, GPS voting scope | `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract` |
| Identity, roles, capabilities, listener/source separation | `docs/specs/users/identity-roles-capabilities.md` |
| Registrar source/capability workflows | `docs/specs/system/registrar.md` |
| Source registration and source origin | `docs/specs/system/registrar.md#source-origin-contract` |
| Community activation threshold workflow | `docs/specs/communities/scenes-uprises-sects.md#city-tier-activation-workflow` plus `docs/specs/system/registrar.md#city-tier-activation-authority` |
| Sect readiness and Sect Uprise boundary | `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary` plus `docs/specs/system/registrar.md#sect-affiliation-and-motion-authority` |
| Proxy scene music lifecycle and migration | `docs/specs/broadcast/radiyo-and-fair-play.md#proxy-cutover-and-lifecycle-join-points` plus `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract` |
| Activation notification and former-proxy Away Scene preservation | `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract` |
| Plot/Home Scene shell | `docs/specs/communities/plot-and-scene-plot.md` |
| Events/flyers | `docs/specs/events/events-and-flyers.md` |
| Broadcast/Fair Play | `docs/specs/broadcast/radiyo-and-fair-play.md` |
| Release Deck media eligibility | `docs/specs/media/release-deck-and-eligibility.md` |
| Print Shop / promotions boundary | `docs/specs/economy/print-shop-and-promotions.md` |
| Revenue/pricing doctrine | `docs/specs/economy/revenue-and-pricing.md` |
| Documentation/context system | `docs/specs/system/documentation-framework.md` |
| AI stack and agent/tool routing summary | `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` |

Contracts still needing dedicated owner sections or cleanup:

| Needed Contract | Current Best Home | Why It Matters |
| --- | --- | --- |
| Sect implementation artifacts and visibility calibration | `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary` plus `docs/specs/system/registrar.md#sect-affiliation-and-motion-authority` | Boundary is owned; affiliation schema, update channels, approval state machine, visibility timing, and backing limits remain follow-up implementation decisions. |
| Activation notification/Away Scene implementation artifacts | `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract` | User-facing contract is owned; UI placement, notification persistence, and saved-scene storage remain implementation decisions. |
| Music-community preference runtime implementation | `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract` | Persistence, backfill, API, typed web wrappers, expanded listener-profile preference management with unresolved/profile-only labels, Home Scene selector read model, Plot/Home selector consumption, and Fair Play voting across resolvable registered preferences exist; compatibility cleanup is planned and remains implementation work. |

## Lane Agents

Lane agents own work areas, not product truth. Product truth lives in owner contracts.

| Lane Agent | Owns | Default Docs | Common Work |
| --- | --- | --- | --- |
| `uprise-context-steward` | documentation authority, contract ownership, handoff promotion, stale-doc cleanup | this spec, `PLATFORM_START_HERE`, `CONTEXT_ROUTER` | prevent drift; promote accepted decisions to owner specs |
| `uprise-onboarding-home` | onboarding, Home Scene, GPS voting, music-community preferences | `ONBOARDING_HOME_SCENE`, onboarding spec | Home Scene resolution, location authority, profile preference runtime |
| `uprise-registrar-source` | Registrar, source registration, source origin, source dashboard boundaries | `REGISTRAR_GOVERNANCE`, `ARTIST_PROFILE_SOURCE_DASHBOARD`, registrar spec | artist/band/source intake, GPS source gates, source admin separation |
| `uprise-community-activation` | city activation, proxy scenes, community lifecycle | community specs, onboarding spec, registrar spec | music-content and source-diversity activation thresholds, proxy cutover |
| `uprise-fairplay-broadcast` | RADIYO, voting, rotation, tier propagation | `ACTIONS_AND_SIGNALS`, broadcast/Fair Play spec | action grammar, votes, Fair Play, tier lifecycle |
| `uprise-media-release` | Release Deck, media limits, upload/transcode boundaries | Release Deck media spec, artist/source brief, media/storage decision docs | song limits, active rotation eligibility, deferred media pipeline |
| `uprise-events-archive` | Events, Archive, flyers, descriptive history | `EVENTS_ARCHIVE`, event specs | prevent Statistics/Promotions drift, event read/write boundaries |
| `uprise-sects-governance` | sect affiliation, official sects, Sect Uprises | Registrar/community sect specs | sect readiness, official status, Uprise threshold |
| `uprise-business-later` | monetization doctrine and deferred boundaries | `BUSINESS_MONETIZATION`, economy specs | prevent premature billing/promotions/analytics implementation |
| `uprise-design-ui` | screen hierarchy, visual handoffs, design-agent prompts | `UI_CURRENT`, relevant owner specs | Claude/Stitch/Uizard/v0 prompts, screen states, visual direction |
| `uprise-infra-hosting` | Vercel/Fly/Neon/provider deployment and smokes | Heavy Authority Pack, deploy env docs | hosted stack readiness, env, CI, smoke scripts |

A lane agent may propose changes, but Codex or the current implementation owner must reconcile cross-lane impacts before merge.

For concise tool-to-lane routing across Codex local, Cloud Codex, Hermes, Abacus / Agent Swarm, NotebookLM, design tools, Linear, and generated wikis, use `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`.

## Linear Execution Model

Linear tracks execution. It does not replace repo docs.

Use Linear for:

- issue queue;
- lane labels;
- priority and blockers;
- owner assignment;
- PR/commit links;
- validation evidence;
- status tracking.

Do not use Linear for:

- product canon;
- final founder decisions;
- detailed durable specs;
- replacing owner contracts.

Recommended project structure:

- `UPRISE Phase 1: Contract System + Launch Readiness`
- later phases can cover runtime parity, source/Registrar, Fair Play, media, design, and monetization.

Recommended labels:

- `lane:context-steward`
- `lane:onboarding-home`
- `lane:registrar-source`
- `lane:community-activation`
- `lane:fairplay-broadcast`
- `lane:media-release`
- `lane:events-archive`
- `lane:sects-governance`
- `lane:business-later`
- `lane:design-ui`
- `lane:infra-hosting`
- `type:bug`
- `type:stale`
- `type:environment`
- `type:fixture-data`
- `type:product-decision`
- `type:docs-cleanup`
- `type:runtime-cleanup`

Issue template:

```md
## Lane
<lane name>

## Owner Contract
<docs/specs/... path and section>

## Problem
<what is unclear, missing, stale, or not implemented>

## Scope
Do:
- ...

Do not:
- ...

## Acceptance Criteria
- ...

## Validation
- pnpm run docs:lint
- pnpm --filter <pkg> test -- <targeted tests>
- pnpm --filter <pkg> typecheck

## Docs Required
- docs/CHANGELOG.md
- owner spec if behavior changes
- dated handoff if multi-step

## Founder Decision Required
yes/no
```

### Execution Packet Blocks

Use the following blocks for significant/risky issues, cross-lane cleanup, provider/db/schema/canon/doc-authority work, or external-agent handoffs. They are optional for tiny surgical docs-only or local cleanup PRs when the branch owner can prove the scope is low-risk.

Linear may track these fields as execution state, but it does not become product truth. Durable product/canon/API/runtime rules still belong in owner specs under `docs/specs/**`.

UPRISE is still implementing many first-pass platform features. Do not assume every issue is a cleanup of already-built behavior. For first-pass implementation, use `Feature / Behavior Scope`, `Repo-Aspects To Verify`, and `Development Plan` to define what should be built from owner-spec truth. Set `Source Drift / Behavior To Correct` and `source_drift_or_bug_identified` to `not_applicable` when there is no broken source behavior to remove. Use the heavier cleanup/excavation framing only when the issue is explicitly about stale code, wrong existing behavior, refactor cleanup, branch absorption, or legacy/workaround removal.

#### Execution Packet

```md
## Execution Packet
Lane:
Owner Contract:
Starting Branch / HEAD:
Must Read:
Do Not Read By Default:
Source Drift / Behavior To Correct:
Feature / Behavior Scope:
Repo-Aspects To Verify:
Development Plan:
Plan Review:
Files Likely Touched:
Tests / Validation Seed:
Expansion Conditions:
Stop Conditions:
Branch Owner:
Subagent Use:
```

#### Executor Readiness

```md
## Executor Readiness
issue_active: yes/no
branch_verified: yes/no
owner_contract_identified: yes/no
source_drift_or_bug_identified: yes/no/not_applicable
feature_reviewed_against_repo: yes/no/not_applicable
development_plan_written: yes/no/not_applicable
development_plan_reviewed_by_codex: yes/no/not_required
files_and_tests_clear: yes/no
risk_impacts_named: yes/no
provider_or_db_risk: yes/no
ready_for_executor: yes/no
blockers:
```

#### Closeout Contract

```md
## Closeout Contract
executor_completed: yes/no
tests_passed: yes/no
reviewer_required: yes/no
reviewer_passed: yes/no/not_required
qa_required: yes/no
qa_passed: yes/no/not_required
drift_source_corrected_or_quarantined: yes/no/not_applicable
owner_spec_changed: yes/no
owner_spec_verified: yes/no/not_required
docs_handoff_required: yes/no
docs_handoff_done: yes/no/not_required
changelog_required: yes/no
changelog_done: yes/no/not_required
provider_state_touched: yes/no
provider_identity_verified: yes/no/not_required
schema_or_migration_touched: yes/no
schema_or_migration_verified: yes/no/not_required
linear_ready_to_close: yes/no
blockers:
next_signal:
```

Do not require `reviewer_passed` or `qa_passed` for every PR. Use `reviewer_required` and `qa_required` to make those gates explicit only when the work needs them.

For feature implementation or behavior-changing UI/API/runtime work, `ready_for_executor` must stay `no` until the executor has reviewed the feature against current repo authority and an independent Codex reviewer has reviewed the development plan. The feature review should cover the owner spec, lane brief, relevant runtime/code paths, tests, current founder-session notes or handoffs when directly cited, and known out-of-scope/deferred boundaries. The plan review should happen before implementation edits, should be recorded in the packet or handoff, and should identify missing context, stale assumptions, risky impacts, and validation gaps. Use `gpt-5.3-codex-spark` for small/medium plan sanity checks and `gpt-5.5` with `reasoning_effort=xhigh` for complex, cross-lane, schema/provider/security/canon, or high-impact plans.

#### Feature Implementation Loop

For each feature or behavior-changing implementation issue, use a fresh executor context for the planning pass:

1. The PM/current owner selects the next implementation issue and prepares the executor context packet: lane, owner contract, required docs, likely files, known runtime/tests to inspect, validation seed, out-of-scope boundaries, and stop conditions.
2. The assigned executor starts from that context packet, then gathers the necessary current repo evidence from the owner spec, lane brief, relevant runtime/code paths, tests, and directly cited founder-session notes or handoffs.
3. The executor writes an execution plan that states the current written contract, what will change, what must not change, files/tests expected, risk points, unresolved questions, and any correction needed to the packet.
4. The plan is confirmed or corrected before implementation edits begin. If founder clarification is needed, stop and record the confirmed answer in the owner spec or appropriate founder-session/handoff path.
5. An independent Codex reviewer checks the plan against repo authority. If it fails, return the issue to the executor for correction before any implementation edits.
6. The same branch-owning executor implements the accepted plan.
7. An independent reviewer checks the completed execution against the plan, owner specs, runtime evidence, and validation output. If it fails, return it to the executor with concrete findings; do not merge or close the issue.

This loop prevents an executor from implementing from a thin Linear/chat summary when the current written contract would change the work. It is required for behavior-changing work and optional for tiny surgical docs-only or local cleanup PRs where the branch owner can prove low risk.

This pre-implementation plan review is not required for tiny surgical docs-only or local cleanup PRs when no product/runtime behavior is being implemented and the branch owner can prove the scope is low-risk. If a docs-only change promotes product truth, changes owner-spec authority, or enables later implementation work, treat it as doc-authority work and use the review gate.

Set `reviewer_required: yes` for large refactors, complex issues, broad
branch/worktree cleanup, or branch-absorption decisions where stale-looking work
may still contain valuable product/spec/runtime content. The reviewer/auditor
must classify branch content before merge/delete decisions using practical
classes such as absorbed, superseded, extract-only, preserve-only, and unsafe to
merge wholesale. Tiny surgical docs-only or local cleanup PRs may keep
`reviewer_required: no` when the branch owner can prove low risk.

## Handoff Promotion Rule

When a handoff contains a founder clarification or accepted reviewer finding:

1. Identify the owner spec.
2. Promote the durable rule into that owner spec.
3. Patch the relevant lane brief with a short pointer if agents in that lane need it.
4. Add/adjust tests when behavior is runtime-visible.
5. Update `docs/CHANGELOG.md`.
6. Leave the handoff as historical evidence.

Do not scatter the same rule across many docs. Put the full rule in the owner spec and short summaries/pointers elsewhere.

## Question Discipline

Ask founder questions only when the answer changes one or more of:

- data model;
- API contract;
- runtime behavior;
- voting/authority;
- source ownership;
- activation workflow;
- launch scope;
- cross-lane documentation authority.

Do not ask if the question only changes:

- wording;
- UI microcopy;
- a small visual control detail;
- an already-settled owner contract.

For clarification sessions:

1. State the documented assumption.
2. Explain why it affects multiple systems.
3. Ask exactly one question.
4. If answered, patch the owner spec or backlog it explicitly.

## Reviewer Routing

Use reviewers as second-pass checks, not source of truth. Codex subagents are the default UPRISE review/audit lane.

- `gpt-5.3-codex-spark`: basic/small review or audit, including docs drift, stale branch checks, changed-file sanity, PM packet checks, low-risk UI/test/docs PRs, and test-output summaries.
- `gpt-5.5` with `reasoning_effort=xhigh`: heavy/final review or audit for high-impact merges, branch deletion, schema/provider/database/security/canon/owner-spec changes, broad cleanup audits, closeout gates, and any review whose result can approve/block action.
- `uprisewatchdog`: Hermes heartbeat/wake-up checks only. It may report stalled or missing outputs, but it does not approve merges, closeout, branch deletion, or product truth.
- `uprisereviewer+`, `uprisereviewer-`, `upriseauditor+`, `upriseauditor-`: Hermes manual fallback/advisory profiles only when explicitly assigned.
- Cloud Codex / OpenClaw / Abacus: scoped implementation/audit/design support when the repo and branch are available.

Linear tracks execution state only. Durable product/canon/API/runtime truth remains in owner specs and current repo docs/code/tests. Product ambiguity stops for founder clarification, then the answer must be recorded in the owner spec, founder-session note, handoff, or backlog item named by the task.

For large refactors, complex issues, prototype/reference branches, and branch
cleanup where absorption is uncertain, run an independent reviewer/auditor pass
before merge/delete decisions. Route that gate to Codex by default: use
`gpt-5.3-codex-spark` for preliminary branch evidence and `gpt-5.5` with
`reasoning_effort=xhigh` when the result can decide merge, deletion, absorption,
provider/database risk, owner-spec promotion, or closeout. The review should
classify what is already on current `main`, what should be extracted into a fresh
branch, what is stale, and what must remain preserve-only.

Reviewer prompts must include:

- branch/commit;
- docs to load;
- owner contract path;
- exact model routing and whether the pass is basic/small or heavy/final;
- exact scope;
- no-edit/no-provider/no-DB boundaries unless edits/actions are intended;
- output format.

## Acceptance Tests / Test Plan

Documentation-system slices must run:

- `pnpm run docs:lint`
- `git diff --check`

Branch/workspace management slices must also run:

- `pnpm run workspace:audit`

When changing agent routing or context policy, also inspect:

- `AGENTS.md`
- `docs/README.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- relevant lane brief(s)

## Current Initial Issues

Seed these as Linear or repo-tracked work items when ready:

Recently completed owner-contract seeds: source registration/source origin (Slice 1), community activation workflow around music-content and source-diversity thresholds (Slice 1), proxy scene music lifecycle and migration (Slice 2), and Fair Play / proxy vote / tier propagation join points (Slice 2). Runtime source-origin persistence on Registrar/ArtistBand, admin activation readiness diagnostics, an authenticated manual activation trigger, and minimal source/listener re-rooting are also implemented.

1. Define activation notification UI/persistence and former-proxy saved Away Scene implementation artifacts after the user contract.
2. Define sect implementation artifacts and visibility calibration after the Sect readiness / Sect Uprise boundary owner sections.
3. Implement the Music-Community Preference compatibility cleanup plan after read paths are inverted to prefer `UserMusicCommunityPreference.isDefault` with safe fallback.

## References

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/README.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/specs/README.md`
- `docs/handoff/README.md`
- `docs/handoff/2026-06-25_hermes-reviewer-clarification-handoff.md`
