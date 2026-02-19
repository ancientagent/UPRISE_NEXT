# 2026-02-23 — Drift Correction: Placeholder Actions

## Why
Founder concern: unapproved features/actions slipped in, especially `Join (Coming Soon)` behavior that implied unsupported community membership workflows.

## Changes
- UI correction:
  - `apps/web/src/app/community/[id]/page.tsx`
  - Replaced `Join (Coming Soon)` with `Visit Scene in Plot` navigation action.
- Governance hardening:
  - `AGENTS.md`: added non-negotiable rule against unapproved placeholder CTAs.
  - `docs/FEATURE_DRIFT_GUARDRAILS.md`: added policy + checklist gate for user-facing actions.
  - `docs/RUNBOOK.md`: added operational rule to block speculative placeholder CTAs.
- Changelog updated.

## Important Context
- Unapproved discovery-map filter work was **parked** and not merged:
  - stashed as `WIP-unapproved-discovery-filters-hold`.

## Validation
- `pnpm --filter web build`
- `pnpm run verify`
