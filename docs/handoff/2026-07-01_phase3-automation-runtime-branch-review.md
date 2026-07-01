# Phase3 Automation Runtime Branch Review

Date: 2026-07-01
Branch: `docs/active-pm-phase3-branch-review`
Base: `main` at `c9afdcc` (`docs: review docs audit branches (#155)`)
Mode: docs-only branch hygiene review

## Summary

Reviewed the remaining Phase3 automation/runtime branches from `docs/operations/ACTIVE_PM.md`:

- `phase3-no-automation-rollback`
- `phase3-runtime-followups`
- `backup/phase3-runtime-followups-20260224-150716`
- `phase3-mvp-roadmap-slice88-runtime`
- `review-risk-p3-rev-002`

Result: all five are superseded or duplicate old snapshots. Current `main` already contains the agent-control queue runtime, Telegram bridge, workflows, RegistrarCode/capability-code surfaces, current specs, tests, and runbooks. These branches are unsafe to merge wholesale because their snapshot diffs would delete current `.reliant` queue files, provider/deploy setup, docs, and later work.

No branch deletion or worktree removal was performed. `phase3-no-automation-rollback` remains attached to `/home/baris/UPRISE_NEXT_runtime` and should not be removed without explicit worktree-removal approval.

## Branch Findings

### `phase3-mvp-roadmap-slice88-runtime`

- Tip: `067a16a feat(agent-bridge): add bi-directional telegram command bridge MVP (slice 91)`
- Review result: superseded / unsafe wholesale.
- Reason: current `main` already contains agent-control, Telegram bridge, workflows, RegistrarCode/capability-code docs, and newer queue/runtime docs. Snapshot merge would delete later `.reliant`, provider/deploy, and docs work.
- Action: cleanup candidate after explicit branch-deletion approval; do not merge branch.

### `review-risk-p3-rev-002`

- Tip: `067a16a feat(agent-bridge): add bi-directional telegram command bridge MVP (slice 91)`
- Review result: duplicate of `phase3-mvp-roadmap-slice88-runtime` at the same HEAD.
- Action: cleanup candidate after explicit branch-deletion approval; do not merge branch.

### `phase3-no-automation-rollback`

- Tip: `f370438 feat(agent-control): enforce AGENTS directives and add task brief flow (slice 92)`
- Review result: superseded / unsafe wholesale.
- Reason: current `main` already contains the agent-control queue, directive metadata, Telegram bridge, workflows, and current runbooks/specs. Snapshot merge would delete current later work. Branch is attached to `/home/baris/UPRISE_NEXT_runtime`.
- Action: cleanup candidate after explicit branch and worktree-removal approval; do not merge branch.

### `phase3-runtime-followups`

- Tip: `3af215f feat(agent): add autonomous lane worker runtime and executable queue tasks (slices 93-94)`
- Review result: superseded / unsafe wholesale.
- Reason: current `main` already contains current agent-control/bridge implementation and later docs. Snapshot merge would delete current later work.
- Action: cleanup candidate after explicit branch-deletion approval; do not merge branch.

### `backup/phase3-runtime-followups-20260224-150716`

- Tip: `3af215f feat(agent): add autonomous lane worker runtime and executable queue tasks (slices 93-94)`
- Review result: duplicate backup of `phase3-runtime-followups` at the same HEAD.
- Action: cleanup candidate after explicit branch-deletion approval; do not merge branch.

## Current Evidence Checked

Confirmed present on current `main`:

- `scripts/agent-control.mjs`
- `scripts/agent-control.test.mjs`
- `scripts/agent-bridge-tick.mjs`
- `scripts/agent-bridge-tick.test.mjs`
- `scripts/agent-bridge-telegram.mjs`
- `scripts/agent-bridge-telegram-lib.mjs`
- `scripts/agent-bridge-telegram.test.mjs`
- `.github/workflows/agent-queue-bridge.yml`
- `.github/workflows/agent-telegram-bridge.yml`
- `docs/handoff/agent-control/README.md`
- `docs/handoff/agent-control/AGENT_DIRECTIVES.md`
- `docs/solutions/AUTONOMOUS_AGENT_BRIDGE_RUNBOOK.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `apps/web/src/app/registrar/page.tsx`
- `apps/web/src/lib/registrar/client.ts`
- `apps/web/src/lib/registrar/contractInventory.ts`

## Commands Run

```bash
git status --short --branch
gh pr list --state open --limit 100 --json number,title,headRefName,baseRefName,isDraft,mergeable,updatedAt,url,statusCheckRollup
for b in phase3-no-automation-rollback phase3-runtime-followups backup/phase3-runtime-followups-20260224-150716 phase3-mvp-roadmap-slice88-runtime review-risk-p3-rev-002; do git rev-list --left-right --count main...$b; git log -1 --oneline $b; git cherry -v main $b; done
rg -n "RegistrarCode|CapabilityGrant|agent-control|agent bridge|telegram|AUTONOMOUS_AGENT|registrar/code|capability code|code/verify|code/redeem|Telegram|queue bridge|task brief|AGENT_DIRECTIVES" apps docs scripts .github package.json --glob '!node_modules'
for b in phase3-no-automation-rollback phase3-runtime-followups backup/phase3-runtime-followups-20260224-150716 phase3-mvp-roadmap-slice88-runtime review-risk-p3-rev-002; do git diff --stat main..$b; git diff --name-status main..$b; done
```

## Files Changed In This Slice

- `docs/operations/ACTIVE_PM.md`
- `docs/handoff/2026-07-01_phase3-automation-runtime-branch-review.md`
- `docs/handoff/README.md`
- `docs/CHANGELOG.md`

## Validation

Run before closeout:

```bash
pnpm run docs:lint
git diff --check
```

## Next Signal

Review the remaining UX/prototype branch group:

- `feat/ux-batch17`
- `feat/ux-batch18-prep`
- `feat/ux-batch18-run`
- `feat/ux-batch19-prep`
- `ux-mobile-r1-build`
- `ux-implementation`

Do not delete reviewed cleanup candidates until explicit deletion approval is given.
