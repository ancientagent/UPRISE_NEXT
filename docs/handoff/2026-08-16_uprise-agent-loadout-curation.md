# UPRISE Agent Loadout Curation

Date: 2026-08-16

## Scope

This handoff records local Hermes profile curation and the repo routing policy
that now points to it. No product doctrine, runtime code, schema, provider,
database, browser, art, or deployment state changed.

## Active Profiles

| Profile | Model | Role |
| --- | --- | --- |
| `uprise` | HY3 via OpenRouter | bounded planning and execution packets |
| `uprisereviewerminus` | HY3 via OpenRouter | bounded plan and completed-slice review |
| `upriseauditorminus` | HY3 via OpenRouter | read-only evidence, drift, and branch audit |
| `uprisewatchdog` | HY3 via OpenRouter | heartbeat only |
| `uprisedeepscout` | DeepSeek V4 Flash via OpenRouter | optional bounded dependency map |
| `uprisedeepcoder` | DeepSeek V4 Pro via OpenRouter | optional benchmarked sole coding slice |

The exact active skills and toolsets are owned by `docs/AGENT_TOOLING.md`.
All profiles use fresh context by default, disable persistent memory and broad
toolsets, and exclude destructive Codebase Memory MCP actions. The former broad
skill trees are preserved locally at
`/home/baris/.hermes/docs/profile-snapshots/2026-08-09-pre-loadout-curation/`.

## Routing Rules

- HY3 is the default UPRISE non-coding automation model: planning, evidence
  gathering, bounded review, audit, and watchdog work.
- Codex or a separately assigned coding model remains the one implementation
  writer in the shared local checkout.
- A reviewer cannot automatically approve a merge, product truth, provider or
  database change, destructive cleanup, or closeout.
- DeepSeek is optional and must stay bounded; use it as a regular coding lane
  only after a benchmarked slice has passed independent review.
- Claude Opus is a strict, one-off large-scope critique task mode, not a
  persistent profile or default reviewer.

## Validation Required

- Verify each profile's resolved tool list contains only its documented narrow
  set and does not expose `bfl`, browser, delegation, memory, or media tools.
- Verify each active profile's enabled skill list matches `docs/AGENT_TOOLING.md`.
- Run fresh HY3 smoke calls for planner, reviewer, auditor, and watchdog.
- Run `pnpm run docs:lint`, `pnpm run workspace:audit`, and `git diff --check`.

## Validation Results

- Resolved tool lists confirm the six profiles expose only their documented
  file/terminal/skills/clarify sets, plus `todo` only for planner/coder. Broad
  browser, delegation, memory, media, and `bfl` toolsets are disabled.
- Enabled skill lists match `docs/AGENT_TOOLING.md`.
- Fresh parallel HY3 smokes returned `UPRISE_PLANNER_READY`,
  `UPRISE_AUDITOR_READY`, `UPRISE_REVIEWER_READY`, and
  `UPRISE_WATCHDOG_READY`.
- The previous planner-local OpenRouter credential returned HTTP 401. It was
  archived under the dated local profile snapshot and replaced by the existing
  shared OpenRouter credential in each curated profile's local ignored `.env`.
  No credential value was printed or committed.

## Next Signal

After this operations update is validated, resume the city-tier RADIYO worker
goal with a fresh planner packet. Do not use this handoff as RADIYO product or
runtime authority.
