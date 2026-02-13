#!/usr/bin/env bash
set -euo pipefail

# PostGIS verification (non-destructive)
# Reads DB settings from ../webapp_api/.env if available.

ENV_FILE="${ENV_FILE:-../webapp_api/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

# Parse .env safely (no shell expansion; supports BOM/CRLF)
declare -A _env
while IFS= read -r line || [[ -n "$line" ]]; do
  # strip BOM on first line
  line="${line#$'\xEF\xBB\xBF'}"
  # remove comments
  line="${line%%#*}"
  # trim whitespace
  line="${line##[[:space:]]}"
  line="${line%%[[:space:]]}"
  [[ -z "$line" ]] && continue
  # split key=value
  key="${line%%=*}"
  val="${line#*=}"
  # trim again
  key="${key##[[:space:]]}"; key="${key%%[[:space:]]}"
  val="${val##[[:space:]]}"; val="${val%%[[:space:]]}"
  # drop surrounding quotes
  val="${val%$'\r'}"
  if [[ ${val:0:1} == '"' && ${val: -1} == '"' ]]; then
    val="${val:1:${#val}-2}"
  elif [[ ${val:0:1} == "'" && ${val: -1} == "'" ]]; then
    val="${val:1:${#val}-2}"
  fi
  _env["$key"]="$val"
done < "$ENV_FILE"

DB_HOST="${_env[DB_HOST]:-}"
DB_PORT="${_env[DB_PORT]:-}"
DB_NAME="${_env[DB_NAME]:-}"
DB_USERNAME="${_env[DB_USERNAME]:-}"
DB_PASSWORD="${_env[DB_PASSWORD]:-}"

if [[ -z "$DB_HOST" || -z "$DB_PORT" || -z "$DB_NAME" || -z "$DB_USERNAME" || -z "$DB_PASSWORD" ]]; then
  echo "Missing one or more DB_* keys in $ENV_FILE" >&2
  exit 1
fi

export PGPASSWORD="$DB_PASSWORD"

echo "Checking PostGIS version on $DB_HOST:$DB_PORT/$DB_NAME (user: $DB_USERNAME)"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" -c "SELECT PostGIS_Full_Version();"

echo "\nOptional: sample geospatial check (skipped if table/columns missing)"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_NAME" \
  -c "\
DO $$\
BEGIN\
  IF EXISTS (\
    SELECT 1 FROM information_schema.columns\
    WHERE table_name='songs' AND column_name IN ('latitude','longitude')\
  ) THEN\
    RAISE NOTICE 'Songs within ~40km of Austin: %', (\
      SELECT COUNT(*) FROM songs\
      WHERE ST_DWithin(\
        ST_SetSRID(ST_MakePoint(longitude, latitude),4326)::geography,\
        ST_SetSRID(ST_MakePoint(-97.7431, 30.2672),4326)::geography,\
        40000\
      )\
    );\
  ELSE\
    RAISE NOTICE 'songs(latitude,longitude) not present; skipping distance check';\
  END IF;\
END$$;\
"

echo "\nDone. Non-destructive checks completed."
