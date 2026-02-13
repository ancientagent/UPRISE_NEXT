# UPRISE Documentation Hub

This directory is the canonical knowledge base for Phase 2 of the UPRISE platform. Everything here (outside of `Agent-HQ/`) is maintained as the current source of truth for engineers, operators, and AI agents.

## Start Here
- [Phase 2 Overview](overview/PHASE2_OVERVIEW.md) — context, scope, and success criteria for the program.
- [Phase 2 Execution Plan](overview/PHASE2_EXECUTION_PLAN.md) — active workstreams, acceptance criteria, and smoke hooks.
- [Platform Source of Truth](overview/PLATFORM_SOURCE_OF_TRUTH.md) — architecture map and dependency health.
- [Changelog](overview/CHANGELOG.md) — running log of changes to docs, code, and processes.
- [Project Overview](overview/PROJECT_OVERVIEW.md) — onboarding brief for new contributors.

## Operational Guides & Templates
- [Daily Carryover Template](templates/PHASE2_CARRYOVER_TEMPLATE.md) — handoff, guardrails, and accountability checklist.
- [Session Kickoff Template](templates/SESSION_KICKOFF_TEMPLATE.md) — standardized prompt/script for spinning up a working session.
- Runbooks (Windows/WSL friendly):
  - [Android Build & CI](guides/runbooks/android.md)
  - [Android CI Smoke Checklist](guides/runbooks/android_ci_smoke.md)
  - [Backend (Postgres/PostGIS & API)](guides/runbooks/backend.md)
  - [Webapp Runbook](guides/runbooks/web.md)
- **Troubleshooting Guides**:
  - [NODE_OPTIONS & ENV Issues](troubleshooting/NODE_OPTIONS_AND_ENV_ISSUES.md) — **Critical fix for DeepAgent/Metro/Jest process explosions and ENV pickup issues**
- Operations references:
  - [CI Workflows](operations/CI_WORKFLOWS.md)
  - [Troubleshooting](operations/TROUBLESHOOTING.md)
  - [Checklists](operations/CHECKLISTS.md)
  - [Configuration Notes](operations/CONFIG_NOTES.md)
- Automation scripts: see [Tools & Scripts Index](reference/TOOLS_INDEX.md) for usage of `docs/automation/scripts/*.sh` helpers.

## Knowledge Base
- [Artist Onboarding Flow](knowledge-base/ARTIST_ONBOARDING_FLOW.md)
- [Onboarding Smoke Tests](knowledge-base/ONBOARDING_SMOKES.md)

## Specifications
The `specs/` directory contains the canonical product and technical specifications:
- Authentication — [03_AUTHENTICATION.md](specs/03_AUTHENTICATION.md)
- Community / Location — [04_COMMUNITY_LOCATION.md](specs/04_COMMUNITY_LOCATION.md)
- Genre System (Alpha) — [GENRE_SYSTEM_ALPHA.md](specs/GENRE_SYSTEM_ALPHA.md)
- Fair Play Algorithm — [05_FAIR_PLAY_ALGO.md](specs/05_FAIR_PLAY_ALGO.md)
- Song Management — [06_SONG_MANAGEMENT.md](specs/06_SONG_MANAGEMENT.md)
- Discovery Map — [07_DISCOVERY_MAP.md](specs/07_DISCOVERY_MAP.md)
- Events — [08_EVENTS.md](specs/08_EVENTS.md)
- Promotions — [09_PROMOTIONS_BUSINESS.md](specs/09_PROMOTIONS_BUSINESS.md)
- Legacy Musical Families (deprecated for Alpha) — [04A_MUSICAL_FAMILIES.md](specs/04A_MUSICAL_FAMILIES.md)

## Reports & Research
- Program status & decision logs: `reports/`
  - [Android CI Stabilization Summary](reports/pr-review-summary.md)
  - [Dependency, upgrade, and migration studies](reports/)
  - Webapp reverse engineering notes: `reports/webapp/`

## Reference Material
- Architecture: [SYSTEM_OVERVIEW](reference/architecture/SYSTEM_OVERVIEW.md) and ADRs under `reference/architecture/DECISIONS/`.
- Environment templates: `reference/environment/` (`.env` samples, Postgres configs, HBA templates).
- Platform utilities: [Tools Index](reference/TOOLS_INDEX.md), [Windows permission guardrails](reference/windows-permission-errors.md), [WSL path guide](reference/wsl-paths.md).

## Automation & Scripts
Helper scripts live in `automation/scripts/` and are documented in the Tools Index. They are safe to run (read-only or idempotent) and support API health checks, Postgres verification, onboarding smokes, and migration hygiene.

## Archives & Historical Context
Archived material is retained for research but should not be treated as live process docs:
- `archives/july-model/` — reports from the July stabilization push.
- `archives/legacy-project-narrative/` — narrative specs and design memos from prior iterations.
- `archives/session-logs/` — past intake and knowledge snapshots.
- `archives/repository-status/` — superseded status reports and runbooks.
- `archives/tmp/` — sanitized environment snapshots.

## Agent HQ
`Agent-HQ/` contains legacy agent orchestration prompts. It is left untouched to preserve historical context; defer to the docs listed above for current operations.

---
Need something that is missing? Update the relevant doc and add an entry here so future contributors stay aligned.
