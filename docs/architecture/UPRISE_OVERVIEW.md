# UPRISE_NEXT Overview

UPRISE_NEXT is a Turborepo monorepo for the UPRISE music community platform. It is designed as a multi-service system with strict tier boundaries.

## What Lives Where

### Applications (`apps/`)
- `apps/web` — Next.js 15 web app (client + server rendering, but **no direct DB access**).
- `apps/api` — NestJS REST API (data tier; owns database access and mutations).
- `apps/socket` — Socket.IO realtime server (authenticated subscriptions/events).
- `apps/workers/transcoder` — media processing worker (FFmpeg pipelines).

### Shared Packages (`packages/`)
- `packages/ui` — shared UI components.
- `packages/config` — shared configuration.
- `packages/types` — shared TypeScript types/contracts.

## Critical Boundaries (Read Before Coding)
- **Web-tier contract:** `apps/web` must not import database clients, server-only modules, or secrets. Use the API and shared packages instead. See `apps/web/WEB_TIER_BOUNDARY.md`.
- **Single source of truth:** shared contracts belong in `packages/types` and should be updated alongside API changes.
- **PostGIS:** geospatial behavior must be documented and covered by tests where practical.

## How to Get Context Fast
- Operational rules: `docs/RUNBOOK.md`
- Repo map + conventions: `docs/PROJECT_STRUCTURE.md`
- Environment setup: `docs/ENVIRONMENTS.md`
- Multi-agent docs + handoffs: `docs/blueprints/MULTI_AGENT_DOCUMENTATION_STRATEGY.md` and `docs/handoff/`
- Specs: `docs/specs/` (module-based) and `docs/Specifications/` (legacy index)
