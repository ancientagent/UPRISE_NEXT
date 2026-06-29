# Cloud Workflow CI Hygiene

Date: 2026-06-29
Branch: fix/cloud-workflow-secret-scan-telegram-bridge
Agent: Codex

## Summary

Fixed two cloud-only workflow issues found after the activation cutover closeout:

- push-event `Secrets Scan` runs failed because TruffleHog was configured with `base: main` and `head: HEAD`; on pushes to `main`, both resolved to the same commit and TruffleHog exited before scanning;
- scheduled `Agent Telegram Bridge` runs failed when Telegram returned `409 Conflict` because another `getUpdates` poller was already active.

## Root Cause Evidence

- GitHub run `28383989249` failed in job `Scan for Secrets with TruffleHog`.
- The TruffleHog log showed: `BASE and HEAD commits are the same. TruffleHog won't scan anything.`
- Gitleaks, custom secret patterns, and `.env.example` validation passed in the same run.
- GitHub run `28382866050` failed in `Agent Telegram Bridge` with Telegram API `409`: `Conflict: terminated by other getUpdates request`.

## Files Changed

- `.github/workflows/secrets-check.yml`
- `scripts/agent-bridge-telegram-lib.mjs`
- `scripts/agent-bridge-telegram.mjs`
- `scripts/agent-bridge-telegram.test.mjs`
- `docs/CHANGELOG.md`
- `docs/handoff/2026-06-29_cloud-workflow-ci-hygiene.md`

## Behavior

- TruffleHog now uses the PR base SHA for pull requests and `github.event.before` for push events, avoiding same-commit `main` vs `HEAD` comparisons after merges.
- Telegram `409` polling conflicts are classified as an already-active-poller condition and exit cleanly for that scheduled tick.
- Other Telegram API failures remain fatal.

## Validation

Run before PR:

- `pnpm run agent:telegram:test`
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `git diff --check`

No provider state, env vars, secrets, database state, migrations, or deploys were changed.
