# UPRISE Agent Strategy And Handoff
**Document ID:** `AGENT_STRATEGY_AND_HANDOFF`
**Status:** `active`
**Last Updated:** `2026-03-24`

This document complements `AGENTS.md`. If any guidance here conflicts with `AGENTS.md`, `AGENTS.md` wins.

## Purpose
- Define agent-document authority and loading order.
- Prevent stale handoff memory from outranking current repo truth.
- Standardize multi-agent execution, QA, and checkpoint behavior.

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
Every coding agent should read only the core set from `AGENTS.md` before touching code.

### Task-specific loading
Load only the materials directly needed for the current task:
- Web route/UI work: `apps/web/WEB_TIER_BOUNDARY.md` + route specs/founder locks
- API/runtime work: relevant module specs + shared types/contracts
- Doc/spec work: `docs/README.md`, `docs/specs/README.md`, and the exact canon/spec files in scope
- Recurring incident work: relevant `docs/solutions/` playbook only

### What not to do
- Do not bulk-load old batch plans, old phase notes, or large handoff sets by default.
- Do not treat every dated handoff as equally authoritative.
- Do not inherit product behavior from prior chat memory when current code/specs disagree.

## Multi-Agent Operating Protocol
### One implementation owner
- Default to one coding agent owning the write path for a branch slice.
- Other agents should stay read-only unless file ownership is explicitly split.

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
