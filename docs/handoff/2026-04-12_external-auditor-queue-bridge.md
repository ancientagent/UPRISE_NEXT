# 2026-04-12 — External Auditor Queue Bridge

## Purpose
Wire Claw/Abacus-style external auditing into the repo's existing agent control plane so audit work can happen with less manual relay.

## What changed
- added queue lane:
  - `external-audit`
- added standing prompt:
  - `docs/handoff/agent-control/CLAW_AUDITOR_PROMPT.md`
- added bridge/runbook:
  - `docs/solutions/EXTERNAL_AUDITOR_QUEUE_BRIDGE_R1.md`
- updated agent-control docs/directives to include the new lane and worker profile

## Why
The repo already had:
- queue-based lane control
- claim/complete/block workflow
- scheduler/bridge automation

So the clean move was to extend that control plane rather than create a second ad hoc handoff system.

## Intended use
- Codex remains implementation owner
- external auditor remains read-heavy and report-oriented
- queue tasks provide the contract between the two
