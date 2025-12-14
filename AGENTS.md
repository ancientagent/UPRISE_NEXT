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

## Non-Negotiables
- **No feature drift:** implement only what’s covered by `docs/specs/` (or `docs/Specifications/` legacy IDs) unless a spec update is explicitly requested.
- **Web-tier boundary:** `apps/web` must not import DB clients, server-only modules, or secrets; use the API layer and shared packages instead.
- **Infrastructure policy:** DeepAgent is dev/CI only; production targets are external (Vercel/Fly/AWS/Neon/S3/R2).
- **No unsafe environment changes:** no symlinks, no admin elevation, no global installs.

## Before You Push
- Run `pnpm run typecheck`
- Run `DATABASE_URL=... pnpm run test` (API tests require Postgres+PostGIS)
- Run `pnpm run build`
- Run `pnpm run infra-policy-check`
- Update `docs/CHANGELOG.md` and any touched specs; add a handoff note under `docs/handoff/` for multi-step work.

## PR Metadata (required)
Include in PR description:
- Deployment Target
- Phase
- Specs links (`docs/specs/` and/or `docs/Specifications/`)
- Agent identifier
