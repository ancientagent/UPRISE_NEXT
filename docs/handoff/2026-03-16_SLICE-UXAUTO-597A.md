# SLICE-UXAUTO-597A — Verify transcript guard hardening

Date: 2026-03-16  
Lane: D — Automation Reliability  
Task: `SLICE-UXAUTO-597A`

## Scope
Harden verify-transcript capture for multi-command slices and deterministic exit metadata formatting.

## Changes
- Updated [`scripts/reliant-verify-transcript.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-verify-transcript.mjs):
  - added `formatVersion=2`;
  - added deterministic exit metadata fields:
    - `exitCode`
    - `exitSignal`
    - `exitStatus`
    - `passed`
  - added chained-command metadata for multi-command verify flows:
    - `commandChainDetected`
    - `commandChainSeparators`
    - `commandSegmentCount`
  - added `stdout`, `stderr`, and `outputLineCount` alongside the combined `output`;
  - kept the existing Markdown section order while formatting the exit block as stable key-value lines.
- Updated [`scripts/reliant-verify-transcript.test.mjs`](/home/baris/UPRISE_NEXT/scripts/reliant-verify-transcript.test.mjs) with coverage for:
  - success metadata,
  - failure metadata,
  - chained-command detection and segment counting.

## Verification
- `node scripts/reliant-verify-transcript.test.mjs`
- `node scripts/reliant-runtime-clean.test.mjs`
- `node scripts/reliant-next-action.test.mjs`
- `pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter api typecheck && pnpm --filter web typecheck`

## Notes
- The wrapper still runs the exact verify command string through the shell; this slice only normalizes the transcript metadata contract around that execution.
