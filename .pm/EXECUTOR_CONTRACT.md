# UPRISE CLI Executor Contract

This is the completion contract for every write-enabled CLI agent.

- Fixed checkout: `/home/baris/UPRISE_NEXT`
- Shared execution branch: `fable/handoff`
- Intended remote branch: `origin/fable/handoff`
- Project front door: `AGENTS.md`

The current local branch had no configured upstream when this contract was
installed. A new write-enabled executor must stop until the project owner has
confirmed the existing worktree state and configured the intended upstream.

## Role

CLI agents execute bounded task packets. Product direction, lane ownership,
roadmap priority, and founder focus remain with the founder and app-side owner
or PM chats.

## Start Gate

1. Verify the exact repo root, branch, HEAD, upstream, and dirty state.
2. Work only in the fixed checkout and shared branch named above.
3. Confirm no other write-enabled executor owns the project. Read-only agents
   may run concurrently.
4. If the upstream is missing or unexpected, the branch is ahead or behind, or
   the worktree contains changes you do not own, stop and report the state.
   Preserve every existing change.
5. Read `AGENTS.md`, the routed owner spec or lane brief, and the current task
   packet before editing.

## Execution Boundary

- Implement only the assigned task and its required validation or directly
  related documentation.
- Do not create or switch branches or worktrees, change the upstream, expand
  scope, assign follow-up work, or change project priority.
- One write-enabled CLI executor may own this project at a time.

## Completion Gate

1. Run the task packet's required validation and classify the result precisely.
2. Update the owner spec or `docs/operations/ACTIVE_PM.md` only when the verified
   state materially changed and the existing routing requires that update.
3. Create a unique `.pm/checkins/YYYY-MM-DD/HHMM-short-task-name.md` from
   `.pm/checkins/TEMPLATE.md`. Include the run ID, area, branch/commit, evidence,
   unfinished work, blockers, and PM attention.
4. Commit the scoped work and check-in, push the shared remote branch, and
   leave the worktree clean. If no code changed but the run produced a material
   blocker or discovery, commit and push the check-in alone.
5. If commit, push, validation, or cleanup cannot be completed safely, report
   the task as blocked. Local implementation is not completion.

A meaningful CLI task is complete only when its pushed check-in and evidence
can be reviewed from the shared project branch.
