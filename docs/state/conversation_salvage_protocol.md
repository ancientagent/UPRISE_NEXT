# Conversation Salvage Protocol

Status: Active
Owner: Founder + product engineering
Last updated: 2026-04-06

## Purpose
Preserve dense conversational work before context compaction, agent change, model switch, or thread loss.

This protocol exists so important work does not live only in:
- chat memory
- transient model context
- external harness chat titles with weak discoverability

## What To Capture
Every salvage snapshot captures only:
1. `locks`
2. `open_decisions`
3. `drift_corrections`
4. `next_actions`

Optional metadata:
- `topic`
- `chat_name`
- `summary`
- `source_docs`
- `handoff_paths`

Do **not** dump full transcripts into the repo.

## Trigger Rules
Create or refresh a salvage snapshot when any of these are true:
- context usage is getting high enough that compaction/reset is likely
- before changing agents/models
- before ending a dense doctrine/spec thread
- after any major founder lock
- after roadmap or execution-board changes
- when the user explicitly says not to lose the thread

## Storage
Two outputs are required:

1. Machine-readable snapshot
- `docs/state/current_context_snapshot.json`

2. Human-readable handoff
- `docs/handoff/YYYY-MM-DD_context-snapshot-<topic>.md`

The JSON is the active machine snapshot.
The dated handoff is the durable audit trail.

## Snapshot Schema
```json
{
  "date": "2026-04-06",
  "topic": "discover_doctrine",
  "chat_name": "optional external harness chat title",
  "summary": "short description",
  "locks": [],
  "open_decisions": [],
  "drift_corrections": [],
  "next_actions": [],
  "source_docs": [],
  "handoff_paths": []
}
```

## Required Quality Bar
- Be concise.
- Preserve only authoritative outcomes.
- Prefer repo docs over chat memory.
- Never state a lock that has not actually been decided.
- Never state an open decision as if it were settled.

## Command
Use:

```bash
pnpm run context:salvage -- snapshot \
  --topic discover_doctrine \
  --chat-name "External Harness Chat Name" \
  --summary "Short summary" \
  --lock "Lock text" \
  --open "Open decision" \
  --drift "Drift correction" \
  --next "Next action"
```

Repeat `--lock`, `--open`, `--drift`, `--next`, `--source-doc`, and `--handoff` as needed.

## Relationship To Existing Docs
- Founder locks still belong in `docs/solutions/*`.
- Execution state still belongs in `docs/solutions/*` and `docs/handoff/*`.
- This protocol is a recovery layer, not a replacement for normal documentation.
