# Multi‑Agent Documentation Strategy for UPRISE_NEXT

This blueprint defines a scalable documentation and hand‑off strategy for coordinating multiple agents on the UPRISE_NEXT monorepo. The goal is to keep context clear and up to date while maintaining traceability, consistency, and smooth onboarding.

## 1. Purpose

UPRISE comprises a diverse set of services (Next.js web, API, worker, transcoder, Prisma migrations, PostGIS), each with separate responsibilities. Agents will build, extend, and maintain these services in parallel. Without a disciplined documentation system, knowledge can fragment, causing duplicated work and regressions. This strategy ensures that:

- Responsibility and scope for each agent are clearly defined.
- Feature specifications remain consistent across the web and API layers.
- Architectural boundaries are enforced (e.g., server‑client separation, PostGIS usage rules).
- New agents can come up to speed quickly by reading the right docs.

## 2. Directory Structure & Naming

Canonical documentation lives under `docs/`:

```
docs/
  blueprints/        – High-level design patterns and workflows
  specs/             – Feature specifications grouped by module/feature
    communities/     – Community + geo specs
    users/           – Auth, onboarding, roles, profiles
    system/          – Cross-cutting specs (logging, analytics, CI/CD, etc.)
  handoff/           – Agent notes + compiled phase handoff reports
  architecture/      – Architectural overviews (structure, boundaries, interactions)

  # Legacy (kept for compatibility until fully migrated):
  Specifications/    – Existing spec index and canonical IDs referenced elsewhere
```

Each directory contains a `README.md` explaining its purpose and listing contained files.

## 3. Specification Template

Each feature spec should follow a consistent template so agents can quickly understand context, requirements, and constraints.

- Use `docs/specs/TEMPLATE.md` as the starting point.
- Include (at minimum): purpose, use cases, requirements, boundaries, data model/migrations, API design, web/client behavior, and a test plan.

## 4. Agent Responsibilities & Hand‑Off

### 4.1 Agent Documents

Each agent working on a feature/task should create an agent document summarizing:

- Scope and deliverables (what was in/out).
- Decisions made (and rationale).
- Challenges & lessons (what was hard and how it was solved).
- Outstanding questions & recommendations.

Agent documents live in `docs/handoff/` with the naming convention:
- `agent-<name>-<task>.md`

Use `docs/handoff/TEMPLATE_agent-handoff.md` to start.

### 4.2 Handoff Reports

Upon completion of a feature or phase, generate a handoff report that compiles agent documents and summarizes:

- Completed tasks and status (implemented / partially implemented / blocked).
- Links to PRs/commits.
- Known issues and technical debt.
- Next steps for future agents.

Handoff reports live in `docs/handoff/`:
- `handoff-phase-<n>.md`

Use `docs/handoff/TEMPLATE_handoff-phase.md` to start.

## 5. Change Management

- **Version control:** All specs and docs are versioned in Git.
- **PR discipline:** Update relevant specs when code changes affect contracts, data models, or architecture.
- **Review:** Major spec changes should be reviewed by at least one other maintainer/senior agent.
- **Deprecation:** If a spec is superseded, mark the old file as `deprecated` and link to the replacement.

## 6. Onboarding New Agents

New agents should start with:

1. `docs/architecture/UPRISE_OVERVIEW.md`
2. `docs/RUNBOOK.md`
3. `docs/PROJECT_STRUCTURE.md`
4. `docs/ENVIRONMENTS.md`
5. Latest phase handoff in `docs/handoff/` (when available)

Then read specs relevant to the task (under `docs/specs/` and/or `docs/Specifications/` while legacy IDs are still in use).

## 7. Future Enhancements

- Automated doc generation: compile agent docs into handoff reports; enforce templates via CI.
- Link specs to tracked work: GitHub Issues + PRs for better traceability.
- Add diagrams: Mermaid or PlantUML for service boundaries, data flows, and PostGIS workflows.
