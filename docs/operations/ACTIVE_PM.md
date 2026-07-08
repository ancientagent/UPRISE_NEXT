# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-07

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

- Snapshot date: 2026-07-07
- Base branch: `main`
- Current `origin/main` HEAD at refresh: `354e6f4`
- Active branch during this refresh: `docs/post-227-branch-hygiene-refresh`
- Local worktree state at refresh: clean branch from current `main` with operations-doc refresh only
- Open PR queue at refresh: draft PR #212 (`docs/linear-clean-context-agent-roles`) remains intentionally deprioritized and conflicting; no active implementation PR is open
- Recently closed PR: PR #227 (`docs/artist-profile-source-dashboard-specs`) merged at `2026-07-08T03:23:30Z`; remote branch deleted/pruned
- Provider/db/schema state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Current goal:

- Keep the repo branch/worktree/PR control plane accurate after PR #227 merged.
- Preserve existing UX reference branches/worktrees until explicit extraction/archive approval.
- Keep draft PR #212 untouched unless the user explicitly reprioritizes Linear clean-context agent roles.
- Identify remote-only cleanup candidates without deleting branches until explicit approval.

Recently completed context:

- PR #225 merged the `screen-package:flow` runner and Artist Profile / Source Dashboard seed package into `main`.
- PR #226 refreshed PM/registry state after PR #225 and pointed the next signal at Dev Spec / Design Spec gates.
- PR #227 merged Artist Profile / Source Dashboard screen-package specs, source-dashboard design/art handoff, public Artist Profile context, Home/Plot visual-language notes, and related owner-spec/lane-brief promotions.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | operations / branch hygiene |
| Branch | `docs/post-227-branch-hygiene-refresh` |
| Scope | Refresh Active PM and branch workspace registry after PR #227 merged; record branch/worktree hygiene findings and remote cleanup candidates without deleting refs. |
| Out of Scope | Provider/db/schema mutation, product doctrine changes, deleting remote branches without explicit approval, merging/closing draft PR #212, deleting preserved UX worktrees/branches. |
| Owner Contracts | `AGENTS.md`, `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`, `docs/specs/system/documentation-framework.md` |
| Companion Docs | `docs/AGENT_STRATEGY_AND_HANDOFF.md`, `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`, `docs/handoff/2026-07-07_branch-workspace-hygiene-refresh.md` |
| Validation | `pnpm run docs:lint`, `git diff --check`, `pnpm run workspace:audit`, `node scripts/workspace-registry.mjs audit --include-remote` |

## Current Branch / Worktree State

### Open PR Queue

| PR | Branch | State | Recommended Action |
| --- | --- | --- | --- |
| #212 | `docs/linear-clean-context-agent-roles` | open draft, conflicting, intentionally deprioritized | Preserve as draft; do not merge/close unless user reprioritizes the Linear clean-context workflow. |

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `docs/post-227-branch-hygiene-refresh` | `354e6f4` base plus ops-doc changes | Branch hygiene refresh after PR #227 merged. |

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

### Remote Cleanup Candidates

Remote-only refs may predate the branch registry. The following were observed during the 2026-07-07 hygiene pass.

Clearly merged into `origin/main` by ancestry, but not registered because they are historical remote-only refs:

- `origin/abacus/community-activation-proxy-lifecycle`
- `origin/audit/music-community-preference-runtime-parity`
- `origin/chore/staging-readiness-and-seed-safety`
- `origin/docs/abacus-fusion-swarm-strategy`
- `origin/docs/plot-tab-stale-term-annotations`
- `origin/docs/submitted-location-gps-staging-smoke`
- `origin/docs/systems-scale-no-one-off-community`
- `origin/docs/voice-plot-dashboard-definition`
- `origin/feat/onboarding-home-scene-resolution`
- `origin/feat/player-profile-contract-hardening`
- `origin/feat/plot-shell-archive-contract-hardening`
- `origin/feat/submitted-location-gps-authority`
- `origin/feat/ux-foundation-screen-shell`
- `origin/feat/ux-founder-locks-and-harness`
- `origin/fix/api-typecheck-tx`
- `origin/fix/artist-profile-public-read`
- `origin/fix/onboarding-music-community-option-labels`
- `origin/fix/print-shop-location-defaults`
- `origin/fix/release-deck-mvp-validation`
- `origin/fix/source-account-context-hardening`
- `origin/next-from-origin-main`
- `origin/next-slice58-registrar-artist-dispatch-controller-tests`
- `origin/next-slice64-phase2-roadmap-kickoff`
- `origin/phase3-batchc-098-099`
- `origin/phase3-next`
- `origin/test/onboarding-home-scene-smoke`

Needs explicit review/approval before deletion:

- `origin/codex/propose-prisma-schema-migration` - old closed draft PR #1, one unique commit, likely obsolete schema draft.
- `origin/docs/hermes-launch-reviewer` - PR #87 merged, but branch head is not ancestry-merged, likely squash/merge artifact.
- `origin/docs/upr-11-staging-seed` - PR #88 merged, but branch head is not ancestry-merged, likely squash/merge artifact.
- `origin/docs/linear-clean-context-agent-roles` - open draft PR #212; keep unless reprioritized or explicitly closed.
- `origin/feat/ux-batch17` - preserved.
- `origin/feat/ux-batch18-run` - preserved.
- `origin/ux-implementation` - preserved worktree.
- `origin/ux-mobile-r1-build` - preserved worktree.

## Next Queue

1. Finish this branch hygiene refresh PR and merge when docs lint, workspace audit, and required checks pass.
2. If approved, run a separate remote cleanup pass for the clearly merged remote-only refs listed above.
3. Keep draft PR #212 untouched unless the user explicitly reprioritizes Linear clean-context agent roles.
4. Keep UX reference worktrees/branches until an explicit extraction/archive decision.
5. Resume product development from current `main`; the likely next implementation signal remains a small vertical Artist Profile / Source Dashboard slice from the merged screen package.

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
