#!/usr/bin/env bash
set -euo pipefail

ROOT="/mnt/d/uprise_mob"
LOGDIR="$ROOT/artifacts/logs"
mkdir -p "$LOGDIR"

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:3000}"

{
  echo "GET $API_BASE_URL/geo/zip-lookup?zip=78610";
  curl -iS "$API_BASE_URL/geo/zip-lookup?zip=78610"; echo;
  echo "GET $API_BASE_URL/geo/zip-lookup?zip=99999";
  curl -iS "$API_BASE_URL/geo/zip-lookup?zip=99999" || true; echo;
} | tee "$LOGDIR/endpoint_geo_zip_lookup.log"

{
  echo "Active path (Austin hip-hop)";
  curl -iS "$API_BASE_URL/onboarding/validate-community?city=Austin&state=Texas&sub_genre=hip-hop"; echo;
  echo "Inactive path (Buda thrash-punk)";
  curl -iS "$API_BASE_URL/onboarding/validate-community?city=Buda&state=Texas&sub_genre=thrash-punk"; echo;
} | tee "$LOGDIR/endpoint_validate_community.log"

echo "Saved logs in $LOGDIR"
