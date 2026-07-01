# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-01

## Purpose

This file is the lightweight current-work control plane for UPRISE agents.

Use it to answer:

- what is active right now?
- which branch or PR should agents inspect first?
- what is blocked, deferred, or not safe to touch?
- what validation belongs to the current slice?
- which docs/specs/handoffs should an agent load before expanding context?

This file is not product doctrine, canon, or an owner spec. Durable product truth remains in `docs/specs/**`, canon, active briefs, current runtime code, and tests. Linear remains execution state. This file only helps agents avoid stale branches, duplicated audits, and context overloading.

## Update Rule

Update this file when any of the following changes:

- active implementation branch or PR;
- active goal or next slice;
- open PR queue;
- branch/worktree cleanup status;
- provider/db/schema/canon risk state;
- blocker that affects which agent should work next.

Keep updates small. Do not paste full audit reports here. Link to the owner spec, handoff, Linear issue, or PR instead.

## Current Workspace Snapshot

- Snapshot date: 2026-07-01
- Base branch: `main`
- Base HEAD: `2215136` (`docs: add execution closeout packet templates (#149)`)
- Current docs slice branch: `docs/active-pm-current-work`
- Open PR queue at snapshot: none
- Main worktree state at snapshot: clean before this docs slice

## Active Goal

Create a lightweight active-PM/current-work layer so Codex, Cloud Codex, Hermes, Abacus, NotebookLM, Linear, and design agents can check current execution state without treating chat memory, old handoffs, or external-agent output as authority.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `uprise-context-steward` / external tools routing |
| Branch | `docs/active-pm-current-work` |
| Scope | Add this active PM file and lightweight routing pointers only. |
| Out of Scope | Product doctrine, canon edits, runtime code, provider state, database/schema changes, Linear workflow automation, new PM harness. |
| Owner Contract | `docs/specs/system/documentation-framework.md` |
| Companion Doc | `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` |
| Validation | `pnpm run docs:lint`, `git diff --check` |

## Next Queue

1. Review remaining unmerged worktrees/branches and decide preserve / supersede / retire. Do not delete without explicit approval.
2. Use this file as the first execution-state check before starting a new UPRISE branch.
3. If a new risky or cross-lane issue starts, include the Execution Packet, Executor Readiness, and Closeout Contract blocks from `docs/specs/system/documentation-framework.md`.

## Branches And Worktrees To Preserve Until Reviewed

These worktrees/branches contain unmerged or separately staged work. Do not remove, reset, rebase, force-push, or delete them without explicit approval.

| Path | Branch | Snapshot HEAD | Note |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT/.worktrees/batch18` | `feat/ux-batch18-prep` | `629a39e` | UX batch prep, remote exists. |
| `/home/baris/UPRISE_NEXT/.worktrees/batch19` | `feat/ux-batch19-prep` | `7a66a72` | UX batch prep, remote exists. |
| `/home/baris/UPRISE_NEXT_batch18` | `feat/ux-batch18` | `38f7124` | Older batch worktree, attached branch. |
| `/home/baris/UPRISE_NEXT_runtime` | `phase3-no-automation-rollback` | `f370438` | Runtime/agent-control history, review before action. |
| `/home/baris/UPRISE_NEXT_uximpl` | `ux-implementation` | `be4ddde` | UX implementation branch, remote exists. |
| `/home/baris/UPRISE_NEXT_uxmobile` | `ux-mobile-r1-build` | `b59a63c` | Mobile UX branch, remote exists. |

## Recently Completed / Cleaned Up

- Pruned stale remote-tracking refs for the already-merged PR branches:
  - `origin/chore/plot-deferred-panel-quarantine`
  - `origin/docs/execution-closeout-packets`
  - `origin/refactor/plot-page-section-extraction`
- Deleted local branches already merged into `main`, excluding attached worktree branches.
- Open PR queue was empty after cleanup.

## PM Usage Rules For Agents

- Read this file for current execution state, then route through `docs/agent-briefs/CONTEXT_ROUTER.md` for lane context.
- Do not treat this file as product truth.
- If this file conflicts with `AGENTS.md`, `AGENTS.md` wins.
- If this file conflicts with an owner spec or runtime evidence, report the conflict and refresh this file.
- If a task is tiny and low-risk, do not create a process packet unless it helps.
- If a task is significant/risky, cross-lane, provider/db/schema/canon/doc-authority work, or an external-agent handoff, require the execution packet blocks named in the active documentation framework.

## Refresh Checklist

When refreshing this file, run or verify:

```bash
git branch --show-current
git rev-parse --short HEAD
git status --short
gh pr list --state open --limit 50 --json number,title,headRefName,baseRefName,isDraft,mergeable,updatedAt,url
git worktree list --porcelain
```

Then update only the sections that changed.
