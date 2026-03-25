# Handoff

Dated execution notes, QA reports, closeout memos, and carry-forward corrections live here.

## Use This Folder For
- execution summaries tied to a date/commit
- QA reports and closeout notes
- reconciliation / carry-forward notes when multiple agents touched the same topic
- phase or batch summaries

## Do Not Use This Folder For
- canon/product semantics
- long-term feature specifications
- parallel “memory” docs for the same issue when one reconciliation note will do

## How To Read Handoffs Safely
- Treat handoffs as lower authority than current specs and current code.
- Prefer the latest relevant dated handoff over older notes on the same topic.
- If a handoff conflicts with current `HEAD`, call it out as stale instead of carrying it forward.

## Current High-Value Handoffs
- [`2026-03-24_session-context-reconciliation.md`](./2026-03-24_session-context-reconciliation.md) — merged carry-forward correction layer from the recent multi-agent UX/discovery work.
- [`2026-03-24_SLICE-UXQAREV-885A.md`](./2026-03-24_SLICE-UXQAREV-885A.md) — Batch27 closeout QA result.
- Recent Plot/Onboarding/Discover route fixes are under the `2026-03-24_*` and `2026-03-23_*` notes.

## Finding Relevant Notes
Use search instead of reading large historical batches by default.

Examples:
```bash
rg -n "discover|plot|onboarding|registrar" docs/handoff
find docs/handoff -maxdepth 1 -type f | sort | tail -n 40
```

## Templates
- [`TEMPLATE_agent-handoff.md`](./TEMPLATE_agent-handoff.md)
- [`TEMPLATE_handoff-phase.md`](./TEMPLATE_handoff-phase.md)

## Coordination Control Plane
- [`agent-control/README.md`](./agent-control/README.md)
- [`agent-control/AGENT_DIRECTIVES.md`](./agent-control/AGENT_DIRECTIVES.md)

## Historical Material
Older phase notes and large slice batches remain in this folder for traceability, but they are historical context, not default reading.
