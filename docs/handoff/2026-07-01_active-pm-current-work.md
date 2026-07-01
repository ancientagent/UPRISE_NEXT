# Active PM Current Work Snapshot

Date: 2026-07-01
Branch: `docs/active-pm-current-work`
Base: `main` @ `2215136`
Mode: docs-only coordination slice

## Summary

Added a lightweight active-PM/current-work layer for UPRISE agents.

The new PM layer is intentionally not a product spec, not canon, and not a Linear replacement. It is a repo-visible execution-state snapshot for active branch/PR/blocker/worktree context so agents do not start from stale handoffs, chat memory, or old branch assumptions.

## Files Changed

- `docs/operations/ACTIVE_PM.md` — new current-work snapshot with active goal, active slice, next queue, preserved worktrees, cleanup notes, and refresh checklist.
- `docs/operations/README.md` — defines the operations folder and keeps it scoped to execution state.
- `AGENTS.md` — adds the PM snapshot as a task-specific add-on for current execution state.
- `docs/README.md` — links the operations snapshot from the docs index.
- `docs/AGENT_STRATEGY_AND_HANDOFF.md` — adds PM refresh to task loading and closeout behavior.
- `docs/agent-briefs/CONTEXT_ROUTER.md` — tells agents to check the PM snapshot when current state matters.
- `docs/specs/system/documentation-framework.md` — adds the operations/active-PM layer below owner specs and handoffs.
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` — adds Active PM to the tool stack and routing rules.
- `docs/agent-briefs/EXTERNAL_TOOLS.md` — tells external-agent prompts to check the PM snapshot when branch/PR/blocker state matters.
- `docs/CHANGELOG.md` — records the addition.

## Current Snapshot Captured

- Open PR queue: none at time of slice.
- Main cleanup had already pruned stale remote-tracking refs for merged PR branches and deleted local branches already merged into `main`.
- Preserved unmerged/attached worktrees remain explicitly listed in `docs/operations/ACTIVE_PM.md` and must not be removed without approval.

## Drift Controls

- Product truth remains in `docs/specs/**`, canon, active lane briefs, current runtime code, and tests.
- Linear remains execution state; the PM doc is a local repo-visible companion snapshot, not a replacement.
- The PM doc points agents to active state before they open older handoffs or external-agent outputs.
- Significant/risky work still uses the Execution Packet, Executor Readiness, and Closeout Contract blocks from the documentation framework.

## Validation

Passed:

```bash
pnpm run docs:lint
git diff --check
```
