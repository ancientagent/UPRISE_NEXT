# UPRISE UI/UX Focus Packet (Current Lane)

Status: active
Last Updated: 2026-06-16
Owner: UPRISE product lane steward

## Scope
- Listener-facing UX and homepage shell shape during UI design handoffs:
  - Home/Plot layout
  - Player/pull-down profile behavior
  - Artist Profile listener surface
  - Archive/Feed/Events content expectations
- Onboarding review behavior that affects player or plot context
- Design artifact routing for Claude/other external design tools

## Context load order (required)
1. `docs/agent-briefs/UI_CURRENT.md`
2. `docs/agent-briefs/EVENTS_ARCHIVE.md`
3. `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
4. `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`
5. Companion runtime only if edits are being implemented:
   - `apps/web/src/app/plot/page.tsx`
   - `apps/web/src/components/plot/RadiyoPlayerPanel.tsx`
   - `apps/web/src/app/artist-bands/[id]/page.tsx`

## Active runtime truth (use this, not old examples)
- Plot tabs: `Feed`, `Events`, `Archive`
- No current MVP `Promotions` or `Statistics` tab in Plot
- Archive is descriptive/community-history lane (read-mostly), not leaderboard/engagement analytics
- `Artist Profile` is direct-listen/info/share surface (no engagement wheel)
- `Blast` is not on Artist Profile; user profile is listener-collection/pull-down workspace
- Player may move to bottom strip under space constraints when profile is expanded
- Source management belongs to `/source-dashboard` (or future separate source domain), not listener profile

## Subtags / when to load extra docs
- `player-profile` → also load `docs/agent-briefs/CONTEXT_ROUTER.md` and `apps/web/WEB_TIER_BOUNDARY.md`
- `feed-events` → load `docs/agent-briefs/CONTEXT_ROUTER.md`, `docs/specs/communities/plot-and-scene-plot.md`
- `archive-history` → load `docs/agent-briefs/EVENTS_ARCHIVE.md`, `docs/specs/communities/scene-map-and-metrics.md`
- `artist-profile` → load `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `onboarding-review` → load `docs/agent-briefs/ONBOARDING_HOME_SCENE.md`, `apps/web/src/lib/onboarding/review-resolution.ts`

## Hard no-confusion rules
- Do not treat `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md` as current behavior authority. It is historical only.
- Do not open broad docs by default. Pull only lane-relevant docs from the list above.
- If a design brief asks for screens/states, always include:
  - baseline (collapsed)
  - profile-expanded
  - archive/feed/events variants
  - no-CTAs if unauthorized by spec
