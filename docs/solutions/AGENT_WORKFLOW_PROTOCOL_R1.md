# Agent Workflow Protocol R1

Use this protocol for current multi-agent coding/QA work in UPRISE_NEXT.

## Goals
- Reduce stale-context drift.
- Prevent mixed-worktree QA confusion.
- Keep implementation and verification aligned to current repo truth.

## 1. Authority Order
1. `AGENTS.md`
2. `docs/canon/`
3. active `docs/specs/`
4. founder locks / active execution docs in `docs/solutions/`
5. current branch code/runtime evidence
6. dated handoffs
7. chat memory

## Model Routing
- Planner / lead integrator: `gpt-5.4` with `high` reasoning
- Coding / implementation lanes: `gpt-5.3-codex` with `high` reasoning
- QA / audit lanes: `gpt-5.4-mini` with `medium` reasoning by default (`high` only for subtle repros)
- Do not assign all agents to the same model by default; prefer the fastest model that still fits the role.

## 2. Working Roles
### Main implementation owner
- owns code changes for the current slice
- runs final triage and integration
- should use higher reasoning effort for cross-cutting work

### QA / audit agents
- read-only unless explicitly assigned a write scope
- report only current reproducible defects
- should ignore stale findings unless they still reproduce on current `HEAD`

## 3. Checkpoint Before Audit
- Do not run QA on a mixed uncommitted worktree.
- QA should target:
  - committed local `HEAD`, or
  - pushed branch state

## 4. Required QA Context
Every QA report should include:
- branch and/or commit hash
- exact route/surface
- signed-in or signed-out state
- fixture/setup used
- exact repro steps
- whether browser storage/session was clean

## 5. Classify Findings Before Acting
Use one of these labels:
- `bug`
- `stale`
- `environment`
- `fixture/data`
- `product decision`

Only `bug` findings should go directly into a fix slice.

## 6. Fix Rules
- Default to the smallest defensible fix.
- Do not broaden scope without evidence.
- Queue ambiguous items instead of blocking on them.
- Add focused regression coverage when the surface already has tests or source locks.

## 7. Closeout Gate
A slice or batch is not closed until:
- tracked worktree is clean
- targeted tests pass
- `pnpm run verify` passes where practical
- changelog updated
- dated handoff added
- final QA rerun completed on current committed `HEAD`

## 8. Reconciliation Rule
- Prefer one current reconciliation note over multiple competing carry-forward docs.
- If a reconciliation note becomes stale, patch it or supersede it explicitly.

## 9. Context Refresh Rule
- Use trigger-based refresh with a turn-count backstop.
- Immediate refresh required when:
  - current `HEAD` changes materially,
  - another agent lands overlapping work,
  - a new checkpoint commit replaces the previous source of truth,
  - docs/runtime/handoffs disagree,
  - stale findings are being carried forward as if current.
- Soft refresh after roughly 8-10 substantial turns on the same slice:
  - restate the active source of truth,
  - re-check current committed `HEAD`,
  - re-scope the remaining work.
- Hard refresh after roughly 15 substantial turns on the same slice, or earlier if context drift appears.
- Refresh is meant to reduce stale-context drift; it is not a mandatory full-repo reread.
