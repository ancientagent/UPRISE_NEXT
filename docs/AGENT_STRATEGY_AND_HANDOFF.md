# UPRISE Agent Strategy And Handoff
**Document ID:** `AGENT_STRATEGY_AND_HANDOFF`
**Status:** `active`
**Last Updated:** `2026-06-25`

This document complements `AGENTS.md`. If any guidance here conflicts with `AGENTS.md`, `AGENTS.md` wins.

## Purpose
- Define agent-document authority and loading order.
- Prevent stale handoff memory from outranking current repo truth.
- Standardize multi-agent execution, QA, and checkpoint behavior.
- Route cross-system rules through owner contracts so agents know what they are building without duplicating micro-rules across docs.
- Pair with `docs/solutions/SEAMLESS_AGENT_CONTINUITY_PROTOCOL_R1.md` when packaging a new-session or new-agent transfer.

## Authority Order
Use this precedence when evaluating what to trust:
1. `AGENTS.md`
2. `docs/canon/`
3. active `docs/specs/`
4. founder locks / active execution docs in `docs/solutions/`
5. current branch code/runtime evidence
6. dated handoffs in `docs/handoff/`
7. chat memory

## Reading Model
### Core set
Every coding agent should start from `AGENTS.md`, `docs/PLATFORM_START_HERE.md`, and the minimum core protocol named by `AGENTS.md`. Do not expand that into every active solution, handoff, canon file, or design document by default.

### Layered context modes
- Focused implementation mode: read `AGENTS.md`, `docs/PLATFORM_START_HERE.md`, this file, `docs/agent-briefs/CONTEXT_ROUTER.md`, the active lane brief, and exact touched files/specs/tests.
- Heavy authority mode: for broad audits, architecture planning, deployment/infra work, multi-agent strategy, repo-structure changes, or explicit full-platform review, load the heavier pack in `AGENTS.md` plus the exact canon/spec/brief files routed by the task.
- Legacy/handoff mode: load dated handoffs and legacy docs only by topic. They are context, not higher authority than current code/specs.

### Task-specific loading
Load only the materials directly needed for the current task:
- Current execution-state check: use `docs/operations/ACTIVE_PM.md` to see the active branch/PR queue, blockers, worktrees to preserve, and next execution signal. Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` to verify branch/worktree/external-agent workspace ownership, assigned agents, scope, status, and closeout plan. These files are not product truth and should not replace owner specs or current runtime evidence.
- Section-specific work: load `docs/agent-briefs/CONTEXT_ROUTER.md` first, then the matching focus-lane brief in `docs/agent-briefs/`. Treat those briefs as routers; follow only the code/spec/lock links that match the files or surface being changed.
- Web route/UI work: `apps/web/WEB_TIER_BOUNDARY.md` + route specs/founder locks
- API/runtime work: relevant module specs + shared types/contracts
- Doc/spec work: `docs/README.md`, `docs/specs/README.md`, and the exact canon/spec files in scope
- Recurring incident work: relevant `docs/solutions/` playbook only

### Section brief rule
- Route by the active work lane, not by the whole platform.
- Section briefs are read-first packets, not mandates to load every linked document.
- Keep the current section truth in the brief; keep full detail in the owning spec/founder lock.
- If a task only needs orientation or a design prompt, the section brief can be sufficient.
- If a task edits runtime behavior, load the matching route/component files and the specific lock that authorizes the change.
- If a task edits canon/specs, load the exact canon/spec file being changed and any directly referenced authority.

### Contract owner rule
- Cross-system behavior belongs in one owner spec or owner section under `docs/specs/**`.
- Lane briefs should summarize the current truth and point to the owner contract.
- Handoffs are temporary evidence; promote accepted founder decisions or reviewer findings into the owner contract.
- Use `docs/specs/system/documentation-framework.md` for lane-agent ownership, Linear issue structure, question discipline, reviewer routing, and handoff promotion rules.

### What not to do
- Do not bulk-load old batch plans, old phase notes, or large handoff sets by default.
- Do not make agents read every document that mentions a surface just because they are working in that area.
- Do not treat every dated handoff as equally authoritative.
- Do not inherit product behavior from prior chat memory when current code/specs disagree.
- Keep context lean: prefer concise summaries over transcript dumps, salvage dense threads early, and use `docs/solutions/LEAN_CONTEXT_OPERATING_RULES_R1.md` when a thread is starting to bloat.
- When founder clarification changes product truth or MVP boundary, promote it in the same pass using `docs/solutions/FOUNDER_DECISION_CAPTURE_PROTOCOL_R1.md`; do not leave it in chat-only memory.
- When founder clarification changes a section's active workflow or screen truth, patch the matching `docs/agent-briefs/` file in the same pass so future agents start from repo-visible section context instead of chat memory.
- When founder clarification affects multiple systems, patch the owner spec first and keep brief/orientation updates short.
- When a slice materially changes product doctrine, active surface behavior, or major runtime shape, also update the current external-memory bridge for NotebookLM or add a dated NotebookLM sync note in the same pass. Do not let NotebookLM drift a month behind the repo.
- For external assistants and delegation products, also apply `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md` so context acquisition, verification, and anti-trope rules stay explicit.

## Multi-Agent Operating Protocol
### One implementation owner
- Default to one coding agent owning the write path for a branch slice.
- Other agents should stay read-only unless file ownership is explicitly split.

### Pre-implementation feature gate
- Before implementing a feature or behavior-changing UI/API/runtime slice, the executor must review the feature against current repo authority and write a development plan.
- A separate Codex reviewer must review that development plan before implementation edits begin.
- Record the feature review scope and plan-review artifact in the Execution Packet / Executor Readiness blocks from `docs/specs/system/documentation-framework.md`.
- Tiny surgical docs-only or local cleanup PRs may skip this gate only when no product/runtime behavior is being implemented and the branch owner can prove low risk.

### Linear clean-context assignment
- The assigning agent owns founder confirmation and Linear issue completeness before assignment.
- PM/current branch owner assigns a dedicated Codex subagent as the assigning agent when issue setup needs repo/context gathering; it prepares the packet and recommends assignment, not the implementation branch.
- The assigned agent starts with clean context and reads the Linear issue first, then the repo-linked docs/files named by the issue.
- If the issue lacks owner spec, rules, context, solution direction, validation, or safety boundaries, the assigned agent stops and reports the missing packet fields instead of reconstructing intent from chat.
- Linear remains execution state; durable confirmed truth is promoted to canon or owner specs as appropriate.

### External-delegation pattern
- Use external/swarm assistants primarily for design, communications, research, and synthesis unless a repo-controlled coding workflow is explicitly intended.
- Keep one shared fact base for multi-deliverable work so outputs do not drift from each other.
- Treat vendor prompt leaks as pattern references only, never as content to import wholesale.

### Checkpoint-before-audit
- Do not run QA or ask other agents for findings against a mixed uncommitted worktree.
- Audit against committed local `HEAD` or pushed branch state.

### Issue classification
Before acting on a finding, classify it as one of:
- `bug`
- `stale`
- `environment`
- `fixture/data`
- `product decision`

Only `bug` items should go straight into an implementation slice.

### QA report minimums
Every QA finding should include:
- branch or commit hash
- route/surface
- signed-in or signed-out state
- fixture/setup used
- exact repro steps
- whether clean browser storage/session was used

### Closeout gate
Before closing a batch or slice:
- tracked worktree clean
- targeted verification complete
- `pnpm run verify` preferred
- final QA rerun on current committed `HEAD`
- changelog + dated handoff updated
- `docs/operations/ACTIVE_PM.md` refreshed when the active branch, PR queue, blockers, preserved worktrees, or next execution signal changed
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` updated when branch/worktree/PR status, assigned agents, scope, or closeout plan changed
- `pnpm run workspace:audit` passed before push, PR creation, branch cleanup, and closeout

## Handoff Rules
### What handoffs are for
Use `docs/handoff/` for:
- dated execution notes
- closeout summaries
- carry-forward corrections
- batch/QA reports

### What handoffs are not
Do not use handoffs as:
- canon replacements
- permanent feature specs
- parallel memory artifacts for the same issue when one reconciliation note will do

### Current carry-forward pattern
- Prefer one reconciliation note when multiple agents have overlapping context.
- Mark stale carry-forward claims explicitly when current `HEAD` no longer supports them.

## Legacy / Historical Notes
- Legacy mobile docs and code remain reference-only under `docs/legacy/`.
- Older phase docs and long batch histories are historical context, not default reading.
- If a document is useful but no longer appropriate as required reading, leave it linked from an index rather than keeping it in the default read path.
