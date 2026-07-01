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

## Current Workspace Snapshot

- Snapshot date: 2026-07-01
- Base branch: `main`
- Current `main` HEAD: `1ce5607` (`feat(web): add profile source identity access (#170)`)
- Local worktree state at refresh: clean after PR #170 merge
- Active implementation branch: none.
- Open PR queue at refresh: none (`gh pr list --state open --limit 100` returned `[]`)
- Provider/db/schema/art state: not touched by this refresh
- Preserved worktrees: `/home/baris/UPRISE_NEXT_uximpl`, `/home/baris/UPRISE_NEXT_uxmobile`

## Active Goal

Keep the UPRISE working set clean enough that new Codex / Cloud Codex / Hermes / Abacus tasks start from current `main`, load the right lane context, and do not disturb preserved UX reference work without explicit approval.

## Active Slice

| Field | Current Value |
| --- | --- |
| Lane | none active |
| Branch | none |
| Scope | Await next explicitly selected cleanup slice. |
| Out of Scope | Branch deletion, worktree removal, destructive git operations, provider state, database/schema changes, art changes, broad UX prototype merging. |
| Owner Contract | route by next task |
| Companion Docs | `docs/handoff/2026-07-01_plot-context-panel-removal.md`; `docs/founder-sessions/2026-07-01_plot-archive-registrar-placement.md` for the completed Plot panel cleanup |
| Validation | choose by next slice |

## Recently Completed Since Prior PM Snapshot

The previous PM snapshot still pointed at the approved cleanup closeout around `3d8f2ff`. Current `main` has since advanced through these relevant slices:

- PR #159 / `04df9ef`: captured Plot/Home Scene visual-skin founder-session direction.
- PR #161 / `ef6ed5d`: replaced old Home Scene switching terminology with Home Scene selector/swiper language.
- PR #162 / `981d083`: extracted `/plot` Home Scene selector presentation into `HomeSceneSelector`.
- PR #163 / `7a16d6b`: captured Discover/transport front-door, back-door, map-view, seek-mode, saved-Uprises, and no-transport-inside-Plot founder-session direction.
- PR #164 / `3725a6f`: extracted expanded `/plot` listener profile body into `PlotListenerProfile`.
- PR #165 / `aac8ccd`: removed direct `/plot` Print Shop shortcut and kept Print Shop source-facing.
- PR #168 / `a19e863`: removed the forced non-expanded `/plot` context panel, removed deprecated community-information terminology, and locked Registrar future placement as Archive/community information with Registrar on top and records below.
- PR #170 / `1ce5607`: added source identity/account switching inside the expanded `/plot` listener profile for users who manage Artist/Band sources while keeping source tools out of non-expanded Plot and listener collection body.

Use these handoffs for the current cleanup trail:

- `docs/handoff/2026-07-01_home-scene-selector-terminology.md`
- `docs/handoff/2026-07-01_home-scene-selector-component-extraction.md`
- `docs/handoff/2026-07-01_plot-listener-profile-component-extraction.md`
- `docs/handoff/2026-07-01_print-shop-source-facing-boundary.md`
- `docs/founder-sessions/2026-07-01_plot-home-scene-visual-skin.md`
- `docs/founder-sessions/2026-07-01_discover-transport-map-player.md`
- `docs/handoff/2026-07-01_plot-context-panel-removal.md`
- `docs/handoff/2026-07-01_profile-source-identity-access.md`
- `docs/founder-sessions/2026-07-01_plot-archive-registrar-placement.md`

## Current Branch / Worktree State

### Open PR Queue

None at refresh time.

### Main Worktree

| Path | Branch | HEAD | State |
| --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT` | `main` | `1ce5607` | clean after PR #170 merge |

### Preserved UX Reference Worktrees

These worktrees/branches contain unmerged, separately staged, or intentionally preserved UX reference work. Do not remove, reset, rebase, force-push, or delete them without explicit approval.

| Path | Branch | Snapshot HEAD | Main divergence at refresh | Note |
| --- | --- | --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` | `ux-implementation` | `be4ddde` | `521` behind / `14` ahead | Broad Plot/profile/player/source-dashboard prototype. Preserve as design/runtime reference until extraction or archive decision. |
| `/home/baris/UPRISE_NEXT_uxmobile` | `ux-mobile-r1-build` | `b59a63c` | `353` behind / `26` ahead | Broad mobile-first UX prototype. Preserve as design/runtime reference until extraction or archive decision. |

### Preserved UX Batch Branches

These are old UX/Reliant batch-output references. Do not merge wholesale. Preserve or archive only after explicit approval.

| Branch | Main divergence at refresh | Recommended Action |
| --- | --- | --- |
| `feat/ux-batch17` | `337` behind / `3` ahead | Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |
| `feat/ux-batch18-run` | `337` behind / `3` ahead | Preserve as historical batch-output/reference until a UX owner explicitly extracts or archives it. |

### Remote Tracking Notes

`git branch -r --merged origin/main` still shows many remote-tracking refs that are already merged or historical. This refresh did not prune or delete anything. Use `uprise-branch-pr-hygiene` and explicit founder approval before any cleanup action.

Recent merged PR branch refs also still appeared locally as remote-tracking refs at refresh time, including:

- `origin/fix/print-shop-source-facing-boundary`
- `origin/refactor/plot-listener-profile-component`
- `origin/docs/discover-transport-founder-session`
- `origin/refactor/plot-home-scene-selector-component`
- `origin/fix/home-scene-switcher-terminology`
- `origin/docs/founder-session-plot-visual-skin`

Treat these as branch-hygiene candidates only, not product work.

## Next Queue

1. If building Registrar placement, start from `docs/specs/communities/plot-and-scene-plot.md` and `docs/specs/system/registrar.md`: Registrar on top, records/status history below, inside Archive/community information.
2. Continue small Plot structural cleanup from clean `main` only if a region is clearly named and behavior is already locked by tests.
3. If touching Print Shop, Source Dashboard, Artist Profile, or Registrar, route through `ARTIST_PROFILE_SOURCE_DASHBOARD.md` and keep source/listener surfaces separate.
4. If implementing Discover/transport later, start from `docs/specs/communities/discovery-scene-switching.md`; do not add transport UI inside Plot.
5. If using UX prototype branches, create fresh small branches from current `main`; do not merge prototype branches wholesale.
6. Preserve `feat/ux-batch17`, `feat/ux-batch18-run`, `ux-mobile-r1-build`, and `ux-implementation` until a design/runtime extraction or archive decision is made.

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
