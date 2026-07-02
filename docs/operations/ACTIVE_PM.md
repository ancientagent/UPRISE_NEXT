# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-02

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

- Snapshot date: 2026-07-02
- Base branch: `main`
- Current `main` HEAD at refresh start: `66556d7` (`Refactor: extract Plot tab surface (#190)`)
- Local worktree state at refresh: clean after PR #190 merge
- Active implementation branch during this refresh: `docs/active-pm-post-plot-tab-surface-refresh`
- Open PR queue at refresh: none (`gh pr list --state open --limit 20` returned `[]`)
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Keep the UPRISE working set clean enough that new Codex / Cloud Codex / Codex subagent / Abacus tasks start from current `main`, load the right lane context, and do not disturb preserved UX reference work without explicit approval. Hermes remains watchdog/manual fallback only per the active AI stack doc.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | `EXTERNAL_TOOLS` / `DOCS_OPS` |
| Branch | `docs/active-pm-post-plot-tab-surface-refresh` |
| Scope | Refresh Active PM and branch workspace registry after PR #190 Plot tab surface extraction merged. |
| Out of Scope | Runtime behavior changes, Discover transport, provider state, database/schema changes, art changes, UX prototype merging, product doctrine changes, and preserved reference branch/worktree cleanup. |
| Owner Contract | `docs/operations/ACTIVE_PM.md`, `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` |
| Companion Docs | `docs/handoff/2026-07-02_plot-tab-surface-component-extraction.md`, `docs/handoff/2026-07-02_plot-bottom-nav-component-extraction.md` |
| Validation | `pnpm run workspace:audit`, `pnpm run docs:lint`, `git diff --check` |

## Recently Completed Since Prior PM Snapshot

The previous PM snapshot pointed at PR #176. Current `main` has since advanced through these relevant slices:

- PR #159 / `04df9ef`: captured Plot/Home Scene visual-skin founder-session direction.
- PR #161 / `ef6ed5d`: replaced old Home Scene switching terminology with Home Scene selector/swiper language.
- PR #162 / `981d083`: extracted `/plot` Home Scene selector presentation into `HomeSceneSelector`.
- PR #163 / `7a16d6b`: captured Discover/transport front-door, back-door, map-view, seek-mode, saved-Uprises, and no-transport-inside-Plot founder-session direction.
- PR #164 / `3725a6f`: extracted expanded `/plot` listener profile body into `PlotListenerProfile`.
- PR #165 / `aac8ccd`: removed direct `/plot` Print Shop shortcut and kept Print Shop source-facing.
- PR #168 / `a19e863`: removed the forced non-expanded `/plot` context panel, removed deprecated community-information terminology, and locked Registrar future placement as Archive/community information with Registrar on top and records below.
- PR #170 / `1ce5607`: added source identity/account switching inside the expanded `/plot` listener profile for users who manage Artist/Band sources while keeping source tools out of non-expanded Plot and listener collection body.
- PR #172 / `58752c4`: placed Registrar inside `/plot` Archive/community information with Registrar entry/control above records/status history.
- PR #173 / `3e07c0e`: refreshed `ACTIVE_PM` after PR #172.
- PR #174 / `e548633`: tightened `/plot` top shell composition so listener identity, Home Scene selector, and top RADIYO player read as one visual cockpit without adding transport behavior.
- PR #175 / `a7918c2`: refreshed `ACTIVE_PM` after PR #174 and corrected the main worktree snapshot away from the transient PM refresh branch.
- PR #176 / `38513d6`: extracted the non-expanded `/plot` top shell into `PlotTopShell` while preserving route-owned selector, player, profile, and notification behavior.
- PR #177 / `45cf5a1`: refreshed `ACTIVE_PM` after PR #176.
- Branch cleanup / no PR: deleted the audited absorbed local and remote branches `docs/active-pm-post-context-panel-removal`, `docs/active-pm-refresh-after-plot-cleanup`, `docs/discover-transport-owner-spec-promotion`, and `refactor/plot-community-context-panel` after Hermes `upriseauditor` classified their durable content as absorbed or superseded.
- PR #178 / `4e6aab8`: captured and promoted the reviewer/auditor cleanup protocol so large refactors, complex issues, prototype branches, and uncertain branch-absorption cleanup require independent reviewer/auditor classification before merge/delete decisions.
- PR #179 / `58b0216`: refreshed `ACTIVE_PM` after PR #178.
- PR #180 / `7e130ce`: routed UPRISE review/audit gates through Codex agents by default, kept `uprisewatchdog` heartbeat-only, and marked Hermes reviewer/auditor briefs as manual fallback scaffolding.
- PR #181 / `fe048ce`: added the Branch / Workspace Registry so future branches, worktrees, PR heads, preserved refs, and external-agent workspaces must be recorded with owner, assigned agents, scope, status, and closeout plan.
- PR #182 / `79467df`: refreshed `ACTIVE_PM` and `BRANCH_WORKSPACE_REGISTRY` after PR #181 merged.
- PR #183 / `4ecbb37`: inventoried preserved UX reference branches/worktrees and recorded selective extraction guidance without merging prototype code.
- PR #184 / `9285b25`: refreshed `ACTIVE_PM` and `BRANCH_WORKSPACE_REGISTRY` after PR #183 merged.
- PR #185 / `861f05b`: added current-compatible Plot profile/player state contract tests and closed PR #184 registry state.
- PR #186 / `ce6c841`: refreshed Active PM and branch registry after PR #185 merged.
- PR #187 / `eea674c`: formalized Codex-first review/audit routing, superseded stale model-routing pointers, and kept Hermes watchdog/manual fallback only.
- PR #188 / `0ab9ce2`: refreshed Active PM and branch registry after PR #187 merged.
- PR #189 / `0cd181e`: extracted `/plot` bottom navigation and UPRISE wheel overlay into a focused component without changing Plot behavior.
- PR #190 / `66556d7`: extracted `/plot` non-expanded tab bar and active surface frame into a focused component without changing Plot behavior.
- Current branch follow-up: refreshes Active PM and branch registry after PR #190 merged.

Use these handoffs / founder-session notes for the current cleanup trail:

- `docs/founder-sessions/2026-07-01_reviewer-auditor-cleanup-protocol.md`
- `docs/handoff/2026-07-02_active-pm-post-plot-tab-surface-refresh.md`
- `docs/handoff/2026-07-02_plot-tab-surface-component-extraction.md`
- `docs/handoff/2026-07-02_plot-bottom-nav-component-extraction.md`
- `docs/handoff/2026-07-02_active-pm-post-codex-routing-v2-refresh.md`
- `docs/handoff/2026-07-02_codex-first-review-routing-refresh.md`
- `docs/handoff/2026-07-02_active-pm-post-plot-profile-player-state-refresh.md`
- `docs/handoff/2026-07-02_plot-profile-player-state-contract.md`
- `docs/handoff/2026-07-02_active-pm-post-ux-inventory-refresh.md`
- `docs/handoff/2026-07-02_ux-reference-extraction-inventory.md`
- `docs/handoff/2026-07-02_active-pm-post-branch-registry-refresh.md`
- `docs/handoff/2026-07-01_uprise-hermes-heavy-light-routing.md`
- `docs/handoff/2026-07-02_active-pm-post-codex-routing-refresh.md`
- `docs/handoff/2026-07-01_active-pm-post-reviewer-protocol-refresh.md`
- `docs/handoff/2026-07-01_active-pm-post-plot-top-shell-component-refresh.md`
- `docs/handoff/2026-07-01_plot-top-shell-component-extraction.md`
- `docs/handoff/2026-07-01_active-pm-post-plot-top-shell-refresh.md`
- `docs/handoff/2026-07-01_plot-top-shell-visual-composition.md`
- `docs/handoff/2026-07-01_active-pm-post-archive-registrar-refresh.md`
- `docs/handoff/2026-07-01_archive-registrar-community-info.md`
- `docs/handoff/2026-07-01_active-pm-post-profile-source-refresh.md`
- `docs/handoff/2026-07-01_profile-source-identity-access.md`
- `docs/handoff/2026-07-01_plot-context-panel-removal.md`
- `docs/handoff/2026-07-01_discover-transport-owner-spec-promotion.md`
- `docs/handoff/2026-07-01_active-pm-post-plot-cleanup-refresh.md`
- `docs/handoff/2026-07-01_print-shop-source-facing-boundary.md`
- `docs/handoff/2026-07-01_plot-listener-profile-component-extraction.md`
- `docs/handoff/2026-07-01_home-scene-selector-component-extraction.md`
- `docs/handoff/2026-07-01_home-scene-selector-terminology.md`
- `docs/founder-sessions/2026-07-01_plot-home-scene-visual-skin.md`
- `docs/founder-sessions/2026-07-01_discover-transport-map-player.md`
- `docs/founder-sessions/2026-07-01_plot-archive-registrar-placement.md`

## Current Branch / Worktree State

### Open PR Queue

None at refresh time.

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `docs/active-pm-post-plot-tab-surface-refresh` until this PM refresh merges; `main` after merge | `66556d7` at refresh start | clean after PR #190 merge; this docs-only branch must return to `main` after merge |

### Preserved UX Reference Worktrees

These worktrees/branches contain unmerged, separately staged, or intentionally preserved UX reference work. Do not remove, reset, rebase, force-push, or delete them without explicit approval.

| Path | Branch | Snapshot HEAD | Main divergence at refresh | Note |
| --- | --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` | `ux-implementation` | `be4ddde` | `538` behind / `14` ahead | Broad Plot/profile/player/source-dashboard prototype. Preserve as design/runtime reference until extraction or archive decision. Do not merge wholesale. |
| `/home/baris/UPRISE_NEXT_uxmobile` | `ux-mobile-r1-build` | `b59a63c` | `370` behind / `26` ahead | Broad mobile-first UX prototype. Preserve as design/runtime reference until extraction or archive decision. Do not merge wholesale. |

### Preserved UX Batch Branches

These are old UX/Reliant batch-output references. Do not merge wholesale. Preserve or archive only after explicit approval and an independent reviewer/auditor classification pass.

| Branch | Main divergence at refresh | Recommended Action |
| --- | --- | --- |
| `feat/ux-batch17` | `354` behind / `3` ahead | Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch18-run` | `354` behind / `3` ahead | Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |

### Cleanup Completed

The following audited, absorbed/superseded branches were deleted locally and remotely after founder approval:

- `docs/active-pm-post-context-panel-removal`
- `docs/active-pm-refresh-after-plot-cleanup`
- `docs/discover-transport-owner-spec-promotion`
- `refactor/plot-community-context-panel`

## Next Queue

1. After this PM refresh merges, continue small Plot structural cleanup from clean `main` only if another region is clearly named and behavior is already locked by tests.
2. If touching Print Shop, Source Dashboard, Artist Profile, or Registrar, route through `ARTIST_PROFILE_SOURCE_DASHBOARD.md` and keep source/listener surfaces separate.
3. If implementing Discover/transport later, start from `docs/specs/communities/discovery-scene-switching.md`; do not add transport UI inside Plot.
4. If using UX prototype branches, create fresh small branches from current `main`; do not merge prototype branches wholesale.
5. Preserve `feat/ux-batch17`, `feat/ux-batch18-run`, `ux-mobile-r1-build`, and `ux-implementation` until a design/runtime extraction or archive decision is made.

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
