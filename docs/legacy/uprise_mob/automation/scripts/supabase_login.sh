#!/usr/bin/env bash
set -euo pipefail

if ! command -v supabase >/dev/null 2>&1; then
  echo 'supabase CLI not found. Install it first (see docs/reference/TOOLS_INDEX.md).' >&2
  exit 1
fi

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo 'SUPABASE_ACCESS_TOKEN is not set. Export your Supabase personal access token before running.' >&2
  exit 1
fi

# Login is idempotent; the CLI caches the token under ~/.config/supabase/
SUPABASE_LOGIN_OPTS=(login --token "${SUPABASE_ACCESS_TOKEN}")

if [[ -n "${SUPABASE_HOST:-}" ]]; then
  SUPABASE_LOGIN_OPTS+=(--host "${SUPABASE_HOST}")
fi

supabase "${SUPABASE_LOGIN_OPTS[@]}"

echo 'Supabase CLI login complete.'
