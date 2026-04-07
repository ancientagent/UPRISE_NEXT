# Seamless Agent Continuity Protocol R1

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-07

## Purpose
Provide a lightweight, enforceable handoff system so any agent can join mid-project and continue work without:
- re-explaining from the founder
- reinterpretation of prior decisions
- speculative redesign
- drift between sessions, models, or agent roles

This protocol is designed for real execution. It is not a transcript archive and it is not a second canon layer.

## Design Goals
1. Instant re-entry for new agents
2. Zero canon drift
3. Minimal founder burden
4. Executable next step at the end of every handoff
5. Flexible enough to support planning, implementation, QA, and multi-agent work

## Agent Identity
When continuity matters, the incoming lead agent should be told who it is expected to be operationally.

Current lead continuity identity:
- name: `YOUNGBLOOD`
- role: founder-aligned lead integrator
- style: direct, concise, low-drift, execution-first

This identity is not canon. It is an operating continuity aid so the next session preserves the same working posture instead of re-inventing one.

Include agent identity in the transfer packet when:
- moving to a fresh session
- swapping lead agents
- restarting after a dense doctrine thread

Do not overload identity with unnecessary personality detail. Carry only the parts that affect execution quality.

## Authority Model
Every agent must anchor to this order before acting:
1. `AGENTS.md`
2. `docs/canon/`
3. active `docs/specs/`
4. founder locks / active execution docs in `docs/solutions/`
5. current branch code and runtime evidence
6. dated handoffs in `docs/handoff/`
7. chat memory

No handoff may override a higher layer.

## Memory Layers
Separate project memory into three explicit layers.

### 1. Canon
Non-negotiable truth.

Includes:
- `AGENTS.md`
- canon docs
- approved specs
- founder locks

Rules:
- cannot be reinterpreted by a handoff
- cannot be narrowed by omission
- cannot be replaced by chat summaries

### 2. Active Working Memory
Current execution state.

Includes:
- current branch and `HEAD`
- open decisions
- current task scope
- known constraints
- latest relevant handoff
- current context snapshot

Rules:
- must reflect current repo truth
- may change frequently
- must never contradict canon

### 3. Temporary Task Context
Short-lived execution detail.

Includes:
- current slice notes
- temporary debugging facts
- local repro data
- exploratory reasoning

Rules:
- disposable unless promoted
- if it changes project truth, it must be promoted into durable memory

## Core Handoff Framework
Every handoff must contain these sections.

### A. Project State
- repo
- branch
- `HEAD`
- clean or dirty worktree
- whether unrelated changes are present

### B. Active Task Scope
- exact task being continued
- explicit out-of-scope items
- required completion standard

### C. Constraints / Guardrails
- canon or spec rules relevant to the task
- architecture boundaries
- workflow constraints
- known tool/environment limitations

### D. Known Decisions Already Made
- settled decisions only
- no mixed open questions here

### E. Do Not Change
- specific locked elements that must not be reworked
- use this only for true invariants or founder-locked surfaces

### F. Next Required Actions
- ordered, executable next steps
- should allow the next agent to start immediately

### G. Open Issues / Unknowns
- unresolved items only
- clearly labeled as open

## Zero-Drift Enforcement
Every agent must prove they are acting from known state before they act.

### Required checks before execution
1. confirm branch and `HEAD`
2. confirm authority docs loaded
3. confirm current task scope
4. confirm locked truths relevant to the task
5. confirm whether worktree is clean or mixed

### Drift rejection rules
Reject and correct any output that:
- introduces behavior not grounded in canon/spec/lock
- reframes founder intent
- imports platform-default behavior without approval
- treats open decisions as settled
- narrows prior truth because it was omitted from a shorter summary

### Assumption rule
Agents may make reversible, low-risk implementation assumptions only when:
- existing architecture already implies the default
- the assumption does not change product truth
- the assumption is noted in the handoff or closeout if it matters later

If the assumption would change product semantics, stop and resolve internally first.

## Agent Alignment Rules
All agents must follow these rules:

1. No speculation
- Do not invent missing product behavior.

2. No founder-intent reframing
- Do not rewrite the task into a different product agenda.

3. No unauthorized systems
- Do not introduce new subsystems, surfaces, or ranking logic without approval.

4. Default to the simplest viable execution
- extend the current architecture before inventing another one

5. Persist real learning
- if new truth is discovered, record it in the repo

6. Escalate only real ambiguity
- do not block on low-risk choices that already have a safe architectural default

## Workflow Selection Layer
The continuity protocol is the universal transfer layer. It does not replace specialized workflow overlays.

Load only the overlays that match the task:

### Default
- use this protocol only

### Doctrine / review / founder-truth shaping
- also load `docs/solutions/UPRISE_AUTOHARNESS_R1.md`
- also load `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md`

### Multi-agent implementation / QA coordination
- also load `docs/solutions/AGENT_WORKFLOW_PROTOCOL_R1.md`

### Dense session management / transition hygiene
- also load `docs/solutions/LEAN_CONTEXT_OPERATING_RULES_R1.md`
- also load `docs/state/conversation_salvage_protocol.md`

### Browser / CUA / live UI work
- load only the relevant browser workflow or runbook material for that task
- do not preload browser-specific overlays when the task is doc-only or repo-only

### Rule
Do not load every workflow family by default.
The transfer packet should stay light, and overlays should be pulled only when the active task actually needs them.

## Execution Readiness Standard
No handoff is complete unless the next step is executable without founder clarification.

A handoff is execution-ready only if it includes:
- the exact next task
- the exact docs to trust
- the branch and `HEAD`
- current warnings
- any blocking open issue, if one truly exists

Bad:
- "continue improving this area"
- "review prior discussion and decide next steps"

Good:
- "Turn the current Discover + Stats locks into an `apps/web` implementation plan using the referenced docs only."

## Failure Handling Protocol
When problems arise, agents must resolve downward before escalating upward.

### If context is incomplete
1. check authority docs
2. check current snapshot
3. check latest relevant handoff
4. inspect code/runtime evidence
5. only then ask for founder clarification

### If conflicts are detected
Resolve by authority order.

If conflict remains:
- create a conflict note
- pause implementation
- ask one precise founder question

### If instructions are unclear
Use the narrowest interpretation that:
- does not violate canon
- does not introduce new product behavior
- still allows progress

If no safe narrow interpretation exists, escalate once with a precise question.

## Multi-Agent Rules
Use multi-agent execution only when the work cleanly splits.

### Allowed split
- one lead agent owns truth and integration
- helper agents can:
  - gather evidence
  - run QA
  - inspect code paths
  - implement isolated write scopes when explicitly assigned

### Not allowed
- multiple agents freely rewriting the same files without ownership
- QA against mixed uncommitted worktrees
- parallel agents each carrying different versions of product truth

### Lead agent duties
- package handoff
- assign scope
- reconcile outputs
- publish final durable state

## Durable Storage Rules
Use the right container for the right memory class.

### Canon / durable rules
- `docs/solutions/*.md`
- `docs/specs/*.md`

### Active execution state
- `docs/state/current_context_snapshot.json`
- current dated handoff in `docs/handoff/`

### Temporary execution details
- local notes, command output, short chat reasoning

If a temporary discovery changes project truth, promote it.

## Standard Handoff Template
Use this exact structure.

```text
Authority
- AGENTS.md
- [other required docs]

Project State
- Branch:
- HEAD:
- Worktree:
- Warning:

Active Task Scope
- In scope:
- Out of scope:

Locked
- ...

Do Not Change
- ...

Open
- ...

Next Required Actions
1. ...
2. ...

Execution Standard
- Commands/checks required:
- Done means:
```

## Minimal Fresh-Session Transfer Block
Use this when moving to a new session.

```text
Use repo truth, not chat memory.

Lead continuity identity:
- YOUNGBLOOD
- direct, concise, execution-first
- preserve founder-aligned workflow and low-drift behavior

Start from:
- AGENTS.md
- docs/state/current_context_snapshot.json
- latest relevant dated handoff

Then load only the active founder locks/specs needed for the task.

Current branch:
- <branch>
- HEAD <sha>

Locked:
- ...

Open:
- ...

Next task:
- ...

Warning:
- ...
```

## Enforcement Summary
If a handoff does not contain:
- state
- scope
- locked truths
- open items
- executable next steps

then it is not a valid handoff.

If an agent cannot continue without asking the founder to repeat prior decisions, the protocol was not followed.

## Related Docs
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/solutions/AGENT_WORKFLOW_PROTOCOL_R1.md`
- `docs/solutions/UPRISE_AUTOHARNESS_R1.md`
- `docs/solutions/UPRISE_DRIFT_TAXONOMY_R1.md`
- `docs/solutions/LEAN_CONTEXT_OPERATING_RULES_R1.md`
- `docs/state/conversation_salvage_protocol.md`
