# Founder Decision Capture Protocol R1

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-10

## Purpose
Prevent important founder decisions from remaining chat-only when session context is expensive or unstable.

This protocol exists because practical session overhead can consume context headroom before doctrine is safely promoted into repo truth. The fix is not to carry more chat memory. The fix is to salvage decisions earlier and more consistently.

## Rule
If a founder statement changes product truth, execution scope, terminology, system behavior, or implementation constraints, it must be captured in the repo during the same working pass.

Do not rely on "we already talked about this" as durable memory.

## What Must Be Captured
Promote the decision if it does any of the following:
- changes MVP vs later-version scope
- changes terminology (`project` -> `cause`, `Statistics` -> `The Scenery`, etc.)
- changes lifecycle or ontology
- changes who owns an action or update
- adds or removes a user-facing capability
- adds an exception to an existing system rule
- changes what is deferred
- changes what should be implemented next
- changes analytics/admin/retention expectations
- resolves a repeated ambiguity that agents are likely to hit again

## What Does Not Need Immediate Promotion
These may stay in chat until they mature:
- copy polish
- visual polish
- exact alert wording
- speculative examples that do not change the rule
- reversible implementation detail that does not change product truth

If a "small" clarification keeps recurring, promote it.

## Preferred Capture Order
### 1. Update an existing founder lock
Use the narrowest active authority file that already governs the topic.

Examples:
- Discover behavior -> `docs/solutions/MVP_DISCOVER_FOUNDER_LOCK_R1.md`
- stats/admin retention -> `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- source/feed/profile ontology -> `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- explicit MVP exclusions -> `docs/solutions/MVP_EXPLICIT_DEFERRED_LIST_R1.md`

### 2. If no suitable lock exists, create one
Create a focused founder-lock doc under `docs/solutions/`.
Do not bury first-class product truth only in a dated handoff note.

### 3. Record carry-forward context in a dated handoff
Add a short `docs/handoff/YYYY-MM-DD_*.md` note when:
- multiple corrections happened in one session
- an older doc/runtime path still needs reconciliation
- the decision implies follow-up implementation work

### 4. Update `docs/CHANGELOG.md`
Every meaningful promotion gets a concise unreleased entry.

### 5. Keep external memory in sync
If the team is using NotebookLM or another external memory layer, update the active briefing pack or add a dated sync note in the same pass whenever the slice changes:
- founder doctrine
- active surface behavior
- action grammar
- major runtime shape

Do not assume external memory will infer the change from raw repo state on its own.

## Capture Standard
Every promoted founder decision should answer these questions plainly:
1. What changed?
2. What is the rule now?
3. What is explicitly not implied?
4. Where should future agents look first?
5. Does code/spec/runtime need follow-up reconciliation?

## Implementation Flagging Rule
If the new decision affects runtime or specs but is not implemented yet, record that explicitly.

Use one of these labels in the lock or handoff note:
- `locked and implemented`
- `locked, spec/runtime reconciliation pending`
- `locked, implementation deferred`
- `open, founder confirmation still required`

This prevents agents from mistaking saved doctrine for completed code.

## Session Operating Rule
When a doctrine-heavy thread runs longer than a few substantial turns, stop and salvage.

Minimum salvage package:
- founder lock update or new lock
- `docs/CHANGELOG.md` entry
- dated handoff note if reconciliation/follow-up exists
- NotebookLM/external-memory sync note or briefing update when the change is large enough to affect future answers

Do not wait until the end of the day or the end of the thread if the thread is already creating durable product truth.

## Closeout Checklist
Before moving from doctrine back into implementation, confirm:
- the new rule is in a founder lock or controlling spec
- stale/conflicting assumptions are called out
- `docs/CHANGELOG.md` is updated
- any runtime/spec follow-up is explicitly flagged
- the user should not have to restate the same rule in the next session

## Anti-Failure Rule
If the founder says some version of:
- "this should have already been locked"
- "we already talked about this"
- "I do not want to keep restating this"

then stop and promote the decision immediately before continuing.

## Related Docs
- `docs/solutions/LEAN_CONTEXT_OPERATING_RULES_R1.md`
- `docs/solutions/SEAMLESS_AGENT_CONTINUITY_PROTOCOL_R1.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/handoff/README.md`
