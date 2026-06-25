# NotebookLM Source Inventory

Status: legacy/source inventory
Last Updated: 2026-06-24

## Purpose

This directory records the NotebookLM source names that were used for an older UPRISE source-of-truth notebook and maps them back to local `UPRISE_NEXT` repo files where possible.

This inventory is not active product authority. Use it to find historical/source context, then verify claims against current repo authority: `AGENTS.md`, `docs/PLATFORM_START_HERE.md`, active specs, agent briefs, current runtime code/tests, and only then dated handoffs or legacy files.

## Inventory

| NotebookLM source name | Local repo path / note | Domain / type | Status | Notes |
| --- | --- | --- | --- | --- |
| `00_READ_FIRST_NOTEBOOKLM_PACK.md` | `(Created specifically for this NotebookLM upload set)` | Orientation | `missing-local` | NotebookLM-only generated source; locate from Drive/export if still needed. |
| `00_SOURCE_INDEX.md` | `(Index generated during your snapshot export)` | Source Index | `missing-local` | NotebookLM-only generated source; locate from Drive/export if still needed. |
| `02_EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md` | `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md` | Agent Brief | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `03_REPO_AUTHORITY_MAP_R1.md` | `docs/solutions/REPO_AUTHORITY_MAP_R1.md` | System Authority Map | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `2026-02-16_onboarding_resolution_and_ops.md` | `docs/handoff/2026-02-16_onboarding_resolution_and_ops.md` | Handoff / Changelog | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `2026-04-16_artist-fixture-roster-seed.md` | `docs/handoff/2026-04-16_artist-fixture-roster-seed.md` | Handoff / Changelog | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `2026-04-16_discover-feed-insert-and-artist-demo-lock.md` | `docs/handoff/2026-04-16_discover-feed-insert-and-artist-demo-lock.md` | Handoff / Changelog | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md` | `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md` | Handoff / Changelog | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `Expanded Getting Started.md` | `docs/canon/Expanded Getting Started.md` | Documentation | `local-present` | Source exists under `docs/canon/`; use local repo path for verification and treat current active routing docs as higher operational guidance. |
| `How Uprise Works — Canon Audit (working).md` | `docs/canon/How Uprise Works — Canon Audit (working).md` | Working Audit | `local-present` | Source exists under `docs/canon/`; verify against active specs/briefs before promoting claims. |
| `MVP_ACTION_SYSTEM_MATRIX_R1.md` | `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md` | Founder Lock | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md` | `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md` | Founder Lock | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `MVP_DISCOVER_CONTRACT_CHECKLIST_R1.md` | `docs/solutions/SURFACE_CONTRACT_DISCOVER_R1.md` | Implementation Check | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md` | `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md` | Founder Lock | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `MVP_STATS_FOUNDER_LOCK_R1.md` | `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md` | Founder Lock | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `Master Application Surfaces, Capabilities & Lifecycle Canon.md` | `docs/canon/Master Application Surfaces, Capabilities & Lifecycle Canon.md` | Core Canon | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `Master Glossary Canon.md` | `docs/canon/Master Glossary Canon.md` | Core Canon | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `Master Identity and Philosohpy Canon.md` | `docs/canon/Master Identity and Philosohpy Canon.md` | Core Canon | `local-present` | Filename uses the existing repo spelling `Philosohpy`; use exact local path. |
| `Master Narrative Canon.md` | `docs/canon/Master Narrative Canon.md` | Core Canon | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `Master Revenue Strategy Canonon.md` | `docs/canon/Master Revenue Strategy Canonon.md` | Core Canon | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `Operational Getting Started.md` | `docs/canon/Operational Getting Started.md` | Onboarding Guide | `local-present` | Source exists under `docs/canon/`; use local repo path for verification and treat current active routing docs as higher operational guidance. |
| `README.md` | `README.md` | Root Repo README | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `UPRISE Analytics & Instrumentation Framework.md` | `docs/specs/engagement/analytics-and-instrumentation-framework.md` | Spec Sheet | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `UPRISE_VOICE_MESSAGING_CANONICAL.md` | `docs/canon/UPRISE_VOICE_MESSAGING_CANONICAL.md` | Core Canon | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `discovery-scene-switching.md` | `docs/specs/communities/discovery-scene-switching.md` | Spec Sheet | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |
| `plot-and-scene-plot.md` | `docs/specs/communities/plot-and-scene-plot.md` | Spec Sheet | `local-present` | Use local repo path for verification; do not treat NotebookLM alias as newer authority. |

## Status Values

- `local-present`: mapped local repo file exists. Verify current truth from repo authority, not NotebookLM text.
- `missing-local`: source appears generated specifically for NotebookLM export or not mapped to a repo file yet.
- `needs-search`: mapped path did not exist exactly; search local repo before treating it as unavailable.

## Use Rules

- Do not bulk-promote NotebookLM claims into active specs.
- Do not copy legacy/canon text into current docs without a targeted founder-approved edit.
- Use this index to classify claims as current, superseded, deferred, missing implementation, or founder-decision needed.
- Prefer local repo paths over Google Drive/NotebookLM exports when the mapped file exists locally.
- Use Google Drive only for `missing-local` generated source files or source lists not present in the repo.
