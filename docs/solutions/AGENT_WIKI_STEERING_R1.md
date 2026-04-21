# Agent Wiki Steering R1

Status: Active
Owner: product engineering
Last updated: 2026-04-21

## Purpose
Guide a generated repo wiki so it helps agents understand `UPRISE_NEXT` without overweighting stale legacy material, old prompt packs, or mixed-era docs.

This is a steering document for:
- DeepWiki / Devin DeepWiki
- repo-indexing systems
- internal AI wiki generators
- any assistant that builds a derived map of the repo

## Core Rule
The generated wiki is a map, not the law.

The wiki should explain the repo from current authoritative material. It should not become an alternative source of product truth.

## Top Priorities For Wiki Generation
The wiki should prioritize these domains first:

### 1) Repo operating rules
Document clearly:
- authority order
- reading order
- verification expectations
- change-management expectations

Priority files:
- `AGENTS.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/solutions/EXTERNAL_AGENT_HARDENING_R1.md`
- `docs/RUNBOOK.md`
- `docs/FEATURE_DRIFT_GUARDRAILS.md`
- `docs/PROJECT_STRUCTURE.md`

### 2) Monorepo architecture
Document clearly:
- app tiers
- shared packages
- route/server boundary
- where public contracts live

Priority files:
- `docs/architecture/UPRISE_OVERVIEW.md`
- `docs/PROJECT_STRUCTURE.md`
- `apps/web/WEB_TIER_BOUNDARY.md`
- `packages/types/**`
- `apps/api/src/**`
- `apps/web/src/**`

### 3) Current MVP product doctrine
Document clearly:
- current action grammar
- current listening-mode split
- current surface boundaries
- what is explicitly deferred

Priority files:
- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`
- `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/plot-and-scene-plot.md`
- `docs/specs/communities/discovery-scene-switching.md`

### 4) Recent carry-forward context
Document clearly:
- what changed recently
- what remains intentionally pending
- what the current QA/testing setup is

Priority files:
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`
- `docs/handoff/2026-04-16_discover-feed-insert-and-artist-demo-lock.md`
- `docs/handoff/2026-04-16_artist-fixture-roster-seed.md`
- `docs/handoff/2026-04-17_abacus-external-assistant-briefing.md`
- `docs/CHANGELOG.md`

## What The Wiki Must Explicitly Separate
Every strong page in the wiki should distinguish:
1. locked doctrine
2. current runtime reality
3. legacy/later-version context

The wiki should not answer as if those are the same.

## What The Wiki Must Deprioritize
These areas should be indexed for reference, but not treated as primary explanation sources:

### Legacy material
- `docs/legacy/**`
- `docs/Specifications/**` unless explicitly pulled forward by a newer doc

### Older design generation packs
These may contain stale action grammar or older surface assumptions:
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R1.md`
- `docs/solutions/MVP_UIZARD_PROMPT_PACK_R2_STRICT.md`
- `docs/solutions/MVP_DESIGN_PLATFORM_PACK_R1.md`

### Large historical handoff batches
- older `docs/handoff/2026-02-*`
- older `docs/handoff/2026-03-*`
- large batch closeouts that are no longer the active working layer

These can still be cited for historical traceability, but they should not anchor summary pages by default.

## What The Wiki Should Treat As Stale Unless Reconfirmed
- old action grammar that still says `Add` or `Support` as the final public doctrine
- old docs that place `Blast` on surfaces where newer founder locks moved it
- old discover docs that assume live cross-community travel during the current local-only MVP phase

## Recommended Wiki Page Families
If the generator supports explicit page steering, prioritize pages like:
- Repo Overview
- Authority and Operating Rules
- Architecture and Tier Boundaries
- Web Routes and Surface Contracts
- API and Shared Contracts
- Current MVP Action Grammar
- Listening Modes and Surface Separation
- Artist Profile and Source Surfaces
- Deferred/Legacy Domains
- Fixture and QA Setup
- External Assistant Operating Model

## External Department Model For Wiki Consumers
The wiki should help different external assistant departments stay in their lane.

### Design agents
Need:
- current surface contracts
- current action grammar
- what is deferred
- route boundaries

### Writing / briefing agents
Need:
- authority order
- latest founder locks
- recent handoffs
- changelog summaries

### Coding agents
Need:
- architecture
- shared types/contracts
- active specs
- runtime evidence
- verification commands

## Anti-Drift Rules For Generated Summaries
Generated wiki pages should avoid:
- platform-trope assumptions
- generic Spotify/TikTok/Facebook interaction patterns
- presenting legacy docs as current MVP truth
- presenting current runtime lag as if it were the intended product doctrine

## Maintenance Rule
When a slice materially changes doctrine or runtime shape, update the steering inputs too:
- `docs/solutions/REPO_AUTHORITY_MAP_R1.md`
- `.devin/wiki.json` if the page plan must change
- the external-memory bridge docs if the active summary has drifted
