# Branch And Workspace Registry

Status: active operations registry
Owner: current branch owner / context-steward
Last Updated: 2026-07-14

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
| linear-clean-context-agent-roles | branch | docs/linear-clean-context-agent-roles | /home/baris/UPRISE_NEXT | PR #212 https://github.com/ancientagent/UPRISE_NEXT/pull/212 | main | 8d559b8 | open-pr | Codex local | Codex local | Draft PR #212: define Linear clean-context assigning/assigned agent roles and optional read-only excavator workflow; process docs only, intentionally not priority. | 2026-07-03 | leave open as draft until user prioritizes; do not merge or close without approval |
| onboarding-homescene-e2e-runtime | branch | feat/onboarding-homescene-e2e-runtime | /home/baris/UPRISE_NEXT | - | main | ebbf317 | active | Codex local | Codex local | Onboarding Home Scene proxy resolution: same-state active major-node must win over nearer cross-state proxy before distance ranking. | 2026-07-08 | update on PR/merge/close/delete |
| main-workspace | primary | main | /home/baris/UPRISE_NEXT | - | origin/main | 62f2d58 | primary | Codex local | current branch owner | Primary UPRISE remote baseline after PR #243 merged. | 2026-07-14 | keep current and clean |
| founder-regenerative-ownership-capture | branch | codex/founder-regenerative-ownership-capture | /home/baris/UPRISE_NEXT | - | main@8c4ab4d | 97539e4 | preserved | Codex local | Codex local sole writer | Original local founder-session capture checkpoint for regenerative network ownership, stewardship, and institutional continuity; no owner-spec or runtime promotion. | 2026-07-14 | preserve the source checkpoint; submit only its unique capture through the clean registered submission branch |
| release-deck-scheduling-client | branch | codex/release-deck-scheduling-client | /home/baris/UPRISE_NEXT | PR #238 https://github.com/ancientagent/UPRISE_NEXT/pull/238 | origin/main | a55a54f | preserved | Codex local | Codex local sole writer; read-only Codex code/client reviewers | Source Dashboard scheduling client plus source-authorized, current-window, ingested-capacity, serializable schedule enforcement and hardened client state; content merged through PR #238. | 2026-07-14 | preserve local branch until graduation rebase and operations closeout are complete; then register deletion separately |
| new-releases-graduation | branch | codex/new-releases-graduation | /home/baris/UPRISE_NEXT | PR #239 https://github.com/ancientagent/UPRISE_NEXT/pull/239 | origin/main | c9992c3 | preserved | Codex local | Codex local sole writer; read-only Codex plan, code, and product-contract reviewers | Manual authenticated New Releases to Main Rotation graduation slice: dry-run/write service, deterministic recurrence initialization, tests, and required docs; content merged through PR #239. | 2026-07-14 | preserve local branch until Slice 6 branch creation and sequential operations closeout are complete |
| official-sect-backing-foundation | branch | codex/official-sect-backing-foundation | /home/baris/UPRISE_NEXT | PR #240 https://github.com/ancientagent/UPRISE_NEXT/pull/240 | origin/main@c9992c3 | c70a813 | preserved | Codex local | Codex local sole writer; read-only Codex plan, schema, and product-contract reviewers | Slice 6A Official Sect identity foundation only: parent-community-scoped identity schema, empty additive migration, and exact parity test; content merged to main at `542c350`. | 2026-07-14 | preserve the local branch until a separately registered cleanup pass; do not reuse it for backing or readiness runtime |
| sect-readiness-decision-gate | branch | codex/sect-readiness-decision-gate | /home/baris/UPRISE_NEXT | PR #241 https://github.com/ancientagent/UPRISE_NEXT/pull/241 | origin/main@542c350 | 843a953 | preserved | Codex local | Codex local sole writer; read-only Codex product-authority and implementation-plan reviewers | Slice 7 decision packet only; content merged to main at `563fd91`. No schema, runtime, UI, provider, or database work. | 2026-07-14 | preserve the local branch until a separately registered cleanup pass; stop for founder answers |
| sect-decision-gate-closeout | branch | codex/sect-decision-gate-closeout | /home/baris/UPRISE_NEXT | PR #242 https://github.com/ancientagent/UPRISE_NEXT/pull/242 | origin/main@563fd91 | branch HEAD | preserved | Codex local | Codex local sole writer | Routing-only closeout after PR #241; refresh Active PM and registry to the founder-answer gate. | 2026-07-14 | merge PR #242 after green checks, then preserve this local branch without another bookkeeping PR |
| founder-regenerative-ownership-submit | branch | codex/founder-regenerative-ownership-submit | /home/baris/UPRISE_NEXT | PR #243 https://github.com/ancientagent/UPRISE_NEXT/pull/243 | origin/main@2b96d84 | reviewed capture `ecfe482`; PR routing metadata follows | preserved | Codex local | Codex local sole writer; read-only founder-capture reviewer | Clean remote submission of the existing raw regenerative ownership/institutional continuity founder-session capture; no owner-spec, legal-model, governance, runtime, schema, or provider promotion. | 2026-07-14 | merge PR #243 after green checks, then preserve without another bookkeeping PR |
| sect-threshold-founder-clarification | branch | codex/sect-threshold-founder-clarification | /home/baris/UPRISE_NEXT | PR #244 https://github.com/ancientagent/UPRISE_NEXT/pull/244 | origin/main@62f2d58 | 988adc0 | preserved | Codex local | Codex local sole writer; read-only product-authority and code-impact reviewers | Founder clarification and authority cleanup; no runtime/schema/provider behavior. | 2026-07-14 | content merged via PR #244 squash at `10787dc`; preserve local branch pending registered cleanup |
| workflow-policy-simplification | branch | codex/workflow-policy-simplification | /home/baris/UPRISE_NEXT | - | main | a108bdf | active | Codex local | Codex local; bounded read-only reviewer | Simplify live operations routing, handoff and changelog triggers, startup context, and concurrent workspace audit behavior; no product or runtime feature changes. | 2026-07-24 | update on PR/merge/close/delete |
| historical-branch-cleanup | branch | codex/historical-branch-cleanup | /home/baris/UPRISE_NEXT | - | main@3f5ef12 | pending | active | Codex local | Codex local; read-only branch auditor | Preserve unique PR #212 founder wording, close superseded workflow work, remove only proven-safe historical refs, and retain protected UX worktrees/branches. | 2026-07-24 | merge cleanup docs through PR, then retire this topic ref after equivalence proof |
<!-- workspace-registry:end -->

## Remote-Only Historical Branches

Remote-only refs may predate this registry. Do not assume they are safe to delete. Use `node scripts/workspace-registry.mjs audit --include-remote` to list unregistered remote refs, then classify them in a dedicated cleanup pass before deletion.
