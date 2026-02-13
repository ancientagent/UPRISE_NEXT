#!/usr/bin/env bash
set -euo pipefail

# Env shape validator (read-only, no secrets echoed)

ENV_FILE="${ENV_FILE:-../webapp_api/.env}"

required_keys=(
  DB_HOST
  DB_PORT
  DB_NAME
  DB_USERNAME
  DB_PASSWORD
  JWT_ACCESS_TOKEN_SECRET
  JWT_REFRESH_TOKEN_SECRET
)

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

declare -A seen
while IFS= read -r line; do
  # strip comments and whitespace
  line="${line%%#*}"
  [[ -z "${line//[[:space:]]/}" ]] && continue
  key="${line%%=*}"
  key="${key## }"; key="${key%% }"
  [[ -n "$key" ]] && seen["$key"]=1
done < "$ENV_FILE"

missing=()
for k in "${required_keys[@]}"; do
  if [[ -z "${seen[$k]:-}" ]]; then
    missing+=("$k")
  fi
done

if (( ${#missing[@]} > 0 )); then
  echo "Missing required keys in $ENV_FILE:" >&2
  for k in "${missing[@]}"; do echo "- $k" >&2; done
  echo "See DOC: docs/operations/TROUBLESHOOTING.md" >&2
  exit 1
fi

echo "Env shape OK: required keys present (values not shown)."

