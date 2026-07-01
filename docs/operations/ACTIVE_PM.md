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
- Base HEAD at Phase3 review: `c9afdcc` (`docs: review docs audit branches (#155)`)
- Active implementation branch: `docs/active-pm-phase3-branch-review`
- Last PM update source: Phase3 automation/runtime preserved-branch review pass
- Open PR queue at snapshot: none
- Main worktree state at snapshot: clean before this docs slice

## Active Goal

Keep the UPRISE working set clean enough that new Codex / Cloud Codex / Hermes / Abacus tasks start from current `main`, understand which leftover branches are safe cleanup candidates, and do not disturb unmerged worktrees without approval.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `uprise-context-steward` / branch hygiene |
| Branch | `docs/active-pm-phase3-branch-review` |
| Scope | Record Phase3 automation/runtime branch review and remaining preserve/review queue. |
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

### Reviewed Superseded Branches: Resolver / Onboarding

These branches were reviewed after cleanup. Do not merge them wholesale: snapshot diffs against current `main` would remove current migrations, smokes, Active PM docs, and/or tracked `art/` assets. Current `main` already contains the core behavior they were created for. Deletion still requires explicit approval because branch removal is destructive.

Verification on current `main`:

```bash
pnpm --filter api test -- fair-play.module.test.ts music-community-preference-resolver.service.test.ts onboarding.music-community-request.test.ts onboarding.home-scene-resolution.test.ts --runInBand
```

Result: 4 suites passed, 16 tests passed.

| Branch | Review Result | Recommended Action |
| --- | --- | --- |
| `fix/fair-play-resolver-di-staging` | Superseded. Current `main` already has optional `MusicCommunityPreferenceResolverService` injection/fallback in `FairPlayService`, `FairPlayModule` imports `UsersModule`, and `fair-play.module.test.ts` passes. | Cleanup candidate after approval; do not merge branch. |
| `feat/default-music-community-preference-resolver` | Superseded. Current `main` already has `apps/api/src/users/music-community-preference-resolver.service.ts`, module export, Fair Play usage, resolver tests, and owner-spec notes. | Cleanup candidate after approval; do not merge branch. |
| `feat/preference-resolver-runtime-adoption` | Superseded / unsafe wholesale. Current `main` already includes resolver adoption across Fair Play, Registrar, Communities, Admin Analytics, auth/invite, smoke verification script, tests, and docs; branch snapshot would delete current later work and tracked art assets. | Cleanup candidate after approval; do not merge branch. |
| `feat/missing-community-request-intake` | Superseded / unsafe wholesale. Current `main` already includes `MusicCommunityRequest` schema/migration, `POST /onboarding/music-community-requests`, API/web tests, onboarding UI, and owner-spec/brief docs; branch snapshot is far behind and would delete later work. | Cleanup candidate after approval; do not merge branch. |

### Reviewed Superseded Branches: Docs / Audit

These docs/audit branches were reviewed after PR #154 merged. Do not merge them wholesale: snapshot diffs against current `main` would remove current migrations, smokes, Active PM docs, tracked `art/` assets, and/or newer current owner-spec corrections. Current `main` already contains the durable rules and implementation coverage these branches were trying to capture. Deletion still requires explicit approval because branch removal is destructive.

Evidence checked on current `main`:

- `docs/PLATFORM_START_HERE.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/specs/system/registrar.md`
- `docs/specs/media/release-deck-and-eligibility.md`
- `docs/specs/economy/print-shop-and-promotions.md`
- `docs/specs/events/events-and-flyers.md`
- `docs/specs/social/message-boards-groups-blast.md`
- `docs/handoff/README.md`
- `docs/CHANGELOG.md`
- focused API tests and runtime references for preference resolver, Registrar source origin, activation cutover, Release Deck caps, and profile/Away Scene notices.

| Branch | Review Result | Recommended Action |
| --- | --- | --- |
| `audit/home-scene-community-cleanup-plan` | Superseded. The unique handoff inventoried `homeSceneCommunity` read paths, but current `main` already has the shared preference resolver, runtime adoption, write sync, activation matching, staging audit command, owner-spec notes, and newer handoffs. | Cleanup candidate after approval; do not merge branch. |
| `audit/registrar-source-origin-compatibility` | Superseded. The unique handoff flagged Registrar source-origin resolver adoption as a follow-up; current `main` already implements and tests default-preference source-origin behavior plus current activation readiness/cutover source-origin rules. | Cleanup candidate after approval; do not merge branch. |
| `docs/artist-identity-canon-fix` | Superseded / unsafe wholesale. Current `main` already carries Registrar-linked Artist/Band identity, source-management separation, Print Shop/event boundaries, social messaging locks, Release Deck caps, and newer business-account boundaries. The old branch also includes outdated anonymous/auto-publish business promotion language and a broad stale snapshot. | Cleanup candidate after approval; do not merge branch. |

### Reviewed Superseded Branches: Phase3 Automation / Runtime

These Phase3 automation/runtime branches were reviewed after PR #155 merged. Do not merge them wholesale: current `main` already contains the agent-control scripts, Telegram bridge, workflows, RegistrarCode/capability-code surfaces, current specs, and runbooks. Snapshot diffs from these old branches would delete current `.reliant` queues, provider/deploy setup, docs, and other later work. Deletion still requires explicit approval because branch/worktree removal is destructive.

Evidence checked on current `main`:

- `scripts/agent-control.mjs`, `scripts/agent-control.test.mjs`
- `scripts/agent-bridge-tick.mjs`, `scripts/agent-bridge-tick.test.mjs`
- `scripts/agent-bridge-telegram.mjs`, `scripts/agent-bridge-telegram-lib.mjs`, `scripts/agent-bridge-telegram.test.mjs`
- `.github/workflows/agent-queue-bridge.yml`
- `.github/workflows/agent-telegram-bridge.yml`
- `docs/handoff/agent-control/README.md`
- `docs/handoff/agent-control/AGENT_DIRECTIVES.md`
- `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/lib/registrar/client.ts`
- `apps/web/src/lib/registrar/contractInventory.ts`

| Branch | Review Result | Recommended Action |
| --- | --- | --- |
| `phase3-mvp-roadmap-slice88-runtime` | Superseded / unsafe wholesale. Older Phase3 sequence through Telegram bridge MVP; current `main` already has agent-control/Telegram bridge files and newer queue/runtime/docs. | Cleanup candidate after approval; do not merge branch. |
| `review-risk-p3-rev-002` | Duplicate of `phase3-mvp-roadmap-slice88-runtime` at the same HEAD. | Cleanup candidate after approval; do not merge branch. |
| `phase3-no-automation-rollback` | Superseded / unsafe wholesale. Attached worktree branch includes early RegistrarCode and agent-control/task-brief work; current `main` already has current equivalents and newer safety/runner docs. | Cleanup candidate after approval; do not merge branch or remove worktree without explicit approval. |
| `phase3-runtime-followups` | Superseded / unsafe wholesale. Extends Phase3 work through autonomous lane worker/runtime queue tasks; current `main` already has current agent-control/bridge implementation and later docs. | Cleanup candidate after approval; do not merge branch. |
| `backup/phase3-runtime-followups-20260224-150716` | Duplicate backup of `phase3-runtime-followups` at the same HEAD. | Cleanup candidate after approval; do not merge branch. |

### Preserve / Review Before Any Cleanup

These branches still have unique commits or broad diffs against `main`. Do not delete, rebase, or remove their worktrees without explicit owner review.

| Branch | Triage |
| --- | --- |
| `feat/ux-batch17` | Older UX/Reliant queue outputs and runtime/test changes. Preserve until UX queue owner decides archival value. |
| `feat/ux-batch18-prep` | Attached worktree with queue/prep docs. Preserve until UX batch decision. |
| `feat/ux-batch18-run` | Batch 18 run outputs and UI/test changes. Preserve until UX batch decision. |
| `feat/ux-batch19-prep` | Attached worktree with queue/prep docs. Preserve until UX batch decision. |
| `ux-mobile-r1-build` | Attached worktree; broad mobile UX/onboarding/plot changes. Needs design/runtime review before any cleanup. |
| `ux-implementation` | Attached worktree; broad Plot/profile/player/source dashboard prototype work. Needs design/runtime review before any cleanup. |

## Next Queue

1. If approved, delete reviewed superseded resolver/onboarding, docs/audit, and Phase3 automation/runtime branches listed above.
2. Review the remaining preserved UX/prototype branches: `feat/ux-batch17`, `feat/ux-batch18-prep`, `feat/ux-batch18-run`, `feat/ux-batch19-prep`, `ux-mobile-r1-build`, `ux-implementation`.
3. Start the next implementation slice only after the preserved unique branches are either reviewed or explicitly deferred.

## Branches And Worktrees To Preserve Until Reviewed

These worktrees/branches contain unmerged or separately staged work. Do not remove, reset, rebase, force-push, or delete them without explicit approval.

| Path | Branch | Snapshot HEAD | Note |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT/.worktrees/batch18` | `feat/ux-batch18-prep` | `629a39e` | UX batch prep, remote exists. |
| `/home/baris/UPRISE_NEXT/.worktrees/batch19` | `feat/ux-batch19-prep` | `7a66a72` | UX batch prep, remote exists. |
| `/home/baris/UPRISE_NEXT_runtime` | `phase3-no-automation-rollback` | `f370438` | Reviewed as superseded/unsafe wholesale; remove only after explicit worktree-removal approval. |
| `/home/baris/UPRISE_NEXT_uximpl` | `ux-implementation` | `be4ddde` | UX implementation branch, remote exists. |
| `/home/baris/UPRISE_NEXT_uxmobile` | `ux-mobile-r1-build` | `b59a63c` | Mobile UX branch, remote exists. |

## Recently Completed / Cleaned Up

- PR #150 merged into `main` at `99b0072`.
- PR #151 merged into `main` at `c1afc9c`.
- PR #152 merged into `main` at `c8909c4`.
- PR #153 merged into `main` at `83108f1`.
- PR #154 merged into `main` at `a14801e`.
- PR #155 merged into `main` at `c9afdcc`.
- Cleanup-candidate branches and the behind-only `feat/ux-batch18` worktree were removed after approval.
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
