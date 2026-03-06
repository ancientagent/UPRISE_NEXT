# Context Reset Handoff — UX/UI + Uizard (2026-03-05)

## Objective
Continue MVP mobile-first UX/UI definition and mockup generation with zero drift from current locked decisions.

## Canon/Source Files To Read First
1. `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
2. `docs/RUNBOOK.md`
3. `docs/FEATURE_DRIFT_GUARDRAILS.md`
4. `docs/architecture/UPRISE_OVERVIEW.md`
5. `docs/PROJECT_STRUCTURE.md`
6. `apps/web/WEB_TIER_BOUNDARY.md`
7. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
8. `docs/README.md`
9. `docs/solutions/README.md`

## Locked UX Decisions (Current)
- No avatar in MVP profile surfaces.
- Collapsed profile strip: username + notifications + options only.
- Expanded profile header:
  - username/handle
  - activity score
  - band/promoter fields only when applicable
  - calendar widget on opposite side of profile details
- Ambassador/mixologist profile surfaces are deferred.
- Expanded profile tabs (locked order):
  1. Singles/Playlists
  2. Events
  3. Photos
  4. Merch
  5. Saved Uprises
  6. Saved Promos/Coupons
- Player mode:
  - No dedicated RADIYO/Collection switch button.
  - Collection mode starts when user selects collection song/playlist.
  - Collection mode persists while navigating Plot.
  - Return to RADIYO via eject only.
- Collection player:
  - shuffle on player strip
  - other collection controls via engagement/action wheel
- RADIYO transport:
  - tap City/State/National tier to start that broadcast scope
  - tap active tier again to stop playback

## Action Wheel (Locked)
- Trigger: center UPRISE logo in bottom nav.
- RADIYO actions: Report, Skip, Blast, Add, Upvote.
- Collection actions: Back (9:00), Pause (10:00), Blast (12:00), Recommend (1:00), Next (3:00).
- Plus/minus dial exists as future interaction concept; not locked as MVP implementation.

## Primary Working Docs
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/solutions/MVP_PROFILE_EXPANDED_MOCKUP_R1.md`
- `docs/solutions/MVP_PLAYER_PROFILE_INTERACTION_R1.md`
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R1.md`

## Uizard Automation Status
- In-repo MCP bridge exists:
  - `packages/uizard-mcp/src/index.ts`
  - tools: `uizard_config`, `uizard_request`
- Setup docs:
  - `docs/solutions/UIZARD_MCP_SERVER_SETUP.md`
- Next hardening (recommended):
  1. path/method allowlist in `uizard_request`
  2. typed wrappers: `list_projects`, `get_project`, `create_screen`
  3. smoke test for auth + safe GET

## Immediate Next Task
Generate and iterate Uizard mobile mockups for:
1. Plot + collapsed profile + RADIYO
2. Plot + collapsed profile + Collection
3. Expanded profile header + each tab state

## Known Open Decision
- Plus/minus dial MVP status:
  - recommended default: deferred (V2), keep as note only.

