#!/usr/bin/env bash
set -euo pipefail

# Seed zip_codes from a CSV (idempotent upsert via staging table)
# Env: PG_HOST, PG_PORT, PG_DB, PG_USER

CSV_PATH="${CSV_PATH:-dev-backend/seeds/zips_sample.csv}"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found in PATH" >&2
  exit 1
fi

if [ ! -f "$CSV_PATH" ]; then
  echo "CSV not found: $CSV_PATH" >&2
  exit 1
fi

export PGPASSWORD="${PG_PASSWORD:-}"

psql "host=${PG_HOST:-127.0.0.1} port=${PG_PORT:-5433} dbname=${PG_DB:-uprise_dev} user=${PG_USER:-uprise}" <<'SQL'
-- Ensure tables exist
\i dev-backend/sql/001_create_zip_tables.sql

-- Create staging table
DROP TABLE IF EXISTS public._zip_codes_staging;
CREATE UNLOGGED TABLE public._zip_codes_staging (
  zip         CHAR(5),
  city        TEXT,
  state_abbr  CHAR(2),
  state_name  TEXT,
  county      TEXT,
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  timezone    TEXT,
  metro_area  TEXT
);
SQL

# COPY from CSV into staging
psql "host=${PG_HOST:-127.0.0.1} port=${PG_PORT:-5433} dbname=${PG_DB:-uprise_dev} user=${PG_USER:-uprise}" -c \
  "\copy public._zip_codes_staging(zip,city,state_abbr,state_name,county,latitude,longitude,timezone,metro_area) FROM '${CSV_PATH}' WITH (FORMAT csv, HEADER true)"

# Upsert into main table
psql "host=${PG_HOST:-127.0.0.1} port=${PG_PORT:-5433} dbname=${PG_DB:-uprise_dev} user=${PG_USER:-uprise}" <<'SQL'
INSERT INTO public.zip_codes (zip, city, state_abbr, state_name, county, latitude, longitude, timezone, metro_area)
SELECT zip, city, state_abbr, state_name, county, latitude, longitude, timezone, metro_area
FROM public._zip_codes_staging s
ON CONFLICT (zip) DO UPDATE SET
  city = EXCLUDED.city,
  state_abbr = EXCLUDED.state_abbr,
  state_name = EXCLUDED.state_name,
  county = EXCLUDED.county,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  timezone = EXCLUDED.timezone,
  metro_area = EXCLUDED.metro_area;

DROP TABLE IF EXISTS public._zip_codes_staging;
SQL

echo "zip_codes seed completed from $CSV_PATH"
