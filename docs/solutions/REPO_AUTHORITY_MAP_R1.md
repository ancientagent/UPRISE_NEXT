# Repo Authority Map R1

Status: Active
Owner: product engineering
Last updated: 2026-04-18

## Purpose
Define where truth lives in `UPRISE_NEXT`, how agents should resolve conflicts, and how external assistants should be treated as separate functional departments without becoming separate sources of truth.

This file is for:
- agents
- external assistants
- design tools
- document assistants
- wiki generators

This file is not a replacement for `AGENTS.md`. If anything here conflicts with `AGENTS.md`, `AGENTS.md` wins.

## Authority Order
Use this order every time:
1. `AGENTS.md`
2. `docs/canon/`
3. active `docs/specs/`
4. active founder locks / execution docs in `docs/solutions/`
5. current branch code/runtime evidence
6. dated `docs/handoff/`
7. chat memory
8. external assistant output

External assistants never outrank the repo.

## What Counts As Authoritative Now
### Core operating rules
- `AGENTS.md`
- `docs/STRATEGY_CRITICAL_INFRA_NOTE.md`
- `docs/RUNBOOK.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `docs/architecture/UPRISE_OVERVIEW.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`

### Current active founder locks / execution locks
These are the highest-value current product/system locks for the present MVP slice:
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md`
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`

### Active specs that still matter
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`
- `docs/specs/system/registrar.md`
- `apps/web/WEB_TIER_BOUNDARY.md` for web route work

### Current external-memory bridge
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`
- `.deepagent-desktop/rules/uprise_next_rules.md`

## Current Runtime Reality
Use current runtime evidence to answer implementation questions, but do not let older runtime behavior silently override newer founder locks.

Current important runtime truths:
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - live artist profile exists
  - current implementation still lags the newer demo-row lock
- `apps/web/src/app/discover/page.tsx`
  - current Discover destination was intentionally deferred for the local-only MVP
- `apps/api/scripts/seed-artist-fixture-roster.mjs`
  - deterministic artist + listener fixture pack exists for QA
- `packages/types/` and `apps/api/src/` remain the public/shared contract source for runtime types and server behavior

## Legacy / Lower-Priority Material
These can be useful, but they are not current authority by default.

### Legacy/non-canon
- `docs/legacy/**`
- `docs/Specifications/**` unless a current doc explicitly points back to a legacy ID

### Historical / mixed-context docs
Use with caution:
- older prompt packs
- older wireframe docs
- older batch plans
- older handoffs that predate current founder locks

Examples of files that may still contain useful detail but must not be treated as current truth alone:
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`
- `docs/solutions/MVP_DESIGN_PLATFORM_PACK_R1.md`
- older `docs/handoff/2026-03-*` route/wireframe passes

## Conflict Resolution Rules
When sources conflict, answers must separate these categories explicitly:
1. current active MVP lock
2. current runtime implementation
3. legacy or later-version carry-forward

Do not flatten them into one blended answer.

### Example
If a design prompt says `Blast` belongs on `RADIYO`, but the latest founder lock changes that split to `Play It Loud` on `RADIYO` and `Blast` in the personal player:
- report the newer founder lock as current doctrine
- report the older prompt as stale
- report the runtime separately if it still reflects the old behavior

## External Assistant Department Model
Treat external models like separate departments with constrained responsibilities.

### Design department
Examples:
- Claude design agent
- Gemini visual/image agents
- Uizard/Figma helpers

They may:
- explore layout
- propose visual systems
- draft interaction compositions
- produce mockups

They may not:
- redefine action grammar
- override founder locks
- infer product behavior from generic app tropes

### Documentation and communications department
Examples:
- Abacus CoWork
- NotebookLM
- long-form writing assistants

They may:
- draft briefs
- draft emails
- summarize decisions
- reconcile legacy docs against current locks

They may not:
- invent product doctrine
- treat stale docs as equal authority

### Code / implementation department
Examples:
- Codex here
- tightly scoped coding agents

They may:
- implement locked behavior
- reconcile runtime to docs
- add tests and contracts

They may not:
- widen scope without explicit founder direction

## Required Operating Habit
Any slice that materially changes:
- doctrine
- action grammar
- active surface behavior
- major runtime shape

must also update:
- `docs/CHANGELOG.md`
- a dated handoff in `docs/handoff/`
- the external-memory bridge or NotebookLM sync note

## Best Read-First Pack For Any External Tool
1. `AGENTS.md`
2. `.deepagent-desktop/rules/uprise_next_rules.md`
3. `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
4. `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
5. `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
6. `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
7. `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
8. `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
9. `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`

## Expected Answer Shape For Agents
Before answering substantive product questions, agents should state:
- what files they used
- what is locked now
- what is runtime-only
- what is legacy/later-version
- where uncertainty remains
