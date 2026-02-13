# Anti‑Drift Strategy (Mobile)

## Purpose
Prevent configuration, artifact, and spec/code drift while keeping developer velocity.

## CI Gatekeepers (warn → enforce)
- Secrets scan (regex-based): warn on likely keys in diffs.
- Artifact guard: warn if `android/app/src/main/assets/index.android.bundle` or `androidappsrcmainassetsindex.android.bundle` exists in the tree.
- Env shape check: run `docs/scripts/env_shape_check.sh` against `.env.example` and fail missing keys in enforce mode.
- Docs touch guard (planned): once implemented it will alert when `src/navigators/*` or `src/services/onboarding/*` change without a companion docs update (CHANGELOG/spec). Not enforced by `scripts/ci/anti_drift.sh` yet.

## Local Hooks (optional)
- Pre-commit: lint + unit tests on staged files.

## Rollout
- Start in warning mode (no PR failures) for 1–2 weeks, then set `STRICT=1` to enforce.

## Commands
- CI script: `scripts/ci/anti_drift.sh` (runs on Linux/macOS runners)
