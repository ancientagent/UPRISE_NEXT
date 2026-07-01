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
- Base HEAD after UX prototype review: `f76d4b6` (`docs: review ux prototype branches (#157)`)
- Active implementation branch: none; `main` is current after PR #157.
- Last PM update source: post-PR #157 Active PM refresh
- Open PR queue at snapshot: none
- Main worktree state at snapshot: clean before this docs slice

## Active Goal

Keep the UPRISE working set clean enough that new Codex / Cloud Codex / Hermes / Abacus tasks start from current `main`, understand which leftover branches are safe cleanup candidates, and do not disturb unmerged worktrees without approval.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `uprise-context-steward` / branch hygiene |
| Branch | none; `main` is current after PR #157. |
| Scope | Cleanup candidates are identified; remaining action requires explicit branch/worktree removal approval or a design/runtime extraction decision. |
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

### Reviewed UX / Prototype Branches

These UX/prototype branches were reviewed after PR #156 merged. Do not merge them wholesale: all are hundreds of commits behind current `main`, and the broad branches touch active `/plot`, onboarding, Discover, RADIYO/player, source-dashboard, and artist-dashboard prototype surfaces. Queue/prep branches may be cleanup candidates, but attached worktrees still require explicit removal approval. Broad prototype branches should be treated as design/runtime references until a founder/design owner decides what to extract.

Evidence checked:

- `git rev-list --left-right --count main...<branch>`
- `git cherry -v main <branch>`
- `git diff --name-status main...<branch>`
- `git worktree list --porcelain`

Detailed handoff: `docs/handoff/2026-07-01_ux-prototype-branch-review.md`.

| Branch | Review Result | Recommended Action |
| --- | --- | --- |
| `feat/ux-batch17` | Old UX/Reliant batch output. Includes queue/runtime files, Discover/Plot/RADIYO/statistics tests, Reliant script changes, and many March handoffs. | Do not merge wholesale. Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch18-prep` | Queue/prep-only branch for batch 18. Attached worktree. | Cleanup candidate after explicit worktree/branch removal approval; do not merge directly. |
| `feat/ux-batch18-run` | Old UX/Reliant batch run output. Includes queue/runtime files, Plot/Discover/player tests, Reliant automation edits, Social-hidden MVP note, and handoffs. | Do not merge wholesale. Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch19-prep` | Queue/prep-only branch for batches 18/19. Attached worktree. | Cleanup candidate after explicit worktree/branch removal approval; do not merge directly. |
| `ux-mobile-r1-build` | Broad mobile-first UX prototype. Touches onboarding, Plot, community page, RADIYO player, subgenre range helper, mobile UX specs, and many March handoffs. Attached worktree. | Preserve as design/runtime reference. Requires explicit founder/design extraction decision before cleanup. |
| `ux-implementation` | Broad Plot/profile/player/source-dashboard prototype. Adds Plot UI state machine/store, player strip, profile expansion panel, artist dashboard prototype docs, and several spec edits. Attached worktree. | Preserve as design/runtime reference. Requires explicit founder/design extraction decision before cleanup. |

## Next Queue

1. If approved, delete reviewed superseded resolver/onboarding, docs/audit, and Phase3 automation/runtime branches listed above.
2. If approved, remove the reviewed queue/prep-only UX worktrees/branches: `feat/ux-batch18-prep` with `/home/baris/UPRISE_NEXT/.worktrees/batch18`, and `feat/ux-batch19-prep` with `/home/baris/UPRISE_NEXT/.worktrees/batch19`.
3. Preserve `feat/ux-batch17`, `feat/ux-batch18-run`, `ux-mobile-r1-build`, and `ux-implementation` until a design/runtime extraction or archive decision is made.
4. Start the next implementation slice only after the cleanup candidates are either removed with approval or explicitly deferred.

## Branches And Worktrees To Preserve Until Explicit Approval

These worktrees/branches contain unmerged, separately staged, or intentionally preserved work. Some have now been reviewed as cleanup candidates, but none should be removed, reset, rebased, force-pushed, or deleted without explicit approval.

| Path | Branch | Snapshot HEAD | Note |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT/.worktrees/batch18` | `feat/ux-batch18-prep` | `629a39e` | Reviewed as UX queue/prep cleanup candidate; remove only after explicit worktree-removal approval. |
| `/home/baris/UPRISE_NEXT/.worktrees/batch19` | `feat/ux-batch19-prep` | `7a66a72` | Reviewed as UX queue/prep cleanup candidate; remove only after explicit worktree-removal approval. |
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
- PR #156 merged into `main` at `ee171b5`.
- PR #157 merged into `main` at `f76d4b6`.
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
