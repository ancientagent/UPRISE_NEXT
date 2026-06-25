# Documentation Framework

**ID:** `DOCS-FRAMEWORK`
**Status:** `active`
**Owner:** `context-steward`
**Last Updated:** `2026-06-25`

## Overview & Purpose

UPRISE is built by multiple agents across product, code, design, QA, and provider lanes. This framework defines how those agents stay aware of what they are building without loading the entire repository history or inventing new product truth.

The goal is a contract-owned, lane-routed documentation system:

- orientation docs explain the platform quickly;
- lane briefs route agents to the right context;
- owner specs hold durable product/runtime contracts;
- handoffs capture temporary execution history;
- Linear tracks work execution, not product truth;
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
| Music-community preferences, default Home Scene, roller, city move, GPS voting scope | `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract` |
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

Contracts still needing dedicated owner sections or cleanup:

| Needed Contract | Current Best Home | Why It Matters |
| --- | --- | --- |
| Release Deck replacement and song-length cleanup | `docs/specs/media/release-deck-and-eligibility.md` | Active slot and 20-minute caps are owned/enforced; replacement UX and any per-song length cap still need a follow-up decision. |
| Sect implementation artifacts and visibility calibration | `docs/specs/communities/scenes-uprises-sects.md#sect-readiness-and-sect-uprise-boundary` plus `docs/specs/system/registrar.md#sect-affiliation-and-motion-authority` | Boundary is owned; affiliation schema, update channels, approval state machine, visibility timing, and backing limits remain follow-up implementation decisions. |
| Activation notification/Away Scene implementation artifacts | `docs/specs/users/onboarding-home-scene-resolution.md#proxy-to-natural-cutover-user-contract` | User-facing contract is owned; UI placement, notification persistence, and saved-scene storage remain implementation decisions. |
| Music-community preference runtime implementation | `docs/specs/users/onboarding-home-scene-resolution.md#music-community-preference-contract` | Persistence, backfill, API, typed web wrappers, and Home Scene roller read model exist; profile UI, Plot/Home roller consumption, unresolved-profile visibility, GPS voting scope across resolvable preferences, and compatibility cleanup remain implementation work. |

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

Use reviewers as second-pass checks, not source of truth.

- `uprisereviewer`: narrow review of a named slice, contract, PR, or post-clarification state.
- `upriseauditor`: broad drift audit across docs/code/strategy.
- Cloud Codex / OpenClaw / Abacus: scoped implementation/audit/design support when the repo and branch are available.

Reviewer prompts must include:

- branch/commit;
- docs to load;
- owner contract path;
- exact scope;
- no-edit/no-provider/no-DB boundaries unless edits/actions are intended;
- output format.

## Acceptance Tests / Test Plan

Documentation-system slices must run:

- `pnpm run docs:lint`
- `git diff --check`

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
2. Define remaining Release Deck replacement behavior and any explicit per-song length cap.
3. Define sect implementation artifacts and visibility calibration after the Sect readiness / Sect Uprise boundary owner sections.
4. Continue Music-Community Preference runtime parity: profile UI, Plot/Home roller consumption, unresolved-profile visibility outside the roller, GPS voting scope across resolvable registered preferences, and migration cleanup after the new preference model is fully adopted.

## References

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/README.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/specs/README.md`
- `docs/handoff/README.md`
- `docs/handoff/2026-06-25_hermes-reviewer-clarification-handoff.md`
