# 2026-03-06 Recovery Housekeeping (Ignore Forensic Dump)

## Scope

Clean working tree noise after recovery by ignoring raw forensic dump artifacts.

## Change

- Added `recovery/` to root `.gitignore`.

## Why

- `recovery/git-unreachable-blobs/` contains low-level salvage blobs from destructive cleanup triage.
- Keeping it untracked prevents accidental commits of opaque binary/text fragments while preserving local forensic access.

## Notes

- No app/runtime behavior changed.
- No destructive operation used.
