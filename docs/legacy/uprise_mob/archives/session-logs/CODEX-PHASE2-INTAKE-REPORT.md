# Codex Phase 2 Intake Report — July Model Consolidation

Date: 2025-09-08

## Key Findings (July Model vs Current Specs)
- Identity unification
  - July model emphasizes consolidating solo Artists and Bands under a canonical performer identity.
  - Repo evidence: Sequelize `artistprofile` model and migrations for band→artist unification present; API routes include band/artist endpoints.
- Location filtering
  - July model calls for city/state + PostGIS-backed geo; current specs describe community key and hierarchy.
  - Repo evidence: `locations`, lat/lng on `songs`, PostGIS noted in docs and CHANGELOG.
- Radio/Community
  - July model frames Radio as the execution of community queues; current specs treat them closely but needed explicit unification.
  - Update applied: radio defined as projection over community rotation with shared filters.
- Genre upgrade
  - July model proposes stronger taxonomy and tagging; specs had genre integration, but tag arrays and hierarchy needed clarity.
  - Update applied: primary `genre_id` + optional `genre_tags[]`, taxonomy hierarchy for discovery/promotions.

## Decision Points & Resolutions
- Canonical performer id
  - Decision: enforce `artist_canonical_id` across Songs, Events, Promotions; retain optional `band_id`.
  - Rationale: clear ownership, analytics consistency, simpler authorization logic.
- Standard geo/genre API params
  - Decision: use `city,state,genre,lat,lng,radius,community_key` across discovery/radio/events/promotions.
  - Rationale: eliminates drift, enables shared client hooks and cache keys.
- Radio as Community projection
  - Decision: keep one entity (Community) with RaDIYo queues as projections (tiered views); same filters/taxonomy.
  - Rationale: avoids duplicate logic and inconsistencies.
- Genre taxonomy + tags
  - Decision: hierarchical taxonomy with optional `genre_tags[]` for fine-grained discovery and targeting.
  - Rationale: supports both structured browsing and flexible promotion audiences.

## Dependency Map
- Mobile app ↔ API
  - Mobile sends `community_key` (or lat/lng) and reads radio/discovery queues; optional `X-Artist-Canonical-Id` when acting as creator.
- API ↔ DB (Postgres/PostGIS @ 5433)
  - Sequelize models/migrations implement identity, genre, and geo; PostGIS functions used for spatial filters.
- webapp_ui ↔ API
  - Business tools for promotions/events rely on standard params and echoing effective targeting.
- Cross‑module
  - Auth provides identity context; Community provides geo context; Fair Play consumes both; Promotions/Events target via them.

## Light Verification Summary
- .env shape (sibling webapp_api): keys found for DB_HOST/DB_PORT/DB_NAME/DB_USERNAME/DB_PASSWORD + JWT/PORT.
- psql PostGIS check attempted; not executed here (likely not installed or DB not running). Command provided below.
- API structure inspected: routes present for auth, radio, discovery, communities, events; database models/migrations include band/artist unification and geo fields.

## Next Steps (Ops/Dev)
- Run PostGIS check locally: `psql -p $DB_PORT -d $DB_NAME -c "SELECT PostGIS_Full_Version();"`
- Confirm GIST indexes on geo columns; validate ST_DWithin queries with seed data.
- Normalize API params and response echoes; add OpenAPI snippets to route docs.

---

## July Model Alignment — Architecture + Feature Reports (Ingested)

Sources
- docs/archives/july-model/architecture realignment/ARCHITECTURAL-REALIGNMENT-IMPLEMENTATION.md
- docs/archives/july-model/architecture realignment/BACKEND-FORENSIC-ANALYSIS.md
- docs/archives/july-model/architecture realignment/ARTIST-UNIFICATION-IMPLEMENTATION.md
- docs/archives/july-model/architecture realignment/FRONTEND-ARTIST-UNIFICATION-REFACTORING.md
- docs/archives/july-model/architecture realignment/STATION-COMMUNITY-SYSTEM-ANALYSIS.md
- docs/archives/july-model/Feature realignment/MODERN-GENRES-SYSTEM.md

Key problems identified
- Feed logic mixed songs/events; should be notifications only (music via radio).
- Home feed lacked location filtering; discovery endpoints also missed geo filters.
- Genre onboarding used outdated endpoint; needed `/onboarding/all-genres` (97 genres).
- Artist/Band split; backend unification implemented (ArtistProfile), frontend refactor in progress.
- Radio tiers (CITYWIDE/STATEWIDE/NATIONAL) need consistent mapping to community filters.

Mapped actions (Phase 2)
- Confirm feed is notifications-only and keep music in radio/discovery flows.
- Implement/verify geo filters for discovery; standardize params and echo `community_key`.
- Ensure onboarding uses super/all-genre endpoints; align mobile services accordingly.
- Use ArtistProfile endpoints from mobile; enforce canonical ID ownership on writes.
- Treat Radio as a projection of Community queues with same filters and tiers.

---

## Session Log — 2025-09-10 (Codex/WSL)

Checklist outcomes
- Phase anchor present (`docs/overview/PHASE2_EXECUTION_PLAN.md`), context docs loaded.
- Smokes: API discovery/radio endpoints unreachable at time of run; health endpoint OK.
- Health checks: API `/health` OK; Postgres and PostGIS checks OK.
- DB checks: Added safe `.env` parser to `psql_postgis_check.sh` (handles BOM/CRLF and `$` in secrets); verified migration status via `yarn db:migrate:status` (read‑only).

Next deliverables (backend)
- Enforce `X-Artist-Canonical-Id` on creator writes with membership authorization (403 on mismatch).
- Normalize geo/genre params across discovery/radio/events and echo `community_key`.
- Ensure `/onboarding/all-genres` returns 97 items for onboarding.

Notes
- Non‑destructive DB policy observed (no migrations executed).

---

## Session Log — 2025-09-11 (Codex/WSL)

Checklist outcomes
- Phase anchor present (`docs/overview/PHASE2_EXECUTION_PLAN.md`), SYSTEM_OVERVIEW and params fragment loaded.
- Smokes: `session_kickoff.sh` + `phase2_smoke.sh` executed; API discovery/radio endpoints not reachable at run time.
- Health checks: `docs/automation/scripts/health_checks.sh` → API `/health` OK; Postgres and PostGIS OK (jq missing).
- DB checks: `psql_postgis_check.sh` reports PostGIS 3.4.2 on PG 16; `migration_guard.sh` shows schema up-to-date.

Next deliverables (backend)
- Auth refresh + mobile state
  - Acceptance: refresh works; app boot reflects authenticated state; 401s handled; tokens persisted/rotated.
- Onboarding 97-genre taxonomy
  - Acceptance: `/onboarding/all-genres` returns 97; onboarding selection sets home scene and persists `community_key`.
- Radio/Discovery community filters
  - Acceptance: `/api/radio|/api/discovery` accept standard geo/genre params or `community_key` and echo `community_key` in responses.

Notes
- Kept operations idempotent and non-destructive; no schema changes executed.

## 2025-09-16 07:34:42Z — Codex Phase 2 Backend Intake
- Scope: Docs anchors, API/DB health, migrations status, routing intent
- Docs: PHASE2_EXECUTION_PLAN.md + CARRYOVER_TEMPLATE present; Acceptance explicitly states post-login → Home Scene Creation (CommunitySetup)
- API health: http://127.0.0.1:3000/health not reachable (API health failed)
- DB/PostGIS: psql connection failed on 127.0.0.1:5433; PostGIS version/extension status unknown
- Migrations: sequelize status/migrate errored (connect EPERM 127.0.0.1:5433); no changes applied
- Phase 2 smoke: Skipped (API unreachable)
- Routing intent (code): login saga navigates to 'CommunitySetup'; screen registered in Auth/Home navigators
- Artifacts: artifacts/logs/* (docs_acceptance_check.txt, scripts_ls.txt, api_health.txt, postgis_check.txt, migration_guard.txt, phase2_smoke.txt, routing_check.txt)
- Immediate blockers: API not running locally; DB not reachable with expected config (5433). Next, bring up API + DB (Postgres 16 + PostGIS, uuid-ossp, pgcrypto).
- Next deliverables (backend):
  - API: expose /health OK; wire onboarding endpoints; acceptance = 200 with version hash
  - DB: verify extensions enabled; acceptance = SELECT versions, extensions list
  - Migrations: status clean on dev; acceptance = sequelize status shows up/down with no pending

---

## Session Log - 2025-09-15 (Agents/PowerShell)

Checklist outcomes
- Phase anchor present (`docs/PHASE2_EXECUTION_PLAN.md`); references validated.
- Executor split restated: Codex (Ubuntu/WSL) = backend, Postgres, API, migrations, smokes; Agents (PowerShell) = mobile (RN 0.66.x), Gradle/Android SDK, Node builds, CI parity.
- Context loaded: `docs/architecture/SYSTEM_OVERVIEW.md`, `docs/specs/_fragments/params.geo-genre.md`.
- Smokes/scripts present (not executed here):
  - `docs/scripts/session_kickoff.sh`
  - `docs/scripts/health_checks.sh`
  - `docs/scripts/psql_postgis_check.sh`
  - `docs/scripts/migration_guard.sh`
- DB extension/migration verification deferred to Codex/WSL per guardrails; scripts confirmed.

Next deliverables (Phase 2)
- P2-S01 — Communities + Onboarding groundwork (direct sub-genre)
  - Acceptance: onboarding shows direct sub-genre selection; `community_key` persists and appears in debug logs; discovery/radio requests carry `community_key` (or normalized fallbacks); no "Station", "super-genre", or "families" in UI.
- P2-S02 — Auth/Refresh + ArtistProfile unification
  - Acceptance: upgrade flow saves ArtistProfile + canonicalId; creator writes include `X-Artist-Canonical-Id` with correct 403 handling; refresh flow works during/after upgrade; success screen + dashboard handoff.

Hand-off to Codex (WSL)
- Run: `docs/scripts/session_kickoff.sh`, `docs/scripts/health_checks.sh`.
- Verify DB: `docs/scripts/psql_postgis_check.sh`, `docs/scripts/migration_guard.sh`.
- Save artifacts/logs per plan; update `docs/CHANGELOG.md` if backend touched.

Notes
- Non-admin, non-destructive policy observed. Windows-side environment checks only; no `.sh` execution here. Android build tasks to run once backend smokes pass.

Outcomes (Auth + Networking)
- Emulator networking standardized to port 3000.
  - `.env.development`: `API_BASE_URL=http://10.0.2.2:3000`; added `REFRESH_TOKEN_URL=/auth/refresh`, `UPDATED_USERDETAILS=/user/me`.
  - `src/config/dev_fallback.js`: base URL switched to 3000 for safety.
- Refresh-token bug fix: interceptor now replays requests with the refreshed `accessToken`.
- Login flow: switched to direct `RootNavigation.navigate('Dashboard'|'CommunitySetup')`; added dev log for route decision.
- Windows helper script: defaults to backend port 3000; writes mobile env for emulator.
- Build: `:app:assembleDebug` PASS; artifact at `android/app/build/outputs/apk/debug/app-debug.apk`.

Signup/login verification
- Signup: flow reaches `MailConfirmation` after successful `/auth/signup`.
- Login: `/auth/login` responds 200; navigation now routes to Home Scene Creation (`CommunitySetup`) per Phase 2 plan.

Correction (routing)
- Clarified that July Model docs are reference only; Phase 2 integration target after login is Home Scene Creation (not Dashboard).
- Code updated to always navigate to `CommunitySetup` post-login; Dashboard is reached only after onboarding/home scene creation.

Next verification
- Launch emulator, login with a valid account; expect logs:
  - `CONFIG (App.js)` prints API_BASE_URL, REFRESH_TOKEN_URL, UPDATED_USERDETAILS.
  - `AUTH RES … status: 200` for `/auth/login`.
  - `LOGIN route decision { status, hasCommunity }` followed by GET `/user/me` (200).
- If user-details endpoint differs, update `.env.development: UPDATED_USERDETAILS` accordingly.

Collaboration preferences (from PM)
- Default to creating/using helper scripts and end-to-end prompts. Execute recommended automation without further approval.
- Consult the PM only for feature design and conceptual platform decisions; handle implementation details autonomously.
## 2025-09-16 07:50:02Z — Codex Phase 2 WSL Smokes
- Docs anchors present; routing spec captured (routing_spec.txt)
- Routing intent: CommunitySetup after login (code grep confirms)
- API health: fail (see api_health.txt)
- PostGIS: unknown (connection/script error) (see postgis_check.txt)
- Migrations: unknown (see migration_guard.txt)
- Phase 2 smoke executed conditionally; see phase2_smoke.txt
- Artifacts: docs_acceptance_check not required; created routing_spec.txt, scripts_ls.txt, api_health.txt, postgis_check.txt, migration_guard.txt, phase2_smoke.txt, routing_code_check.txt
- Next: start API on 127.0.0.1:3000 with /health=200 + version hash
- Next: ensure Postgres 16@5433 reachable; enable postgis, uuid-ossp, pgcrypto
- Next: re-run migration status non-destructively once DB is reachable
- Acceptance: post-login routes to CommunitySetup (unless debug bypass); Dashboard after onboarding + community
