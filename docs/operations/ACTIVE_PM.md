# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-07-23

## Purpose

Use this file only for current work, blockers, preserved-risk workspaces, and
the next execution signal. It is not product doctrine, merge history, or a
remote-branch inventory.

Git and GitHub own live branch, PR, check, and merge state. Durable product
truth remains in owner specs under `docs/specs/**`, with current code and tests
as implementation evidence.

## Current Work

| Field | Current Value |
| --- | --- |
| Branch | `codex/workflow-policy-simplification` |
| Base | `main@a108bdf` |
| Scope | Reduce documentation and branch-management ceremony while preserving repo authority, active workspace safety, and protected UX references. |
| Owner | Codex local, sole writer |
| Validation | `pnpm run docs:lint`, `pnpm run workspace:audit`, focused registry-script checks, `git diff --check` |
| Out of Scope | Product behavior, canon, owner-spec semantics, legacy-document deletion, preserved UX extraction, and provider/database changes |

## Open Queue

| PR / Branch | State | Action |
| --- | --- | --- |
| PR #212 / `docs/linear-clean-context-agent-roles` | Draft, conflicting, deprioritized | Classify during the approved historical cleanup; do not merge as-is. |

## Preserved Workspaces

| Path / Branch | State | Reason |
| --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` / `ux-implementation` | Preserved | Broad Plot/profile/player/source-dashboard reference; extract intentionally, never merge wholesale. |
| `/home/baris/UPRISE_NEXT_uxmobile` / `ux-mobile-r1-build` | Preserved | Mobile-first UX reference; extract intentionally, never merge wholesale. |
| `feat/ux-batch17` | Preserved branch | Historical UX/Reliant batch reference. |
| `feat/ux-batch18-run` | Preserved branch | Historical UX/Reliant batch reference. |
| `codex/founder-regenerative-ownership-capture` | Review needed | Local founder-session source checkpoint; classify before deletion. |

## Blockers

- None for the workflow-policy slice.
- Branch deletion still requires verified merge/supersession evidence.
- Preserved UX workspaces remain outside cleanup scope.

## Next Signal

1. Validate and merge the workflow-policy simplification.
2. Run the approved historical branch inventory against the merged policy.
3. Delete only refs proven merged or superseded; preserve unknown or protected
   work.

## Agent Rules

- Load `docs/agent-briefs/CONTEXT_ROUTER.md` for product-lane work.
- Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for current ownership and
  preservation intent.
- Do not add merged PR history or remote-ref inventories here.
- Refresh this file only when current work, blockers, preserved-risk
  workspaces, or the immediate next signal changes.
