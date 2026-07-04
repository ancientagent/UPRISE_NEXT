# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-04

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
- Current `main` HEAD at refresh start: `b81c5f3`
- Active branch during this refresh: `chore/screen-package-agent-flow`
- Local worktree state at refresh: screen-package agent automation flow docs/scripts update
- Open PR queue at refresh: draft PR #212 (`docs/linear-clean-context-agent-roles`) remains intentionally deprioritized
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Current goal:

- Implement the new agent automation flow for major UPRISE screen packages.
- Keep durable product truth in owner specs while screen packages store execution artifacts.
- Add a deterministic repo runner that inspects/scaffolds/advances screen-package gates and can later be wrapped by LangGraph if persistent human-in-the-loop orchestration is needed.
- Preserve draft PR #212 unless the user explicitly reprioritizes Linear clean-context agent roles.

Recently completed context:

- Major-screen workflow was evaluated by the team-manager lane and rated `patch`, not reject.
- The Artist Profile / Source Dashboard package is the first seeded package for the new workflow.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | context-steward / agent automation / artist-source package seed |
| Branch | `chore/screen-package-agent-flow` |
| Scope | Add screen-package workflow docs, repo/local skill routing, Artist Profile / Source Dashboard package seed, and `screen-package:flow` runner/test. |
| Out of Scope | Provider/db/schema/art mutation, runtime app behavior changes, completing all Artist Profile implementation gates, merging/closing draft PR #212. |
| Owner Contracts | `AGENTS.md`, `docs/specs/system/documentation-framework.md`, `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`, `docs/specs/users/artist-profile-and-source-dashboard.md` |
| Companion Docs | `docs/AGENT_STRATEGY_AND_HANDOFF.md`, `docs/screen-packages/**`, `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md` |
| Validation | `pnpm run screen-package:flow:test`, `pnpm run screen-package:flow -- status --package artist-profile-source-dashboard`, `pnpm run docs:lint`, `git diff --check`, `pnpm run workspace:audit` before push/PR |

## Current Branch / Worktree State

### Open PR Queue

| PR | Branch | State | Recommended Action |
| --- | --- | --- | --- |
| #212 | `docs/linear-clean-context-agent-roles` | draft, intentionally deprioritized | Preserve as draft; do not merge/close unless user reprioritizes the Linear clean-context workflow. |

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `chore/screen-package-agent-flow` | `e808244` | Screen-package agent automation flow update. |

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

- PR #224 / lean PR standing orders was absorbed into current `main` before this slice.
- Current slice registered as `screen-package-agent-flow` in `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`.

## Next Queue

1. Finish and PR `chore/screen-package-agent-flow`.
2. Keep draft PR #212 untouched unless the user explicitly reprioritizes Linear clean-context agent roles.
3. After this automation slice, use the screen-package runner to dispatch the Artist Profile / Source Dashboard Dev Spec and Design Spec gates.

## PM Usage Rules For Agents

- Read this file for current execution state, then route through `docs/agent-briefs/CONTEXT_ROUTER.md` for lane context.
- Do not treat this file as product truth.
- If this file conflicts with `AGENTS.md`, `AGENTS.md` wins.
- If this file conflicts with an owner spec or runtime evidence, report the conflict and refresh this file.
- If a task is tiny and low-risk, do not create a process packet unless it helps.
- Default to the lean PR path for small/medium slices: scoped implementation, focused validation, required docs only, one bounded review only when behavior/risk justifies it, then merge/auto-merge without CI babysitting.
- If a task is significant/risky, cross-lane, provider/db/schema/canon/doc-authority work, complex refactor, broad branch/worktree cleanup, prototype branch absorption, or an external-agent handoff, require the execution packet blocks named in the active documentation framework and use an independent reviewer/auditor pass when branch absorption or cleanup risk is non-trivial.
- For UPRISE first-pass implementation, the packet should define what to build from owner specs/current repo evidence. Do not force source-drift cleanup or excavator framing unless stale/wrong existing behavior is actually in scope.
- For feature or behavior-changing implementation work, the assigning owner must give the assigned executor enough context to avoid drift: lane, owner contract, required docs, likely files, known runtime/tests to inspect, validation seed, out-of-scope boundaries, and stop conditions. The assigned executor verifies that packet against current repo evidence before writing the plan. Use the full packet/review loop when risk justifies it, not as ceremony for every small change.
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
