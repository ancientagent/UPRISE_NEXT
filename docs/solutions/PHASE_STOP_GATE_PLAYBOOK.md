# Phase Stop Gate Playbook

Purpose: prevent throughput systems from continuing to seed implementation batches after a phase has already converged and should move to acceptance or closeout.

Status: required process control for phase-based execution plans.

## Problem This Solves

Queue-driven execution is good at continuing work.

It is not good at deciding when work should stop.

Without an explicit stop gate, a team can keep generating more batches simply because:
- the queue machinery exists,
- the verification chain is green,
- and there is still some possible slice surface left to inspect.

That creates false progress, wasted review time, and phase churn after implementation has already converged.

## Core Rule

Every phase execution plan must define all three:
1. entry criteria,
2. exit criteria,
3. stop-batching criteria.

If stop-batching criteria are met, do not seed another general implementation batch until an explicit closeout decision is recorded.

## Required Stop Gate

Before preparing any new phase batch, check:
- Are recent batches converging cleanly?
- Are there no unresolved critical blockers in the active phase paths?
- Are current verify gates green?
- Is the remaining work now acceptance-oriented rather than implementation-oriented?

If the answer is yes, batching pauses and the phase moves into acceptance review.

## Convergence Rule

Treat a phase as converged when there are at least 2-3 consecutive clean batches with:
- `blocked=0`
- full report coverage
- green verify chain
- no meaningful product-surface expansion, or only regression/doc/QA closeout work

Once this threshold is reached:
- stop preparing open-ended implementation batches,
- generate a readiness report,
- and schedule founder/operator acceptance review.

## Acceptance Mode Rule

After convergence, only these are allowed:
- founder walkthrough / acceptance review
- readiness report
- explicit closeout memo
- small delta batch tied to accepted walkthrough findings
- final acceptance replay batch

These are not allowed after convergence unless a closeout decision re-opens the phase:
- speculative new throughput batches
- broad exploratory cleanup batches
- new implementation queues without accepted delta scope

## Explicit Decision Requirement

After convergence, one of these decisions must be written down:

1. `Phase accepted; proceed to next phase`
2. `Phase accepted with listed follow-up deltas`
3. `Phase not accepted; approved delta batch required`

No additional generic batch prep should occur until one of those outcomes exists in repo docs.

## Time-Cost Guard

If a phase is consuming repeated batch cycles but recent slices are mostly:
- no-op verifications,
- regression lock extensions,
- doc sync,
- or replays of already-green surfaces,

stop and reassess before seeding more work.

This is a process warning that throughput has overtaken phase control.

## Required Artifacts At Stop Gate

When convergence is reached, create:
- a readiness report
- a dated handoff note
- a changelog entry

Recommended names:
- `docs/solutions/<PHASE>_CLOSEOUT_READINESS.md`
- `docs/solutions/<PHASE>_CLOSEOUT_DECISION.md`

## Minimal Checklist Before Seeding Another Batch

Do not create the next batch until all questions are answered:
- What unresolved product behavior is this batch expected to change?
- Is that behavior already covered by current accepted specs?
- Is the phase still implementation-open, or only acceptance-open?
- Would a founder walkthrough be higher-value than another batch?
- Is the next batch a real delta batch, or just throughput inertia?

If those answers are weak or circular, do not seed the batch.

## Application To UX / UI Phases

For UX-heavy phases, the usual stop point is:
- layout and interaction contracts are stable,
- recent queues are green,
- blockers are resolved or archived,
- and remaining uncertainty is founder acceptance rather than implementation mechanics.

At that point the next move is walkthrough + closeout, not more generalized lane throughput.
