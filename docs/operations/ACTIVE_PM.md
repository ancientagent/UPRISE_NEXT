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
- Base branch: `origin/main` at `5ae79b8`; local `main` has operations-only checkpoints through `375d06c`
- Active branch: `codex/release-deck-scheduling-client`
- Local worktree state: scheduling client complete and independently reviewed; founder authorized staged remote PR submission
- Open PR queue at refresh: implementation PR #238 (`codex/release-deck-scheduling-client`) is open after independent review; draft PR #212 (`docs/linear-clean-context-agent-roles`) remains intentionally deprioritized and conflicting
- Recently completed runtime stack: PR #236 merged Release Deck schedule writes and Fair Play ingestion; PR #237 was docs-only avatar boundary work
- Provider/db/schema state: no new migration or provider change in the current client slice; existing `ReleaseDeckSchedule` persistence is being consumed
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Current goal:

- Keep Codex local as the sole writer and reviewers read-only.
- Submit the reviewed scheduling client as the first focused PR.
- After it establishes the remote baseline, rebase and separately submit the
  reviewed New Releases graduation slice.
- Begin Slice 6 official Sect/song-level backing and Slice 7 backing authority
  only through independently reviewed plans and bounded implementation slices.
- Keep the raw founder-session capture, draft PR #212, and preserved UX
  worktrees/branches out of these submissions.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | Source Dashboard / Release Deck |
| Branch | `codex/release-deck-scheduling-client` |
| Scope | Add server-owned schedule availability, durable existing-schedule restore, and `soonest` / returned-`chosen` scheduling to the loaded Release Deck row; align owner docs and focused tests. |
| Out of Scope | Fair Play ordering/controls, automatic ingestion jobs, graduation, song-level sect backing, replacement/removal, upload/storage, paid-ad runtime, remote push/PR. |
| Owner Contracts | `docs/specs/media/release-deck-and-eligibility.md`, `docs/specs/users/artist-profile-and-source-dashboard.md`, `docs/specs/broadcast/radiyo-and-fair-play.md` |
| Companion Docs | `docs/handoff/2026-07-08_release-deck-schedule-write-path.md`, `docs/handoff/2026-07-08_release-deck-fair-play-ingestion.md`, `docs/screen-packages/artist-profile-source-dashboard/README.md` |
| Validation | focused web/API scheduling tests, web/API typecheck, docs lint, diff check, workspace audit, read-only reviewer passes |

## Current Branch / Worktree State

### Open PR Queue

| PR | Branch | State | Recommended Action |
| --- | --- | --- | --- |
| #238 | `codex/release-deck-scheduling-client` | open, independently reviewed | Await required checks/codeowner review, then merge through the protected PR path. |
| #212 | `docs/linear-clean-context-agent-roles` | open draft, conflicting, intentionally deprioritized | Preserve as draft; do not merge/close unless user reprioritizes the Linear clean-context workflow. |

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `codex/release-deck-scheduling-client` | PR #238 submission checkpoint | Open implementation PR; reviewers remain read-only. |

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

1. Land independently reviewed scheduling-client PR #238 through the protected PR path.
2. After PR #238 establishes the remote baseline, rebase, reverify, and independently review the graduation branch before its separate PR.
3. Start Slice 6 official Sect/song-level backing with a heavy schema/owner-contract plan review before implementation.
4. Follow with a separately reviewed Slice 7 source-authorized backing API checkpoint only after Slice 6 has a safe baseline.
5. Keep the founder-session capture, draft PR #212, and preserved UX reference worktrees/branches untouched.

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
