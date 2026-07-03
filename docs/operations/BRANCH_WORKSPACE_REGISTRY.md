# Branch And Workspace Registry

Status: active operations registry
Owner: current branch owner / context-steward
Last Updated: 2026-07-03

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
| active-pm-codex-routing-refresh | branch | docs/active-pm-post-codex-routing-refresh | - | PR #181 | main | fe048ce | merged | Codex local | Codex local | Active PM refresh after PR #180, plus branch/workspace registry system added in this follow-up. | 2026-07-02 | merged in PR #181; remote branch deleted |
| ux-implementation-reference | worktree | ux-implementation | /home/baris/UPRISE_NEXT_uximpl | - | older main snapshot | be4ddde | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Broad Plot/profile/player/source-dashboard prototype. Preserve as design/runtime reference; do not merge wholesale. | 2026-07-02 | extract intentionally or archive after review |
| ux-mobile-r1-reference | worktree | ux-mobile-r1-build | /home/baris/UPRISE_NEXT_uxmobile | - | older main snapshot | b59a63c | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Broad mobile-first UX prototype. Preserve as design/runtime reference; do not merge wholesale. | 2026-07-02 | extract intentionally or archive after review |
| ux-batch17-reference | preserved-branch | feat/ux-batch17 | - | - | older main snapshot | 9fb382e | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Historical UX/Reliant batch-output reference with canonical blockers documented. | 2026-07-02 | preserve until extraction/archive decision |
| ux-batch18-reference | preserved-branch | feat/ux-batch18-run | - | - | older main snapshot | 77d2e26 | preserved | UX extraction owner pending | Codex/design agents by explicit approval only | Historical UX/Reliant batch-output reference with Social-hidden MVP precedence notes. | 2026-07-02 | preserve until extraction/archive decision |
| active-pm-post-branch-registry-refresh | branch | docs/active-pm-post-branch-registry-refresh | - | PR #182 | main | 79467df | merged | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #181 merged. | 2026-07-02 | merged in PR #182; remote branch deleted |
| ux-reference-extraction-inventory | branch | docs/ux-reference-extraction-inventory | - | PR #183 | main | 4ecbb37 | merged | Codex local | Codex local | Read-only extraction inventory for preserved UX reference worktrees ux-implementation and ux-mobile-r1-build. | 2026-07-02 | merged in PR #183; remote branch deleted |
| active-pm-post-ux-inventory-refresh | branch | docs/active-pm-post-ux-inventory-refresh | - | PR #184 | main | 9285b25 | merged | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #183 UX reference extraction inventory merged. | 2026-07-02 | merged in PR #184; remote branch deleted |
| plot-profile-player-state-contract | branch | test/plot-profile-player-state-contract | - | PR #185 | main | 861f05b | merged | Codex local | Codex local | Add current-compatible Plot profile/player state contract tests inspired by preserved UX reference state-machine work; no prototype runtime import. | 2026-07-02 | merged in PR #185; remote and local branches deleted |
| active-pm-post-plot-profile-player-state-refresh | branch | docs/active-pm-post-plot-profile-player-state-refresh | - | PR #186 | main | ce6c841 | merged | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #185 Plot profile/player state contract merged. | 2026-07-02 | merged in PR #186; remote branch deleted |
| codex-first-review-routing-refresh | branch | docs/codex-first-review-routing-refresh | - | PR #187 | main | eea674c | merged | Codex local | Codex local | Formalized Codex-first review/audit routing in documentation-framework, AI stack docs, Active PM, and local routing skill; Hermes fallback/watchdog only. | 2026-07-02 | merged in PR #187; remote and local branches deleted |
| active-pm-post-codex-routing-v2-refresh | branch | docs/active-pm-post-codex-routing-v2-refresh | - | PR #188 | main | 0ab9ce2 | merged | Codex local | Codex local | Refreshed ACTIVE_PM and branch workspace registry after PR #187 Codex-first review routing merged. | 2026-07-02 | merged in PR #188; remote branch deleted |
| plot-bottom-nav-component | branch | refactor/plot-bottom-nav-component | - | PR #189 | main | 0cd181e | merged | Codex local | Codex local | Extracted /plot bottom navigation and UPRISE wheel overlay into a focused component while preserving route-owned state and behavior. | 2026-07-02 | merged in PR #189; remote branch deleted |
| main-workspace | primary | main | /home/baris/UPRISE_NEXT | - | origin/main | 25e06a2 | primary | Codex local | current branch owner | Primary UPRISE workspace on current main after PR #211. | 2026-07-03 | keep current and clean |
| plot-tab-surface-component | branch | refactor/plot-tab-surface-component | - | PR #190 | main | 66556d7 | merged | Codex local | Codex local | Extracted /plot non-expanded tab bar and active surface frame into a focused component while preserving route-owned tab state and tab body rendering. | 2026-07-02 | merged in PR #190; remote branch deleted |
| active-pm-post-plot-tab-surface-refresh | branch | docs/active-pm-post-plot-tab-surface-refresh | - | PR #191 | main | 01a6109 | merged | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #190 Plot tab surface extraction merged. | 2026-07-03 | merged in PR #191; remote branch deleted |
| founder-session-discover-player-captures | branch | docs/founder-session-discover-player-captures | - | PR #193 https://github.com/ancientagent/UPRISE_NEXT/pull/193 | origin/main | 97680e4 | merged | Codex local | Codex local | Capture Discover front-door/back-door shared-screen clarification and RADIYO/SPACE player terminology notes; no owner-spec promotion or runtime behavior changes. | 2026-07-03 | merged in PR #193; remote branch deleted |
| windows-visible-artifact-bridge | branch | chore/windows-visible-artifact-bridge | - | PR #192 https://github.com/ancientagent/UPRISE_NEXT/pull/192 | origin/main | 7327453 | merged | Codex local | Codex local | Windows-visible artifact bridge helpers; patched to avoid symlinks, derive the Windows artifact root, and reject unsafe slugs. | 2026-07-03 | merged in PR #192; remote branch deleted |
| active-pm-post-founder-captures-refresh | branch | docs/active-pm-post-founder-captures-refresh | - | PR #194 https://github.com/ancientagent/UPRISE_NEXT/pull/194 | main | 37c61fe | merged | Codex local | Codex local | Refresh ACTIVE_PM and branch workspace registry after PR #191, PR #192, and PR #193 merged. | 2026-07-03 | merged in PR #194; remote branch deleted |
| discover-player-owner-spec-promotion | branch | docs/discover-player-owner-spec-promotion | - | PR #195 https://github.com/ancientagent/UPRISE_NEXT/pull/195 | main | a83b667 | merged | Codex local | Codex local | Promote founder-session Discover transport and RADIYO/SPACE player clarifications into owner specs without runtime changes. | 2026-07-03 | merged in PR #195; remote branch deleted |
| feed-blast-card-travel-source-contract | branch | docs/feed-blast-card-travel-source-contract | - | PR #196 https://github.com/ancientagent/UPRISE_NEXT/pull/196 | main | 052016f | merged | Codex local | Codex local | Promote founder clarification: Feed Blast cards are Feed card types; card click/source link/travel link semantics; Travel hands off to Discover back-door context. | 2026-07-03 | merged in PR #196; remote branch deleted |
| feed-travel-launch-boundary-pm-refresh | branch | docs/feed-travel-launch-boundary-pm-refresh | - | PR #197 https://github.com/ancientagent/UPRISE_NEXT/pull/197 | main | 5a07d93 | merged | Codex local | Codex local | Captured Feed Travel launch boundary nuance and refreshed Active PM / branch registry after PR #194-#196 merged. | 2026-07-03 | merged in PR #197; remote branch deleted |
| onboarding-home-scene-smoke-hardening | branch | test/onboarding-home-scene-smoke-hardening | /home/baris/UPRISE_NEXT | PR #203 https://github.com/ancientagent/UPRISE_NEXT/pull/203 | main | c4fa768 | merged | Codex local | Codex local | UPRISE-PLAN-004: Onboarding/Home Scene smoke hardening. | 2026-07-03 | merged via PR #203; remote branch deleted |
| registrar-source-gps-authority-hardening | branch | test/registrar-source-gps-authority-hardening | /home/baris/UPRISE_NEXT | PR #204 https://github.com/ancientagent/UPRISE_NEXT/pull/204 | main | 3f746db | merged | Codex local | Codex local | UPRISE-PLAN-005: Registrar/source GPS authority hardening. | 2026-07-03 | merged via PR #204; remote branch deleted |
| release-deck-media-eligibility-hardening | branch | test/release-deck-media-eligibility-hardening | /home/baris/UPRISE_NEXT | PR #205 https://github.com/ancientagent/UPRISE_NEXT/pull/205 | main | 1708f19 | merged | Codex local | Codex local | UPRISE-PLAN-006: Release Deck media eligibility hardening. | 2026-07-03 | merged via PR #205; remote branch deleted |
| feed-blast-card-source-link-contract | branch | test/feed-blast-card-source-link-contract | /home/baris/UPRISE_NEXT | PR #200 https://github.com/ancientagent/UPRISE_NEXT/pull/200 | main | 6aad9f2 | merged | Codex local | Codex local | UPRISE-PLAN-001: Feed Blast card source-link contract tests. | 2026-07-03 | merged via PR #200; remote branch deleted |
| feed-travel-launch-boundary-tests | branch | test/feed-travel-launch-boundary-tests | /home/baris/UPRISE_NEXT | PR #201 https://github.com/ancientagent/UPRISE_NEXT/pull/201 | main | c6e1e2c | merged | Codex local | Codex local | UPRISE-PLAN-002: Feed Travel launch-boundary tests. | 2026-07-03 | merged via PR #201; remote branch deleted |
| plot-no-transport-boundary-tests | branch | test/plot-no-transport-boundary-tests | /home/baris/UPRISE_NEXT | PR #202 https://github.com/ancientagent/UPRISE_NEXT/pull/202 | main | cc57dc5 | merged | Codex local | Codex local | UPRISE-PLAN-003: Plot no-transport boundary tests. | 2026-07-03 | merged via PR #202; remote branch deleted |
| uprise-development-plan-r1 | branch | docs/uprise-development-plan-r1 | /home/baris/UPRISE_NEXT | PR #198 https://github.com/ancientagent/UPRISE_NEXT/pull/198 | main | 8812a0b | merged | Codex local | Codex local; Codex subagents for read-only lane checks when useful | Create explicit UPRISE development plan and lightweight PM operating model from current main. | 2026-07-03 | merged via PR #198; remote branch deleted |
| reliant-development-plan-queue | branch | chore/reliant-development-plan-queue | /home/baris/UPRISE_NEXT | PR #199 https://github.com/ancientagent/UPRISE_NEXT/pull/199 | main | 2ce8684 | merged | Codex local | Codex local | Add Reliant queue tooling for the current UPRISE Development Plan R1 without executing queued slices. | 2026-07-03 | merged via PR #199; remote branch deleted |
| activation-readiness-transaction-revalidation | branch | test/activation-readiness-transaction-revalidation | /home/baris/UPRISE_NEXT | PR #206 https://github.com/ancientagent/UPRISE_NEXT/pull/206 | main | 88f97a1 | merged | Codex local | Codex local | UPRISE-PLAN-007: Activation readiness transaction revalidation closeout/hardening. | 2026-07-03 | merged via PR #206; remote branch deleted |
| tasks-1-7-closeout-refresh | branch | docs/tasks-1-7-closeout-refresh | /home/baris/UPRISE_NEXT | PR #207 https://github.com/ancientagent/UPRISE_NEXT/pull/207 | main | 0f7f100 | merged | Codex local | Codex local | Docs-only closeout after UPRISE-PLAN-001 through UPRISE-PLAN-007 merged; refresh Active PM and branch registry. | 2026-07-03 | merged via PR #207; remote branch deleted |
| activation-tuple-normalized-matching | branch | test/activation-tuple-normalized-matching | /home/baris/UPRISE_NEXT | PR #208 https://github.com/ancientagent/UPRISE_NEXT/pull/208 | main | d4dc636 | merged | Codex local | Codex local; Codex reviewer approved runtime change | UPRISE-PLAN-008: Activation tuple normalized matching closeout. | 2026-07-03 | merged via PR #208; remote branch deleted |
| feed-card-family-inventory | branch | docs/feed-card-family-inventory | /home/baris/UPRISE_NEXT | PR #209 https://github.com/ancientagent/UPRISE_NEXT/pull/209 | main | 68f978a | merged | Codex local | Codex local; Codex read-only subagents for UX_UI, ACTIONS_SIGNALS, EVENTS_ARCHIVE; Codex reviewer approved with low residual risks | Task 9: Feed card family inventory. Inventory current Feed runtime cards and classify launch/beta/source/remove; optional small regression locks only, no new runtime actions. | 2026-07-03 | merged via PR #209; remote branch deleted |
| task8-task9-goal-closeout | branch | docs/task8-task9-goal-closeout | /home/baris/UPRISE_NEXT | PR #210 https://github.com/ancientagent/UPRISE_NEXT/pull/210 | main | 50c6e8b | merged | Codex local | Codex local | Final docs-only closeout after UPRISE-PLAN-008 and Task 9 merged; refreshed Active PM and branch registry for completed goal. | 2026-07-03 | merged via PR #210; remote branch deleted |
| feature-plan-review-gate | branch | docs/feature-plan-review-gate | /home/baris/UPRISE_NEXT | PR #211 https://github.com/ancientagent/UPRISE_NEXT/pull/211 | main | 25e06a2 | merged | Codex local | Codex local | Added pre-implementation feature review and independent Codex development-plan review gates to UPRISE execution packet/readiness docs. | 2026-07-03 | merged via PR #211; remote branch deleted |
| source-listener-profile-boundary | branch | test/source-listener-profile-boundary | /home/baris/UPRISE_NEXT | - | main | pending | active | Codex local | Codex local | Task 11: harden Source Dashboard / listener profile separation contract locks; no runtime/provider/db/schema/art changes. | 2026-07-03 | update on PR/merge/close/delete |
| linear-clean-context-agent-roles | branch | docs/linear-clean-context-agent-roles | /home/baris/UPRISE_NEXT | PR #212 https://github.com/ancientagent/UPRISE_NEXT/pull/212 | main | 8d559b8 | open-pr | Codex local | Codex local | Draft PR #212: define Linear clean-context assigning/assigned agent roles and optional read-only excavator workflow; process docs only, intentionally not priority. | 2026-07-03 | leave open as draft until user prioritizes; do not merge or close without approval |
<!-- workspace-registry:end -->

## Remote-Only Historical Branches

Remote-only refs may predate this registry. Do not assume they are safe to delete. Use `node scripts/workspace-registry.mjs audit --include-remote` to list unregistered remote refs, then classify them in a dedicated cleanup pass before deletion.
