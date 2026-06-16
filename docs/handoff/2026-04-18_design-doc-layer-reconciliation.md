# 2026-04-18 — Design Doc Layer Reconciliation

## Summary
Reconciled the older prompt-pack and design-tooling layer so external design tools and assistants stop treating pre-April Plot/Profile/Discover documents as current product authority.

## Why
Recent founder locks and handoff notes moved the repo materially beyond the older mobile-first/Uizard prompt phase.

Without an explicit reconciliation pass, external design tools were still likely to read older docs as if they were current because they remained in `docs/solutions/` with active-sounding names.

## What Changed
### Marked historical / non-authoritative for current MVP behavior
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R1.md`
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`
- `docs/solutions/MVP_DESIGN_PLATFORM_PACK_R1.md`
- `docs/solutions/MVP_UX_TOOLING_STACK_R1.md`
- `docs/solutions/NEW_CHAT_BOOTSTRAP_PROMPT_UX_R1.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/solutions/MVP_PROFILE_EXPANDED_MOCKUP_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- `docs/solutions/MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md`

### Repointed active read-first guidance toward current authority
- `docs/solutions/MVP_UX_DRIFT_GUARD_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- `docs/solutions/MVP_DESIGN_PLATFORM_PACK_R1.md`

## Current Authority For Design/Surface Questions
Use these first:
- `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`
- `docs/handoff/2026-04-16_discover-feed-insert-and-artist-demo-lock.md`
- `docs/handoff/2026-04-16_discover-deferred-local-only-mvp.md`

## Effect
The older docs remain available for historical rationale and visual-reference continuity, but they should no longer read like current active doctrine.

## Verification
- `pnpm run docs:lint`
- `git diff --check`
