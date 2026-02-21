# 2026-02-21 — Artist/Band Identity Slice 24 (Gitignore Artifact/Noise Guard)

## Scope
- Reduce repeated untracked-file noise that interrupts autonomous execution flow.

## Implemented
- Updated `.gitignore`:
  - added `artifacts/`
  - added generic `*:Zone.Identifier`

## Rationale
- `artifacts/` is now used by readiness reports (`--out=...`) and should remain local.
- `:Zone.Identifier` metadata files are non-source artifacts and should not appear in routine work status.

## Validation
Commands run:
- `pnpm run docs:lint`
- `pnpm run infra-policy-check`

## Out of Scope Kept
- No runtime code changes.
- No schema/API/web behavior changes.
