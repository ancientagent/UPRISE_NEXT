# MVP UX Batch16 Execution Plan

Status: Ready  
Date: 2026-03-15

## Goal
Complete remaining MVP UX implementation areas with deterministic lane scopes:
- Plot section overhauls
- Discovery surface closure
- Player/Profile final parity
- Automation guardrails
- QA/review closeout

## Queue Files
- `.reliant/queue/mvp-lane-a-ux-plot-batch16.json`
- `.reliant/queue/mvp-lane-b-ux-discovery-batch16.json`
- `.reliant/queue/mvp-lane-c-ux-player-profile-batch16.json`
- `.reliant/queue/mvp-lane-d-ux-automation-batch16.json`
- `.reliant/queue/mvp-lane-e-ux-qarev-batch16.json`

## Runtime Files (recommended)
- `.reliant/runtime/current-task-lane-a-ux-batch16.json`
- `.reliant/runtime/current-task-lane-b-ux-batch16.json`
- `.reliant/runtime/current-task-lane-c-ux-batch16.json`
- `.reliant/runtime/current-task-lane-d-ux-batch16.json`
- `.reliant/runtime/current-task-lane-e-ux-batch16.json`

## Lane Responsibilities

### Lane A — Plot UX
- Feed/Events/Promotions/Statistics tab overhauls
- Social deferred-policy lock
- Plot tab regression closeout

### Lane B — Discovery UX
- Discovery IA + state model
- Scene card/search/switch behavior parity
- Discovery contract/test closeout

### Lane C — Player/Profile UX
- Compact player shell parity
- Tier-title/context behavior
- Collection entry/eject + expanded profile composition locks

### Lane D — Automation Reliability
- UX master-lock preflight checks
- Queue/runtime drift protection
- Runbook + transcript consistency

### Lane E — QA/Docs/Closeout
- Consolidated gate replays
- Risk/rollback memo
- Founder checklist + final closeout report

## Standard Loop (each lane)
1. `claim`
2. execute exact slice prompt
3. run `verifyCommand` exactly
4. update `docs/CHANGELOG.md` + dated `docs/handoff/*`
5. `complete --task-id <claimed-id> --report <handoff>`
6. repeat until `no_queued_tasks`

## Copy/Paste Lane Start Commands

```bash
# Lane A
node scripts/reliant-slice-queue.mjs claim \
  --queue .reliant/queue/mvp-lane-a-ux-plot-batch16.json \
  --runtime .reliant/runtime/current-task-lane-a-ux-batch16.json

# Lane B
node scripts/reliant-slice-queue.mjs claim \
  --queue .reliant/queue/mvp-lane-b-ux-discovery-batch16.json \
  --runtime .reliant/runtime/current-task-lane-b-ux-batch16.json

# Lane C
node scripts/reliant-slice-queue.mjs claim \
  --queue .reliant/queue/mvp-lane-c-ux-player-profile-batch16.json \
  --runtime .reliant/runtime/current-task-lane-c-ux-batch16.json

# Lane D
node scripts/reliant-slice-queue.mjs claim \
  --queue .reliant/queue/mvp-lane-d-ux-automation-batch16.json \
  --runtime .reliant/runtime/current-task-lane-d-ux-batch16.json

# Lane E
node scripts/reliant-slice-queue.mjs claim \
  --queue .reliant/queue/mvp-lane-e-ux-qarev-batch16.json \
  --runtime .reliant/runtime/current-task-lane-e-ux-batch16.json
```

## Safety Locks
- Canon/spec-first only; no inferred behavior.
- No placeholder CTAs.
- Stop and escalate on unresolved founder decisions.
- Preserve route ownership and state semantics from `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`.
