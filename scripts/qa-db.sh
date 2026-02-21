#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "[qa:db] docker is required but not found in PATH" >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1 && docker-compose version >/dev/null 2>&1; then
  COMPOSE=(docker-compose)
else
  echo "[qa:db] docker compose is required but not available/functional in this environment" >&2
  echo "[qa:db] if using WSL, enable Docker Desktop WSL integration for this distro" >&2
  exit 1
fi

DB_URL_DEFAULT="postgresql://uprise:uprise_dev_password@localhost:5432/uprise_dev"
export DATABASE_URL="${DATABASE_URL:-$DB_URL_DEFAULT}"

echo "[qa:db] Using DATABASE_URL host from: $DATABASE_URL"
echo "[qa:db] Starting postgres service via docker compose"
"${COMPOSE[@]}" up -d postgres

if ! docker inspect -f '{{.State.Health.Status}}' uprise_postgres >/dev/null 2>&1; then
  echo "[qa:db] postgres container uprise_postgres not found after compose up" >&2
  exit 1
fi

echo "[qa:db] Waiting for uprise_postgres health=healthy"
for i in {1..60}; do
  status="$(docker inspect -f '{{.State.Health.Status}}' uprise_postgres 2>/dev/null || true)"
  if [[ "$status" == "healthy" ]]; then
    break
  fi
  if [[ "$status" == "unhealthy" ]]; then
    echo "[qa:db] postgres container became unhealthy" >&2
    docker logs --tail 100 uprise_postgres >&2 || true
    exit 1
  fi
  sleep 2
  if [[ $i -eq 60 ]]; then
    echo "[qa:db] timed out waiting for postgres health" >&2
    docker logs --tail 100 uprise_postgres >&2 || true
    exit 1
  fi
done

echo "[qa:db] Running prisma migrate deploy"
pnpm --filter api exec prisma migrate deploy

echo "[qa:db] Running DB-dependent API tests"
pnpm --filter api test -- communities.test.ts

echo "[qa:db] DB QA suite passed"
