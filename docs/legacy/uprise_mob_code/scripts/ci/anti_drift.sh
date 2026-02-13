#!/usr/bin/env bash
set -euo pipefail

# Anti-drift checks (warn by default). Set STRICT=1 to fail on findings.

STRICT_MODE=${STRICT:-0}
warn() { echo "[WARN] $*" >&2; }
fail() { echo "[FAIL] $*" >&2; exit 1; }
note() { echo "[anti-drift] $*"; }

EXIT=0

# 1) Artifact guard (bundled JS committed)
if [[ -f android/app/src/main/assets/index.android.bundle ]]; then
  warn "Found android/app/src/main/assets/index.android.bundle in repo. Should not be committed."
  (( STRICT_MODE )) && EXIT=1
fi
if [[ -f androidappsrcmainassetsindex.android.bundle ]]; then
  warn "Found androidappsrcmainassetsindex.android.bundle in repo. Should not be committed."
  (( STRICT_MODE )) && EXIT=1
fi

# 2) Secrets scan (very light regex)
FOUND=0
PATTERNS=(
  'AIza[0-9A-Za-z\-_]{35}'    # Google API key shape
  'sk_live_[0-9a-zA-Z]+'       # Stripe live key
  'AKIA[0-9A-Z]{16}'           # AWS key id
)
for p in "${PATTERNS[@]}"; do
  if grep -RInE "$p" --exclude-dir node_modules --exclude-dir .git . >/dev/null 2>&1; then
    warn "Potential secret match found for pattern: $p"
    FOUND=1
  fi
done
if (( FOUND )); then (( STRICT_MODE )) && EXIT=1; fi

# 3) Env shape check (non-destructive)
if [[ -x docs/scripts/env_shape_check.sh ]]; then
  if ! bash docs/scripts/env_shape_check.sh; then
    warn "env_shape_check.sh reported issues"
    (( STRICT_MODE )) && EXIT=1
  fi
else
  note "env_shape_check.sh not present or not executable; skipping"
fi

if (( EXIT )); then fail "Anti-drift checks failed (STRICT=1)."; fi
note "Anti-drift checks completed (warnings may be present)."

