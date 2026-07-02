# Branch And Workspace Registry

Status: active operations registry
Owner: current branch owner / context-steward
Last Updated: 2026-07-02

## Purpose

This is the mandatory registry for UPRISE branches, worktrees, PR workspaces, and externally assigned branch work.

It exists so branch/worktree creation cannot happen off the books. Any active branch, open PR branch, preserved worktree, preserved prototype branch, or externally assigned workspace must be represented here with enough context for the next agent to know what is on it, who owns it, and what closeout action is expected.

This file is execution state only. It is not product doctrine, canon, or an owner spec.

## Non-Negotiable Rule

Creating a UPRISE branch/worktree/workspace is not complete until this file has an entry for it.

Update this registry when:

- creating a local branch;
- creating a worktree;
- assigning a branch to Cloud Codex, Abacus, Reliant, Hermes, a design agent, or another external agent;
- opening a PR;
- changing branch ownership, assigned agents, status, or closeout plan;
- merging, closing, preserving, archiving, or deleting a branch/worktree.

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
3. When a PR opens, set status to `open-pr` and add the PR number/link.
4. When a branch/worktree is preserved, set status to `preserved` or `review-needed` and state why it must not be deleted.
5. When a PR merges or branch closes, update status to `merged` or `closed` before deleting local/remote refs.
6. Do not delete unregistered branches/worktrees. First register and classify them, then get explicit approval for deletion if needed.

## Commands

```bash
pnpm run workspace:register -- --id <id> --kind branch --branch <branch> --status active --owner "Codex local" --agents "Codex local" --scope "<what is on it>" --path /home/baris/UPRISE_NEXT
pnpm run workspace:audit
node scripts/workspace-registry.mjs audit --include-remote
```

`workspace:audit` fails on unregistered local branches, worktree branches, and open PR heads. Remote-only historical branches are reported only when `--include-remote` is passed; use `--strict-remote` when doing broad remote cleanup.

## Current Registry

<!-- workspace-registry:start -->
| ID | Kind | Branch | Worktree / Path | PR / Linear | Base | HEAD | Status | Owner | Agents | What is on it | Last Updated | Closeout |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| main-workspace | primary | main | /home/baris/UPRISE_NEXT | - | origin/main | 861f05b | primary | Codex local | current branch owner | Primary UPRISE workspace on current main after PR #185. | 2026-07-02 | keep current and clean |
| active-pm-codex-routing-refresh | branch | docs/active-pm-post-codex-routing-refresh | - | PR #181 | main | fe048ce | merged | Codex local | Codex local | Active PM refresh after PR #180, plus branch/workspace registry system added in this follow-up. | 2026-07-02 | merged in PR #181; remote branch deleted |
| ux-implementation-reference | worktree | ux-implementation | /home/baris/UPRISE_NEXT_uximpl | - | older main snapshot | be4ddde | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Broad Plot/profile/player/source-dashboard prototype. Preserve as design/runtime reference; do not merge wholesale. | 2026-07-02 | extract intentionally or archive after review |
| ux-mobile-r1-reference | worktree | ux-mobile-r1-build | /home/baris/UPRISE_NEXT_uxmobile | - | older main snapshot | b59a63c | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Broad mobile-first UX prototype. Preserve as design/runtime reference; do not merge wholesale. | 2026-07-02 | extract intentionally or archive after review |
| ux-batch17-reference | preserved-branch | feat/ux-batch17 | - | - | older main snapshot | 9fb382e | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Historical UX/Reliant batch-output reference with canonical blockers documented. | 2026-07-02 | preserve until extraction/archive decision |
| ux-batch18-reference | preserved-branch | feat/ux-batch18-run | - | - | older main snapshot | 77d2e26 | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Historical UX/Reliant batch-output reference with Social-hidden MVP precedence notes. | 2026-07-02 | preserve until extraction/archive decision |
| active-pm-post-branch-registry-refresh | branch | docs/active-pm-post-branch-registry-refresh | - | PR #182 | main | 79467df | merged | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #181 merged. | 2026-07-02 | merged in PR #182; remote branch deleted |
| ux-reference-extraction-inventory | branch | docs/ux-reference-extraction-inventory | - | PR #183 | main | 4ecbb37 | merged | Codex local | Codex local | Read-only extraction inventory for preserved UX reference worktrees ux-implementation and ux-mobile-r1-build. | 2026-07-02 | merged in PR #183; remote branch deleted |
| active-pm-post-ux-inventory-refresh | branch | docs/active-pm-post-ux-inventory-refresh | - | PR #184 | main | 9285b25 | merged | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #183 UX reference extraction inventory merged. | 2026-07-02 | merged in PR #184; remote branch deleted |
| plot-profile-player-state-contract | branch | test/plot-profile-player-state-contract | - | PR #185 | main | 861f05b | merged | Codex local | Codex local | Add current-compatible Plot profile/player state contract tests inspired by preserved UX reference state-machine work; no prototype runtime import. | 2026-07-02 | merged in PR #185; remote and local branches deleted |
| active-pm-post-plot-profile-player-state-refresh | branch | docs/active-pm-post-plot-profile-player-state-refresh | /home/baris/UPRISE_NEXT | - | main | pending | active | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #185 Plot profile/player state contract merged. | 2026-07-02 | merge docs-only PM refresh via PR if green |
<!-- workspace-registry:end -->

## Remote-Only Historical Branches

Remote-only refs may predate this registry. Do not assume they are safe to delete. Use `node scripts/workspace-registry.mjs audit --include-remote` to list unregistered remote refs, then classify them in a dedicated cleanup pass before deletion.
