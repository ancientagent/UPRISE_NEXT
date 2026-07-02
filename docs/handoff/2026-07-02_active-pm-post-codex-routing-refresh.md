# Active PM Refresh After Codex-First Review Routing

Date: 2026-07-02
Branch: `docs/active-pm-post-codex-routing-refresh`
Mode: docs/PM snapshot refresh only

## Summary

Refreshed `docs/operations/ACTIVE_PM.md` after PR #180 merged into `main`, then added the Branch / Workspace Registry protocol requested by the founder in-thread.

Current `main` at refresh start:

- `7e130ce` — `Docs: route UPRISE reviews through Codex agents (#180)`

Current state verified:

- Local main worktree clean before refresh branch creation.
- Open PR queue empty: `gh pr list --state open --limit 50 --json ...` returned `[]`.
- Preserved UX worktrees remain:
  - `/home/baris/UPRISE_NEXT_uximpl`
  - `/home/baris/UPRISE_NEXT_uxmobile`

## Changes

- Updated snapshot date and main HEAD in `docs/operations/ACTIVE_PM.md`.
- Added PR #179 and PR #180 to the completed-slices list.
- Added `docs/handoff/2026-07-01_uprise-hermes-heavy-light-routing.md` to the current cleanup trail.
- Added the Codex-first review/audit routing pointer to PM usage rules.
- Added `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` as the mandatory registry for branches, worktrees, PR heads, preserved refs, and external-agent workspaces.
- Added `scripts/workspace-registry.mjs` plus `pnpm run workspace:register`, `pnpm run workspace:audit`, `just workspace-register`, and `just workspace-audit`.
- Updated `AGENTS.md`, `docs/specs/system/documentation-framework.md`, `docs/AGENT_STRATEGY_AND_HANDOFF.md`, and `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` so agents must update the registry and run `workspace:audit` before push/PR/closeout.
- Captured the founder instruction verbatim in `docs/founder-sessions/2026-07-02_branch-workspace-registry-protocol.md`.

## Boundaries

- No runtime code changed.
- No provider, database, schema, deployment, or art state touched.
- Product doctrine was not changed; this is execution-state routing only.

## Validation

Run before merge:

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
```
