# Documentation Framework

**ID:** `DOCS-FRAMEWORK`  
**Status:** `active`  
**Owner:** `platform`  
**Last Updated:** `2025-12-13`

## Overview & Purpose
UPRISE_NEXT is built and maintained by multiple contributors (often multiple coding agents) operating in parallel. This documentation framework standardizes how we:
- describe architecture and boundaries,
- write specs and templates,
- capture decisions during implementation,
- hand off work across agents without context loss.

## User Roles & Use Cases
- **New agents/contributors:** onboard quickly via a predictable doc entrypoint.
- **Active implementers:** keep specs and handoffs current during work.
- **Maintainers/reviewers:** review changes against explicit specs and documented decisions.

## Functional Requirements
- Provide a single docs entrypoint: `docs/README.md`.
- Maintain a stable directory structure:
  - `docs/blueprints/` (workflows/patterns),
  - `docs/specs/` (module-organized specs + templates),
  - `docs/handoff/` (agent docs + phase reports),
  - `docs/architecture/` (overviews and boundaries).
- Keep the legacy canonical index intact while migration is ongoing: `docs/Specifications/`.
- Ensure every docs folder has a `README.md` describing purpose and listing files.

## Non-Functional Requirements
- **Onboarding:** new agents can find “what to read next” in < 5 minutes.
- **Traceability:** every substantial change links to a spec and/or handoff note.
- **Low friction:** templates are copy/paste friendly and short enough to maintain.

## Architectural Boundaries
- Docs must not contradict the web-tier contract (`apps/web/WEB_TIER_BOUNDARY.md`).
- Spec changes that affect shared contracts should be mirrored in `packages/types`.
- Keep legacy spec IDs stable until migration completes.

## Data Models & Migrations
- None.

## API Design
- None.

## Web UI / Client Behavior
- None.

## Acceptance Tests / Test Plan
- Link hygiene: key docs reachable from `docs/README.md`.
- Template availability: `docs/specs/TEMPLATE.md`, `docs/handoff/TEMPLATE_*.md`.
- Manual review checklist for PRs:
  - Spec links included (new: `docs/specs/`; legacy: `docs/Specifications/` as needed).
  - Agent handoff doc created/updated for multi-step work.

## Future Work & Open Questions
- Add a lightweight CI job to validate doc links and required files exist.
- Decide when legacy `docs/Specifications/` is fully migrated and can be frozen.

## References
- `docs/README.md`
- `docs/blueprints/MULTI_AGENT_DOCUMENTATION_STRATEGY.md`
- `docs/specs/README.md`
- `docs/handoff/README.md`
- `docs/architecture/UPRISE_OVERVIEW.md`

