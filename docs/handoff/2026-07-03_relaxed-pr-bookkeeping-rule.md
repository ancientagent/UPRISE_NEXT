# Relaxed PR Bookkeeping Rule

Date: 2026-07-03
Branch: docs/relaxed-pr-bookkeeping-rule
Owner: Codex local
Status: process clarification

## Summary

Captured the founder-approved relaxation for operations bookkeeping: do not create follow-up PRs solely to mark the just-merged operations/registry refresh PR as merged. Use GitHub/`gh` as live PR-state truth. Treat `ACTIVE_PM.md` and `BRANCH_WORKSPACE_REGISTRY.md` as routing/safety snapshots rather than a perfect live database.

## Rule Captured

- Keep registry entries for real branches, worktrees, preserved refs, external-agent workspaces, and PRs.
- Keep `ACTIVE_PM.md` accurate enough that the next agent can route safely.
- Do not open a new PR only to close the self-referential row from the PR that just merged.
- Let the next real work branch clean harmless stale self-closing rows naturally.
- Update stale rows immediately only when they would misroute the next agent, hide unsafe branch/worktree state, confuse deletion/cleanup, or affect closeout decisions.

## Files Changed

- `docs/specs/system/documentation-framework.md`
- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-07-03_relaxed-pr-bookkeeping-rule.md`

## Product / Runtime Impact

None. Process docs only.

## Validation

To run before closeout:

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```
