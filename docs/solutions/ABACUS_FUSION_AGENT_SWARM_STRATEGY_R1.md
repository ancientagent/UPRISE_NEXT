# Abacus Fusion Agent Swarm Strategy R1

Status: Active operating playbook
Owner: product engineering
Last updated: 2026-06-24

## Purpose

Define how UPRISE should use Abacus AI Agent Swarms / Fusion-style multi-agent
workflows without letting external agents become product authority.

This document is for mapping, decomposition, research, design synthesis, and
complex-platform planning. It is not a product spec and does not authorize new
runtime behavior.

## External Research Summary

Official Abacus documentation describes Agent Swarms as a master/worker system:
one master agent breaks a complex request into smaller tasks, coordinates
dependencies, passes information between worker agents, and synthesizes the
final result. Worker agents operate as independent Abacus AI Agents on
specialized tasks.

Abacus recommends swarms when a request naturally breaks into multiple
independent deliverables that can be built side by side. It explicitly says not
to use a swarm for a single application just because it is complex, for ordinary
debugging, or for design-only work. Swarms also consume more credits than a
single agent, and can stop if credits run out.

Abacus Agent Tasks are a separate pattern: scheduled or repeatable workflows
that can use connectors, browser automation, database access, and validation.
Those are useful later for recurring audits or monitoring, but they should not
be treated as the same thing as a one-off swarm planning run.

Primary sources checked:

- `https://abacus.ai/help/chatllm-ai-super-assistant/agent-swarms`
- `https://abacus.ai/help/chatllm-ai-super-assistant/deepagent`
- `https://abacus.ai/help/chatllm-ai-super-assistant/deepagent-tasks`

## UPRISE Interpretation

For UPRISE, the right use is not "let the swarm build the app."

The right use is:

1. Use the swarm to map complex, cross-lane areas into independent,
   evidence-backed work packets.
2. Keep each worker in one department lane.
3. Require every worker to cite repo files and classify lock/runtime/deferred
   status.
4. Let the master synthesize a plan, not merge code.
5. Bring the synthesized plan back into this repo as reviewable docs, issues,
   or small PR-safe slices.

Abacus swarms are strongest when UPRISE needs parallel structured output across
several independent deliverables. They are weak or risky when the task is one
runtime implementation path that needs a single owner and exact tests.

## Use Swarm For These UPRISE Problems

### 1. Complex Area Mapping

Use when the platform area spans multiple lanes and the desired output is a
map, not code.

Good targets:

- Prime model / generated sub-community architecture.
- Source entity lifecycle from listener registration through source-dashboard
  operation and future separate source/admin domain.
- Governance / Registrar / GPS / voting authority chain.
- Business monetization doctrine versus current MVP deferred runtime.
- Media path from URL-only Release Deck to future upload/storage/transcoding.
- State/national tier expansion readiness.

Output should be:

- lane map
- authority files
- implemented/runtime evidence
- deferred pieces
- dependencies
- risks
- recommended implementation slices

### 2. Multi-Deliverable Planning

Use when we need several independent artifacts at once.

Example deliverables:

- product architecture map
- implementation roadmap
- test strategy
- design-agent handoff
- founder decision packet
- stale-doc cleanup list

This matches the official swarm use case: multiple independent deliverables
that can be produced side by side.

### 3. Parallel Audit Scouting

Use for read-only audits where each worker owns a different lane.

Good examples:

- UI/player/profile worker
- onboarding/GPS/Home Scene worker
- source-dashboard/Release Deck/Print Shop worker
- actions/RADIYO/SPACE worker
- business/deferred boundary worker

The master agent may synthesize findings, but implementation stays with the
main repo agent after findings are classified.

### 4. Design Context Packaging

Use for producing several design handoff packets, not for final UI truth.

Workers can produce:

- Home/Plot/player screen packet
- onboarding first-run packet
- listener profile packet
- Artist Profile/source dashboard packet
- events/archive packet

The final design-agent package must still load `UI_CURRENT.md` and the active
lane brief before art references.

## Do Not Use Swarm For These UPRISE Problems

- One coding slice with tightly coupled files and tests.
- Direct provider/env changes.
- Live database writes, migrations, or seed execution.
- A single broad "clean up the repo" pass.
- A current UI mockup task that only needs screen/layout direction.
- Any task where historical docs could be bulk-rewritten.
- Any task that requires a founder decision before the scope is known.
- Any task where a single implementation owner is required to keep the branch
  coherent.

## Required Swarm Contract

Every UPRISE swarm prompt must include:

- repo path and branch/commit to inspect
- "read-only unless explicitly told otherwise"
- authority order from `AGENTS.md`
- active lane briefs to load
- no bulk legacy/canon rewrites
- no provider/env/database writes
- no one-off city/community/source logic
- classify findings as `bug`, `stale`, `environment`, `fixture/data`, or
  `product decision`
- separate `locked now`, `implemented now`, `deferred`, and `historical`
- exact files read and commands run
- expected output format

If the swarm starts from the wrong branch, it must stop and report the mismatch.

## Recommended UPRISE Swarm Topology

### Master Agent

Role:

- receives the founder goal
- turns the goal into lane-specific worker prompts
- prevents workers from overlapping file ownership
- gathers outputs
- deduplicates conflicts
- produces one final synthesis

The master may not:

- make product doctrine final without repo evidence
- merge code
- mark implementation complete
- run provider or database mutations

### Worker 1: Authority And Drift Mapper

Reads:

- `AGENTS.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- relevant lane briefs
- authority maps / external-agent docs

Output:

- controlling docs
- stale/historical docs to avoid
- conflict map
- context-loading plan for follow-up agents

### Worker 2: Runtime And Data Model Mapper

Reads:

- exact runtime files in scope
- Prisma schema and migrations if data model is touched
- relevant tests

Output:

- implemented behavior
- data model gaps
- missing tests
- implementation slice boundaries

### Worker 3: UX And Surface Mapper

Reads:

- `UI_CURRENT.md`
- exact web routes/components
- relevant visual/art references only if explicitly supplied

Output:

- screen/state inventory
- layout constraints
- design-agent packet
- anti-trope risks

### Worker 4: QA And Test Strategy Mapper

Reads:

- relevant tests
- package scripts
- smoke scripts
- handoffs for recent QA blockers

Output:

- existing coverage
- missing regression locks
- smoke/browser QA matrix
- validation command list

### Worker 5: Decision Packet Writer

Reads:

- findings from other workers
- relevant canon/specs only when the topic touches doctrine

Output:

- founder decision packet
- options
- tradeoffs
- recommended next branch slices

## Best First UPRISE Swarm Experiment

Run a read-only swarm on:

`Prime Model / Community Scaling Architecture Map`

Why this is the best first experiment:

- It is complex enough to benefit from parallel workers.
- It has independent deliverables: doctrine map, data model map, UX map, QA
  plan, and founder decisions.
- It is not asking the swarm to directly implement code.
- It tests whether Abacus can respect lane loading and systems-scale rules.

The final deliverable should become a repo doc under `docs/solutions/` or
`docs/specs/` after main-agent review, not an automatic implementation branch.

## First Experiment Prompt

Use this in Abacus Agent Swarm mode:

```text
You are running a read-only UPRISE_NEXT architecture-mapping swarm.

Repo: /home/baris/UPRISE_NEXT
Branch/commit to inspect: <CURRENT_BRANCH_AND_HEAD>

Hard rules:
- Read-only. Do not edit files, stage, commit, push, run migrations, run seeds,
  or change provider settings.
- If the branch/HEAD does not match what is provided, stop and report the
  mismatch.
- AGENTS.md wins over all other docs.
- Do not bulk-load every doc. Route through docs/agent-briefs/CONTEXT_ROUTER.md
  and then only the lane briefs needed by each worker.
- Do not collapse community identity to city-only or genre-only.
- Do not propose one-off architecture for a particular city, music community,
  source, or fixture.
- Separate locked now, implemented now, deferred, and historical/later-version
  context in every finding.
- Classify gaps as bug, stale, environment, fixture/data, or product decision.

Goal:
Map the Prime Model / community scaling architecture needed for UPRISE after
the 48 launch city-tier Home Scene tuples are working. Focus on how generated
sects, channels, sub-communities, state tiers, national tiers, events/archive,
source entities, voting authority, and RADIYO/SPACE behavior should scale
without creating one-off community architectures.

Worker lanes:
1. Authority/drift worker: identify controlling docs and stale docs to avoid.
2. Runtime/data worker: inspect schema, communities/onboarding/registrar/event
   code, and tests for what exists today.
3. UX/surface worker: map current Home/Plot/profile/source surfaces and what
   must stay invariant across communities.
4. QA/test worker: identify existing tests and missing regression locks for
   systems-scale community behavior.
5. Decision-packet worker: synthesize founder decisions needed before
   implementation.

Final output:
1. Executive summary.
2. Authority map with exact files read.
3. Current implemented runtime map.
4. Deferred architecture map.
5. Gap list by severity and classification.
6. Proposed staged implementation slices, each with branch name, files likely
   touched, tests, docs to update, and risk.
7. Founder decisions required.
8. Exact commands run.
9. Clear statement that no edits, migrations, seeds, provider changes, or
   pushes were made.
```

## How To Evaluate The Experiment

Accept the swarm output only if it:

- cites exact repo files
- respects lane boundaries
- preserves the city/state/music-community identity rule
- keeps Home Scene architecture invariant
- does not invent city-specific flows
- distinguishes runtime from doctrine
- outputs implementable slices rather than one huge plan
- identifies which findings need founder decisions

Reject or rerun if it:

- treats historical docs as current
- suggests platform-trope defaults
- proposes direct code changes without tests
- proposes provider/database mutations
- blends monetization or source dashboard future work into current MVP without
  activation

## Repo Integration Path

1. Run the swarm read-only on a clean branch/commit.
2. Paste the output back to the main repo agent.
3. Main repo agent verifies claims against current files.
4. Convert accepted results into:
   - one `docs/solutions/` strategy doc, or
   - one `docs/specs/` implementation spec, or
   - small Linear/GitHub issue slices.
5. Implement only one slice per branch.
6. Use Hermes reviewer or Cloud Codex for post-implementation review when the
   slice lands.

## Relationship To Abacus Tasks

Use Abacus Tasks later for recurring monitoring, not for the first architecture
experiment.

Possible later scheduled tasks:

- weekly stale-doc drift scan
- recurring PR summary across UPRISE branches
- provider readiness smoke report
- launch QA dashboard synthesis

Before scheduling any Task:

- run it once manually
- verify connector permissions
- ensure no unintended database writes
- keep any DB access read-only unless explicitly approved

