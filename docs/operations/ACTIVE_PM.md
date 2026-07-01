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
- Base HEAD at approved cleanup closeout: `3d8f2ff` (`docs: refresh active pm after ux review (#158)`)
- Active implementation branch: `docs/active-pm-approved-cleanup-closeout` until closeout PR merges; none after merge.
- Last PM update source: approved branch/worktree cleanup closeout
- Open PR queue at snapshot: none
- Main worktree state at snapshot: clean before this docs slice

## Active Goal

Keep the UPRISE working set clean enough that new Codex / Cloud Codex / Hermes / Abacus tasks start from current `main`, understand which leftover branches are safe cleanup candidates, and do not disturb unmerged worktrees without approval.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `uprise-context-steward` / branch hygiene |
| Branch | `docs/active-pm-approved-cleanup-closeout` until closeout PR merges; none after merge. |
| Scope | Record approved cleanup of reviewed superseded branches/worktrees and leave only protected UX reference branches. |
| Out of Scope | Branch deletion, worktree removal, destructive git operations, product doctrine, runtime code, provider state, database/schema changes. |
| Owner Contract | `docs/specs/system/documentation-framework.md` |
| Companion Doc | `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` |
| Validation | `pnpm run docs:lint`, `git diff --check` |

## Branch Triage Snapshot

Captured after PR #150 merged and `main` fast-forwarded to `99b0072`.

### Cleanup Candidates Removed

Completed after PR #152 merged:

- pruned stale remote-tracking refs;
- removed behind-only worktree `/home/baris/UPRISE_NEXT_batch18`;
- deleted local branch `feat/ux-batch18`;
- deleted local and remote cleanup branches that were patch-equivalent or already absorbed:
  - `test/activation-cutover-fixture-smoke`
  - `docs/post-deploy-launch-readiness-2026-06-29`
  - `chore/launch-readiness-verification-2026-06-29`
  - `chore/track-art-assets`
  - `docs/browser-qa-lane-readiness`
  - `docs/uprise-ai-stack-agent-lanes`
  - `feat/archive-event-terminology-cleanup`
- confirmed PM branch remote heads were already gone after PR merges:
  - `docs/active-pm-current-work`
  - `docs/active-pm-branch-triage`
  - `docs/active-pm-stable-snapshot-wording`

No `art/` files were directly edited or removed by this cleanup.

### Approved Cleanup Completed: Superseded Branches / Worktrees

The reviewed superseded resolver/onboarding, docs/audit, and Phase3 automation/runtime branches were removed after explicit founder approval. See `docs/handoff/2026-07-01_approved-branch-worktree-cleanup.md` for exact command evidence and branch/worktree lists.

Removed worktrees:

- `/home/baris/UPRISE_NEXT_runtime` -> `phase3-no-automation-rollback`
- `/home/baris/UPRISE_NEXT/.worktrees/batch18` -> `feat/ux-batch18-prep`
- `/home/baris/UPRISE_NEXT/.worktrees/batch19` -> `feat/ux-batch19-prep`

Deleted local branches:

- `fix/fair-play-resolver-di-staging`
- `feat/default-music-community-preference-resolver`
- `feat/preference-resolver-runtime-adoption`
- `feat/missing-community-request-intake`
- `audit/home-scene-community-cleanup-plan`
- `audit/registrar-source-origin-compatibility`
- `docs/artist-identity-canon-fix`
- `phase3-mvp-roadmap-slice88-runtime`
- `review-risk-p3-rev-002`
- `phase3-runtime-followups`
- `backup/phase3-runtime-followups-20260224-150716`
- `phase3-no-automation-rollback`
- `feat/ux-batch18-prep`
- `feat/ux-batch19-prep`

Deleted matching remote branches where they still existed. Remote branches that were already absent were left as-is.

### Reviewed UX / Prototype Branches

These UX/prototype branches were reviewed after PR #156 merged. Queue/prep branches and their worktrees were removed after explicit approval. The remaining broad branches are hundreds of commits behind current `main` and touch active `/plot`, onboarding, Discover, RADIYO/player, source-dashboard, and artist-dashboard prototype surfaces, so they should be treated as design/runtime references until a founder/design owner decides what to extract.

Evidence checked:

- `git rev-list --left-right --count main...<branch>`
- `git cherry -v main <branch>`
- `git diff --name-status main...<branch>`
- `git worktree list --porcelain`

Detailed handoff: `docs/handoff/2026-07-01_ux-prototype-branch-review.md`.

| Branch | Review Result | Recommended Action |
| --- | --- | --- |
| `feat/ux-batch17` | Old UX/Reliant batch output. Includes queue/runtime files, Discover/Plot/RADIYO/statistics tests, Reliant script changes, and many March handoffs. | Do not merge wholesale. Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch18-run` | Old UX/Reliant batch run output. Includes queue/runtime files, Plot/Discover/player tests, Reliant automation edits, Social-hidden MVP note, and handoffs. | Do not merge wholesale. Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `ux-mobile-r1-build` | Broad mobile-first UX prototype. Touches onboarding, Plot, community page, RADIYO player, subgenre range helper, mobile UX specs, and many March handoffs. Attached worktree. | Preserve as design/runtime reference. Requires explicit founder/design extraction decision before cleanup. |
| `ux-implementation` | Broad Plot/profile/player/source-dashboard prototype. Adds Plot UI state machine/store, player strip, profile expansion panel, artist dashboard prototype docs, and several spec edits. Attached worktree. | Preserve as design/runtime reference. Requires explicit founder/design extraction decision before cleanup. |

## Next Queue

1. Preserve `feat/ux-batch17`, `feat/ux-batch18-run`, `ux-mobile-r1-build`, and `ux-implementation` until a design/runtime extraction or archive decision is made.
2. If UX extraction is approved, create fresh small branches from current `main`; do not merge prototype branches wholesale.
3. Otherwise, start the next implementation slice from clean `main`.

## Branches And Worktrees To Preserve Until Explicit Approval

These worktrees/branches contain unmerged, separately staged, or intentionally preserved UX reference work. Do not remove, reset, rebase, force-push, or delete them without explicit approval.

| Path | Branch | Snapshot HEAD | Note |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` | `ux-implementation` | `be4ddde` | UX implementation branch, remote exists. Preserve as design/runtime reference until extraction or archive decision. |
| `/home/baris/UPRISE_NEXT_uxmobile` | `ux-mobile-r1-build` | `b59a63c` | Mobile UX branch, remote exists. Preserve as design/runtime reference until extraction or archive decision. |

## Recently Completed / Cleaned Up

- PR #150 merged into `main` at `99b0072`.
- PR #151 merged into `main` at `c1afc9c`.
- PR #152 merged into `main` at `c8909c4`.
- PR #153 merged into `main` at `83108f1`.
- PR #154 merged into `main` at `a14801e`.
- PR #155 merged into `main` at `c9afdcc`.
- PR #156 merged into `main` at `ee171b5`.
- PR #157 merged into `main` at `f76d4b6`.
- PR #158 merged into `main` at `3d8f2ff`.
- Approved cleanup-candidate branches and worktrees were removed after explicit approval; see `docs/handoff/2026-07-01_approved-branch-worktree-cleanup.md`.
- Earlier cleanup-candidate branches and the behind-only `feat/ux-batch18` worktree were removed after approval in the prior cleanup pass.
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
