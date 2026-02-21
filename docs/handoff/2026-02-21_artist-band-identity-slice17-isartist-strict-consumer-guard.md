# 2026-02-21 — Artist/Band Identity Slice 17 (isArtist Strict Consumer Guard)

## Scope
- Harden deprecation-readiness guardrails by failing on unapproved `isArtist` call sites.
- Wire strict guard into identity QA lane.

## Implemented
- Updated `scripts/is-artist-consumer-report.mjs`:
  - added `--fail-on-unapproved` mode,
  - ignores pnpm passthrough `--` arg,
  - reports `unapprovedLegacyReferences` in output,
  - exits non-zero when strict mode detects unapproved references.
- Added script command:
  - `pnpm run report:isartist-consumers:strict`
- Updated QA lane:
  - `qa:identity` now runs strict guard mode before API identity tests.
- Updated runbook:
  - `docs/solutions/USER_ISARTIST_DEPRECATION_READINESS.md` includes strict mode usage and allowed transitional file set.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`
- `pnpm run report:isartist-consumers`
- `pnpm run report:isartist-consumers:strict`
- `pnpm run qa:identity`

## Out of Scope Kept
- No schema/API behavior changes.
- No destructive deprecation/removal step.
