# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-01

## Purpose

This file is the lightweight current-work control plane for UPRISE agents.

Use it to answer:

- what is active right now?
- which branch or PR should agents inspect first?
- what is blocked, deferred, or not safe to touch?
- what validation belongs to the current slice?
- which docs/specs/handoffs should an agent load before expanding context?

This file is not product doctrine, canon, or an owner spec. Durable product truth remains in `docs/specs/**`, canon, active briefs, current runtime code, and tests. Linear remains execution state. This file only helps agents avoid stale branches, duplicated audits, and context overloading.

## Update Rule

Update this file when any of the following changes:

- active implementation branch or PR;
- active goal or next slice;
- open PR queue;
- branch/worktree cleanup status;
- provider/db/schema/canon risk state;
- blocker that affects which agent should work next.

Keep updates small. Do not paste full audit reports here. Link to the owner spec, handoff, Linear issue, or PR instead.

## Current Workspace Snapshot

- Snapshot date: 2026-07-01
- Base branch: `main`
- Base HEAD: `99b0072` (`docs: add active PM current work snapshot (#150)`)
- Current docs slice branch: `docs/active-pm-branch-triage`
- Open PR queue at snapshot: none
- Main worktree state at snapshot: clean before this docs slice

## Active Goal

Keep the UPRISE working set clean enough that new Codex / Cloud Codex / Hermes / Abacus tasks start from current `main`, understand which leftover branches are safe cleanup candidates, and do not disturb unmerged worktrees without approval.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `uprise-context-steward` / branch hygiene |
| Branch | `docs/active-pm-branch-triage` |
| Scope | Record post-PR #150 branch/worktree triage and next cleanup signals. |
| Out of Scope | Branch deletion, worktree removal, destructive git operations, product doctrine, runtime code, provider state, database/schema changes. |
| Owner Contract | `docs/specs/system/documentation-framework.md` |
| Companion Doc | `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` |
| Validation | `pnpm run docs:lint`, `git diff --check` |

## Branch Triage Snapshot

Captured after PR #150 merged and `main` fast-forwarded to `99b0072`.

### Cleanup Candidates: Patch-Equivalent Or Already Absorbed

These branches showed patch-equivalent commits with `git cherry -v main <branch>` (`-` marker) or no unique diff. They are cleanup candidates, but deletion still requires explicit approval.

| Branch | Evidence | Recommended Action |
| --- | --- | --- |
| `docs/active-pm-current-work` | PR #150 merged; patch-equivalent commit `38c3a90`; remote branch still visible after merge. | Delete local/remote branch after approval. |
| `test/activation-cutover-fixture-smoke` | Patch-equivalent commit `b0fb8d6`; content already present on `main`. | Delete branch after approval. |
| `docs/post-deploy-launch-readiness-2026-06-29` | Patch-equivalent commit `8ae04f4`; content already present on `main`. | Delete branch after approval. |
| `chore/launch-readiness-verification-2026-06-29` | Patch-equivalent commit `bca4aa0`; content already present on `main`. | Delete branch after approval. |
| `chore/track-art-assets` | Patch-equivalent commit `d9912fe`; art assets already absorbed. | Delete branch after approval; do not touch `art/` files directly. |
| `docs/browser-qa-lane-readiness` | Patch-equivalent commit `335dd29`; content already present on `main`. | Delete branch after approval. |
| `docs/uprise-ai-stack-agent-lanes` | Patch-equivalent commit `3bb59b2`; content already present on `main`. | Delete branch after approval. |
| `feat/archive-event-terminology-cleanup` | Patch-equivalent commit `f121067`; content already present on `main`. | Delete branch after approval. |
| `feat/ux-batch18` | No commits unique to branch; attached worktree is behind `main`. | Remove attached worktree and delete branch after approval. |

### Preserve / Review Before Any Cleanup

These branches still have unique commits or broad diffs against `main`. Do not delete, rebase, or remove their worktrees without explicit owner review.

| Branch | Triage |
| --- | --- |
| `fix/fair-play-resolver-di-staging` | Unique Fair Play DI + onboarding label fixes. Needs review against current main before deciding cherry-pick vs superseded. |
| `feat/preference-resolver-runtime-adoption` | Unique resolver adoption and staging CORS closeout commits. Likely partially superseded by current main; needs targeted API diff review. |
| `audit/home-scene-community-cleanup-plan` | Unique audit handoff. Preserve until reviewed for current relevance. |
| `audit/registrar-source-origin-compatibility` | Unique audit handoff. Preserve until reviewed for current relevance. |
| `feat/default-music-community-preference-resolver` | Unique resolver foundation branch. Likely ancestor concept of later resolver adoption; review before delete. |
| `feat/missing-community-request-intake` | Large older onboarding/schema branch; likely heavily superseded but still unique. Needs deliberate review, not blind deletion. |
| `feat/ux-batch17` | Older UX/Reliant queue outputs and runtime/test changes. Preserve until UX queue owner decides archival value. |
| `feat/ux-batch18-prep` | Attached worktree with queue/prep docs. Preserve until UX batch decision. |
| `feat/ux-batch18-run` | Batch 18 run outputs and UI/test changes. Preserve until UX batch decision. |
| `feat/ux-batch19-prep` | Attached worktree with queue/prep docs. Preserve until UX batch decision. |
| `ux-mobile-r1-build` | Attached worktree; broad mobile UX/onboarding/plot changes. Needs design/runtime review before any cleanup. |
| `ux-implementation` | Attached worktree; broad Plot/profile/player/source dashboard prototype work. Needs design/runtime review before any cleanup. |
| `phase3-no-automation-rollback` | Attached worktree; agent-control / registrar-code / automation bridge history. Preserve until automation/runtime owner decision. |
| `phase3-runtime-followups` | Similar phase3 automation/runtime work; overlaps with backup branch. Review for duplicate/obsolete state. |
| `backup/phase3-runtime-followups-20260224-150716` | Backup of phase3 runtime followups. Keep until phase3 branch owner confirms safe archival/removal. |
| `phase3-mvp-roadmap-slice88-runtime` | Older phase3 runtime branch. Review with phase3 set. |
| `review-risk-p3-rev-002` | Older phase3 review branch. Review with phase3 set. |
| `docs/artist-identity-canon-fix` | Unique docs/canon-aligned identity fixes. Needs review against current identity specs before cleanup. |

## Next Queue

1. If approved, delete the cleanup-candidate branches listed above. For `feat/ux-batch18`, remove the attached worktree first, then delete the branch.
2. Review the preserved unique branches in groups:
   - resolver/onboarding: `fix/fair-play-resolver-di-staging`, `feat/preference-resolver-runtime-adoption`, `feat/default-music-community-preference-resolver`, `feat/missing-community-request-intake`
   - UX batches/prototypes: `feat/ux-batch17`, `feat/ux-batch18-prep`, `feat/ux-batch18-run`, `feat/ux-batch19-prep`, `ux-mobile-r1-build`, `ux-implementation`
   - phase3 automation/runtime: `phase3-no-automation-rollback`, `phase3-runtime-followups`, `backup/phase3-runtime-followups-20260224-150716`, `phase3-mvp-roadmap-slice88-runtime`, `review-risk-p3-rev-002`
   - docs/audit: `audit/home-scene-community-cleanup-plan`, `audit/registrar-source-origin-compatibility`, `docs/artist-identity-canon-fix`
3. Start the next implementation slice only after branch hygiene decisions are made or explicitly deferred.

## Branches And Worktrees To Preserve Until Reviewed

These worktrees/branches contain unmerged or separately staged work. Do not remove, reset, rebase, force-push, or delete them without explicit approval.

| Path | Branch | Snapshot HEAD | Note |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT/.worktrees/batch18` | `feat/ux-batch18-prep` | `629a39e` | UX batch prep, remote exists. |
| `/home/baris/UPRISE_NEXT/.worktrees/batch19` | `feat/ux-batch19-prep` | `7a66a72` | UX batch prep, remote exists. |
| `/home/baris/UPRISE_NEXT_batch18` | `feat/ux-batch18` | `38f7124` | Behind-only worktree; cleanup candidate after approval. |
| `/home/baris/UPRISE_NEXT_runtime` | `phase3-no-automation-rollback` | `f370438` | Runtime/agent-control history, review before action. |
| `/home/baris/UPRISE_NEXT_uximpl` | `ux-implementation` | `be4ddde` | UX implementation branch, remote exists. |
| `/home/baris/UPRISE_NEXT_uxmobile` | `ux-mobile-r1-build` | `b59a63c` | Mobile UX branch, remote exists. |

## Recently Completed / Cleaned Up

- PR #150 merged into `main` at `99b0072`.
- Pruned stale remote-tracking refs for the already-merged PR branches:
  - `origin/chore/plot-deferred-panel-quarantine`
  - `origin/docs/execution-closeout-packets`
  - `origin/refactor/plot-page-section-extraction`
- Deleted local branches already merged into `main`, excluding attached worktree branches.
- Open PR queue was empty after cleanup and after PR #150 merge.

## PM Usage Rules For Agents

- Read this file for current execution state, then route through `docs/agent-briefs/CONTEXT_ROUTER.md` for lane context.
- Do not treat this file as product truth.
- If this file conflicts with `AGENTS.md`, `AGENTS.md` wins.
- If this file conflicts with an owner spec or runtime evidence, report the conflict and refresh this file.
- If a task is tiny and low-risk, do not create a process packet unless it helps.
- If a task is significant/risky, cross-lane, provider/db/schema/canon/doc-authority work, or an external-agent handoff, require the execution packet blocks named in the active documentation framework.

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
