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
- Current `main` HEAD at refresh start: `25e06a2` (`docs: require feature plan review gate`)
- Active branch during this refresh: `test/source-listener-profile-boundary`
- Local worktree state at refresh: Task 11 tests/docs hardening branch
- Open PR queue at refresh: draft PR #212 (`docs/linear-clean-context-agent-roles`), intentionally preserved and not in this slice
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Current goal:

- Complete UPRISE Development Plan R1 Task 11: Source Dashboard / listener profile separation pass.
- Keep source selector and managed-source links in allowed profile/source seams.
- Do not place Release Deck, Print Shop, Registrar controls, or listener-to-artist DM affordances inside the listener collection/profile body.

Recently completed context:

- PR #210 merged the final Task 8 / Task 9 closeout at `50c6e8b`.
- PR #211 merged the pre-implementation feature-plan review gate at `25e06a2`.
- Draft PR #212 remains open for Linear clean-context agent roles and is not priority unless explicitly resumed.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `ARTIST_SOURCE` / `REGISTRAR_GOVERNANCE` / listener profile boundary |
| Branch | `test/source-listener-profile-boundary` |
| Scope | Task 11 contract-test hardening for Source Dashboard / listener profile separation. |
| Out of Scope | Runtime behavior changes, provider/db/schema/art changes, product-doctrine changes, Task 12 event path work. |
| Owner Contracts | `docs/specs/users/identity-roles-capabilities.md`, `docs/specs/system/registrar.md` |
| Companion Docs | `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`, `docs/agent-briefs/REGISTRAR_GOVERNANCE.md`, `docs/founder-sessions/2026-07-03_source-listener-messaging-boundary.md` |
| Validation | `pnpm --filter web test -- source-dashboard-shell-lock.test.ts source-account-switcher-lock.test.ts plot-ux-regression-lock.test.ts route-ux-consistency-lock.test.ts --runInBand`, `pnpm --filter web typecheck`, `pnpm run docs:lint`, `pnpm run workspace:audit`, `git diff --check` |

## Current Branch / Worktree State

### Open PR Queue

| PR | Branch | State | Recommended Action |
| --- | --- | --- | --- |
| #212 | `docs/linear-clean-context-agent-roles` | draft, green, mergeable | Preserve as draft; do not merge/close unless user reprioritizes the Linear clean-context workflow. |

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `test/source-listener-profile-boundary` | `25e06a2` at branch start | Task 11 focused tests/docs branch |

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

- PR #210 / `50c6e8b`: closed the Task 8 + Task 9 goal state after activation tuple matching and Feed card family inventory merged.
- PR #211 / `25e06a2`: added the pre-implementation feature gate for behavior-changing feature work.

## Next Queue

1. Complete and PR Task 11 from `test/source-listener-profile-boundary`.
2. Return to clean `main` after Task 11 merges or is handed off.
3. Start Task 12: Print Shop source-facing event path.
4. Keep draft PR #212 untouched unless the user explicitly reprioritizes Linear clean-context agent roles.

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
