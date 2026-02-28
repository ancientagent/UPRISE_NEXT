# Slice 155A — Orchestrator Prompt Hardening To Prevent Bulk Block Loops

## Scope
- Tooling/docs only.
- Tighten orchestrator workflow guidance to prevent accidental bulk claim/block loops.
- No product API/UI/schema behavior changes.

## Changes
- Updated `.reliant/workflows/uprise-orchestrator.yaml`:
  - Added explicit execution rules that prohibit bulk claim/block loops.
  - Added guardrail text requiring single-task lifecycle (`claim -> execute -> complete|block`) before next claim.
  - Added stale runtime mismatch stop/cleanup requirement.
- Updated `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md`:
  - Added required anti-loop guardrails section.
  - Added deterministic stale runtime cleanup steps.
- Updated `docs/CHANGELOG.md` with slice 155A entry.

## Validation Commands and Results
1. `pnpm run docs:lint` — PASS
2. `pnpm run infra-policy-check` — PASS
3. `pnpm --filter api typecheck` — PASS
4. `pnpm --filter web typecheck` — PASS

## Risk / Rollback
- Risk: low (workflow prompt/runbook text hardening only).
- Rollback: revert edits in `.reliant/workflows/uprise-orchestrator.yaml`, `docs/solutions/RELIANT_ORCHESTRATOR_RUNBOOK.md`, and `docs/CHANGELOG.md`.
