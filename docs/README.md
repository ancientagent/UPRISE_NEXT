# Documentation Index

This folder contains operational docs, architecture references, specifications, and multi-agent handoff material for the UPRISE_NEXT monorepo.

## Start Here
- `AGENTS.md` (repo root) — primary agent entry point and non-negotiables.
- [`AGENT_STRATEGY_AND_HANDOFF.md`](./AGENT_STRATEGY_AND_HANDOFF.md) — authority order, task-specific reading model, and handoff/QA protocol.
- [`FEATURE_DRIFT_GUARDRAILS.md`](./FEATURE_DRIFT_GUARDRAILS.md) — spec-first policy.
- [`RUNBOOK.md`](./RUNBOOK.md) — operational rules, verification, PR metadata, and branch protection.
- [`architecture/UPRISE_OVERVIEW.md`](./architecture/UPRISE_OVERVIEW.md) — quick repo and tier orientation.
- [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — monorepo map and conventions.

## Read Only What You Need Next
- Spec work: [`specs/README.md`](./specs/README.md)
- Legacy spec IDs / older references: [`Specifications/README.md`](./Specifications/README.md)
- Recurring issue playbooks: [`solutions/README.md`](./solutions/README.md)
- Dated execution notes and carry-forward context: [`handoff/README.md`](./handoff/README.md)
- Web boundary rules: [`../apps/web/WEB_TIER_BOUNDARY.md`](../apps/web/WEB_TIER_BOUNDARY.md)

## Canon Protocol (`docs/canon`)
- `docs/canon/` is the authoritative source of truth for product semantics.
- All documents in `docs/canon/` are canon.
- If canon documents conflict, the Master Canon Set wins; otherwise prefer the newer relevant canon source.
- Do not bulk-overwrite canon from imports. Stage raw imports under `docs/legacy/` and apply intentional canon edits separately.
- Canon changes must pass `pnpm run docs:lint` and update `docs/CHANGELOG.md`.

## Multi-Agent Workflow
- Use current specs/code/runtime before dated handoffs.
- Audit only committed branch state, not mixed worktrees.
- Prefer a single reconciliation note over parallel memory docs.
- Use [`solutions/AGENT_WORKFLOW_PROTOCOL_R1.md`](./solutions/AGENT_WORKFLOW_PROTOCOL_R1.md) for the current recommended operating protocol.
