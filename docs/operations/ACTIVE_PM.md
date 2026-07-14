# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-14

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

- Snapshot date: 2026-07-14
- Base branch: `origin/main` at `a55a54f` after scheduling-client PR #238 merged
- Current branch: `codex/new-releases-graduation`, active for the authorized sequential submission
- Local worktree state at refresh: rebased onto the scheduling baseline, freshly reverified, and applying the bounded reviewer-requested operations correction
- Open PR queue at refresh: draft PR #212 remains intentionally deprioritized; PR #238 is merged
- Recently completed remote slice: scheduling-client PR #238; graduation is rebased and reverified, with final bounded re-review in progress before push/PR
- Provider/db/schema state: no provider writes; the graduation slice does not require schema changes
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Current goal:

- Submit the completed manual New Releases to Main Rotation graduation slice as a separate focused PR after rebasing it onto `origin/main`.
- Keep Codex local as the sole writer and all review agents read-only.
- Route the next architecture signal through a fresh reviewed plan before any Slice 6 Sect/song-level backing schema work begins.

Recently completed context:

- PR #236 merged the Release Deck scheduling stack and related source/listener identity and Support/avatar spec promotions.
- PR #237 merged the avatar creation/account-profile versus Personal Space/Inventory boundary.
- The Release Deck scheduling client content merged through PR #238 at `a55a54f`; its local branch remains preserved only until sequential closeout is complete.
- The local-only graduation slice adds exact stored-window eligibility, dry-run/write execution, deterministic engagement-derived initial recurrence, and conditional idempotent rotation updates; independent plan, code, and product reviews passed.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | API / Fair Play lifecycle |
| Branch | `codex/new-releases-graduation` (active sequential submission) |
| Scope | Completed manual authenticated graduation dry-run/write path using each entry's locked New Releases window and the configured rolling engagement window for deterministic recurrence initialization. |
| Out of Scope | Cron/queue activation, automatic propagation, vote/engagement mutation, cap policy, removal/floor policy, UI work, schema/migration work, RBAC invention, provider writes, push/PR activity. |
| Owner Contracts | `AGENTS.md`, `docs/specs/broadcast/radiyo-and-fair-play.md`, `docs/specs/admin/super-admin-controls.md`, `docs/solutions/RELEASE_DECK_RADIYO_SECT_IMPLEMENTATION_ARCHITECTURE_R1.md` |
| Companion Docs | `docs/AGENT_STRATEGY_AND_HANDOFF.md`, `docs/agent-briefs/CONTEXT_ROUTER.md`, current Fair Play ingestion/service/schema/tests |
| Validation | focused API graduation/controller/service tests; Fair Play regression tests; `pnpm run verify`; `pnpm run workspace:audit`; `git diff --check`; independent read-only plan/code/product reviews |

## Current Branch / Worktree State

### Open PR Queue

| PR | Branch | State | Recommended Action |
| --- | --- | --- | --- |
| #238 | `codex/release-deck-scheduling-client` | merged at `a55a54f` | Baseline established; preserve the local branch until sequential closeout is complete. |
| #212 | `docs/linear-clean-context-agent-roles` | open draft, conflicting, intentionally deprioritized | Preserve as draft; do not merge/close unless user reprioritizes the Linear clean-context workflow. |

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `codex/new-releases-graduation` | rebased branch HEAD after fresh validation | Active sole-writer submission; bounded final re-review in progress. |

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

1. Complete the bounded operations-doc re-review, then push and open the graduation PR against the merged scheduling baseline.
2. Begin Slice 6 Official Sect/song-level backing with owner-contract/schema review and an independently reviewed implementation plan before writing it.
3. Keep cron/queue automation, propagation/cap policy, unresolved RBAC, and UI expansion out of the next slice unless owner contracts explicitly authorize them.
4. Keep draft PR #212 and preserved UX reference worktrees/branches untouched unless the user explicitly reprioritizes them.

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
