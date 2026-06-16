# 2026-03-24 — Model routing standing orders

## Summary
Updated the standing-order and agent-directive docs to encode the current role-to-model split used in this repo's multi-agent workflow.

## Standing model split
- Planner / lead integrator: `gpt-5.4` with `high` reasoning
- Coding / implementation lanes: `gpt-5.3-codex` with `high` reasoning
- QA / audit lanes: `gpt-5.4-mini` with `medium` reasoning by default (`high` only for subtle repros)

## Why
Using the same model for every role increased cost and reduced specialization. Recent UX/discovery execution worked better when:
- planning/integration used stronger cross-cutting reasoning,
- coding lanes used a coding-optimized model,
- QA stayed fast and read-only.

## Docs updated
- `docs/solutions/SESSION_STANDING_DIRECTIVES.md`
- `docs/handoff/agent-control/AGENT_DIRECTIVES.md`
- `docs/solutions/AGENT_WORKFLOW_PROTOCOL_R1.md`
- `docs/CHANGELOG.md`

## Notes
- Public OpenAI docs currently describe `gpt-5.4` as the flagship for complex reasoning/coding and `gpt-5-mini` as the lower-latency/cost option.
- This repo's Codex agent pool exposes `gpt-5.3-codex` and `gpt-5.4-mini`, so the standing orders map the public guidance to the actual available agent models.
