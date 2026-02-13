#!/usr/bin/env bash
set -euo pipefail

# Usage: community_key.sh "Austin" "Texas" "Hip Hop"

city="${1:-}"
state="${2:-}"
genre="${3:-}"

if [[ -z "$city" || -z "$state" || -z "$genre" ]]; then
  echo "Usage: $0 <city> <state> <genre>" >&2
  exit 1
fi

norm(){
  printf "%s" "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9 ]//g; s/[[:space:]]+/-/g; s/-+/-/g'
}

echo "$(norm "$city")-$(norm "$state")-$(norm "$genre")"

