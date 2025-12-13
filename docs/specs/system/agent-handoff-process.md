# Agent Handoff Process

**ID:** `AGENT-HANDOFF`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2025-12-13`

## Overview & Purpose
Agent handoffs prevent context loss when work is transferred between contributors (human ↔ agent, agent ↔ agent). Handoffs capture decisions, constraints, and the “why” behind changes so future work continues safely and efficiently.

## User Roles & Use Cases
- **Agent implementing a task:** records scope, decisions, and follow-ups while working.
- **Next agent/contributor:** picks up work without re-discovering context.
- **Maintainer/reviewer:** verifies scope and decisions match documented specs.

## Functional Requirements
- Every multi-step task creates a handoff document under `docs/handoff/`:
  - `agent-<name>-<task>.md`
- Handoff doc includes:
  - scope and deliverables (in/out),
  - decisions made (with rationale),
  - implementation notes (files, commands, env),
  - challenges/lessons,
  - outstanding questions and next steps,
  - references (PRs/commits/specs).
- Phase-level work produces `docs/handoff/handoff-phase-<n>.md` using the phase template.

## Non-Functional Requirements
- **Clarity:** future readers can answer “what changed and why” quickly.
- **Consistency:** structure matches templates across contributors.
- **Traceability:** includes links to specs and PRs/commits.

## Architectural Boundaries
- Handoffs do not authorize new features; they must reference specs (see `docs/FEATURE_DRIFT_GUARDRAILS.md`).
- Handoffs must respect web-tier boundary rules (no DB/secrets in `apps/web`).

## Acceptance Tests / Test Plan
- Ensure new handoff docs follow `docs/handoff/TEMPLATE_agent-handoff.md`.
- Ensure phase reports follow `docs/handoff/TEMPLATE_handoff-phase.md`.
- Confirm docs are discoverable via `docs/handoff/README.md`.

## Success Metrics
- New agents can resume ongoing work without re-triage.
- Reduced repeated investigation and fewer regressions due to missing context.

## References
- `docs/handoff/TEMPLATE_agent-handoff.md`
- `docs/handoff/TEMPLATE_handoff-phase.md`
- `docs/handoff/handoff-phase-1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`

