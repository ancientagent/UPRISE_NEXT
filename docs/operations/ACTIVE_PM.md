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
- Current `main` HEAD at refresh start: `414f1a0`
- Active branch during this refresh: `docs/artist-profile-source-dashboard-specs`
- Local worktree state at refresh: Artist Profile / Source Dashboard screen-package Dev Spec, Design Spec, and spec-package review gate
- Open PR queue at refresh: draft PR #212 (`docs/linear-clean-context-agent-roles`) remains intentionally deprioritized
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Current goal:

- Advance the Artist Profile / Source Dashboard screen package through its Dev Spec, Design Spec, and spec-package review gates.
- Preserve the split between public Artist Profile, Source Dashboard/source-admin tooling, Registrar civic/source lifecycle, Release Deck media eligibility, and listener profile surfaces.
- Keep durable product truth in owner specs while package docs store execution artifacts.
- Preserve draft PR #212 unless the user explicitly reprioritizes Linear clean-context agent roles.

Recently completed context:

- PR #225 merged the `screen-package:flow` runner and Artist Profile / Source Dashboard seed package into `main`.
- PR #226 refreshed PM/registry state after PR #225 and pointed the next signal at Dev Spec / Design Spec gates.
- Parallel Dev Spec and Design Spec agents produced `spec/dev-spec.md` and `design-spec/ux-plan.md`.
- Spec-package reviewer returned `Decision: pass` in `review/spec-package-review.md`.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | artist-source package / context-steward |
| Branch | `docs/artist-profile-source-dashboard-specs` |
| Scope | Add Artist Profile / Source Dashboard screen-package Dev Spec, Design Spec, spec-package review, package metadata updates, and handoff. |
| Out of Scope | Provider/db/schema/art mutation, runtime app behavior changes, implementation plan, implementation code, art/creative asset generation, merging/closing draft PR #212. |
| Owner Contracts | `AGENTS.md`, `docs/specs/system/documentation-framework.md`, `docs/specs/users/artist-profile-and-source-dashboard.md`, `docs/specs/system/registrar.md`, `docs/specs/media/release-deck-and-eligibility.md`, `docs/specs/core/signals-and-universal-actions.md`, `docs/specs/social/message-boards-groups-blast.md` |
| Companion Docs | `docs/AGENT_STRATEGY_AND_HANDOFF.md`, `docs/screen-packages/artist-profile-source-dashboard/**`, `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`, `docs/solutions/SCREEN_NARRATIVE_ARTIST_PROFILE_SOURCE_DASHBOARD_R1.md` |
| Validation | `pnpm run screen-package:flow -- status --package artist-profile-source-dashboard`, `pnpm run docs:lint`, `git diff --check`, `pnpm run workspace:audit` before push/PR |

## Current Branch / Worktree State

### Open PR Queue

| PR | Branch | State | Recommended Action |
| --- | --- | --- | --- |
| #212 | `docs/linear-clean-context-agent-roles` | draft, intentionally deprioritized | Preserve as draft; do not merge/close unless user reprioritizes the Linear clean-context workflow. |

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `docs/artist-profile-source-dashboard-specs` | `HEAD` | Screen-package specs/review gate branch. |

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

- PR #225 / screen-package agent flow merged into `main` at `02bb5b6`.
- PR #226 / screen-package flow closeout refresh merged into `main` at `414f1a0`.
- Current branch registered as `artist-profile-source-dashboard-specs` in `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`.

## Next Queue

1. Open and merge this docs-only spec-package PR after validation.
2. Keep draft PR #212 untouched unless the user explicitly reprioritizes Linear clean-context agent roles.
3. Next screen-package signal after this branch merges:

```bash
pnpm run screen-package:flow -- status --package artist-profile-source-dashboard
pnpm run screen-package:flow -- next --package artist-profile-source-dashboard
```

Current next signal after this branch: pick one small vertical Artist Profile / Source Dashboard implementation slice from the passed Dev Spec + Design Spec + review package. If scope is not obvious, create `docs/screen-packages/artist-profile-source-dashboard/implementation/slice-contract.md`; do not require a full implementation plan or file-ownership packet by default.

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
