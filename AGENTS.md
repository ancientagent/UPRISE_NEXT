# UPRISE_NEXT Agent Guide

This file is the primary agent entry point for this repo. If another agent-facing doc conflicts with this file, `AGENTS.md` wins.

## Required Reading

### Always Read (Focused Default)
1. `docs/PLATFORM_START_HERE.md`
2. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
3. `docs/agent-briefs/CONTEXT_ROUTER.md`

### Heavy Authority Pack
Use this pack for broad audits, architecture planning, deployment/infra work, multi-agent strategy, repo-structure changes, or when the task explicitly asks for full-platform review.

1. `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
2. `docs/RUNBOOK.md`
3. `docs/FEATURE_DRIFT_GUARDRAILS.md`
4. `docs/architecture/UPRISE_OVERVIEW.md`
5. `docs/PROJECT_STRUCTURE.md`
6. Relevant canon/spec/brief files identified by `docs/agent-briefs/CONTEXT_ROUTER.md`

### Task-Specific Add-Ons
Load only the minimum additional material required for the task.

- Web/UI/routes: `apps/web/WEB_TIER_BOUNDARY.md` + the relevant active specs/founder locks
- Spec/doc work: `docs/README.md` + `docs/specs/README.md` + relevant canon/spec files
- Architecture/repo-shape/deployment work: the Heavy Authority Pack above
- Recurring incidents / operating failures: `docs/solutions/README.md` + only the relevant playbook
- Multi-agent execution / handoff review: `docs/handoff/README.md` + the latest relevant dated handoff(s)

## Legacy Reference Archives (Non-Canon)
- `docs/legacy/uprise_mob/` — prior mobile-era documentation set (reference only)
- `docs/legacy/uprise_mob_code/` — legacy code + config snapshot (reference only; includes `.env*`)

## Non-Negotiables
- **No feature drift:** implement only what’s covered by `docs/specs/` (or `docs/Specifications/` legacy IDs) unless a spec update is explicitly requested.
- **Community identity rule:** communities/Uprises are identified by `city + state + music community`. Do not collapse identity to city-only or genre-only, and when a flow already knows the current community context, inherit the music community from that context instead of asking the user to redefine it.
- **Systems-scale rule:** do not implement one-off behavior for a particular city, music community, artist, or fixture unless it is explicitly marked fixture-only/test-only. Runtime logic must be designed to scale across the full city/community/source matrix and future tier aggregation.
- **No unapproved placeholder CTAs:** do not add UI actions like `Coming Soon`, `Join`, `Upgrade`, etc. unless explicitly authorized by a spec or founder direction in-thread.
- **No platform-trope drift:** do not import default Spotify/Instagram/TikTok/Facebook patterns. Use `docs/solutions/ANTI_PLATFORM_TROPE_DRIFT.md` guardrails for scoped implementation prompts.
- **Web-tier boundary:** `apps/web` must not import DB clients, server-only modules, or secrets; use the API layer and shared packages instead.
- **Infrastructure policy:** DeepAgent is dev/CI only; production targets are external (Vercel/Fly/AWS/Neon/S3/R2).
- **Browser/auth session rule:** after the user completes login/security checks in a browser, do not open a fresh browser/profile for that same provider flow. Reuse the existing controlled tab/session (`tab-list`/`tab-select` or equivalent), use CLI/MCP/API verification, or ask before launching anything that would require another login. Protected previews should use Vercel automation bypass or CLI/MCP status checks instead of repeatedly forcing interactive login. When browser auth is required, use a stable named Playwright session such as `PLAYWRIGHT_CLI_SESSION=uprise-provider-auth`; after login, save storage state to a local-only ignored file such as `.auth/playwright/vercel-state.json`, and load it before future provider browser checks. Never commit browser storage state.
- **No unsafe environment changes:** no symlinks, no admin elevation, no global installs.
- **Package manager rule:** UPRISE_NEXT = pnpm only. Legacy RN (`uprise_mob`) = yarn only. Do not mix.
- **Canon import rule:** never bulk-overwrite `docs/canon/*.md` from external exports; stage raw imports in `docs/legacy/` and apply intentional canon edits separately.
- **Rollback checkpoint rule:** for multi-agent throughput runs, follow `docs/solutions/ROLLBACK_CHECKPOINT_CHEATSHEET.md` and default to non-destructive rollback (`git switch`/`git revert`); use `git reset --hard` only with explicit in-thread approval.

## Working Rules
- Prefer current repo truth over stale handoff memory.
- Do not audit or implement against a mixed uncommitted worktree unless you are the explicit implementation owner.
- QA findings must be tied to a commit/branch state and fixture/setup context.
- Classify issues before acting: `bug`, `stale`, `environment`, `fixture/data`, or `product decision`.
- Use dated handoffs as context, not as higher authority than current code/specs.

## Before You Push
- Preferred: run `pnpm run verify` (docs:lint + infra-policy-check + typecheck)
- Optional (slower / DB required): `DATABASE_URL=... pnpm run verify:full` (verify + test + build)
- Update `docs/CHANGELOG.md` and any touched specs; add a handoff note under `docs/handoff/` for multi-step work.

## PR Metadata (required)
Include in PR description:
- Deployment Target
- Phase
- Specs links (`docs/specs/` and/or `docs/Specifications/`)
- Agent identifier

## Branch Protection (required)
- All changes to `main` must go through PR with required checks + codeowner review.
- Canon changes (`docs/canon/**`) must pass `Canon Guard` and include a `docs/CHANGELOG.md` update.
