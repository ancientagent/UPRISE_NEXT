# 📜 CHANGELOG.md — UPRISE Monorepo

**Repository:** `music-community-platform`  
**Policy:** Auto-updated via CI from PR titles & labels. Manual edits allowed for summaries.

---

## [Unreleased]
### Added
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
- Web app font updated to Space Grotesk for non-default typography.
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

### Fixed
- Jest tooling installed for `apps/web`, `apps/api`, and `apps/socket` so `pnpm run test` works.
- Web-tier typecheck error in `apps/web/__tests__/web-tier-guard.test.ts`.
- Socket.IO community event tests by wiring real namespace/handler setup.
- PostGIS community creation raw SQL to avoid returning unsupported `geofence` in results.
- Turbo test env forwarding for `DATABASE_URL` so API tests can run under `turbo run test`.

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
