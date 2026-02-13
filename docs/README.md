# Documentation Index

This folder contains operational docs, architecture references, specifications, and multi-agent handoff material for the UPRISE_NEXT monorepo.

## Start Here (New Agents)
- [`AGENT_STRATEGY_AND_HANDOFF.md`](./AGENT_STRATEGY_AND_HANDOFF.md) — Critical boundaries + context recovery protocol.
- [`FEATURE_DRIFT_GUARDRAILS.md`](./FEATURE_DRIFT_GUARDRAILS.md) — Spec-first policy (no undocumented features).
- [`architecture/UPRISE_OVERVIEW.md`](./architecture/UPRISE_OVERVIEW.md) — Quick orientation to the repo and tiers.
- [`RUNBOOK.md`](./RUNBOOK.md) — Day-to-day operational guidance and PR requirements.
- [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) — Monorepo map, conventions, and boundaries.
- [`ENVIRONMENTS.md`](./ENVIRONMENTS.md) — Local + CI setup details.
- [`INTERVIEW_WALKTHROUGH_FOR_INTERVIEWER.md`](./INTERVIEW_WALKTHROUGH_FOR_INTERVIEWER.md) — Repo follow-along (5–8 min).

## Writing Specs
- [`specs/README.md`](./specs/README.md) — Module-organized specs + templates.
- [`Specifications/README.md`](./Specifications/README.md) — Legacy spec index / canonical IDs referenced elsewhere.

## Canon Protocol (docs/canon)
- **`docs/canon/` is the authoritative source of truth for product semantics.**
- **All documents in `docs/canon/` are canon** (no `+`/`-` prefixes required).
- If two canon documents conflict, the newest creation date prevails. If conflicts involve the Master Canon Set, **Master Canon Set wins**.
- Any product-defining document outside `docs/canon/` should be archived under `docs/legacy/`.
- Canon sources live as Markdown in `docs/canon/`. PDFs are not required and should not be committed.
 - The prior mobile-era documentation set is archived at `docs/legacy/uprise_mob/` for reference only and must not override canon.

### Master Canon Set (Authoritative)
These documents are the canonical foundation for building the platform:
- `Master Narrative Canon`
- `Master Glossary Canon`
- `Master Identity and Philosohpy Canon`
- `Master Application Surfaces, Capabilities & Lifecycle Canon`
- `Master Revenue Strategy Canonon`
- `How Uprise Works — Canon Audit (working)`
- `Legacy Narrative plus Context`
- `UPRISE_VOICE_MESSAGING_CANONICAL`
- `Operational Getting Started`
- `Expanded Getting Started`
- `45c4d5ba-6438-48e2-bb13-2a929a0dd69c` (Getting Started Guide)
  - **Note:** This guide is a verbatim markdown export from the DeepAgent-authored source.

## Multi-Agent Workflow
- [`blueprints/MULTI_AGENT_DOCUMENTATION_STRATEGY.md`](./blueprints/MULTI_AGENT_DOCUMENTATION_STRATEGY.md) — Documentation + handoff strategy.
- [`handoff/README.md`](./handoff/README.md) — Where agent notes and phase handoffs live.
- [`solutions/README.md`](./solutions/README.md) — Playbooks for recurring issues (symptoms → fix → prevention).

## Architecture Pointers
- [`architecture/README.md`](./architecture/README.md) — Architectural overviews.
- [`../apps/web/WEB_TIER_BOUNDARY.md`](../apps/web/WEB_TIER_BOUNDARY.md) — Web-tier contract rules.
