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
| Branch | `codex/classic-avatar-asset-production` |
| Base | `main@ba969f8` |
| Scope | Lock the classic illustrated Plot/Home Scene avatar direction and produce a small modular construction proof under `art/avatar-system/`. |
| Owner | Codex local, sole writer |
| Validation | founder Gate 1 record, source-reference inspection, consistent-scale construction sheet, crop/readability review, `pnpm run docs:lint`, `pnpm run workspace:audit` |
| Out of Scope | Avatar editor/runtime, persistence/API work, full beta catalog, Personal Space implementation, public Artist Profile headshots, and the unresolved Prisma draft |

## Open Queue

| PR / Branch | State | Action |
| --- | --- | --- |
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

- None for the first avatar construction proof.
- Preserved UX workspaces remain outside cleanup scope.

## Next Signal

1. Record the founder's classic Plot/Home Scene style selection.
2. Create one bounded Stage 2 modular construction proof using the existing
   avatar contract and production matrix.
3. Stop for founder Gate 2 approval before creating the beta catalog.

## Agent Rules

- Load `docs/agent-briefs/CONTEXT_ROUTER.md` for product-lane work.
- Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for current ownership and
  preservation intent.
- Do not add merged PR history or remote-ref inventories here.
- Refresh this file only when current work, blockers, preserved-risk
  workspaces, or the immediate next signal changes.
