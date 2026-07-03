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
- Current `main` HEAD at refresh start: `88f97a1` (`test(api): close activation readiness revalidation (#206)`)
- Local worktree state at refresh: clean before this docs closeout branch
- Active branch during this refresh: `docs/tasks-1-7-closeout-refresh`
- Open PR queue at refresh: none before branch creation
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Use `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md` as the current execution plan for UPRISE cleanup and launch-readiness work. Tasks `UPRISE-PLAN-001` through `UPRISE-PLAN-007` are complete and merged. `UPRISE-PLAN-008` remains queued.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `DOCS_OPS` / execution-state closeout |
| Branch | `docs/tasks-1-7-closeout-refresh` |
| Scope | Refresh Active PM and branch registry after UPRISE Development Plan tasks 1-7 merged. |
| Out of Scope | Runtime product behavior changes, provider state, database/schema changes, art changes, product-doctrine changes, and preserved UX reference cleanup. |
| Owner Contract | `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md`, `.reliant/queue/uprise-development-plan-r1.json` |
| Companion Docs | `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`, task handoffs under `docs/handoff/2026-07-03_*` |
| Validation | `pnpm run workspace:audit`, `pnpm run docs:lint`, `node scripts/reliant-slice-queue.mjs status --queue .reliant/queue/uprise-development-plan-r1.json --runtime .reliant/runtime/current-task-uprise-development-plan-r1.json`, `git diff --check` |

## Current Branch / Worktree State

### Open PR Queue

None at refresh time.

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `docs/tasks-1-7-closeout-refresh` until this closeout branch merges; `main` after merge | `88f97a1` at refresh start | clean before closeout edits |

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

- PR #198 / `8812a0b`: added `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md` and recorded the lightweight PM operating model.
- PR #199 / `2ce8684`: added Reliant queue tooling for the current UPRISE Development Plan R1.
- PR #200 / `6aad9f2`: completed `UPRISE-PLAN-001`, Feed Blast card source-link contract tests.
- PR #201 / `c6e1e2c`: completed `UPRISE-PLAN-002`, Feed Travel launch-boundary tests.
- PR #202 / `cc57dc5`: completed `UPRISE-PLAN-003`, Plot no-transport boundary tests.
- PR #203 / `c4fa768`: completed `UPRISE-PLAN-004`, onboarding/Home Scene smoke hardening.
- PR #204 / `3f746db`: completed `UPRISE-PLAN-005`, Registrar/source GPS authority hardening.
- PR #205 / `1708f19`: completed `UPRISE-PLAN-006`, Release Deck media eligibility hardening.
- PR #206 / `88f97a1`: completed `UPRISE-PLAN-007`, activation readiness transaction revalidation closeout.

Recent full cleanup history remains in prior handoffs and git history. Do not use old PM entries as product doctrine.

## Next Queue

1. Merge this docs-only closeout branch after checks.
2. Return to clean `main`.
3. Decide whether to continue into `UPRISE-PLAN-008`: activation tuple normalized matching closeout.
4. Do not touch provider/staging activation work until the task 8 normalized matching item is complete or explicitly deferred.

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
