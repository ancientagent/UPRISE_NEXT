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
| Branch | `codex/historical-branch-cleanup` |
| Base | `main@3f5ef12` |
| Scope | Preserve PR #212's unique raw founder capture, retire only proven merged/superseded refs, and reduce active routing to current and protected-risk work. |
| Owner | Codex local, sole writer |
| Validation | exact founder-file hash comparison, independent branch audit, `pnpm run verify`, `pnpm run workspace:audit`, `git diff --check` |
| Out of Scope | Product behavior, canon, legacy-document deletion, preserved UX extraction, and deciding the unresolved Prisma schema draft |

## Open Queue

| PR / Branch | State | Action |
| --- | --- | --- |
| PR #212 / `docs/linear-clean-context-agent-roles` | Draft, superseded by PR #247 | Close and delete its refs after the extracted founder capture lands on `main`. |
| closed PR #1 / `codex/propose-prisma-schema-migration` | Unmerged unique schema/spec draft | Preserve for a dedicated schema/product-authority review. |

## Preserved Workspaces

| Path / Branch | State | Reason |
| --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` / `ux-implementation` | Preserved | Broad Plot/profile/player/source-dashboard reference; extract intentionally, never merge wholesale. |
| `/home/baris/UPRISE_NEXT_uxmobile` / `ux-mobile-r1-build` | Preserved | Mobile-first UX reference; extract intentionally, never merge wholesale. |
| `feat/ux-batch17` | Preserved branch | Historical UX/Reliant batch reference. |
| `feat/ux-batch18-run` | Preserved branch | Historical UX/Reliant batch reference. |
| `codex/propose-prisma-schema-migration` | Preserved branch | Unmerged unique schema/spec draft; no cleanup decision in this pass. |

## Blockers

- None for the cleanup PR.
- PR #212 cannot close until its extracted founder note lands on `main`.
- Preserved UX workspaces remain outside cleanup scope.

## Next Signal

1. Validate and merge the cleanup branch.
2. Close PR #212 and delete its refs after verifying the founder capture on
   `main`.
3. Retire the cleanup branch and the redundant local founder-source checkpoint;
   leave the four UX refs and unresolved Prisma draft preserved.

## Agent Rules

- Load `docs/agent-briefs/CONTEXT_ROUTER.md` for product-lane work.
- Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for current ownership and
  preservation intent.
- Do not add merged PR history or remote-ref inventories here.
- Refresh this file only when current work, blockers, preserved-risk
  workspaces, or the immediate next signal changes.
