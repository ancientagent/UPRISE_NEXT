# Codex-First Review Routing Refresh

Date: 2026-07-02
Branch: `docs/codex-first-review-routing-refresh`
Base: `main` @ `ce6c841`
Mode: docs/tooling routing refresh

## Purpose

Formalize the current UPRISE review/audit model so it is repo-visible and skill-visible instead of only chat habit.

## Current Rule

- Codex subagents are the default review/audit lane.
- `gpt-5.3-codex-spark` handles basic/small reviews and audits: docs drift, stale branch checks, changed-file sanity, PM packet checks, low-risk UI/test/docs PRs, and test-output summaries.
- `gpt-5.5` with `reasoning_effort=xhigh` handles heavy/final gates: high-impact merges, branch deletion, schema/provider/database/security/canon/owner-spec changes, broad cleanup audits, closeout gates, and any review whose result can approve/block action.
- Hermes is not the default reviewer/auditor. `uprisewatchdog` is heartbeat/wake-up only, and Hermes reviewer/auditor profiles remain advisory manual fallback unless explicitly assigned.
- Linear tracks execution state only. Durable truth stays in owner specs and current repo docs/code/tests.
- Product ambiguity stops for founder clarification, then the answer is recorded in the correct owner doc, founder-session note, handoff, or backlog.
- In persistent Hermes sessions, `/clear` starts a fresh Hermes session by discarding conversation history. It is not a mid-task context compactor.

## Changed

- Updated `docs/specs/system/documentation-framework.md` reviewer routing to make Codex subagents the default review/audit lane and Hermes fallback/watchdog only.
- Added a concise current model block to `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`.
- Refreshed `docs/operations/ACTIVE_PM.md` and `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` after PR #186 merged.
- Updated the local Codex skill `/home/baris/.codex/skills/uprise-hermes-session-routing/SKILL.md` with the same product-ambiguity and Linear execution-state rule.
- Added this handoff and changelog entry.

## Not Changed

- No runtime code.
- No provider, database, schema, security, canon, or art state.
- No product doctrine beyond tooling/review process.
- No Hermes profile config or model credentials.

## Validation

```bash
pnpm run workspace:audit
pnpm run docs:lint
git diff --check
```

## Next Signal

Merge this docs/tooling refresh if validation passes. Future UPRISE review/audit prompts should route through Codex model tier first and use Hermes only when the PM or user names Hermes-specific value.
