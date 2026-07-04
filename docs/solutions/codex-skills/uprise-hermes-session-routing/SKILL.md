---
name: uprise-hermes-session-routing
description: Use when UPRISE review/audit routing, Hermes fallback use, uprisewatchdog heartbeat checks, deprecated uprisereviewer/upriseauditor calls, Codex gpt-5.3-codex-spark basic reviews, Codex gpt-5.5 xhigh heavy/final gates, or legacy Hermes session cleanup is involved.
---

# UPRISE Review/Audit Routing

## Current Rule

Do not use Hermes as the default UPRISE review/audit runner.

Use Codex subagents by default:

- Basic/small review or audit: `gpt-5.3-codex-spark`.
- Heavy/final review or audit: `gpt-5.5` with `reasoning_effort=xhigh`.

Basic agents gather, classify, and recommend. Heavy/final agents can approve/block only when explicitly assigned a final gate.

Linear tracks execution state only. Durable product/canon/API/runtime truth stays in owner specs and current repo docs/code/tests. Product ambiguity stops for founder clarification, then the answer is recorded in the appropriate owner spec, founder-session note, handoff, or backlog item.

## Hermes Role

Normal Hermes route:

- `uprisewatchdog`: heartbeat/wake-up checks only, using `hermes-cli` minimal tooling. It verifies repo/git/branch/PM artifact state and reports stalls or missing outputs. It is not a review/audit gate.

Manual fallback only:

- `uprisereviewer+`, `uprisereviewer-`, `upriseauditor+`, `upriseauditor-`.

Use those profiles only if the user or PM explicitly requests Hermes, prior Hermes profile memory/feedback learning is the point of the run, historical Hermes output must be compared, or Codex agent routing is unavailable and the fallback is approved.

Hermes reviewer/auditor output is advisory unless a future repo protocol explicitly reactivates Hermes gates. Current UPRISE safety, merge, branch deletion, provider/db/schema, owner-spec promotion, and closeout gates route to Codex.

## Codex Prompt Requirements

For a Codex review/audit agent, include:

- repo path `/home/baris/UPRISE_NEXT`,
- branch and expected short HEAD,
- issue/PR/commit under review,
- lane and owner spec if known,
- changed files or artifacts,
- exact model routing: `gpt-5.3-codex-spark` for basic/small or `gpt-5.5` with `reasoning_effort=xhigh` for heavy/final,
- requirement to verify `pwd`, git top-level, branch, short HEAD, and dirty state,
- read-only/no-provider/no-db/no-secret boundary unless explicitly approved,
- output requirements: findings first, severity, exact file references, validation evidence, and next signal.

## Hermes Fallback Requirements

Before each new Hermes fallback review, audit, branch check, QA plan, or owner-spec/doc-drift pass:

1. Prefer a fresh one-shot worker.
2. In a persistent Hermes chat, `/clear` clears the screen and starts a new session by discarding conversation history. It is not a mid-task context compactor.
3. Keep context only when the same Hermes profile is intentionally continuing one larger sequential investigation and the prompt says so.
4. Start the prompt with repo path, issue/PR/branch/commit, expected branch and short HEAD, lane and owner spec, changed files/artifacts, exact Hermes profile, and a requirement to verify repo state.
5. Stop if verified branch/worktree/head differs from the prompt.

## Calling Profiles

Watchdog normal route:

```bash
just hermes-watchdog path/to/prompt.md
```

Deprecated/manual fallback only:

```bash
uprisereviewer+ -z "Read-only prompt"
uprisereviewer- -z "Read-only prompt"
upriseauditor+ -z "Read-only prompt"
upriseauditor- -z "Read-only prompt"
```

Repo `just` review/audit recipes intentionally fail closed and print the manual fallback command. They should not silently run Hermes review/audit gates.

## Subagents

Use Codex subagents for independent review/audit lanes when this saves context or wall time. Each subagent gets one lane, named docs/files, no edits, no secrets, no provider mutation, no branch deletion, and a concise output cap.

If Hermes is explicitly requested and subagents are available there, Hermes may use bounded read-only subagents under the same constraints. Preserve disagreements in synthesis instead of averaging them away.

## Stop Conditions

Stop instead of approving when:

- branch/head/dirty state does not match the prompt,
- a basic/small Codex model is asked to issue a final gate,
- a Hermes reviewer/auditor profile is treated as the final approving gate,
- provider/env/database/schema mutation would be required,
- Linear, handoff, NotebookLM, Abacus, Hermes, or chat memory conflicts with current repo authority,
- current repo docs contradict the prompt and no owner-spec decision is provided.

## Repo References

When repo authority is needed, start with:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
