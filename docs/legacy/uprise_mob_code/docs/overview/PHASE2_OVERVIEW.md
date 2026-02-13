# Phase 2 Overview

## Why
- Drop CCPM; reduce process overhead.
- Keep docs colocated with code for tight feedback.
- Use **Codex CLI in WSL** as primary executor; Windows agents for orchestration.

## Principles
- Single source: `uprise_mob/docs/`
- Update CHANGELOG for every meaningful change.
- Runbooks contain only stable steps.
- Runtime happens in **WSL** (Postgres 16 @ 5433, PostGIS, Node/Yarn).
- No global npm installs inside repos (yarn only).

## Tooling Roles
- **Codex CLI (WSL)**: executes edits/commands.
- **Claude/Cursor (PowerShell)**: orchestration, PRs, docs.
- **CI (GitHub Actions)**: APK builds, smoke tests, artifacts.

## Milestones
1. ✅ Postgres 16 + PostGIS enabled; DB on 5433; `.env` aligned.
2. ⬜ Sequelize migrations stable.
3. ⬜ Android build parity (debug/release), CI smoke pass.
4. ⬜ Webapp/API integration.
5. ⬜ Minimal release & documented cutover.

---

## Doc Relocation Map
- docs/guides/runbooks/android.md — canonical Android runbook (replaces former root-level version)
- docs/archives/repository-status/runbook_android.md — legacy status page (reference only)
- docs/Specifications/01_UPRISE_Master_Overview.md → docs/reference/architecture/SYSTEM_OVERVIEW.md (appended)
- docs/Specifications/03_UPRISE_Authentication_System.md → docs/specs/03_AUTHENTICATION.md
- docs/Specifications/04_UPRISE_Community_Location_System.md → docs/specs/04_COMMUNITY_LOCATION.md
- docs/Specifications/05_UPRISE_Fair_Play_Algorithm.md → docs/specs/05_FAIR_PLAY_ALGO.md
- docs/Specifications/06_UPRISE_Song_Management_System.md → docs/specs/06_SONG_MANAGEMENT.md
- docs/Specifications/07_UPRISE_Discovery_Map_System.md → docs/specs/07_DISCOVERY_MAP.md (with Legacy Web notes)
- docs/Specifications/08_UPRISE_Events_System.md → docs/specs/08_EVENTS.md
- docs/Specifications/09_UPRISE_Promotions_Business.md → docs/specs/09_PROMOTIONS_BUSINESS.md
- docs/Specifications/STATION-COMMUNITY-SYSTEM-ANALYSIS.md → Section in architecture/SYSTEM_OVERVIEW.md (Legacy)
- docs/archives/repository-status/# UPRISE Project – CHANGELOG.md → merged into docs/overview/CHANGELOG.md
