# ZIP Seeding & Metro Policy

Scope
- Provide a minimal ZIP lookup for dev (Austin metro + a few cities) and a path to full datasets later.

Tables (Postgres 16 @ 5433)
- zip_codes(zip PK, city, state_abbr, state_name, county, latitude, longitude, timezone, metro_area)
- metro_mappings(zip PK, metro_city, metro_state)
- Indexes: (city, state_abbr) and (metro_area)

Migrations
- SQL: `dev-backend/sql/001_create_zip_tables.sql` (idempotent)
- Guardrails: keep migrations idempotent; do not drop data.

Seed (small sample)
- CSV: `dev-backend/seeds/zips_sample.csv` (Austin, Buda, plus a few)
- Import (WSL):
  ```bash
  PG_HOST=127.0.0.1 PG_PORT=5433 PG_DB=uprise_dev PG_USER=uprise \
    bash docs/scripts/seed_zip_codes.sh
  ```

Full import (later)
- Add purchased CSV path via `CSV_PATH=/path/to/full.csv` when available. The script uses COPY + UPSERT and is safe to re-run.

API Wiring
- Dev backend route: `GET /geo/zip-lookup?zip=XXXXX` → `{ city, state_abbr, state_name, county, coords:{lat,lng}, metroArea }`
- Mobile config: `ZIP_LOOKUP_ENDPOINT=/geo/zip-lookup` (fallbacks exist for common dev ZIPs)
- Optional external fallback: `GEOCODIO_KEY` (not required; avoid printing secrets)

Metro Grouping Policy
- Suburbs map to a shared `metroArea` (e.g., Buda → Austin). This drives community scenes.
- Use `metro_area` in `zip_codes` to group ZIPs under a canonical metro.

Verification
- Health + PostGIS: `docs/scripts/psql_postgis_check.sh`
- Seed: see `docs/scripts/seed_zip_codes.sh` output
- Endpoint checks:
  - `curl 'http://127.0.0.1:3000/geo/zip-lookup?zip=78610'`
  - `curl 'http://127.0.0.1:3000/onboarding/validate-community?city=Buda&state=Texas&sub_genre=thrash-punk'`
- Phase 2 smoke: `API_BASE_URL=http://127.0.0.1:3000 ./docs/scripts/phase2_smoke.sh`

Acceptance
- `/geo/zip-lookup` returns data for known ZIPs in <100ms.
- `/onboarding/validate-community` responses drive Active vs Early modal in mobile.
- Logs saved under `artifacts/logs` using stable names.
