# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-03

## Purpose

This file is the lightweight current-work control plane for UPRISE agents.

Use it to answer:

- what is active right now?
- which branch or PR should agents inspect first?
- what is blocked, deferred, or not safe to touch?
- what validation belongs to the current slice?
- which docs/specs/handoffs should an agent load before expanding context?

This file is not product doctrine, canon, or an owner spec. Durable product truth remains in `docs/specs/**`, canon, active briefs, current runtime code, and tests. Linear remains execution state. This file only helps agents avoid stale branches, duplicated audits, and context overloading.

For branch/worktree ownership, assigned agents, what is on each branch, and closeout plan, use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`. Any branch/worktree/workspace creation or cleanup must update that registry and pass `pnpm run workspace:audit`.

## Current Workspace Snapshot

- Snapshot date: 2026-07-03
- Base branch: `main`
- Current `main` HEAD at refresh start: `5a07d93` (`docs: clarify Feed Travel launch boundary (#197)`)
- Local worktree state at refresh: clean before this docs-only planning branch
- Active branch during this refresh: `docs/uprise-development-plan-r1`
- Open PR queue at refresh: PR #198 (`docs: add UPRISE development plan`) after branch creation
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Use `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md` as the current execution plan for UPRISE cleanup and launch-readiness work. Keep one branch-owning executor per implementation slice, use Codex local as the sequential PM/executor, and introduce a separate PM agent only when parallel branches/agents or broad cleanup require coordination.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `DOCS_OPS` / `EXTERNAL_TOOLS` / cross-lane planning |
| Branch | `docs/uprise-development-plan-r1` |
| Scope | Create a repo-visible UPRISE development plan and lightweight PM operating model from current `main` after PR #197. |
| Out of Scope | Runtime behavior changes, provider state, database/schema changes, art changes, product-doctrine changes, external-agent execution, and preserved UX reference cleanup. |
| Owner Contract | `docs/specs/system/documentation-framework.md`, `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`, `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md` |
| Companion Docs | `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`, `docs/handoff/2026-07-03_uprise-development-plan-r1.md` |
| Validation | `pnpm run workspace:audit`, `pnpm run docs:lint`, `git diff --check` |

## Current Branch / Worktree State

### Open PR Queue

PR #198: `docs: add UPRISE development plan` (`docs/uprise-development-plan-r1`).

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `docs/uprise-development-plan-r1` until this planning branch merges; `main` after merge | `5a07d93` at refresh start | clean before docs-only planning edits |

### Preserved UX Reference Worktrees

These worktrees/branches contain unmerged, separately staged, or intentionally preserved UX reference work. Do not remove, reset, rebase, force-push, or delete them without explicit approval.

| Path | Branch | Snapshot HEAD | Note |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` | `ux-implementation` | `be4ddde` | Broad Plot/profile/player/source-dashboard prototype. Preserve as design/runtime reference until extraction or archive decision. Do not merge wholesale. |
| `/home/baris/UPRISE_NEXT_uxmobile` | `ux-mobile-r1-build` | `b59a63c` | Broad mobile-first UX prototype. Preserve as design/runtime reference until extraction or archive decision. Do not merge wholesale. |

### Preserved UX Batch Branches

These are old UX/Reliant batch-output references. Do not merge wholesale. Preserve or archive only after explicit approval and an independent reviewer/auditor classification pass.

| Branch | Recommended Action |
| --- | --- |
| `feat/ux-batch17` | Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch18-run` | Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |

## Recently Completed Since Prior PM Snapshot

- PR #195 / `a83b667`: promoted Discover/player founder-session clarifications into owner specs and lane briefs.
- PR #196 / `052016f`: clarified the Feed Blast-card travel/source-link contract: Blast cards are Feed card types, blasted signals link to source objects, and eligible outside-Uprise Feed cards may expose a separate `Travel` handoff into Discover/back-door context.
- PR #197 / `5a07d93`: clarified that Feed-card `Travel` remains in the future outside-Uprise card contract while Travel/cross-Uprise Blast cards are not launch-scope.

Recent full cleanup history remains in prior handoffs and git history. Do not use old PM entries as product doctrine.

## Next Queue

1. Close `docs/uprise-development-plan-r1` and return to clean `main`.
2. Start `UPRISE_DEVELOPMENT_PLAN_R1` Stage 1 Task 1: Feed Blast card source-link contract tests.
3. Start Stage 1 Task 2: Feed Travel launch-boundary tests.
4. Start Stage 1 Task 3: Plot no-transport boundary tests.
5. Start Stage 2 Task 4: onboarding/Home Scene smoke hardening after Stage 1 locks merge.
6. Start Stage 3 Task 7 and Task 8: activation cutover transaction revalidation and normalized tuple matching before provider/staging activation work.

## PM Usage Rules For Agents

- Read this file for current execution state, then route through `docs/agent-briefs/CONTEXT_ROUTER.md` for lane context.
- Do not treat this file as product truth.
- If this file conflicts with `AGENTS.md`, `AGENTS.md` wins.
- If this file conflicts with an owner spec or runtime evidence, report the conflict and refresh this file.
- If a task is tiny and low-risk, do not create a process packet unless it helps.
- If a task is significant/risky, cross-lane, provider/db/schema/canon/doc-authority work, complex refactor, broad branch/worktree cleanup, prototype branch absorption, or an external-agent handoff, require the execution packet blocks named in the active documentation framework and use an independent reviewer/auditor pass when branch absorption or cleanup risk is non-trivial.
- For review/audit model routing, use `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`: Codex subagents are default; `gpt-5.3-codex-spark` handles basic/small passes and `gpt-5.5` with `reasoning_effort=xhigh` handles heavy/final gates. Hermes reviewer/auditor profiles are manual fallback only; `uprisewatchdog` is heartbeat-only.
- Before creating, assigning, pushing, preserving, merging, closing, or deleting a branch/worktree/workspace, update `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` and run `pnpm run workspace:audit`.

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
