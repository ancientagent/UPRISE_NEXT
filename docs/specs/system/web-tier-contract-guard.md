# Web‑Tier Contract Guard

**ID:** `T5`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2025-12-13`

## Overview & Purpose
UPRISE enforces a strict boundary between the **web tier** (`apps/web`) and the **data/server tiers** (`apps/api`, database, cloud SDKs). The Web‑Tier Contract Guard provides fast, explicit enforcement to prevent:
- accidental DB access or Prisma imports in the web tier,
- server‑only module usage in browser code,
- secret leakage into client bundles,
- direct coupling between `apps/web` and backend source trees.

## User Roles & Use Cases
- **All contributors/agents:** get immediate feedback when violating tier boundaries.
- **Reviewers/maintainers:** rely on CI to block merges that violate boundaries.
- **CI/CD:** fail builds early with actionable error codes and file/line context.

## Functional Requirements
- Scan `apps/web` source for prohibited patterns (DB imports, server-only modules, secrets).
- Skip non-signal paths (`node_modules`, `.next`, `.git`, etc.) and known guard/test fixtures.
- Emit deterministic, actionable errors with file/line/snippet and stable error codes.
- Exit non‑zero on errors to block CI merges.
- Provide `--help` and `--verbose` modes.

## Non-Functional Requirements
- **Speed:** scan should complete in milliseconds–seconds for typical PR diffs.
- **Determinism:** same inputs → same outputs (no flaky heuristics).
- **Clarity:** violation messages must explain the correct pattern (API client, shared packages).

## Architectural Boundaries
- Applies to `apps/web/**`.
- Enforces rules documented in `apps/web/WEB_TIER_BOUNDARY.md`.
- Does not replace (but complements) ESLint/type-level protections.

## Data Models & Migrations
- None.

## API Design
- None (guard is a dev/CI tool).

## Web UI / Client Behavior
- None (guard runs outside the runtime web bundle).

## Acceptance Tests / Test Plan
- Local policy scan: `pnpm run infra-policy-check`
- Web typecheck: `pnpm --filter web typecheck`
- Web tests: `pnpm --filter web test`
- CI: ensure `.github/workflows/infra-policy-check.yml` passes on PRs.

## Success Metrics
- Zero boundary violations merged into `main`.
- Violations are caught pre-merge (CI) and ideally pre-push (local runs).
- New contributors can identify and fix a violation without additional guidance.

## References
- `scripts/infra-policy-check.ts`
- `apps/web/WEB_TIER_BOUNDARY.md`
- `docs/RUNBOOK.md`
- `docs/PROJECT_STRUCTURE.md`
- `.github/workflows/infra-policy-check.yml`
- `.github/workflows/ci.yml`

