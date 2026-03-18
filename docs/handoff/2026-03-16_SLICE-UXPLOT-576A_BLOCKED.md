# SLICE-UXPLOT-576A BLOCKED

Date: 2026-03-16
Lane: A (`lane-a-ux-plot-batch17`)
Task: Plot tab rail parity lock (MVP-only tabs)
Status: blocked

## Exact Block Reason
This slice requires removing Social exposure from the collapsed `/plot` tab rail, but the required source-of-truth stack still conflicts under the documented precedence order.

Conflicting directives:
- `docs/specs/communities/plot-and-scene-plot.md`
  - lists Plot tab surfaces including `Social (V2)`
  - also states `Social remains placeholder until endpoint ships.`
- `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`
  - locks collapsed Plot primary tabs to `Feed`, `Events`, `Promos/Promotions`, `Statistics`
  - says `Social: Deferred for MVP unless explicitly unlocked by spec update.`
- `docs/solutions/MVP_UX_BATCH17_EXECUTION_PLAN.md`
  - queue task prompt explicitly says `MVP-only tabs` and `no Social exposure`

Because `docs/specs/*` outranks `docs/solutions/*` per `docs/solutions/MVP_UX_MASTER_LOCK_R1.md`, removing Social exposure without a spec update would be speculative.

## No Code Changes / No Verify
- No code changes were made for this slice.
- No verify command was run for this slice.
