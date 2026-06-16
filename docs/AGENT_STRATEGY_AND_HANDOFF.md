# UPRISE Agent Strategy And Handoff
**Document ID:** `AGENT_STRATEGY_AND_HANDOFF`
**Status:** `active`
**Last Updated:** `2026-04-21`

This document complements `AGENTS.md`. If any guidance here conflicts with `AGENTS.md`, `AGENTS.md` wins.

## Purpose
- Define agent-document authority and loading order.
- Prevent stale handoff memory from outranking current repo truth.
- Standardize multi-agent execution, QA, and checkpoint behavior.
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
Every coding agent should start from `AGENTS.md` and the minimum core protocol it names. Do not expand that into every active solution, handoff, or design document by default.

### Task-specific loading
Load only the materials directly needed for the current task:
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

### What not to do
- Do not bulk-load old batch plans, old phase notes, or large handoff sets by default.
- Do not make agents read every document that mentions a surface just because they are working in that area.
- Do not treat every dated handoff as equally authoritative.
- Do not inherit product behavior from prior chat memory when current code/specs disagree.
- Keep context lean: prefer concise summaries over transcript dumps, salvage dense threads early, and use `docs/solutions/LEAN_CONTEXT_OPERATING_RULES_R1.md` when a thread is starting to bloat.
- When founder clarification changes product truth or MVP boundary, promote it in the same pass using `docs/solutions/FOUNDER_DECISION_CAPTURE_PROTOCOL_R1.md`; do not leave it in chat-only memory.
- When founder clarification changes a section's active workflow or screen truth, patch the matching `docs/agent-briefs/` file in the same pass so future agents start from repo-visible section context instead of chat memory.
- When a slice materially changes product doctrine, active surface behavior, or major runtime shape, also update the current external-memory bridge for NotebookLM or add a dated NotebookLM sync note in the same pass. Do not let NotebookLM drift a month behind the repo.
- For external assistants and delegation products, also apply `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md` so context acquisition, verification, and anti-trope rules stay explicit.

## Multi-Agent Operating Protocol
### One implementation owner
- Default to one coding agent owning the write path for a branch slice.
- Other agents should stay read-only unless file ownership is explicitly split.

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
