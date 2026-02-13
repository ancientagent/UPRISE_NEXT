# ADR-0001: Phase 2 Docs & Executors

## Context
- CCPM overhead; docs drifted from code; native modules require Linux.

## Decision
- Consolidate docs into `uprise_mob/docs/`.
- Codex CLI (WSL) as executor; PowerShell agents for orchestration.
- CHANGELOG + Runbooks as the authoritative process.

## Consequences
- Faster iteration, fewer env mismatches, easy future mirroring.
