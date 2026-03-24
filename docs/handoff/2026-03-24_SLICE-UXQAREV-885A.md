# 2026-03-24 — SLICE-UXQAREV-885A Batch27 merge-readiness closeout memo

## Scope
- Publish the final Batch27 closeout memo summarizing current reproducible-defect status, verification commands, residual risks, and merge-readiness for `feat/ux-founder-locks-and-harness`.

## Current reproducible-defect status
- No current reproducible scoped defects were found in the final Lane E QA sweep on current `HEAD` `9da7bae`.

## Flows verified
- unsigned `/onboarding -> /plot -> /discover`
- signed-in `/discover` via current client auth storage shape
- `/plot`
- `/registrar`
- `/community/qa-missing`
- `/artist-bands/qa-missing`
- `/users/qa-missing`

## What passed
- `/plot` bottom nav is present with `Home`, center `UPRISE` trigger, and `Discover`
- Plot-to-Discover continuity works
- unsigned current-community Discover unlock works
- `Recommendations`, `Trending`, and `Top Artists` render on `/discover`
- local artist/song search is enabled on `/discover`
- no obvious route hangs reproduced
- signed-out auth-state messaging on `/registrar`, `/community/[id]`, `/artist-bands/[id]`, and `/users/[id]` is clear and terminal

## Harness method
- Clean in-memory browser via `bash ~/.codex/skills/playwright/scripts/playwright_cli.sh`
- Live app at `http://127.0.0.1:3000`

## Verification commands
```bash
pnpm run docs:lint && pnpm run infra-policy-check && pnpm --filter web typecheck && pnpm --filter api typecheck
```

## Residual risks
- The verified unsigned empty-state community context still has no live city-scene anchor for the selected Home Scene tuple. In that state, `Retune` and `Visit [Community Name]` are not expected to appear because there is no matching Uprise result to act on.
- The active repo still lacks an authoritative hotspot/launch-city inventory, so nearest-active fallback behavior remains canon-backed but not backed by a concrete named launch matrix in active docs.
- Local route QA is clean for the scoped surfaces above, but merge readiness still assumes normal PR checks and codeowner review remain required for `main`.

## Merge-readiness recommendation
- `feat/ux-founder-locks-and-harness` is ready for merge review for the scoped Batch27 closeout work.
- No additional implementation work is required before review based on the current Lane E sweep.
