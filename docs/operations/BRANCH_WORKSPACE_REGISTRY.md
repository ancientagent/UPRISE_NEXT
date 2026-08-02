# Branch And Workspace Registry

Status: active operations registry
Owner: current branch owner / context-steward
Last Updated: 2026-08-01

## Purpose

This is the active routing registry for the current write workspace,
preserved-risk worktrees/branches, and externally assigned work.

Git and GitHub own discoverable branch, PR, and merge history. This file stores
the ownership, scope, preservation, and closeout intent that Git cannot explain.

This file is execution state only. It is not product doctrine, canon, or an owner spec.

## Non-Negotiable Rule

Creating a UPRISE write branch/worktree/workspace is not complete until its
current branch has an entry here.

Update this registry when:

- creating a local branch;
- creating a worktree;
- assigning a branch to Cloud Codex, Abacus, Reliant, Hermes, a design agent, or another external agent;
- changing branch ownership, assigned agents, scope, preservation status, or
  closeout plan;
- preserving, archiving, or deleting a non-obvious branch/worktree.

For significant/risky issues, cross-lane work, provider/db/schema/canon/doc-authority work, external-agent handoffs, prototype extraction, or broad cleanup, pair this registry entry with the Execution Packet / Executor Readiness / Closeout Contract blocks in `docs/specs/system/documentation-framework.md`.

## Required Fields

Each registry entry must answer:

- ID: stable short slug for the branch/workspace.
- Kind: `primary`, `branch`, `worktree`, `preserved-branch`, or `external-agent`.
- Branch: exact branch name.
- Worktree / Path: local path if one exists, otherwise `-`.
- PR / Linear: PR number, Linear issue, or `-`.
- Base: branch/ref it was created from.
- HEAD: short commit at last registry update, or `pending` for the branch currently updating the registry.
- Status: `active`, `open-pr`, `preserved`, `review-needed`, `merged`, or `closed`.
- Owner: accountable branch owner.
- Agents: assigned agents or agent families.
- What is on it: concise summary of content/scope.
- Last Updated: date of latest registry update.
- Closeout: merge/delete/preserve/archive/extract plan.

## Workflow

1. Before creating a branch/worktree, add or upsert a registry entry with `status: active`.
2. Before pushing or opening a PR, run `pnpm run workspace:audit`.
3. When a PR opens, its link may be added for routing, but GitHub remains live
   PR state.
4. When a branch/worktree is preserved, set status to `preserved` or `review-needed` and state why it must not be deleted.
5. After merge/close verification, remove the row with
   `pnpm run workspace:compact`; Git/GitHub retain the history.
6. Do not delete unregistered branches/worktrees. First register and classify them, then get explicit approval for deletion if needed.

## No Refresh PRs

Do not open a follow-up PR solely to record a merge or refresh this file.

## Commands

```bash
pnpm run workspace:register -- --id <id> --kind branch --branch <branch> --status active --owner "Codex local" --agents "Codex local" --scope "<what is on it>" --path /home/baris/UPRISE_NEXT
pnpm run workspace:audit
pnpm run workspace:compact
node scripts/workspace-registry.mjs audit --include-remote
```

`workspace:audit` fails when the current write branch is unregistered. Other
worktrees, local refs, and open PRs are warnings because their current routing
entry may live on another unmerged branch. Remote-only historical branches are
reported only with `--include-remote`; use `--strict-remote` during an explicit
cleanup pass.

## Current Registry

<!-- workspace-registry:start -->
| ID | Kind | Branch | Worktree / Path | PR / Linear | Base | HEAD | Status | Owner | Agents | What is on it | Last Updated | Closeout |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ux-implementation-reference | worktree | ux-implementation | /home/baris/UPRISE_NEXT_uximpl | - | older main snapshot | be4ddde | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Broad Plot/profile/player/source-dashboard prototype. Preserve as design/runtime reference; do not merge wholesale. | 2026-07-02 | extract intentionally or archive after review |
| ux-mobile-r1-reference | worktree | ux-mobile-r1-build | /home/baris/UPRISE_NEXT_uxmobile | - | older main snapshot | b59a63c | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Broad mobile-first UX prototype. Preserve as design/runtime reference; do not merge wholesale. | 2026-07-02 | extract intentionally or archive after review |
| ux-batch17-reference | preserved-branch | feat/ux-batch17 | - | - | older main snapshot | 9fb382e | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Historical UX/Reliant batch-output reference with canonical blockers documented. | 2026-07-02 | preserve until extraction/archive decision |
| ux-batch18-reference | preserved-branch | feat/ux-batch18-run | - | - | older main snapshot | 77d2e26 | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Historical UX/Reliant batch-output reference with Social-hidden MVP precedence notes. | 2026-07-02 | preserve until extraction/archive decision |
| prisma-schema-migration-draft | preserved-branch | codex/propose-prisma-schema-migration | - | closed PR #1 https://github.com/ancientagent/UPRISE_NEXT/pull/1 | older main snapshot | be54087 | review-needed | owner pending | no active agent | Unmerged schema/spec draft with unique content. Not evaluated for current product or migration authority. | 2026-07-23 | preserve until a dedicated schema/product review decides extract or delete |
| shared-local-normalization | branch | codex/classic-avatar-asset-production | /home/baris/UPRISE_NEXT | - | main@ba969f8 | pending | active | Codex local, sole writer | no active subagents; 2026-08-02 Sol plan and implementation reviews completed and agents closed | Completed non-destructive normalization plus local-only city-tier RADIYO fixture preflight and the no-schema preview-only lifecycle coordinator. No schema/provider/DB state has changed. The preflight inspects founder-supplied hydrated audio without copying it or touching DB/provider state. Rollback checkpoint: `C:\Users\baris\uprise-agent-artifacts\uprise-shared-checkout-pre-normalization`. | 2026-08-02 | preserve the pushed checkpoint; await explicit approval before the Slice B schema/ledger or later provider work |
<!-- workspace-registry:end -->

## Remote-Only Historical Branches

Remote-only refs may predate this registry. Do not assume they are safe to delete. Use `node scripts/workspace-registry.mjs audit --include-remote` to list unregistered remote refs, then classify them in a dedicated cleanup pass before deletion.
