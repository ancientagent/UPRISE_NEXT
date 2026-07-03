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
- Current `main` HEAD at refresh start: `d4dc636` (`fix(api): normalize activation tuple matching (#208)`)
- Local worktree state at refresh: active Task 9 docs/test edits on `docs/feed-card-family-inventory`
- Active branch during this refresh: `docs/feed-card-family-inventory`
- Open PR queue at refresh: none before Task 9 PR creation
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Complete UPRISE Development Plan R1 Task 9 and close the current goal after Task 8 and Task 9 are merged, validation passes, branch/PM state is refreshed, and the final repository audit is clean.

Reliant queue `.reliant/queue/uprise-development-plan-r1.json` currently shows all 8 queued UPRISE Development Plan R1 tasks complete. Task 9 is tracked outside that queue as the Feed card family inventory follow-up from Stage 4.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `UX_UI` with `ACTIONS_SIGNALS` and `EVENTS_ARCHIVE` companion checks |
| Branch | `docs/feed-card-family-inventory` |
| Scope | Task 9: inventory current Feed runtime cards and classify launch-scope, beta/deferred, source-facing, or remove/quarantine; add narrow regression locks only where they directly prevent drift. |
| Out of Scope | Runtime card actions, Travel activation, Discover transport implementation, provider/db/schema/art changes, product-doctrine changes, Promotions/Statistics reactivation, and source-management UI in Plot. |
| Owner Contracts | `docs/specs/communities/plot-and-scene-plot.md`, `docs/specs/core/signals-and-universal-actions.md`, `docs/specs/events/events-and-flyers.md` |
| Companion Docs | `docs/agent-briefs/UI_CURRENT.md`, `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`, `docs/agent-briefs/EVENTS_ARCHIVE.md`, `docs/solutions/FEED_CARD_FAMILY_INVENTORY_R1.md` |
| Validation | `pnpm --filter web test -- plot-ux-regression-lock.test.ts plot-tab-contracts.test.ts --runInBand`, `pnpm --filter web typecheck`, `pnpm run docs:lint`, `pnpm run workspace:audit`, `git diff --check` |

## Current Branch / Worktree State

### Open PR Queue

None at refresh time. Task 9 PR should be opened from `docs/feed-card-family-inventory` after local validation.

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `docs/feed-card-family-inventory` | `d4dc636` at branch start | active Task 9 docs/test inventory edits |

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

- PR #207 / `0f7f100`: refreshed Active PM and branch registry after UPRISE Development Plan tasks 1-7 merged.
- PR #208 / `d4dc636`: completed `UPRISE-PLAN-008`, activation tuple normalized matching.

Recent full cleanup history remains in prior handoffs and git history. Do not use old PM entries as product doctrine.

## Next Queue

1. Validate, push, and open PR for `docs/feed-card-family-inventory`.
2. Merge Task 9 after checks and reviewer gate if needed.
3. Refresh `main`, confirm local worktree clean, and run final completion audit for the active goal.
4. If continuing development after this goal, start Task 10: launch-scope Blast card runtime/source-link hardening. Keep Travel hidden/deferred and do not add general Plot transport.

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
