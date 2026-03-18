# SLICE-UXAUTO-657A

Date: 2026-03-18
Lane: D
Batch: 19
Task: `SLICE-UXAUTO-657A`
Title: `Verify transcript guard hardening`

## Scope
- Harden `scripts/reliant-verify-transcript.mjs` for chained verify commands.
- Normalize exit metadata formatting so downstream handoff parsing gets a deterministic shape in markdown and JSON.
- Extend transcript regression coverage for the hardened behavior.

## Changes
- Switched transcript execution to a single shell capture path with `pipefail` and merged output ordering for multi-command verify chains.
- Added normalized exit metadata under `exitMeta` in JSON output.
- Reformatted the `## Verify Exit Code` markdown block to emit deterministic key/value lines for `code`, `passed`, and `signal`.
- Extended `scripts/reliant-verify-transcript.test.mjs` to lock normalized markdown exit metadata, normalized JSON exit metadata, and chained-command output ordering.

## Verification
- `node scripts/reliant-verify-transcript.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Outcome
- Verify transcript capture now preserves chained-command output order and emits deterministic exit metadata for parser-driven handoffs.
