---
name: uprise-hermes-session-routing
description: Use when UPRISE HY3 Hermes planning/review/audit/watchdog routing, DeepSeek task-mode routing, profile/session hygiene, or legacy Hermes cleanup is involved.
---

# UPRISE Hermes Automation Routing

## Current Rule

Use fresh HY3 Hermes profiles as the default UPRISE non-coding automation lane.

- Planning and execution packets: `uprise`.
- Bounded requirement-to-result or plan review: `uprisereviewerminus`.
- Read-only drift, branch, or evidence audit: `upriseauditorminus`.
- Heartbeat only: `uprisewatchdog`.

Codex or another explicitly assigned coding model remains the sole implementation
writer. DeepSeek profiles are optional bounded task modes, not automatic review
or merge authority. No agent automatically approves a merge, product rule,
destructive cleanup, or provider/database/schema action. Reviewer output informs
the required human/codeowner gate.

Linear tracks execution state only. Durable product/canon/API/runtime truth stays
in owner specs and current repo docs/code/tests. Product ambiguity stops for
founder clarification, then the answer is recorded in the appropriate owner
spec, founder-session note, handoff, or backlog item.

## Profile Boundaries

Read `docs/AGENT_TOOLING.md` before assigning a Hermes profile. It owns the
current skills/toolsets. All curated profiles use fresh context, no persistent
memory, no browser/provider/database tools, and a non-mutating Codebase Memory
MCP subset. Do not add broad skills or tools by habit.

`uprisewatchdog` is only a heartbeat. `uprisedeepscout` and
`uprisedeepcoder` are optional DeepSeek task modes and require a bounded packet
plus independent review. Claude Opus is a strict one-off large-scope critique
task mode, not a persistent UPRISE profile.

## Prompt Requirements

For a non-coding Hermes planner/reviewer/auditor prompt, include:

- repo path `/home/baris/UPRISE_NEXT`;
- branch and expected short HEAD;
- issue/PR/commit under review when applicable;
- lane and owner spec if known;
- changed files or artifacts;
- exact profile and its narrow task role;
- requirement to verify `pwd`, git top-level, branch, short HEAD, and dirty state;
- read-only/no-provider/no-db/no-secret boundary unless explicitly approved;
- output requirements: findings first, severity, exact file references,
  validation evidence, and next signal.

## Fresh-Session Requirements

Before each new Hermes review, audit, branch check, QA plan, or owner-spec/doc
drift pass:

1. Prefer a fresh one-shot worker.
2. In a persistent Hermes chat, `/clear` starts a new session by discarding
   conversation history; it is not a mid-task context compactor.
3. Keep context only when the same profile is intentionally continuing one
   sequential investigation and the prompt says so.
4. Start the prompt with repo path, issue/PR/branch/commit, expected branch and
   short HEAD, lane and owner spec, changed files/artifacts, exact profile, and
   a requirement to verify repo state.
5. Stop if verified branch/worktree/head differs from the prompt.

## Calling Profiles

Use the curated profile directly with a bounded prompt. In unattended local
automation, pass `--yolo` only after the profile/toolset has been verified and
the prompt is explicitly read-only or has an approved sole-writer scope.

```bash
uprise -z "Bounded planning prompt"
uprisereviewer- --yolo -z "Read-only bounded review prompt"
upriseauditor- --yolo -z "Read-only bounded audit prompt"
uprisewatchdog -z "Heartbeat prompt"
```

If a one-shot wrapper returns no final text after tool use, retrieve the terminal
output and session result from the profile's local Hermes session store before
classifying the review as failed. Do not treat an empty wrapper output as PASS.

## Subagents

Use bounded subagents only when independent read-only lanes save context or wall
time. Each subagent gets one lane, named docs/files, no edits, no secrets, no
provider mutation, no branch deletion, and a concise output cap. Preserve
disagreements in synthesis instead of averaging them away.

## Stop Conditions

Stop instead of approving when:

- branch/head/dirty state does not match the prompt;
- a reviewer is treated as the final approving gate;
- provider/env/database/schema mutation would be required;
- Linear, handoff, NotebookLM, Abacus, Hermes, or chat memory conflicts with
  current repo authority;
- current repo docs contradict the prompt and no owner-spec decision is provided.

## Repo References

When repo authority is needed, start with:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/AGENT_TOOLING.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
