#!/usr/bin/env bash
set -euo pipefail

# Migration guard (expects idempotent migrations)

API_DIR="${API_DIR:-../webapp_api}"

if ! command -v yarn >/dev/null 2>&1; then
  echo "yarn not found in PATH" >&2
  exit 1
fi

echo "== Migration status (before) =="
yarn --cwd "$API_DIR" db:migrate:status || true

echo "\n== Running migrations =="
yarn --cwd "$API_DIR" db:migrate || { echo "Migrations failed" >&2; exit 1; }

echo "\n== Migration status (after) =="
yarn --cwd "$API_DIR" db:migrate:status || true

echo "\nMigration guard completed. Expect no errors; reruns should be idempotent."

