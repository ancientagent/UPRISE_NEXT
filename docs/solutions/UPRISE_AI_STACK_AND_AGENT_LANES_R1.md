# UPRISE AI Stack And Agent Lanes R1

Status: active
Owner: context-steward
Last Updated: 2026-08-16

## Purpose

This document is the concise routing map for UPRISE AI tools, agent lanes, and external-assistant workflows.

Use it when deciding which agent/tool should handle a task, how to prompt that tool, and where the output should be reconciled back into the repo.

This document is not product doctrine. It does not replace `AGENTS.md`, canon, owner specs, lane briefs, runtime code, or tests. It summarizes how to use the AI stack without letting external tools become authority.

## Authority Reminder

Authority order remains:

1. `AGENTS.md`
2. `docs/canon/**` for doctrine and terminology
3. active owner specs under `docs/specs/**`
4. active `docs/agent-briefs/**` and founder locks / solution docs linked by those briefs
5. current runtime code and tests
6. dated handoffs under `docs/handoff/**`
7. chat memory, external-agent output, generated wikis, NotebookLM output, and legacy docs

If external output conflicts with current repo authority, classify it as scouting input and reconcile it into the owner spec only after review.

## Fast Routing Rule

Route by lane first, tool second.

1. Identify the focus lane in `docs/agent-briefs/CONTEXT_ROUTER.md`.
2. If the task depends on current execution state, check `docs/operations/ACTIVE_PM.md` for active branch, PR queue, blockers, worktrees to preserve, and next signal.
3. Load the lane brief and owner spec named by that lane.
4. Pick the tool whose strength matches the task shape.
5. Require branch/commit evidence, exact scope, stop conditions, and validation evidence.
6. Promote accepted decisions into owner specs, not only handoffs or chat memory.

## Local Codex Skill Loading Rule

Use local Codex skills as conditional aids, not as a mandatory loading chain.

- Do not load `uprise-skill-router` merely because the workspace is UPRISE. Use it when tool, lane, external-agent, provider/browser, review, or branch-routing choices are unclear.
- Do not chain `uprise-skill-router` -> `uprise-lane-loader` -> multiple lane briefs for exact-file edits, simple Q&A, or already-scoped docs work.
- For exact-file or exact-spec tasks, start with `AGENTS.md`, the named file, direct references from that file, and current repo evidence.
- For non-trivial behavior-changing work, use the execution packet and independent Codex plan-review loop instead of trying to solve context uncertainty by loading more skills.
- Founder-session and clarification-capture skills are required when material founder wording or product truth could be lost, but they should not create new notes for routine confirmations or rules already settled in owner specs.

Repo-controlled snapshots of durable UPRISE local skill changes live under
`docs/solutions/codex-skills/`. When a local UPRISE skill change should become
team behavior, update that snapshot folder in the same branch so another agent
or machine can refresh `/home/baris/.codex/skills/` without relying on chat
memory.

For broad/noisy routing skills, prefer `agents/openai.yaml` with
`policy.allow_implicit_invocation: false` so the skill remains explicitly
available without auto-triggering during routine work.

When dispatching subagents, use `uprise-lane-loader` as the compact skill-sharing map. Give each subagent one lane, named files/docs, and at most 1-3 skills relevant to that lane; do not forward the full skill catalog.

## Tool Stack

| Tool / Agent | Best Use | Avoid Using For | Required Output |
| --- | --- | --- | --- |
| Codex local | Tightly coupled implementation, docs patches, validation, commits, PR coordination | broad unsupervised rewrites, provider mutation without explicit approval | changed files, tests run, branch/commit state, handoff when multi-step |
| Cloud Codex | Isolated branch work, focused implementation slices, large repo scans, contract hardening, repo-only audit branches | tasks needing live local browser sessions or local provider auth state | branch, commit, files changed, tests, PR or patch |
| Hermes `uprise` | default HY3 planning, narrow execution packets, classification | code execution, provider/database/browser work | packet with authority, scope, stop conditions, validation seed |
| Hermes `uprisereviewerminus` | default HY3 bounded plan/requirement-to-result review | code edits, open-ended repo archaeology, automatic merge approval | pass/fail findings tied to commit, authority, and validation |
| Hermes `upriseauditorminus` | default HY3 read-only drift, branch, contract, and evidence audits | code edits, self-remediation, automatic merge/deletion approval | classified evidence and a next signal |
| Hermes `uprisewatchdog` | cheap HY3 heartbeat for stalled/missing work | review gates, edits, provider/database/browser work | current state and one next signal |
| Hermes `uprisedeepscout` / `uprisedeepcoder` | optional DeepSeek dependency map / benchmarked sole coding slice | automatic final gate, unsupervised cross-lane work | bounded report or tested patch, always independently reviewed |
| Abacus / Agent Swarm | Complex cross-lane mapping with independent worker lanes, decision packets, architecture scouting | one tightly coupled implementation slice, source of final product truth | lane findings, synthesis, provenance, owner-spec patch recommendations |
| NotebookLM | External memory over large source packs, philosophical/doctrine comparison, source-list exploration | direct implementation, deciding current runtime truth | claims inventory, gap list, source map, current-vs-historical caveats |
| Design tools: Claude Designer, Stitch, Gemini, Uizard, v0 | visual exploration, mockups, screen hierarchy options, UI direction | redefining action grammar, product surfaces, data contracts, or runtime architecture | annotated design options tied to current lane brief and constraints |
| Linear | execution queue, owner assignment, blockers, status, PR/commit links | product canon, durable specs, final founder decisions | issue with lane, owner contract, scope, acceptance criteria, validation |
| Active PM doc | current branch/PR/worktree/blocker snapshot and next execution signal | product doctrine, final decisions, detailed specs, replacing Linear | short state update linked to owner specs, handoffs, PRs, and Linear |
| Branch / Workspace Registry | branch, worktree, PR head, preserved prototype, and external-agent workspace ownership | product doctrine, detailed specs, replacing Linear/PM status | branch/path/status/owner/agents/scope/base/head/closeout entry and `workspace:audit` evidence |
| Generated wiki / Devin / DeepWiki | navigation map, file discovery, orientation aid | authority, doctrine, current MVP truth without verification | map references back to repo files and owner specs |

## Lane Agents

Lane agents own work areas, not product truth. Product truth lives in owner specs.

| Lane Agent | Use For | Owner / Default Docs |
| --- | --- | --- |
| `uprise-context-steward` | documentation authority, contract ownership, stale-doc cleanup, handoff promotion | `docs/specs/system/documentation-framework.md`, `docs/PLATFORM_START_HERE.md`, `docs/agent-briefs/CONTEXT_ROUTER.md` |
| `uprise-onboarding-home` | onboarding, Home Scene, GPS voting, music-community preferences | `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`, onboarding spec |
| `uprise-registrar-source` | Registrar, source registration, source origin, source dashboard boundaries | `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`, `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`, registrar spec |
| `uprise-community-activation` | city activation, proxy scenes, community lifecycle | community specs, onboarding spec, registrar spec |
| `uprise-fairplay-broadcast` | RADIYO, voting, rotation, tier propagation | `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`, broadcast/Fair Play spec |
| `uprise-media-release` | Release Deck, media limits, upload/transcode boundaries | Release Deck media spec, artist/source brief, media/storage decision docs |
| `uprise-events-archive` | Events, Archive, flyers, descriptive history | `docs/agent-briefs/EVENTS_ARCHIVE.md`, event specs |
| `uprise-sects-governance` | listener Sect requests, Artist/Band Sect membership, legitimate/active Sects | Registrar/community sect specs |
| `uprise-business-later` | monetization doctrine and deferred boundaries | `docs/agent-briefs/BUSINESS_MONETIZATION.md`, economy specs |
| `uprise-design-ui` | screen hierarchy, visual handoffs, design-agent prompts | `docs/agent-briefs/UI_CURRENT.md`, relevant owner specs |
| `uprise-infra-hosting` | Vercel/Fly/Neon/provider deployment and smoke checks | Heavy Authority Pack, deploy env docs |

Use `docs/specs/system/documentation-framework.md#lane-agents` as the owner source for lane definitions.

## Use / Do Not Use Matrix

Use Codex local or Cloud Codex when:

- a branch needs implementation, tests, docs, and PR-ready validation;
- a scoped docs patch needs exact repo edits;
- a runtime behavior must be verified against code/tests.
- a routine audit/review can be handled from current repo docs, changed files, test output, and issue packets without Hermes profile memory.

Use fresh HY3 `uprisereviewerminus` when:

- a PR, commit, or launch slice needs a second-pass read-only review;
- the output should be concrete findings and recommendations;
- the task is narrow enough that broad audit context would create noise;
- the task has named owner docs, code/test evidence, and a bounded review target.

Use fresh HY3 `upriseauditorminus` when:

- the task is a broad drift audit across docs/specs/runtime;
- the goal is to classify gaps, stale language, and missing owner contracts;
- no edits should be made during the pass;
- the task must classify gaps, stale language, owner-contract drift, or branch evidence without edits.

## HY3 Automation Review Rule

Current default model:

- Fresh HY3 Hermes profiles handle non-coding planning, review, audit, and watchdog work.
- Codex or an explicitly assigned coding model handles implementation under the one-writer rule.
- DeepSeek profiles are optional, bounded, and benchmarked before they become a regular coding path.
- `/clear` starts a fresh Hermes session and is not a mid-task context compactor.
- Linear tracks execution state only; durable truth stays in owner specs/current repo docs/code/tests.
- Product ambiguity stops for founder clarification, then the answer is recorded in the appropriate owner doc or handoff/backlog.

## Lean PR Path

Default UPRISE development should optimize for shipping correct scoped work, not process ceremony:

1. implement the scoped change from current repo authority;
2. run focused validation for the touched code/docs;
3. update required docs/changelog/handoff only;
4. open/update the PR with required metadata;
5. enable auto-merge or merge once checks pass.

Use one bounded independent review pass for behavior-changing work when it materially reduces risk. Default to HY3 for that pass. Do not stack multiple reviewers, repeated plan loops, branch-registry head-chasing commits, or follow-up operations PRs for small/medium slices unless a real blocker or safety risk appears. Poll CI once or enable auto-merge; do not babysit pending checks unless they fail or the user is explicitly waiting on the deploy result.

Escalate to a separately assigned large-scope reviewer only for high-impact runtime changes, complex cross-lane work, provider/db/schema/security/canon/doc-authority changes, branch absorption, broad cleanup, or failed checks. Tiny docs-only/local cleanup PRs can skip independent review when low risk is proven.

Ordinary non-coding audits and reviews are HY3-first. Use `upriseauditorminus` for branch diffs, stale/fixed-work checks, contract drift, and evidence gathering; use `uprisereviewerminus` for packet sanity, changed-file review, test-output summaries, and completed-slice verification. Codex remains the local implementation and reconciliation owner. A reviewer verdict never bypasses required checks or human/codeowner merge approval.

PM should choose the lightest assigned agent/profile that protects the task:

| Task class | Preferred Codex model | Examples |
| --- | --- | --- |
| Bounded non-coding plan review | `uprisereviewerminus` (HY3) | Packet/acceptance review, changed-file requirement check, validation-evidence review |
| Read-only evidence or drift audit | `upriseauditorminus` (HY3) | Docs/runtime drift, stale/fixed-work, branch classification, current-state reconciliation |
| Heartbeat only | `uprisewatchdog` (HY3) | Stalled/missing output or PM/registry/git state |
| Large-scope independent critique | explicitly assigned Codex or Claude Opus task mode | Cross-lane architecture or risk a bounded HY3 packet cannot safely settle |

Escalate beyond HY3 only when PM names the reason and the packet explains why a
bounded HY3 pass cannot safely answer it. Claude Opus and other heavyweight
models are exceptional task modes, not default routing.

## Screen Package Workflow

Use `docs/screen-packages/**` only when a whole page/module, major screen, or flow needs a shared execution workspace to prevent drift. Do not use the package workflow for minor UI edits, component tweaks, copy changes, or isolated cleanup. Do not treat a package as permission to create mandatory Dev Spec, Design Spec, review, art, hardening, or closeout artifacts for every slice.

Default shape:

1. Pick one small vertical screen section or behavior.
2. Verify branch/HEAD, owner spec, lane brief, likely runtime files, likely tests, out-of-scope boundaries, and branch/workspace registry state.
3. Use the package seed (`README.md`, `instruction-packet.md`, `source-map.md`) as the shared context. If the slice is still ambiguous, create one short `implementation/slice-contract.md`.
4. Implement with one branch-owning executor. Subagents are sidecars only: bounded research, product design, or review. They do not own competing branches or edit the same files.
5. Add focused validation and only the docs/changelog/handoff updates the slice actually requires.
6. Run one bounded independent review when behavior or risk justifies it. Use fresh HY3 by default; name a different reviewer only when the risk cannot be safely bounded for HY3.

Optional artifacts are risk-triggered, not automatic:

- `spec/dev-spec.md` when a technical trace beyond the slice contract is needed.
- `design-spec/ux-plan.md` when visual/product-design direction is needed.
- `review/spec-package-review.md` when Dev/Design artifacts both exist and need a package gate.
- `art-handoff/creative-brief.md` only after the user approves visual/art direction.
- `review/implementation-integration-review.md` and `hardening/closeout.md` only for large or risky integrated work.

Durable truth stays in `docs/specs/**`. Screen-package artifacts are execution history that link to owner specs, lane briefs, runtime files, tests, handoffs, and art references. Accepted product decisions must be promoted back to owner specs before package closeout.

Use `pnpm run screen-package:flow -- status --package <slug>` to inspect package seed state and optional artifacts. Use `pnpm run screen-package:flow -- next --package <slug> --write` only when a slice contract would help. The runner is deterministic and file-based; it inventories the workspace, not a mandatory gate ladder.

Do not spend broad or duplicate review runs on routine work. HY3 profiles are the
normal UPRISE automation lane; retain one bounded reviewer/auditor pass rather
than stacking agents. If HY3 is unavailable or a packet cannot be safely
bounded, classify that as an infrastructure/scope blocker and assign a specific
alternative task mode.

## Hermes Watchdog Rule

Use `uprisewatchdog` for PM heartbeat checks only. It should run the lowest-cost configured Hermes model, use the minimal `hermes-cli` toolset, and keep prompts bounded to repo/git/branch state, PM artifacts, worker logs, PR state, and expected handoff paths.

`uprisewatchdog` may wake the right coding writer or explicitly assigned
specialist lane, and may report blocked/stalled/missing agents back to PM. It
must not perform review/audit gates, approve merge readiness, mutate Linear,
edit repo files, inspect secrets, browse provider dashboards, or load broad
optional toolsets. If a heartbeat check reveals review work, route it to the
fresh HY3 reviewer or auditor profile.

## Hermes Profile Rule

Use the current curated profiles from `docs/AGENT_TOOLING.md`:

| Task | Profile | Boundary |
| --- | --- | --- |
| planning / packet creation | `uprise` | no implementation edits unless explicitly reassigned as the sole writer |
| bounded review | `uprisereviewerminus` | read-only; verify a fixed target and return findings |
| authority / drift / branch audit | `upriseauditorminus` | read-only; classify evidence, do not remediate |
| stalled-work heartbeat | `uprisewatchdog` | status only; never a review gate |
| optional dependency map / coding experiment | `uprisedeepscout` / `uprisedeepcoder` | bounded and independently reviewed |

Hermes results are inputs for PM/Codex, not automatic approvals. They cannot independently approve safety, merge, branch deletion, product truth, provider changes, database changes, or closeout.

Before every new Hermes review/audit packet, prefer a fresh one-shot worker. In a persistent Hermes chat, `/clear` clears the screen and starts a new session by discarding conversation history; it is not a mid-task context compactor. Keep context only when the same Hermes profile is intentionally continuing one larger sequential investigation and the prompt says so. Then include repo path, branch, short HEAD, lane, owner spec, changed files/artifacts, expected profile, and a requirement to verify repo state before reviewing.

Hermes just shortcuts:

```bash
just hermes-watchdog path/to/prompt.md
just hermes-review-heavy path/to/prompt.md
just hermes-review-basic path/to/prompt.md
just hermes-audit-heavy path/to/prompt.md
just hermes-audit-basic path/to/prompt.md
```

Use fresh one-shot Hermes calls for planning, review, audit, and watchdog work.
The older `just hermes-*` recipes may remain as compatibility wrappers but do
not define routing. A review result still never bypasses required checks or
human/codeowner merge approval.

Prompts should direct Hermes to use bounded subagents or an agent swarm when independent read-only slices can lower context, wall time, or model cost. Each subagent must get one lane, named docs/files, no edits, no secrets, no provider mutation, no branch deletion, and a concise output cap. Preserve disagreements in the synthesis instead of averaging them away.

Use Abacus / Agent Swarm when:

- work naturally splits into independent lanes;
- each lane can produce findings without shared mutable state;
- the desired output is architecture strategy, decision packets, or cross-lane mapping.

Use NotebookLM when:

- the user has a large source pack or historical notebook;
- the task is source-list reconciliation, doctrine comparison, or claims extraction;
- a coding agent will later verify claims against current repo authority.

Use design tools when:

- the task is visual exploration or screen option generation;
- product rules are already provided from active briefs/specs;
- the result will be reviewed before implementation.

Do not use external tools to:

- invent product rules;
- bulk-rewrite canon;
- make provider/env/database changes;
- decide current runtime truth without current repo/code evidence;
- implement one-off behavior for a city, music community, artist, source, or fixture.

## Prompt Contract For External Agents

Every substantive external-agent prompt should include:

- repo URL or local path;
- starting branch and expected HEAD, or instructions to stop if mismatched;
- active lane and required docs to read;
- owner spec path for any durable behavior;
- exact scope and out-of-scope items;
- edit mode or read-only mode;
- provider/env/database safety boundary;
- classification scheme for findings;
- validation commands expected;
- required final output format.

For implementation prompts, also require:

- branch name;
- repo-grounded feature review scope before edits;
- development plan reviewed by an independent designated reviewer before execution when behavior/risk justifies it;
- tests to run;
- `docs/CHANGELOG.md` update when product/docs behavior changes;
- dated handoff for multi-step work;
- no direct `main` edits.

For significant/risky implementation, cross-lane cleanup, provider/db/schema/canon/doc-authority work, or external-agent handoffs, include or request the three execution blocks from `docs/specs/system/documentation-framework.md`:

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

## Executor Readiness
issue_active: yes/no
branch_verified: yes/no
owner_contract_identified: yes/no
source_drift_or_bug_identified: yes/no/not_applicable
feature_reviewed_against_repo: yes/no/not_applicable
development_plan_written: yes/no/not_applicable
development_plan_reviewed: yes/no/not_required
files_and_tests_clear: yes/no
risk_impacts_named: yes/no
provider_or_db_risk: yes/no
ready_for_executor: yes/no
blockers:

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

These blocks are optional for tiny surgical docs-only or local cleanup PRs where the branch owner can prove the scope is low-risk. Do not create per-issue context-packet files by default and do not introduce a separate PM harness from these blocks.

UPRISE is not in the same operating posture as projects where most work is cleanup of already-implemented flows. Many UPRISE issues are first-pass feature slices. For those, the packet should point to the repo owner spec, active lane brief, exact code surfaces to inspect, validation seed, and out-of-scope boundaries. Do not force a source-behavior-removal or excavator model unless the issue is actually stale-code cleanup, wrong existing behavior, refactor/absorption work, or a risky cross-lane correction. Linear should carry the packet and repo links for clean execution context; it should not become the durable product/canon source.

For feature implementation or behavior-changing UI/API/runtime work, the executor must review the feature against current repo authority before implementation edits. Use one independent HY3 plan review when the slice changes behavior or carries meaningful risk; skip it for tiny docs-only/local cleanup when low risk is proven. The feature review must include the owner spec, lane brief, relevant runtime/code paths, tests, directly relevant founder-session notes or handoffs, deferred/out-of-scope boundaries, and validation seed. Use fresh `uprisereviewerminus` unless the packet explicitly assigns a different large-scope reviewer. Record the reviewer/model/artifact in `Plan Review` or the dated handoff when a reviewer is used.

Use the feature implementation loop from `docs/specs/system/documentation-framework.md#feature-implementation-loop` for behavior-changing work:

1. PM/current owner selects the next issue and gives the assigned executor a context packet with lane, owner contract, required docs, likely files, known runtime/tests to inspect, validation seed, out-of-scope boundaries, and stop conditions.
2. A fresh executor agent/session starts from that packet, verifies it against current repo evidence, and writes the execution plan from docs/code/tests, not from chat or Linear alone.
3. The plan is confirmed/corrected before edits; founder ambiguity stops for clarification and repo-visible capture.
4. When risk justifies it, an independent reviewer checks the plan before implementation.
5. The same branch-owning executor implements the accepted plan.
6. When reviewer gates are required, an independent reviewer checks the completed execution and either passes it or returns concrete findings to the executor.

This is not a new PM harness and does not require per-issue packet files. It is the default behavior-changing feature workflow; tiny docs-only/local cleanup PRs can skip it when low risk is proven.

For large refactors, complex issues, broad branch/worktree cleanup, or any
branch-absorption decision where valuable product/spec/runtime content may be
hidden in stale-looking work, require an independent reviewer/auditor pass
before merge/delete decisions. Use fresh HY3 `upriseauditorminus` or
`uprisereviewerminus` by default; assign a different large-scope reviewer only
when the packet states why HY3 cannot safely answer it. The review
should classify content as absorbed, superseded, extract-only, preserve-only, or
unsafe to merge before cleanup.

## Linear Role

Linear tracks execution, not truth.

Use Linear issues to record:

- lane label;
- owner contract path;
- problem statement;
- scope boundaries;
- acceptance criteria;
- validation commands;
- PR/commit links;
- blockers and owner assignment.

Do not use Linear as the only place for founder decisions, product doctrine, or durable API/data contracts. Promote durable rules into `docs/specs/**`.

Use `docs/operations/ACTIVE_PM.md` as the repo-visible companion snapshot for local agents that may not have Linear context loaded. It should summarize active execution state and point back to Linear/PRs/handoffs rather than duplicating them.

## Review Routing

- Use `uprisereviewerminus` (HY3) for bounded packet sanity, changed-file requirement checks, and validation-output review.
- Use `upriseauditorminus` (HY3) for stale/duplicate evidence, branch classification, and owner-spec/runtime drift.
- Use `uprisewatchdog` (HY3) only for heartbeat state. It is not a review or approval lane.
- Use `uprisedeepscout` / `uprisedeepcoder` only for a bounded optional DeepSeek task and retain independent review.
- Use an independent reviewer/auditor before deleting or merging branches from
  large refactors, complex issues, prototype work, or uncertain branch
  absorption; route that reviewer/auditor gate to fresh HY3 by default. Do not rely only on the implementation agent's summary when
  a branch might contain unpromoted product/spec/runtime work.
- Use Codex local for final reconciliation, staging, commits, PR creation, and validation coordination.
- Use Abacus / Agent Swarm only when the work can be split into independent lanes with a final synthesis pass.

If review finds a product-rule gap, do not patch multiple summaries first. Patch the owner spec or create a decision packet naming the owner spec that must change.

## Branch And Worktree Hygiene

Before starting non-trivial UPRISE work, capture:

```bash
git branch --show-current
git rev-parse --short HEAD
git status --short
git worktree list --porcelain
gh pr list --state open --limit 50
pnpm run workspace:audit
```

Do not create, assign, push, delete, rebase, reset, close, or clean branches/worktrees without a matching entry in `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`. Report stale or prunable branches as cleanup candidates.

After branch/PR/worktree cleanup or when the active branch changes, refresh `docs/operations/ACTIVE_PM.md` if the next agent would make a different routing decision from the old snapshot, and update `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` whenever branch status, assigned agents, scope, or closeout plan changes.

Do not create follow-up PRs solely to close the self-referential row for a just-merged operations/registry refresh. GitHub/`gh` is the live PR-state source; `ACTIVE_PM` and the registry should be accurate enough for routing and safety, not perfect bookkeeping. Clean harmless stale self-closing rows during the next real work branch.

## Safety Rules

- No provider/env/database mutation without explicit approval.
- No unsafe Git operations without explicit approval.
- No untracked art inspection/modification unless the task is about assets.
- No product doctrine changes from external output until reconciled into owner specs.
- No live DB seed/migration unless the target is explicitly confirmed.
- No design-tool output becomes product truth until reviewed against active specs/briefs.

## Update Rule

Patch this document when:

- a new AI tool becomes part of the UPRISE workflow;
- review/audit model routing or Hermes profile usage changes;
- Abacus / Agent Swarm routing changes;
- Linear label/project structure changes;
- NotebookLM sync behavior changes;
- generated wiki or design-tool rules change.

When this document changes, also check whether `docs/agent-briefs/EXTERNAL_TOOLS.md`, `docs/agent-briefs/CONTEXT_ROUTER.md`, and `docs/specs/system/documentation-framework.md` need a pointer update.

When `docs/operations/ACTIVE_PM.md` changes substantially, no product-doc update is required unless the change also affects agent/tool routing, owner contracts, or durable workflow policy.

## References

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
- `docs/solutions/ABACUS_FUSION_AGENT_SWARM_STRATEGY_R1.md`
- `docs/agent-briefs/UPRISE_HERMES_AUDITOR_AGENT.md`
- `docs/agent-briefs/UPRISE_HERMES_LAUNCH_REVIEWER.md`
