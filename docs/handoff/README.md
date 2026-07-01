# Handoff

Dated execution notes, QA reports, closeout memos, and carry-forward corrections live here.

## Use This Folder For
- execution summaries tied to a date/commit
- QA reports and closeout notes
- reconciliation / carry-forward notes when multiple agents touched the same topic
- phase or batch summaries

## Do Not Use This Folder For
- canon/product semantics
- long-term feature specifications
- parallel “memory” docs for the same issue when one reconciliation note will do

## How To Read Handoffs Safely
- Treat handoffs as lower authority than current specs and current code.
- Prefer the latest relevant dated handoff over older notes on the same topic.
- If a handoff conflicts with current `HEAD`, call it out as stale instead of carrying it forward.

## Current High-Value Handoffs
- [`2026-07-01_active-pm-post-cleanup.md`](./2026-07-01_active-pm-post-cleanup.md) — records the approved cleanup-candidate branch/worktree removal and updates `docs/operations/ACTIVE_PM.md` to leave only preserve/review branches in queue.
- [`2026-07-01_active-pm-branch-triage.md`](./2026-07-01_active-pm-branch-triage.md) — refreshes `docs/operations/ACTIVE_PM.md` after PR #150 with cleanup-candidate and preserve/review branch classifications.
- [`2026-07-01_active-pm-current-work.md`](./2026-07-01_active-pm-current-work.md) — adds the lightweight `docs/operations/ACTIVE_PM.md` current-work snapshot so agents can check active branch/PR/blocker/worktree state without treating it as product doctrine.
- [`2026-07-01_plot-primary-tab-body-extraction.md`](./2026-07-01_plot-primary-tab-body-extraction.md) — extracts the active `/plot` Feed/Events/Archive body renderer into `PlotPrimaryTabBody` as the first low-risk route-shell cleanup from the structural integrity roadmap.
- [`2026-07-01_plot-deferred-panel-quarantine.md`](./2026-07-01_plot-deferred-panel-quarantine.md) — marks retained `StatisticsPanel` and `PlotPromotionsPanel` files as deferred/non-current import targets and adds Plot component-folder guidance so future agents do not revive stale Statistics/Promotions tabs.
- [`2026-06-29_home-scene-roller-arrows-swipe.md`](./2026-06-29_home-scene-roller-arrows-swipe.md) — updates `/plot` Home Scene Roller presentation to centered active scene plus left/right arrows and swipe, while keeping saved Away Scenes profile-only.
- [`2026-06-29_plot-feed-avatar-merch-clarification.md`](./2026-06-29_plot-feed-avatar-merch-clarification.md) — captures the Feed-as-Home-Scene-mainpage clarification, reusable feed card-family taxonomy, and deferred avatar-wearable merch fit-model direction for future design agents.
- [`2026-06-29_activation-cutover-fixture-smoke.md`](./2026-06-29_activation-cutover-fixture-smoke.md) — adds the API-owned fixture-backed activation write smoke for synthetic source/listener/proxy cutover verification, with dry-run and host/database-scoped confirmation before non-local writes.
- [`2026-06-29_activation-cutover-transaction-revalidation.md`](./2026-06-29_activation-cutover-transaction-revalidation.md) — hardens manual Home Scene activation cutover with transaction-time readiness revalidation, normalized source/listener tuple matching, and post-merge Fly staging deploy/read-only smoke evidence.
- [`2026-06-29_release-deck-song-cap-registrar-gps.md`](./2026-06-29_release-deck-song-cap-registrar-gps.md) — records the Release Deck 6-minute per-song cap, reject-only at-cap behavior, Registrar GPS materialization re-check, and staging source-origin readiness smoke cleanup evidence.
- [`2026-06-29_release-deck-15-minute-source-cap.md`](./2026-06-29_release-deck-15-minute-source-cap.md) — records the founder decision changing the Release Deck / activation readiness per-source cap from 20 minutes to 15 minutes per Uprise rotation, with owner docs and runtime constants updated.
- [`2026-06-29_users-me-current-route-staging-closeout.md`](./2026-06-29_users-me-current-route-staging-closeout.md) — records the post-merge Fly API staging deploy, health checks, authenticated `/users/me` smoke, and temporary user cleanup for PR #135.
- [`2026-06-29_users-me-current-route.md`](./2026-06-29_users-me-current-route.md) — fixes the authenticated bare `GET /users/me` route-order gap found during staging browser QA and locks current-user `me/*` routes ahead of parameterized `/users/:id` routes.
- [`2026-06-29_authenticated-onboarding-browser-qa.md`](./2026-06-29_authenticated-onboarding-browser-qa.md) — records signed-in staging browser QA for manual Austin/Texas/Punk onboarding with GPS denied, Plot/Home Scene Roller/profile verification, temporary user cleanup, and the non-blocking bare `/users/me` route-order observation.
- [`2026-06-29_authenticated-onboarding-persistence-smoke.md`](./2026-06-29_authenticated-onboarding-persistence-smoke.md) — adds the authenticated onboarding persistence smoke path for temporary-user Home Scene/default preference/Home Scene Roller verification after login, with host/database-scoped confirmation for staging writes.
- [`2026-06-29_hosted-migration-runner.md`](./2026-06-29_hosted-migration-runner.md) — closes the Fly API production-image Prisma CLI gap by adding an API-owned `migrate:deploy` command, production-deploy verification helper, and the exact Fly staging migration command to use before the next schema change.
- [`2026-06-29_launch-readiness-verification.md`](./2026-06-29_launch-readiness-verification.md) — current launch-readiness verification pass and post-deploy closeout: Google Places, launch-community DB verification, focused API/web contracts, stable Vercel/Fly/Neon smoke, staging preference migration, and signed-out onboarding browser QA now pass after PR #127 and PR #128.
- [`2026-06-29_staging-truth-refresh.md`](./2026-06-29_staging-truth-refresh.md) — previous read-only staging baseline: Vercel stable web load, Fly API health, Neon/PostGIS readiness, and Vercel-to-Fly CORS passed before the later launch-readiness pass ran Places and direct DB verification.
- [`2026-06-19_distance-based-pioneer-fallback.md`](./2026-06-19_distance-based-pioneer-fallback.md) — makes unavailable Home Scene fallback actually distance-based when submitted city coordinates and active scene geofences are available.
- [`2026-06-18_fake-location-provider-smoke.md`](./2026-06-18_fake-location-provider-smoke.md) — local fake location provider and onboarding smoke command for manual, GPS-first, and pioneer fallback flows without routine Google Maps API calls.
- [`2026-06-18_onboarding-gps-location-authority.md`](./2026-06-18_onboarding-gps-location-authority.md) — locks manual-first location authority, GPS-derived city/state fallback when the user does not enter location, and GPS recheck after Home Scene persistence for voting eligibility.
- [`2026-06-17_archive-runtime-contract.md`](./2026-06-17_archive-runtime-contract.md) — current `/plot` Archive runtime contract hardening: Archive remains descriptive and does not revive map/analytics exploration as the default MVP body.
- [`2026-06-16_uprise-spark-high-ui-alignment-pass.md`](./2026-06-16_uprise-spark-high-ui-alignment-pass.md) — current Spark-safe UI/UX docs alignment pass for active Plot tab language, Archive wording, and design-agent packet setup.
- [`2026-06-16_linear-ready-ui-context-issues.md`](./2026-06-16_linear-ready-ui-context-issues.md) — Linear-ready follow-up cards for UI context routing, stale-tab lint expansion, and Archive runtime verification after the next UI slice.
- [`2026-06-15_deploy-readiness-and-env-matrix.md`](./2026-06-15_deploy-readiness-and-env-matrix.md) — current hosted-stack readiness context for Vercel/Fly/App Runner/Neon/S3/R2 planning and deploy env ownership.
- [`2026-04-26_listener-profile-source-management-separation.md`](./2026-04-26_listener-profile-source-management-separation.md) — locks the distinction between listener user profile, public Artist Profile, and separate source-management surface/domain.
- [`2026-04-25_missing-focus-lane-briefs.md`](./2026-04-25_missing-focus-lane-briefs.md) — closes the missing business, onboarding, registrar, and external-tool lane brief gaps called out by the focus-stage inventory.
- [`2026-04-25_cloud-codex-stale-language-audit-cleanup.md`](./2026-04-25_cloud-codex-stale-language-audit-cleanup.md) — accepted Cloud Codex stale-language audit cleanup for active Plot/Archive/Discover-placeholder docs.
- [`2026-04-25_context-router-focus-lanes.md`](./2026-04-25_context-router-focus-lanes.md) — current focus-lane context router for loading only the work area and companion briefs a task needs.
- [`2026-04-25_section-briefs-and-stale-term-guard.md`](./2026-04-25_section-briefs-and-stale-term-guard.md) — current section-brief expansion and targeted stale-term docs lint guard for active agent-facing context.
- [`2026-04-25_agent-section-briefs.md`](./2026-04-25_agent-section-briefs.md) — current section-specific agent brief system and maintenance rule.
- [`2026-04-18_handoff-staleness-reconciliation.md`](./2026-04-18_handoff-staleness-reconciliation.md) — current guide to which older handoffs are historical-only versus still useful carry-forward.
- [`2026-04-18_repo-authority-map-and-wiki-steering.md`](./2026-04-18_repo-authority-map-and-wiki-steering.md) — current repo authority and generated-wiki steering layer for external assistants.
- [`2026-04-18_art-department-structure.md`](./2026-04-18_art-department-structure.md) — current art/design workspace structure.
- [`2026-04-17_abacus-external-assistant-briefing.md`](./2026-04-17_abacus-external-assistant-briefing.md) — current external-assistant setup context.
- [`2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`](./2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md) — current curated briefing for artist-profile/source-dashboard questions.
- [`2026-04-16_discover-feed-insert-and-artist-demo-lock.md`](./2026-04-16_discover-feed-insert-and-artist-demo-lock.md) — current discovery-to-artist-profile demo-listen lock.
- [`2026-04-16_discover-deferred-local-only-mvp.md`](./2026-04-16_discover-deferred-local-only-mvp.md) — current MVP Discover deferment and feed-insert position.

## Finding Relevant Notes
Use search instead of reading large historical batches by default.

Examples:
```bash
rg -n "discover|plot|onboarding|registrar" docs/handoff
find docs/handoff -maxdepth 1 -type f | sort | tail -n 40
```

## Templates
- [`TEMPLATE_agent-handoff.md`](./TEMPLATE_agent-handoff.md)
- [`TEMPLATE_handoff-phase.md`](./TEMPLATE_handoff-phase.md)

## Coordination Control Plane
- [`agent-control/README.md`](./agent-control/README.md)
- [`agent-control/AGENT_DIRECTIVES.md`](./agent-control/AGENT_DIRECTIVES.md)

## Historical Material
Older phase notes and large slice batches remain in this folder for traceability, but they are historical context, not default reading.
