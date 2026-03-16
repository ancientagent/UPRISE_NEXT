# SLICE-UXPLOT-550A BLOCKED

Date: 2026-03-16
Lane: A (`lane-a-ux-plot-batch16`)
Task: Plot Social deferred-policy lock pass
Status: blocked

## Exact Block Reason
Current source-of-truth documents conflict on the required MVP treatment for Plot Social exposure, so implementing this slice would require speculation.

Conflicting directives:
- `docs/specs/communities/plot-and-scene-plot.md`
  - says Social is `V2`
  - also says `Social remains placeholder until endpoint ships.`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
  - locks collapsed Plot primary tabs to `Feed`, `Events`, `Promos/Promotions`, `Statistics`
  - says `Social: Deferred for MVP unless explicitly unlocked by spec update.`
- `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md`
  - says collapsed tab rail is locked to the four tabs above
  - requires Social treatment to match the `deferred policy lock`
- `docs/solutions/MVP_FLOW_MAP_R1.md`
  - explicitly states: `Exact MVP cutoff for Social tab exposure in Plot (hidden vs visible placeholder vs deferred route treatment) requires founder confirmation to avoid semantics drift.`

Because this slice prompt requires implementing `hidden/placeholder per current spec decision`, but the current docs do not resolve which decision is authoritative, execution is blocked.

## Queue Block Output
```json
{"blocked":true,"resultCode":"blocked","taskId":"SLICE-UXPLOT-550A","reason":"Conflict: docs/specs/communities/plot-and-scene-plot.md says Social remains placeholder until endpoint ships, while docs/solutions/MVP_UX_MASTER_LOCK_R1.md and docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md lock the collapsed Plot rail to Feed/Events/Promotions/Statistics only; docs/solutions/MVP_FLOW_MAP_R1.md explicitly says hidden vs placeholder Social exposure requires founder confirmation.","updatedAt":"2026-03-16T17:29:02.510Z"}
```

## No Code Changes / No Verify
- No code changes were made for this slice.
- No verify command was run for this slice.

## Required Unblock
Founder/spec lock needed for one of these exact treatments:
1. Social tab hidden from collapsed Plot rail in MVP.
2. Social tab visible as a non-interactive deferred placeholder panel in MVP.
3. Some other explicit deferred route treatment, documented canon-first.
