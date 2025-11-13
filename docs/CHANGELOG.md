# 📜 CHANGELOG.md — UPRISE Monorepo

**Repository:** `music-community-platform`  
**Policy:** Auto-updated via CI from PR titles & labels. Manual edits allowed for summaries.

---

## [Unreleased]
- (add new entries here)

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

