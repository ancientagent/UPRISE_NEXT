---
name: uprise-branch-pr-hygiene
description: Use when checking UPRISE branches, pull requests, worktrees, stale upstreams, prunable worktrees, dirty state, forgotten work, conflicting PRs, merge order, or deciding what to rebase, merge, close, preserve, or clean up.
---

# UPRISE Branch PR Hygiene

## Safety

Read-only first. Never delete, reset, prune, clean, close, rebase, or force-push without explicit approval for that action.

## Inventory Commands

```bash
git status --short --branch
git worktree list --porcelain
git branch -vv --all --sort=-committerdate
gh pr list --state open --limit 100 --json number,title,headRefName,baseRefName,isDraft,mergeable,updatedAt,url,statusCheckRollup
```

For a suspect PR:

```bash
gh pr view <PR> --json number,title,state,isDraft,headRefName,baseRefName,mergeable,statusCheckRollup,url
```

## Output Shape

```md
Current Workspace
- branch:
- HEAD:
- dirty tracked:
- untracked summary:

Open PR Queue
- # / branch / mergeability / check state / recommended action

Worktrees
- path / branch / clean-dirty / issue

Stale Branches
- gone upstreams:
- behind main:
- likely superseded:

Recommended Order
1. <next safest action>
2. <next>

Do Not Touch Without Approval
- <branches/worktrees/assets>
```

## Decision Rules

- Handle mergeable green implementation PRs before stale audit PRs.
- Treat superseded PRs as close candidates, not merge candidates.
- Rebase stale docs PRs only when their content still matters.
- Keep untracked `art/` files untouched unless the task explicitly asks about art/assets.
- Use `--force-with-lease`, never blind force-push.
- Do not open a follow-up PR solely to mark the just-merged operations/registry
  refresh PR as merged; clean harmless stale self-closing rows during the next
  real work branch.
