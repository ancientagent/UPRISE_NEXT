# Conversation Salvage Protocol Rollout

## What Changed
- Added `docs/state/conversation_salvage_protocol.md` as the explicit recovery-layer protocol for dense threads, compaction, model switches, and agent changes.
- Added `docs/state/current_context_snapshot.json` as the machine-readable active snapshot for current locks, open decisions, drift corrections, and next actions.
- Added `scripts/salvage-context.mjs` plus root package script `pnpm run context:salvage` to generate/update the JSON snapshot and a dated Markdown handoff together.
- Indexed the new `docs/state/` layer from `docs/README.md` so agents can find it without relying on chat memory.

## Why
Dense product threads are now carrying enough doctrine and drift corrections that losing the chat thread or switching agents without extraction is an operational risk.

The goal of this layer is not transcript storage. It is controlled recovery:
- preserve authoritative outcomes
- keep machine-readable current state
- keep a dated human-readable audit trail
- avoid restarting the same product arguments after compaction or agent change

## Protocol Scope
The salvage layer captures only:
- locks
- open decisions
- drift corrections
- next actions

Optional metadata:
- topic
- chat name
- summary
- source docs
- handoff paths

## Verification
- Smoke-tested `scripts/salvage-context.mjs` by writing a temporary snapshot and dated handoff, then restoring the intended active snapshot.
- `pnpm run docs:lint`

## Carry-Forward Notes
- This is a recovery layer, not a replacement for founder locks, specs, or normal handoff discipline.
- Founder-confirmed semantics still belong in `docs/solutions/*`.
- The JSON snapshot should stay concise and current rather than becoming a transcript dump.
