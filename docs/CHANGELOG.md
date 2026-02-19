# 📜 CHANGELOG.md — UPRISE Monorepo

**Repository:** `music-community-platform`  
**Policy:** Auto-updated via CI from PR titles & labels. Manual edits allowed for summaries.

---

## [Unreleased]
### Added
- Plot Events surface web + API wiring:
  - Added `GET /communities/:id/events` endpoint (scene-scoped listing, deterministic ordering).
  - Added `PlotEventsPanel` component in `apps/web/src/components/plot/PlotEventsPanel.tsx`.
  - Plot Events tab now renders API-backed scene events from selected community anchor.
  - Added service unit tests: `apps/api/test/communities.events.service.test.ts`.
- Plot S.E.E.D Feed web wiring:
  - Added `SeedFeedPanel` component in `apps/web/src/components/plot/SeedFeedPanel.tsx`.
  - Plot Feed tab now calls `GET /communities/:id/feed` and renders cursor-paginated scene activity.
  - Feed rendering remains scene-scoped and non-personalized.
- Scene map API + web wiring:
  - Added `GET /communities/:id/scene-map?tier=city|state|national`.
  - Added tier-scoped scene-map payload in `CommunitiesService.getSceneMap` with:
    - city scope: community points
    - state scope: city rollups
    - national scope: state rollups
  - Statistics page map now consumes the scene-map endpoint across tiers.
  - Added service unit tests: `apps/api/test/communities.scene-map.service.test.ts`.
- Community statistics API + web wiring:
  - Added `GET /communities/:id/statistics?tier=city|state|national`.
  - Added tier-scoped metrics and deterministic `topSongs` payload (max 40) in `CommunitiesService.getStatistics`.
  - Statistics tab now reads API-backed metrics from `/communities/:id/statistics`.
  - Top Songs panel now reads `topSongs` from the statistics endpoint (instead of feed approximation).
  - Added service unit tests: `apps/api/test/communities.statistics.service.test.ts`.
- Web community profile read surface:
  - Added `apps/web/src/app/community/[id]/page.tsx` to display community metadata, counts, and recent S.E.E.D activity.
  - Added Plot-to-profile navigation via `Open Profile` action in `apps/web/src/app/plot/page.tsx`.
- Admin Fair Play config surface (global policy variables only):
  - Added `FairPlayConfig` model in `apps/api/prisma/schema.prisma`.
  - Added `AdminConfigModule` with endpoints:
    - `GET /admin/config/fair-play`
    - `POST /admin/config/fair-play`
  - Added service tests for config read/update:
    - `apps/api/test/admin-config.service.test.ts`
- Fair Play foundation (Task 1 + Task 2):
  - Added `RotationPool` enum and `RotationEntry` model to `apps/api/prisma/schema.prisma`.
  - Added `FairPlayModule` and `FairPlayService` with `ingestNewRelease(trackId, sceneId)` to place tracks into `NEW_RELEASES`.
  - Enforced one active new release per artist per scene in ingestion logic.
  - Added unit tests for Fair Play ingestion service (`apps/api/test/fair-play.service.test.ts`).
- Fair Play recurrence aggregation foundation (Task 3):
  - Added `aggregateRecurrenceScores(sceneId, asOf)` in `FairPlayService` with 14-day rolling window aggregation for `MAIN_ROTATION`.
  - Added `RecurrenceAggregationJob` surface (`apps/api/src/fair-play/jobs/recurrence-aggregation.job.ts`).
  - Added recurrence aggregation tests (`apps/api/test/fair-play.recurrence.test.ts`) including idempotent rerun behavior.
- Fair Play vote foundation (Task 4):
  - Added `TrackVote` model to `apps/api/prisma/schema.prisma` (scene-tier uniqueness guard).
  - Added `POST /tracks/:id/vote` via `FairPlayController` with Zod DTO validation.
  - Added vote gates in `FairPlayService.castVote()`:
    - currently-playing assertion (`nowPlayingTrackId` must match route track)
    - GPS verification required
    - Home Scene match required
    - track must be present in scene broadcast rotation
  - Added vote unit tests (`apps/api/test/fair-play.vote.test.ts`).
- Fair Play rotation serving (Task 5):
  - Added `GET /broadcast/:sceneId/rotation` via `BroadcastController`.
  - Added `FairPlayService.getRotation(sceneId)` returning deterministic ordered pools:
    - `newReleases` ordered by `enteredPoolAt ASC`
    - `mainRotation` ordered by `recurrenceScore DESC`, then `enteredPoolAt ASC`
  - Added response metadata (`sceneId`, `generatedAt`, `newReleasesCount`, `mainRotationCount`).
  - Added rotation service tests (`apps/api/test/fair-play.rotation.test.ts`).
- Fair Play API spec alignment:
  - `docs/specs/broadcast/radiyo-and-fair-play.md` now reflects implemented vote endpoint path `POST /tracks/:id/vote` (replacing legacy planned `/votes` path).
- Fair Play diagnostics endpoint:
  - Added `GET /fair-play/metrics?sceneId=:sceneId` to return scene-scoped lifecycle/recurrence telemetry.
  - Includes `activeNewCount`, `mainRotationCount`, recurrence summary (`avg/min/max`), and 14-day `votesInWindow`.
  - Added unit tests (`apps/api/test/fair-play.metrics.test.ts`).
- Fair Play density analysis doc for punk city modeling (`docs/solutions/FAIR_PLAY_PUNK_CITY_DENSITY_STUDY_2026-02-18.md`) with Austin/LA calibration, dial-variance results, and 60/75/90 minute capped-cycle comparisons.
- Analytics instrumentation framework spec (`docs/specs/engagement/analytics-and-instrumentation-framework.md`) for Home Scene descriptive metrics tracking.
- Super-admin analytics governance scope: full telemetry visibility + custom metric/module definition controls (descriptive-only boundary).
- Broadcast simulation tool for Fair Play exploration:
  - `scripts/fair_play_rotation_sim.py`
  - includes new `lateral_vote_mid_entry` mode where songs start neutral/mid-cycle and cadence is adjusted by lateral vote signal (`more`, `fine`, `less`) with min/max replay-gap safety bounds.
- Track engagement recording API (`POST /tracks/:id/engage`) for Fair Play recurrence inputs (legacy 3/2/1/0 mapping retained in historical implementation notes, superseded by Two-Pool V1 spec direction).
- TrackEngagement model with spam guard (unique on userId+trackId+sessionId).
- Unit tests for engagement scoring and service methods.
- Scene-scoped S.E.E.D feed API: `GET /communities/:id/feed` (explicit actions/events only, non-personalized).
- System specs for web-tier contract guard, documentation framework, agent handoffs, and CI/CD pipeline.
- Onboarding flow UI in `apps/web` with Home Scene selection and GPS voting disclaimer.
- Plot shell in `apps/web` with core tabs (Feed, Events, Promotions, Statistics, Social).
- Web onboarding store and seed data lists for Music Communities and taste tags.
- Onboarding API endpoints for Home Scene selection and GPS verification.
- Google Places city autocomplete API (server-side) for onboarding location input.
- Scene mapping fields on communities (`city`, `state`, `musicCommunity`, `tier`, `isActive`).
- Sect tags and user tag linkage to support Home Scene routing.
- Signals data model, signal actions (ADD/BLAST/SUPPORT), follows, and collections.

### Changed
- Fair Play services now read `recurrenceRollingWindowDays` from global admin config (`fair_play_config`) with fallback default (`14`) when unset.
- Docs readiness state normalized:
  - Canon-side generated readiness report removed.
  - Consolidated to single active readiness report at `docs/Specifications/FRESH_READINESS_REPORT.md`.
- Fair Play Two-Pool policy locks:
  - recurrence reorder cadence set to 48 hours
  - recurrence rolling window set to 14 days
  - graduation minimum lifecycle age set to 14 days
  - graduation execution cadence set to biweekly (14 days)
- Plot statistics panel cleanup:
  - `StatisticsPanel` now uses `SceneMap` as the single map/marker renderer (removed duplicated inline marker logic).
  - Added `shouldFetchNearbyForTier` guard and tests to enforce canon behavior: only `city` tier performs nearby lookup; `state`/`national` do not use radius queries.
- Agent governance tightened to prevent cross-platform trope drift:
  - Added `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md` playbook.
  - Linked anti-trope guardrails in `docs/solutions/README.md`.
  - Added non-negotiable anti-trope rule in `AGENTS.md`.
- Web app build no longer depends on Google Fonts fetch (removed `next/font` Google import from `apps/web/src/app/layout.tsx` to avoid DNS/network build flakiness).
- User schema extended with Home Scene and GPS verification fields.
- Onboarding UI now calls API when authenticated and pulls city suggestions from Places endpoint.
- Onboarding resolution now supports sect tags and pioneer routing flags.
- Canon updated: Uprise defined as a dual‑state object (station + signal); S.E.E.D Feed retained.
- Revenue canon clarified: catalog is an artist opt‑in feature for label discovery.
- Revenue canon cleaned: removed anti‑poaching language.
- Revenue canon clarified: catalog is long‑term, dependent on accumulated stats.
- Revenue canon clarified: primary funding mix centers on artist ads, Print Shop touring promotion fees, low‑cost business Promotions ads, and subscription tiers.
- Print Shop promotions clarified as boost-style cross-community Promotions distribution (explicit scope selection only; no Fair Play or ranking impact).
- Canon alignment pass: synced Narrative, Glossary, Application Surfaces, Expanded Getting Started, and Legacy Narrative-in-canon to the same Promotions-only boost model.
- Fair Play spec wording clarified to scope pay-for-placement prohibitions to Fair Play/governance/rotation systems.
- Canon/spec scope clarified: artist catalog/label-signing services are post‑V1 and not part of the initial build.
- Canon revenue rule clarified: only Mix Market (V2) uses revenue sharing; all other systems use service/subscription pricing.
- Canon alignment: `Legacy Narrative plus Context` updated to match `Master Narrative Canon` on Signals/Entities, Promotions-vs-Feed boundaries, Fair Play constraints, Registrar/Fair Play governance limits, and terminology.
- Revenue canon cleanup: removed account-identity structural statement from pricing section to keep scope strictly revenue/mechanics.
- Canon safety guardrails added: new `canon:lint` script, `docs:lint` integration, and explicit no-bulk-import-overwrite protocol in agent/runbook/docs index guidance.
- Branch-protection scaffolding added: `.github/CODEOWNERS`, PR template, `Canon Guard` workflow, and runbook instructions for required status checks.
- `Canon Guard` workflow trigger widened to all PRs so it can be enforced as a required status check.
- Plot spec updated to mark S.E.E.D feed endpoint as implemented and web rendering as pending.
- Secrets workflow custom-pattern scan hardened to avoid false positives from workflow regex literals, test fixtures, and archived legacy `.env` snapshots under `docs/legacy/`.
- Secrets workflow temporarily relaxed for early iteration: JWT/password-pattern custom check removed from blocking logic; PR comment posting is non-blocking.
- Added `pnpm run verify` (docs:lint + infra-policy-check + typecheck) and `pnpm run verify:full` (verify + test + build) to standardize local pre-push checks.
- Core specs alignment pass:
  - `COMM-SCENES` now documents implemented scene/sect models, migrations, and onboarding/community endpoints.
  - `COMM-PLOT` now distinguishes implemented Plot shell from deferred S.E.E.D/registrar/statistics integrations.
  - `USER-ONBOARDING` now documents exact request/response contracts and GPS reason codes from current API behavior.
  - `CORE-SIGNALS` now documents implemented signal/follow/collection contracts and idempotency constraints.
  - `BROADCAST-FP` now distinguishes implemented engagement capture from deferred rotation/vote/propagation systems.
- Specs completion pass:
  - Promoted remaining module specs to active status with explicit implemented-vs-deferred sections:
    - `USER-IDENTITY`, `SYS-REGISTRAR`, `SOCIAL-MSG`, `EVENTS-FLYERS`, `ENG-ACTIVITY`,
      `ECON-PRINTSHOP`, `ECON-REVENUE`, `SYS-MODERATION`, `SYS-EDGE`, `ADMIN-SUPER`,
      `DISC-VIBE`, `V2-SEARCH`, `V2-ROOMS`, `V2-MIXES`, `V2-AMBASSADOR`, `SEED-TAXONOMY`.
  - Removed remaining spec-level `TBD` placeholders from canonical module specs.
  - Updated specs index files:
    - `docs/specs/system/README.md`
    - `docs/specs/users/README.md`
- Scene map/statistics canon-alignment pass:
  - Added `docs/specs/communities/scene-map-and-metrics.md` (`COMM-SCENEMAP`) to define Scene Map as inherent to the Scene.
  - Locked parent-context persistence across tier toggles (city/state/national toggles change aggregation scope only).
  - Locked tier view semantics:
    - city = local/sect detail
    - state = city-level macro view
    - national = state-level macro view
  - Added `docs/specs/communities/statistics-page-design-task-list.md` (`COMM-STATS-DESIGN`) as a dedicated non-code task track for Statistics page design.
  - Updated Plot and community specs indexes to reference the new Scene Map contract.
  - Added Scene Map policy locks to `docs/specs/DECISIONS_REQUIRED.md` (aggregation windows, geo privacy floor, tier rollup continuity).

### Fixed
- Jest tooling installed for `apps/web`, `apps/api`, and `apps/socket` so `pnpm run test` works.
- Web-tier typecheck error in `apps/web/__tests__/web-tier-guard.test.ts`.
- Socket.IO community event tests by wiring real namespace/handler setup.
- PostGIS community creation raw SQL to avoid returning unsupported `geofence` in results.
- Turbo test env forwarding for `DATABASE_URL` so API tests can run under `turbo run test`.
- Web typecheck/build reliability:
  - Disabled `apps/web` incremental typecheck to avoid `tsconfig.tsbuildinfo` artifacts and stale cache issues.
  - Added a Solutions playbook for `.next/types` TS6053 failures.

---

## 2025-11-13
### Added (T6)
- **PostGIS API Endpoints for Communities:**
  - `GET /api/communities/nearby` - Find communities within radius using PostGIS ST_DWithin
  - `POST /api/communities/:id/verify-location` - Verify user location within geofence
- **Comprehensive error handling:**
  - Coordinate validation (lat/lng bounds)
  - PostGIS query failure handling
  - Invalid geofence data detection
- **Documentation:**
  - Added `docs/T6_IMPLEMENTATION_SUMMARY.md` with complete implementation details

### Fixed (T6)
- TypeScript errors related to Prisma Unsupported geofence field
- Route path from `/api/communities/nearby/search` to `/api/communities/nearby`
- Health service HealthStatus interface export issue
- ZodQuery decorator TypeScript compatibility

### Changed (T6)
- Refactored geofence operations to use raw SQL queries
- Updated communities service with proper PostGIS handling
- Improved error messages for geospatial operations

### Technical (T6)
- PostGIS functions: ST_GeogFromText, ST_DWithin, ST_Distance, ST_X, ST_Y
- Raw SQL queries for geography type handling
- Coordinate validation: lat (-90 to 90), lng (-180 to 180)
- Distance calculations in meters with geodesic accuracy

---

## 2025-11-12
### Added
- Phase 1 foundation documented: `PHASE1_COMPLETION_REPORT.md`.
- Critical infrastructure directive: `STRATEGY_CRITICAL_INFRA_NOTE.md`.
- Operational playbooks: `RUNBOOK.md`, `ENVIRONMENTS.md`, `PROJECT_STRUCTURE.md`.

### Changed
- Established strict web-tier boundary contract and documented PR rules.

### Notes
- CI should include a job to append merged PR titles grouped by date and labels to this file.
