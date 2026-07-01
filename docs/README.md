# Documentation Index

This folder contains operational docs, architecture references, specifications, and multi-agent handoff material for the UPRISE_NEXT monorepo.

## Start Here
- `AGENTS.md` (repo root) — primary agent entry point and non-negotiables.
- [`PLATFORM_START_HERE.md`](./PLATFORM_START_HERE.md) — five-minute platform orientation, current truths, common wrong assumptions, and lane-loading entry point.
- [`AGENT_STRATEGY_AND_HANDOFF.md`](./AGENT_STRATEGY_AND_HANDOFF.md) — authority order, task-specific reading model, and handoff/QA protocol.
- [`agent-briefs/CONTEXT_ROUTER.md`](./agent-briefs/CONTEXT_ROUTER.md) — focus-lane router for loading only the brief/spec/runtime files required by the active task.
- [`specs/system/documentation-framework.md`](./specs/system/documentation-framework.md) — contract ownership, lane-agent model, Linear execution structure, reviewer routing, and handoff promotion rules.
- [`operations/ACTIVE_PM.md`](./operations/ACTIVE_PM.md) — lightweight current-work snapshot for active branch/PR/blocker/worktree state. This is execution state, not product doctrine.

## Context Modes
- Focused implementation: read `AGENTS.md`, `PLATFORM_START_HERE.md`, `AGENT_STRATEGY_AND_HANDOFF.md`, `agent-briefs/CONTEXT_ROUTER.md`, the active lane brief, and exact touched files/specs/tests.
- Heavy authority review: for broad audits, architecture, deployment, multi-agent strategy, or full-platform planning, use the heavier authority pack named in `AGENTS.md` plus routed canon/spec/brief files.

Do not bulk-load legacy docs or dated handoffs as current truth. Load them by topic when needed.

## Operational References
- [`FEATURE_DRIFT_GUARDRAILS.md`](./FEATURE_DRIFT_GUARDRAILS.md) — spec-first policy.
- [`RUNBOOK.md`](./RUNBOOK.md) — operational rules, verification, PR metadata, and branch protection.
- [`architecture/UPRISE_OVERVIEW.md`](./architecture/UPRISE_OVERVIEW.md) — quick repo and tier orientation.
- [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — monorepo map and conventions.

## Read Only What You Need Next
- Spec work: [`specs/README.md`](./specs/README.md)
- Legacy spec IDs / older references: [`Specifications/README.md`](./Specifications/README.md)
- Section-specific agent context: [`agent-briefs/README.md`](./agent-briefs/README.md)
- Recurring issue playbooks: [`solutions/README.md`](./solutions/README.md)
- Dated execution notes and carry-forward context: [`handoff/README.md`](./handoff/README.md)
- Current execution-state snapshot: [`operations/ACTIVE_PM.md`](./operations/ACTIVE_PM.md)
- Active recovery snapshot + salvage protocol: `docs/state/`
- Web boundary rules: [`../apps/web/WEB_TIER_BOUNDARY.md`](../apps/web/WEB_TIER_BOUNDARY.md)

## Canon Protocol (`docs/canon`)
- `docs/canon/` is the authoritative source of truth for product semantics.
- All documents in `docs/canon/` are canon.
- If canon documents conflict, the Master Canon Set wins; otherwise prefer the newer relevant canon source.
- Do not bulk-overwrite canon from imports. Stage raw imports under `docs/legacy/` and apply intentional canon edits separately.
- Canon changes must pass `pnpm run docs:lint` and update `docs/CHANGELOG.md`.

## Multi-Agent Workflow
- Use current specs/code/runtime before dated handoffs.
- For section work such as UI, load the matching `docs/agent-briefs/` packet first; use linked docs selectively instead of making agents read every related file.
- Put durable cross-system rules in one owner spec or owner section; keep briefs and handoffs as pointers/context.
- Audit only committed branch state, not mixed worktrees.
- Prefer a single reconciliation note over parallel memory docs.
- Use [`solutions/AGENT_WORKFLOW_PROTOCOL_R1.md`](./solutions/AGENT_WORKFLOW_PROTOCOL_R1.md) for the current recommended operating protocol.
