# External Auditor Queue Bridge (R1)

Status: Active  
Owner: product engineering  
Last updated: 2026-04-12

## Purpose
Let an external CLI auditor such as Claw/Abacus participate in the existing UPRISE queue/control-plane workflow without requiring constant manual relay.

## Use Case
Use this bridge when:
- Codex is the implementation owner
- an external auditor has repo access
- the external auditor should perform read-heavy drift scans and reconciliation reports
- the external auditor should not act as product authority

## System Position
The external auditor is:
- a lane worker
- report-oriented
- read-heavy
- lower authority than founder locks, canon, specs, and current branch code

The external auditor is not:
- a product decision-maker
- a canon writer of first resort
- an implementation owner for broad feature slices

## Lane
Queue lane:
- `external-audit`

Allowed write scope:
- `docs/**`

Intended report destination:
- `docs/handoff/agent-control/results/`

## Recommended Flow
1. Codex/orchestrator assigns a narrow audit task into `external-audit`.
2. Claw CLI claims the task.
3. Claw runs the standing prompt from:
   - `docs/handoff/agent-control/CLAW_AUDITOR_PROMPT.md`
4. Claw writes a report artifact to:
   - `docs/handoff/agent-control/results/`
5. Claw completes the task with the report path.
6. Codex/orchestrator reviews the report and decides whether it represents:
   - `bug`
   - `stale`
   - `environment`
   - `fixture/data`
   - `product decision`

## Good Task Shapes
- one recent slice at a time
- one system boundary at a time
- one terminology reconciliation at a time
- one “what drift remains after commit X?” pass at a time

## Bad Task Shapes
- “review the whole repo”
- “decide what MVP should be”
- “invent the next feature”
- “rewrite canon from scratch”

## Example Assign
```bash
pnpm run agent:queue -- assign \
  --id AUDIT-SOURCE-001 \
  --lane external-audit \
  --title "Audit source dashboard and release deck drift after current branch changes" \
  --phase mvp \
  --priority 150 \
  --paths docs/** \
  --planned-report docs/handoff/agent-control/results/2026-04-12_audit-source-dashboard-release-deck.md \
  --rollback-note "Report-only audit lane; no product-code ownership."
```

## Example Claim
```bash
pnpm run agent:queue -- claim \
  --lane external-audit \
  --agent claw-auditor-1 \
  --json
```

## Example Complete
```bash
pnpm run agent:queue -- complete \
  --id AUDIT-SOURCE-001 \
  --agent claw-auditor-1 \
  --report docs/handoff/agent-control/results/2026-04-12_audit-source-dashboard-release-deck.md \
  --notes "Read-only audit completed against current branch truth."
```

## Guardrails
- Prefer report artifacts over branch edits.
- If a proposed fix is obvious, describe it in the report instead of implementing it.
- Treat “missing access to repo/workspace” as a blocker, not a reason to infer.
- Keep the task narrow enough that Codex can act on the result in one pass.
