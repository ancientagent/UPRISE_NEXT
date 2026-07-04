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

- Snapshot date: 2026-07-04
- Base branch: `main`
- Current `main` HEAD at refresh start: `64e65fe` (`docs: lighten UPRISE skill standing orders (#221)`)
- Active branch during this refresh: `docs/development-plan-closeout-refresh`
- Local worktree state at refresh: development-plan / Active PM closeout refresh
- Open PR queue at refresh: draft PR #212 (`docs/linear-clean-context-agent-roles`) only; PR #221 merged
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Current goal:

- Reconcile UPRISE Development Plan R1 and Active PM after PR #221 merged.
- Mark already-merged Tasks 1-9 and 11-12 accurately so agents do not repeat completed work.
- Set Stage 4 Task 10 as the next real development signal.
- Leave draft PR #212 preserved and out of scope.

Recently completed context:

- PR #221 merged the skill standing-orders lightening rule at `64e65fe`.
- Development Plan R1 Tasks 1-9 and 11-12 have merged; Task 10 remains the next implementation slice.
- Draft PR #212 remains open for Linear clean-context agent roles and is not priority unless explicitly resumed.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | context-steward / execution-process docs |
| Branch | `docs/development-plan-closeout-refresh` |
| Scope | Docs/operations refresh so the active plan points at remaining development instead of completed Tasks 1-9 and 11-12. |
| Out of Scope | Runtime behavior changes, provider/db/schema/art changes, product-doctrine changes, merging/closing PR #212. |
| Owner Contracts | `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md`, `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` |
| Companion Docs | `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` |
| Validation | `pnpm run docs:lint`, `pnpm run workspace:audit`, `git diff --check` |

## Current Branch / Worktree State

### Open PR Queue

| PR | Branch | State | Recommended Action |
| --- | --- | --- | --- |
| #212 | `docs/linear-clean-context-agent-roles` | draft, intentionally deprioritized | Preserve as draft; do not merge/close unless user reprioritizes the Linear clean-context workflow. |

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `docs/development-plan-closeout-refresh` | `64e65fe` at branch start | Development-plan / Active PM closeout refresh |

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

- PR #221 / `64e65fe`: skill standing-orders lightening and repo-controlled skill snapshots.
- Tasks 1-9 and 11-12 from `docs/operations/UPRISE_DEVELOPMENT_PLAN_R1.md` are merged according to branch registry, handoffs, and current runtime/test evidence.

## Next Queue

1. Finish this development-plan closeout refresh branch.
2. Keep draft PR #212 untouched unless the user explicitly reprioritizes Linear clean-context agent roles.
3. Start Stage 4 Task 10: Launch-scope Blast card runtime.
4. Use the feature implementation loop for Task 10: executor repo review + plan, independent Codex plan review, implementation, targeted tests, and post-implementation review if the slice changes runtime behavior.
5. After Task 10, run a focused launch vertical-slice smoke pass before expanding deferred Discover/Travel/map/Seek work.

## PM Usage Rules For Agents

- Read this file for current execution state, then route through `docs/agent-briefs/CONTEXT_ROUTER.md` for lane context.
- Do not treat this file as product truth.
- If this file conflicts with `AGENTS.md`, `AGENTS.md` wins.
- If this file conflicts with an owner spec or runtime evidence, report the conflict and refresh this file.
- If a task is tiny and low-risk, do not create a process packet unless it helps.
- If a task is significant/risky, cross-lane, provider/db/schema/canon/doc-authority work, complex refactor, broad branch/worktree cleanup, prototype branch absorption, or an external-agent handoff, require the execution packet blocks named in the active documentation framework and use an independent reviewer/auditor pass when branch absorption or cleanup risk is non-trivial.
- For UPRISE first-pass implementation, the packet should define what to build from owner specs/current repo evidence. Do not force source-drift cleanup or excavator framing unless stale/wrong existing behavior is actually in scope.
- For feature or behavior-changing implementation work, the assigning owner must give the assigned executor a context packet with lane, owner contract, required docs, likely files, known runtime/tests to inspect, validation seed, out-of-scope boundaries, and stop conditions. The assigned executor verifies the packet against current repo evidence before writing the plan.
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
