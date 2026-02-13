# Phase 2 Agent Conversions (Actionable Playbooks)

Strategy: Convert high-value Agent-HQ roles into concrete, scriptable playbooks aligned to Phase 2 goals. No `.claude` or CCPM workflows; use these as task guides tied to our docs/specs and repos.

---

## Backend Developer → API Param Unification Implementer
- Goal: Standardize geo/genre params and `community_key` echo across radio/discovery/events/promotions.
- Scope (repo): `../webapp_api` (routes: `radio`, `discovery`, `communities`, `eventmanagement`, `song`, `onboarding`)
- Tasks
  - Accept params: `city,state,genre,lat,lng,radius,community_key` on read endpoints.
  - Compute/validate `community_key`; echo in responses.
  - Add header support for `X-Artist-Canonical-Id` on write endpoints and authorize.
- Acceptance
  - curl calls succeed with unified params; responses include `community_key` and effective filters.
- References: docs/specs/04_COMMUNITY_LOCATION.md, docs/specs/07_DISCOVERY_MAP.md, docs/specs/05_FAIR_PLAY_ALGO.md

## API Designer → Contract Surgeon (OpenAPI-lite)
- Goal: Publish parameter schema snippets for the standardized filters.
- Tasks
  - Create `docs/specs/_fragments/params.geo-genre.md` with param shapes and examples.
  - Add per-route examples for radio/discovery/events/promos.
- Acceptance
  - Fragments referenced by specs 04/05/07/08/09; examples curl-able.

## Postgres Pro → PostGIS Indexer & Verifier
- Goal: Ensure correct spatial columns and indexes; validate ST_DWithin/ST_Contains.
- Tasks
  - Verify geography columns and add GIST indexes.
  - Create a view for `communities` with centroids and keys.
  - Provide sample psql queries in docs for smoke.
- Acceptance
  - psql returns PostGIS version and expected counts from seed data.
- References: docs/specs/04_COMMUNITY_LOCATION.md, docs/PHASE2_EXECUTION_PLAN.md

## Database Optimizer → Genre Taxonomy Enabler
- Goal: Enable hierarchical taxonomy and tag arrays without breaking existing data.
- Tasks
  - Propose migrations: `genres.parent_genre_id`, `songs.genre_tags text[]`.
  - Backfill minimal parent links for top genres.
- Acceptance
  - Discovery/promotions can filter by parent/child and tags.

## Security Auditor → Auth Context Enforcer
- Goal: Enforce canonical performer ownership on writes; reduce leakage of secrets.
- Tasks
  - Identify write routes needing `X-Artist-Canonical-Id`.
  - Add checks mapping user→artist profile and band admin rights.
  - Confirm JWT scopes and drop unused secrets from logs.
- Acceptance
  - Unauthorized canonical-id writes return 403; no secrets in logs.
- References: docs/specs/03_AUTHENTICATION.md

## Test Automator → Phase 2 Smoke Suite
- Goal: Provide repeatable curl/psql test hooks (no destructive ops).
- Tasks
  - Shell snippets for radio/discovery/events/promos with unified params.
  - psql PostGIS version + one ST_DWithin sample.
- Acceptance
  - Runs locally and in CI (optional) with non-zero coverage of key endpoints.
- References: docs/ops/CI_WORKFLOWS.md, docs/PHASE2_EXECUTION_PLAN.md

## Mobile Developer → Profile & Community Hooks
- Goal: Add active profile context and community filters in app requests.
- Tasks
  - Persist `community_key`; set on radio/discovery requests.
  - Include `X-Artist-Canonical-Id` when acting as creator.
- Acceptance
  - Network inspector shows standardized params and headers.
- References: docs/specs/07_DISCOVERY_MAP.md, docs/specs/03_AUTHENTICATION.md

## Build Engineer → CI Smoke (Defer Emulator)
- Goal: Keep CI green with minimal but useful checks.
- Tasks
  - Build APK; run curl-based API checks; optionally skip emulator boot.
  - Upload artifacts + smoke logs.
- Acceptance
  - CI passes with artifacts; emulator optional.
- References: docs/ops/CI_WORKFLOWS.md

## SRE Engineer → Local Env Verifier
- Goal: One-pass local verification for DB/API readiness.
- Tasks
  - psql PostGIS check using `../webapp_api/.env`.
  - ls/rg checks on `../webapp_api/src/database` and routes.
- Acceptance
  - Non-destructive confirmation of DB features and route surface.

## Documentation Engineer → Living Specs Caretaker
- Goal: Keep docs/specs in lockstep during Phase 2.
- Tasks
  - Maintain SYSTEM_OVERVIEW unified model and cross-module contracts.
  - Ensure specs 03–09 reference the parameter fragment and align examples.
- Acceptance
  - Specs serve as single source of truth; diffs concise and atomic.

---

## Conversion Notes
- `.claude` and CCPM are deprecated. Use these playbooks + existing docs/specs.
- All scripts/examples must avoid printing secrets (env shape only).
- No destructive DB ops in smoke tests; migrations require explicit review.

## Quick Links
- Architecture: docs/architecture/SYSTEM_OVERVIEW.md
- Execution Plan: docs/PHASE2_EXECUTION_PLAN.md
- Specs: docs/specs/03_AUTHENTICATION.md … 09_PROMOTIONS_BUSINESS.md
- Ops: docs/ops/CI_WORKFLOWS.md, docs/ops/CHECKLISTS.md
- Agents you can invoke in prompts
  - Agent: Spec-Radar
    - Role: scans docs/specs/* + July Model and flags drift.
    - Output: docs/Session-Logs/SPEC_RADAR_REPORT.md with ✅/⚠️ per spec, and exact files/lines to update.
    - Invoke: `[role: Spec-Radar] Context: $DOCS_DIR, July Model folders. Task: Produce SPEC_RADAR_REPORT.md and list concrete doc or route changes needed.`
  - Agent: API-Auditor
    - Role: runs the curl smokes, verifies contract (params, headers, pagination, community_key echo), and posts diffs if mismatched.
    - Output: docs/Session-Logs/API_AUDIT_<date>.md + suggested patch blocks for routes/handlers.
  - Agent: Smoke-Runner
    - Role: executes docs/scripts/phase2_smoke.sh and psql_postgis_check.sh, summarizes pass/fail with links to logs or commands to reproduce.
