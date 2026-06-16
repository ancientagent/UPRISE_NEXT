# 2026-04-07 Session Transition Package

## Why This Exists
This note packages the current durable working state so a new Codex session can restart cleanly without dragging the full doctrine thread forward.

## Branch State
- Branch: `feat/ux-founder-locks-and-harness`
- Latest doctrine commit: `1245891` — `docs: lock stats contract and lean context rules`
- Branch status relative to origin at snapshot time: ahead by 1 commit

## Important Repo Truth
- `Home` is the left destination.
- `Discover` is the right destination.
- `Plot` lives inside `Home`.
- `Popular Singles` uses `Most Added`, `Supported Now`, and `Recent Rises`.
- `Popular Now` is excluded from Discover and stays owned by RaDIYo/broadcast momentum.
- Plot feed carries followed-source updates.
- The profile-strip notification icon is a separate notice/inbox surface.
- Calendar auto-population remains MVP behavior.
- Top 40 / billboard lists are deferred from MVP.

## Primary Docs To Rehydrate From
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_PHASE1_PHASE2_ACTION_BOARD_R1.md`
- `docs/solutions/SURFACE_CONTRACT_PLOT_R1.md`
- `docs/solutions/LEAN_CONTEXT_OPERATING_RULES_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/scene-map-and-metrics.md`

## Open Decisions
- Exact notification taxonomy.
- Structural-scope map visualization treatment.
- Activity Points / Activity Score formula.
- Any later Top 40 / billboard semantics if reintroduced.

## Worktree Warning
The repo is still dirty with unrelated changes outside the committed doctrine package. Do not assume the worktree is clean or that the remaining modified files belong to the current doctrine slice.

Known unrelated dirty areas include:
- Midjourney avatar-picker files
- older prompt / UX master docs
- launcher scripts
- untracked local runtime folders and pid files

## Recommended Next Move
Start a fresh implementation session and treat this package plus `docs/state/current_context_snapshot.json` as the carry-forward layer.
