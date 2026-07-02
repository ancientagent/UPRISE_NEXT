# UPRISE AI Stack And Agent Lanes R1

Status: active
Owner: context-steward
Last Updated: 2026-06-26

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

## Tool Stack

| Tool / Agent | Best Use | Avoid Using For | Required Output |
| --- | --- | --- | --- |
| Codex local | Tightly coupled implementation, docs patches, validation, commits, PR coordination, default first-pass review/audit | broad unsupervised rewrites, provider mutation without explicit approval | changed files, tests run, branch/commit state, handoff when multi-step |
| Cloud Codex | Isolated branch work, focused implementation slices, large repo scans, contract hardening, repo-only audit branches | tasks needing live local browser sessions or local provider auth state | branch, commit, files changed, tests, PR or patch |
| Codex `gpt-5.3-codex-spark` | Basic/small review or audit, packet sanity, stale/fixed-work checks, changed-file skims, and test-output summaries | final safety gates, provider/db/security risk, branch absorption | concise evidence summary and next signal |
| Codex `gpt-5.5` with `reasoning_effort=xhigh` | Heavy/final review or audit, provider/db/security risk, branch absorption, owner-spec promotion risk, layered/drift-prone cleanup, and closeout gates | small packet sanity or routine changed-file scans | final safe/not-safe gate with blocking findings |
| Hermes `uprisereviewer+` / `uprisereviewer-` | Explicit manual fallback or second opinion when PM names Hermes-specific value | default branch audits, final gates, broad doctrine audits, or implementation | evidence/recommendations for PM/Codex decision |
| Hermes `upriseauditor+` / `upriseauditor-` | Explicit manual fallback for specialist drift/docs/owner-spec evidence when PM names Hermes-specific value | default stale checks, routine changed-file scans, code edits, PR ownership, provider changes | classified findings for PM/Codex review, not automatic approval |
| Abacus / Agent Swarm | Complex cross-lane mapping with independent worker lanes, decision packets, architecture scouting | one tightly coupled implementation slice, source of final product truth | lane findings, synthesis, provenance, owner-spec patch recommendations |
| NotebookLM | External memory over large source packs, philosophical/doctrine comparison, source-list exploration | direct implementation, deciding current runtime truth | claims inventory, gap list, source map, current-vs-historical caveats |
| Design tools: Claude Designer, Stitch, Gemini, Uizard, v0 | visual exploration, mockups, screen hierarchy options, UI direction | redefining action grammar, product surfaces, data contracts, or runtime architecture | annotated design options tied to current lane brief and constraints |
| Linear | execution queue, owner assignment, blockers, status, PR/commit links | product canon, durable specs, final founder decisions | issue with lane, owner contract, scope, acceptance criteria, validation |
| Active PM doc | current branch/PR/worktree/blocker snapshot and next execution signal | product doctrine, final decisions, detailed specs, replacing Linear | short state update linked to owner specs, handoffs, PRs, and Linear |
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
| `uprise-sects-governance` | sect affiliation, official sects, Sect Uprises | Registrar/community sect specs |
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

Use Hermes `uprisereviewer` only as manual fallback when:

- a PR, commit, or launch slice needs a second-pass read-only review;
- the output should be concrete findings and recommendations;
- the task is narrow enough that broad audit context would create noise;
- PM explicitly wants Hermes profile memory, a second opinion after Codex, or a fallback specialist pass.

Use Hermes `upriseauditor` only as manual fallback when:

- the task is a broad drift audit across docs/specs/runtime;
- the goal is to classify gaps, stale language, and missing owner contracts;
- no edits should be made during the pass;
- PM explicitly wants Hermes profile memory or a specialist owner-spec/docs drift pass after Codex routing.

## Codex-First Audit Rule

Ordinary audits and reviews are Codex-first. Use Codex for branch diffs, stale/fixed-work checks, changed-file review, test-output summaries, packet sanity, first-pass implementation review, PM closeout review, and final safe/not-safe gates. Use Hermes only as an explicit manual fallback when the prompt names the added Hermes value: profile memory, owner-spec/docs specialization, QA planning state, second opinion, synthesis across worker outputs, or feedback/profile-skill learning.

PM should choose the lightest Codex model that protects the task:

| Task class | Preferred Codex model | Examples |
| --- | --- | --- |
| Basic/small review or audit | `gpt-5.3-codex-spark` | Docs sanity, packet review, stale/fixed-work check, changed-file skim, test-output summary |
| Heavy/final review or audit | `gpt-5.5` with `reasoning_effort=xhigh` | Implementation review, multi-file UI/state review, PM closeout review, cross-lane audit, provider/db/security risk, branch absorption, owner-spec promotion risk, layered/drift-prone cleanup |

Escalate beyond `gpt-5.5` with `reasoning_effort=xhigh` only when PM names the reason. Claude Opus and Fugu/Fugu Ultra are backup or exceptional heavyweight lanes, not default routing.

Do not spend Hermes fallback runs on routine scouting or final gates. Basic Hermes can gather evidence and recommend; heavy Hermes can provide a manual fallback opinion only when PM explicitly asks for it. Codex remains the approving/blocking gate. If Hermes credits are exhausted or a run is too expensive for the expected value, classify that as an infrastructure/budget blocker and route back to Codex.

## Hermes Manual Fallback Rule

Use explicit basic/heavy Hermes calls only after the Codex-first rule says Hermes adds value:

| Call | Command/profile | Model tier | Authority |
| --- | --- | --- | --- |
| `reviewer-heavy` | `uprisereviewer+` / `uprisereviewerplus` | Manual fallback profile; model is operational, not authority | Advisory specialist opinion for PR, merge, closeout, provider/db risk, owner-spec changes, branch absorption, or high-impact runtime behavior. |
| `reviewer-basic` | `uprisereviewer-` / `uprisereviewerminus` | Manual fallback profile; model is operational, not authority | Non-approving changed-file scan, packet sanity, stale/duplicate evidence, or second opinion. |
| `auditor-heavy` | `upriseauditor+` / `upriseauditorplus` | Manual fallback profile; model is operational, not authority | Advisory specialist drift/safety opinion for branch cleanup, merge, owner-spec promotion, or closeout. |
| `auditor-basic` | `upriseauditor-` / `upriseauditorminus` | Manual fallback profile; model is operational, not authority | Preliminary drift map, docs/source scan, stale branch search, or evidence gathering. |

Hermes results are inputs for PM/Codex, not automatic approvals. They cannot independently approve safety, merge, branch deletion, product truth, provider changes, database changes, or closeout.

Before every new Hermes review/audit packet, prefer a fresh one-shot worker. In a persistent Hermes chat, `/clear` clears the screen and starts a new session by discarding conversation history; it is not a mid-task context compactor. Keep context only when the same Hermes profile is intentionally continuing one larger sequential investigation and the prompt says so. Then include repo path, branch, short HEAD, lane, owner spec, changed files/artifacts, expected profile, and a requirement to verify repo state before reviewing.

Hermes just shortcuts:

```bash
just hermes-review-heavy path/to/prompt.md
just hermes-review-basic path/to/prompt.md
just hermes-audit-heavy path/to/prompt.md
just hermes-audit-basic path/to/prompt.md
```

The review/audit recipes fail closed and print the manual Hermes fallback command. They exist so older prompts do not silently run expensive Hermes gates. Use Codex first: `gpt-5.3-codex-spark` for basic/small review or audit, and `gpt-5.5` with `reasoning_effort=xhigh` for heavy/final review or audit.

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

For large refactors, complex issues, broad branch/worktree cleanup, or any
branch-absorption decision where valuable product/spec/runtime content may be
hidden in stale-looking work, require an independent reviewer/auditor pass
before merge/delete decisions. Use a Codex reviewer/auditor by default:
`gpt-5.3-codex-spark` for basic branch evidence and `gpt-5.5` with
`reasoning_effort=xhigh` when the result can decide merge, deletion,
absorption, provider/db risk, owner-spec promotion, or closeout. The review
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

- Use `gpt-5.3-codex-spark` for basic packet sanity, changed-file scans, stale/duplicate evidence, and test-output summaries.
- Use `gpt-5.5` with `reasoning_effort=xhigh` for heavy/final reviews or audits that can block branch cleanup, merge, owner-spec promotion, provider/db risk, or closeout.
- Use `uprisereviewer+`, `uprisereviewer-`, `upriseauditor+`, or `upriseauditor-` only as manual fallback when PM names Hermes-specific value: profile memory, second opinion, owner-spec/docs specialization, synthesis, or feedback learning.
- Use an independent reviewer/auditor before deleting or merging branches from
  large refactors, complex issues, prototype work, or uncertain branch
  absorption; route that reviewer/auditor gate to the matching Codex model
  tier by default. Do not rely only on the implementation agent's summary when
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
```

Do not delete, rebase, reset, close, or clean branches/worktrees without explicit approval. Report stale or prunable branches as cleanup candidates.

After branch/PR/worktree cleanup or when the active branch changes, refresh `docs/operations/ACTIVE_PM.md` if the next agent would make a different routing decision from the old snapshot.

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
