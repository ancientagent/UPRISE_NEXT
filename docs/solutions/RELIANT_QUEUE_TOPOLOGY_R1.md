# Reliant Queue Topology R1 (Consolidation Plan)

Status: Proposed (R1)
Last Updated: 2026-02-28
Owner: Lane C docs pass

## Scope
This plan consolidates `.reliant/queue` topology for MVP throughput execution and removes queue-role ambiguity without deleting files.

## Evidence Snapshot (2026-02-28)
Inventory source: queue-file scan and status rollup over all `.reliant/queue/*.json`.

Observed facts:
- Total queue files: 47
- Files with queued work: 12
- Files with in-progress work: 0
- Duplicate task IDs across files: 196
- Most lane-specific queue files are fully complete (`queued=0`, `in_progress=0`, `blocked=0`, `done>0`).

Queued files are currently:
- `mvp-lane-e-qa-doc-review.json` (`queued=9`)
- `mvp-slices-batch10-real-mvp-reserve.json` (`queued=30`)
- `mvp-slices-batch11-real-mvp-throughput.json` (`queued=30`)
- `mvp-slices-batch12-real-mvp-throughput.json` (`queued=30`)
- `mvp-slices-batch13-real-mvp-throughput.json` (`queued=30`)
- `mvp-slices-batch3.json` (`queued=8`)
- `mvp-slices-batch4.json` (`queued=8`)
- `mvp-slices-batch5.json` (`queued=8`)
- `mvp-slices-batch6.json` (`queued=8`)
- `mvp-slices-batch7.json` (`queued=8`)
- `mvp-slices-batch9-real-mvp.json` (`queued=30`)
- `mvp-slices.json` (`queued=6`)

## Classification

### 1) Active Execution Queues (operator-run lane queues)
Current state:
- None with queued work in batch11/12/13 lane files.
- One legacy lane queue still has queued work:
  - `mvp-lane-e-qa-doc-review.json` (`queued=9`)

R1 handling:
- Treat `mvp-lane-e-qa-doc-review.json` as **active-pending-decision**, not auto-archive.
- Continue execution only after founder confirms whether these 9 legacy tasks should be executed or retired.

### 2) Historical / Completed Queues
Completed lane queues (all `queued=0`, `in_progress=0`) including:
- `mvp-lane-a-*` (core/admin/next/reserve/batch11/batch12/batch13)
- `mvp-lane-b-*` (contract/admin/next/reserve/batch11/batch12/batch13)
- `mvp-lane-c-*` (code-invite/next/reserve/batch11/batch12/batch13)
- `mvp-lane-d-*` (automation/next/reserve/batch11/batch12/batch13)
- `mvp-lane-e-qarev-*` (next/reserve/batch11/batch12/batch13)

### 3) Duplicate / Legacy Queues
These are queue-role duplicates and drift sources:
- Parent seed files duplicated into lane files:
  - `mvp-slices-batch9-real-mvp.json`
  - `mvp-slices-batch10-real-mvp-reserve.json`
  - `mvp-slices-batch11-real-mvp-throughput.json`
  - `mvp-slices-batch12-real-mvp-throughput.json`
  - `mvp-slices-batch13-real-mvp-throughput.json`
- Earlier legacy seed files:
  - `mvp-slices.json`, `mvp-slices-batch3.json` ... `mvp-slices-batch7.json`
- Legacy lane naming before normalized batch naming:
  - `mvp-lane-*-*.json` forms without batch marker (for example `mvp-lane-c-code-invite.json`, `mvp-lane-d-automation.json`, `mvp-lane-e-qa-doc-review.json`).

## Recommended Active Queue Set (ongoing MVP)
Adopt one canonical topology for each new batch N:
- Parent seed (planning artifact):
  - `mvp-slices-batchNN-real-mvp-throughput.json`
- Lane execution queues (operator runtime source):
  - `mvp-lane-a-api-admin-batchNN.json`
  - `mvp-lane-b-web-contract-batchNN.json`
  - `mvp-lane-c-invite-batchNN.json`
  - `mvp-lane-d-automation-batchNN.json`
  - `mvp-lane-e-qarev-batchNN.json`

Operational rule:
- Execute from lane batch files only.
- Keep parent seed files as seed manifests only (non-execution).

## Archive Candidates (No Deletion in R1)
Mark candidates for archive/move only after founder sign-off:
- Legacy seed files: `mvp-slices.json`, `mvp-slices-batch3.json` ... `mvp-slices-batch7.json`
- Prior parent seed generations after batch closeout:
  - `mvp-slices-batch9-real-mvp.json`
  - `mvp-slices-batch10-real-mvp-reserve.json`
  - `mvp-slices-batch11-real-mvp-throughput.json`
  - `mvp-slices-batch12-real-mvp-throughput.json`
  - `mvp-slices-batch13-real-mvp-throughput.json`
- Legacy non-batch lane files superseded by batch files:
  - `mvp-lane-a-api-core.json`, `mvp-lane-a-api-core-backlog.json`
  - `mvp-lane-b-web-contract.json`, `mvp-lane-b-web-contract-backlog.json`
  - `mvp-lane-c-code-invite.json`, `mvp-lane-c-code-invite-backlog.json`
  - `mvp-lane-d-automation.json`, `mvp-lane-d-automation-backlog.json`
  - `mvp-lane-e-qa-doc-review-backlog.json`
  - `mvp-lane-e-qa-doc-review.json` (pending founder decision because queued work remains)

## Naming Convention (drift prevention)
Use exactly:
- Parent seed: `mvp-slices-batchNN-real-mvp-throughput.json`
- Lane queues: `mvp-lane-<lane>-<domain>-batchNN.json`

Constraints:
- `lane` in `{a,b,c,d,e}` only.
- `domain` fixed by lane map:
  - `a=api-admin`, `b=web-contract`, `c=invite`, `d=automation`, `e=qarev`
- No new `-next`, `-reserve`, or unsuffixed lane queue names for post-R1 batches.

## R1 Non-Destructive Implementation Steps
1. Freeze queue naming to the canonical pattern above for all new seeds.
2. Keep duplicate/legacy files read-only until explicit archive decision.
3. Add a lightweight queue-lint check (future tiny tooling) that fails unknown queue filename patterns.
4. Execute founder decision on legacy `mvp-lane-e-qa-doc-review.json` queued tasks.
5. After decision, move archive candidates to an archive folder in one audited change (no deletions).

## Founder Decision Required (ambiguity escalation)
1. Should the 9 queued tasks in `mvp-lane-e-qa-doc-review.json` be executed now or retired as legacy backlog?
2. Should parent `mvp-slices-batch*` files remain queued manifests, or be normalized to `done` once their derived lane queues complete?
