# UPRISE_NEXT Agent Guide

This file is intended for AI coding agents and new contributors. Follow it before making changes.

## Required Reading (in order)
1. `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
2. `docs/RUNBOOK.md`
3. `docs/FEATURE_DRIFT_GUARDRAILS.md`
4. `docs/architecture/UPRISE_OVERVIEW.md`
5. `docs/PROJECT_STRUCTURE.md`
6. `apps/web/WEB_TIER_BOUNDARY.md`
7. `docs/AGENT_STRATEGY_AND_HANDOFF.md`
8. `docs/README.md` (indexes/specs/handoffs)
9. `docs/solutions/README.md` (recurring-issue playbooks)

## Legacy Reference Archives (Non-Canon)
- `docs/legacy/uprise_mob/` — prior mobile-era documentation set (reference only)
- `docs/legacy/uprise_mob_code/` — legacy code + config snapshot (reference only; includes `.env*`)

## Non-Negotiables
- **No feature drift:** implement only what’s covered by `docs/specs/` (or `docs/Specifications/` legacy IDs) unless a spec update is explicitly requested.
- **Web-tier boundary:** `apps/web` must not import DB clients, server-only modules, or secrets; use the API layer and shared packages instead.
- **Infrastructure policy:** DeepAgent is dev/CI only; production targets are external (Vercel/Fly/AWS/Neon/S3/R2).
- **No unsafe environment changes:** no symlinks, no admin elevation, no global installs.
- **Package manager rule:** UPRISE_NEXT = pnpm only. Legacy RN (`uprise_mob`) = yarn only. Do not mix.
- **Canon import rule:** never bulk-overwrite `docs/canon/*.md` from external exports; stage raw imports in `docs/legacy/` and apply intentional canon edits separately.

## Before You Push
- Run `pnpm run typecheck`
- Run `DATABASE_URL=... pnpm run test` (API tests require Postgres+PostGIS)
- Run `pnpm run build`
- Run `pnpm run infra-policy-check`
- Run `pnpm run docs:lint` (includes canon guardrails)
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
