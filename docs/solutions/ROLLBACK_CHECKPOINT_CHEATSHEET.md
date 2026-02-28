# Rollback Checkpoint Cheatsheet

Purpose: provide deterministic rollback points during high-throughput multi-agent runs.

## Current Standard Checkpoints

- `checkpoint-2026-02-28-code`
  - Points to commit `e1a0cc8`
  - Scope: code/tooling and core docs updates

- `checkpoint-2026-02-28-full`
  - Points to commit `37ba4f3`
  - Scope: full snapshot including queue and handoff artifacts

## Inspect Checkpoints

```bash
git tag --list 'checkpoint-*' | sort
git show --no-patch --oneline checkpoint-2026-02-28-code
git show --no-patch --oneline checkpoint-2026-02-28-full
```

## Safe Compare Before Any Rollback

```bash
# what changed since code checkpoint
git diff --stat checkpoint-2026-02-28-code..HEAD

# what changed since full checkpoint
git diff --stat checkpoint-2026-02-28-full..HEAD
```

## Preferred Non-Destructive Rollback Flow

Use a rollback branch first (recommended):

```bash
git switch -c rollback/code checkpoint-2026-02-28-code
# or
git switch -c rollback/full checkpoint-2026-02-28-full
```

Push and test there before modifying your working branch.

## Roll Back Current Branch by Revert (Shared Branch Safe)

```bash
# example: revert everything after full checkpoint
git revert --no-edit checkpoint-2026-02-28-full..HEAD
```

Notes:
- Keeps history intact (safe for shared branches and PRs)
- Resolve conflicts, then continue revert sequence if needed

## Hard Reset (Only With Explicit Approval)

```bash
# destructive; use only when explicitly approved
git reset --hard checkpoint-2026-02-28-full
```

## Queue Runtime Cleanup After Rollback

```bash
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task.json
# lane-specific runtime example
pnpm run reliant:runtime:clean -- --runtime .reliant/runtime/current-task-lane-d-batch12.json
```

## Re-Validate Queue State

```bash
node scripts/reliant-slice-queue.mjs status --queue .reliant/queue/mvp-slices-batch13-real-mvp-throughput.json
```

## Policy

- Default to non-destructive rollback (`switch`/`revert`)
- Never use `reset --hard` unless explicitly approved in-thread
- Always record rollback action in `docs/CHANGELOG.md` and a dated `docs/handoff/` note
