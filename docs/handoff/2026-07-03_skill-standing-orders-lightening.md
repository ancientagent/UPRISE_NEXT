# Skill Standing Orders Lightening

Status: completed
Date: 2026-07-03
Branch: docs/lighten-uprise-skill-standing-orders
Owner: Codex local

## Summary

Lightened UPRISE agent/skill routing so local Codex skills are conditional aids rather than mandatory cascades. The intent is to keep agents lightweight by default while preserving hard safety gates for feature work, branch/worktree management, founder clarifications, and provider/db/schema/canon risk.

## Repo Docs Updated

- `docs/specs/system/documentation-framework.md`
  - Added Local Skill Loading Policy.
  - Rule: trigger skills from request/risk/workflow need; do not load broad UPRISE routing skills for every UPRISE turn.
  - Rule: exact-file/exact-spec work should start with the named file, direct references, and current repo evidence before expanding.
  - Rule: behavior-changing feature work uses execution packet + independent Codex plan review; more skill loading is not a substitute.

- `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md`
  - Added Local Codex Skill Loading Rule.
  - Clarifies `uprise-skill-router` is for uncertain tool/lane/external-agent/provider/browser/review/branch routing, not every UPRISE task.
  - Clarifies founder-session/clarification skills are required for material product-truth capture, not routine confirmations.

- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
  - Added Skill Loading Rule under Reading Model.
  - Keeps broad context loading reserved for broad/ambiguous/high-risk work.

- `docs/operations/ACTIVE_PM.md`
  - Refreshed current active slice to this skill standing-orders lightening branch.

- `docs/operations/BRANCH_WORKSPACE_REGISTRY.md`
  - Registered this branch.

- `docs/CHANGELOG.md`
  - Added Unreleased entry for this process/tooling update.

## Repo-Controlled Skill Snapshots Added

Added repo-visible snapshots under `docs/solutions/codex-skills/` so local skill
behavior can be reproduced by future agents:

- `docs/solutions/codex-skills/README.md`
- `docs/solutions/codex-skills/uprise-skill-router/SKILL.md`
- `docs/solutions/codex-skills/uprise-lane-loader/SKILL.md`
- `docs/solutions/codex-skills/uprise-founder-clarification-capture/SKILL.md`
- `docs/solutions/codex-skills/uprise-founder-session-capture/SKILL.md`
- `docs/solutions/codex-skills/uprise-branch-pr-hygiene/SKILL.md`
- `docs/solutions/codex-skills/uprise-hermes-session-routing/SKILL.md`

For broad/noisy routing skills, the snapshots include `agents/openai.yaml` with
`policy.allow_implicit_invocation: false`:

- `uprise-skill-router`
- `uprise-lane-loader`
- `uprise-hermes-session-routing`

The matching runtime local skill files were also refreshed under
`/home/baris/.codex/skills/`:

- `uprise-skill-router/SKILL.md`
  - Description no longer triggers for every `/home/baris/UPRISE_NEXT` task.
  - Added Use Lightly and Skill Loading Rule sections.
  - Clarified Codex subagents are default for reviews/audits; Hermes is fallback/watchdog.

- `uprise-lane-loader/SKILL.md`
  - Description now says non-trivial tasks only.
  - Required Start now chooses the smallest packet instead of always reading the full default docs stack.

- `uprise-founder-clarification-capture/SKILL.md`
  - Clarified use for durable product-truth changes, not every short agreement or already-documented fact.

- `uprise-founder-session-capture/SKILL.md`
  - Clarified use for material wording/long sessions, not routine confirmations.

- `uprise-branch-pr-hygiene/SKILL.md`
  - Added relaxed self-closing PR bookkeeping rule.

- `uprise-skill-router/agents/openai.yaml`
- `uprise-lane-loader/agents/openai.yaml`
- `uprise-hermes-session-routing/agents/openai.yaml`
  - Set `policy.allow_implicit_invocation: false` so these broad/fallback skills
    remain explicitly available without auto-triggering by default.

## Skill Inventory / Subagent Sharing Update

After the larger skill enablement pass, the filesystem contained 238 `SKILL.md`
paths and 176 unique skill names after deduplication by skill name/source
priority. `uprise-lane-loader` now includes a compact Subagent Skill Sharing
section so branch owners can hand subagents a small skill packet instead of the
full catalog.

Rule: give each subagent one lane, named docs/files, and at most 1-3 relevant
skills. Do not forward the whole skill catalog.

## Drift Prevention

This reduces context bloat without weakening process controls:

- simple/narrow work starts from current repo evidence instead of routing through multiple broad skills;
- ambiguous or risky work still gets lane routing, execution packets, and review gates;
- founder clarification capture stays strict when product truth changes;
- branch/worktree safety remains registry-backed.

## Validation

Completed:

```bash
pnpm run docs:lint
pnpm run workspace:audit
git diff --check
python3 /home/baris/.codex/skills/.system/skill-creator/scripts/quick_validate.py <edited-skill-dir>
```

Results:

- `docs:lint` passed.
- `workspace:audit` passed.
- `git diff --check` passed.
- Local skill validation passed for all five edited UPRISE skill directories.
- Repo-controlled skill snapshots were copied from the validated local skill
  files and committed under `docs/solutions/codex-skills/`.

No provider, DB, schema, runtime, or art state was touched.
