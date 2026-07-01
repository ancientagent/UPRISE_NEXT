# Active PM Branch Triage Refresh

Date: 2026-07-01
Branch: `docs/active-pm-branch-triage`
Base: `main` @ `99b0072`
Mode: docs-only branch/worktree triage

## Summary

Refreshed `docs/operations/ACTIVE_PM.md` after PR #150 merged. The update records which remaining branches are cleanup candidates versus which branches still contain unique work and require owner review.

No branches, worktrees, provider state, runtime code, schema, migrations, or art files were changed by this slice.

## Evidence Commands

```bash
gh pr view 150 --json number,title,state,isDraft,mergeable,statusCheckRollup,url,headRefName,baseRefName
gh pr ready 150
gh pr merge 150 --squash --delete-branch
git switch main
git pull --ff-only origin main
git status --short --branch
git rev-parse --short HEAD
git worktree list --porcelain
gh pr list --state open --limit 100 --json number,title,headRefName,baseRefName,isDraft,mergeable,updatedAt,url,statusCheckRollup
git branch -vv --all --sort=-committerdate
git rev-list --left-right --count main...<branch>
git cherry -v main <branch>
git diff --stat main...<branch>
```

## Result

- PR #150 merged into `main` at `99b0072`.
- Open PR queue: none.
- Patch-equivalent / absorbed cleanup candidates are now listed in `docs/operations/ACTIVE_PM.md`.
- Preserved unique branches and attached worktrees are listed separately.
- Next cleanup action remains approval-gated because it requires deleting branches and, for `feat/ux-batch18`, removing an attached worktree.

## Validation

Passed:

```bash
pnpm run docs:lint
git diff --check
```
