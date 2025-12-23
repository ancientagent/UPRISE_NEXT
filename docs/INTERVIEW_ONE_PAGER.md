# UPRISE_NEXT — Interview One‑Pager

**Purpose:** A top‑down overview you can present in ~2–4 minutes without diving into implementation details.  
**Audience:** Technical lead / engineering manager  
**Scope:** Repo strategy + product concept + architecture (source-aligned to docs in this repo)

---

## What It Is (2 sentences)
UPRISE_NEXT is a modernized rebuild of the UPRISE music community platform: a multi-service monorepo designed to support location‑anchored music scenes, community discovery, and creator workflows. It’s built to be developed by multiple contributors (including AI agents) with strict guardrails that prevent architecture violations, feature drift, and secret leaks.

## The Problem (high level)
- Today’s streaming model flattens geography and local scenes, pushing discovery toward opaque, engagement-driven systems.
- Independent creators struggle to build sustainable local-to-global momentum and community ownership.

## Core Thesis (differentiators)
- **Location as structure:** “Scenes” are anchored to place (e.g., City/State + genre), not a global feed.
- **Participation-driven visibility:** exposure is designed to be earned via community mechanisms rather than black‑box virality.
- **Single identity model:** users participate first; creator capabilities are additive rather than siloed.

## Domain Model (conceptual primitives)
- **User:** base identity (auth, profile, participation).
- **Scene / Community:** location + genre container for discovery and engagement.
- **Broadcast surface (“RaDIYo”):** continuous community stream concept.
- **Artist capability overlay:** creator tooling attached to user identity.
- **Tracks / media:** uploaded assets processed by workers and served to clients.

## Architecture (what exists in the repo)
Monorepo structure (see `docs/PROJECT_STRUCTURE.md` and `README.md`):
- `apps/web` — Next.js 15 (web UI; Vercel target)
- `apps/api` — NestJS API (Postgres/PostGIS target; external hosting)
- `apps/socket` — realtime service (Socket.IO)
- `apps/workers/transcoder` — worker for media processing (FFmpeg)
- `packages/*` — shared UI/config/types and contracts
- `infra/prisma` — schema + migrations (PostGIS)

## Governance: How We Keep Multi‑Agent Work Safe
Start here: `AGENTS.md` → `docs/README.md`.
- **Spec‑first / No drift:** `docs/FEATURE_DRIFT_GUARDRAILS.md` (implement only what is specified).
- **Tier boundaries enforced:** `apps/web/WEB_TIER_BOUNDARY.md` (web is untrusted; no DB/secrets).
- **Ops runbook + verification:** `docs/RUNBOOK.md` (how to run, test, deploy, triage).
- **Handoffs for context continuity:** `docs/handoff/README.md` + templates; required for multi-step work.
- **Solutions playbooks:** `docs/solutions/README.md` (if it breaks twice, it gets a playbook).

## Credibility / Guardrails (how regressions & secret leaks are prevented)
- CI workflows: `.github/workflows/ci.yml`, `.github/workflows/secrets-check.yml`, `.github/workflows/infra-policy-check.yml`
- Architecture enforcement: web-tier contract guard (see `docs/specs/system/web-tier-contract-guard.md`)
- CI/CD policy and expectations: `docs/specs/system/ci-cd-pipeline.md`
- Documentation framework rules: `docs/specs/system/documentation-framework.md`

## What Not To Claim (interview safety rails)
- Don’t claim a feature is implemented unless there’s a matching spec + code + verification evidence.
- Don’t claim tests passed unless you can point to CI logs or you ran the commands locally.
- Don’t discuss secret values; reference env var *names* only.

## Quick “Where Do I Click First?”
- `AGENTS.md`
- `docs/README.md`
- `docs/RUNBOOK.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `.github/workflows/ci.yml`

