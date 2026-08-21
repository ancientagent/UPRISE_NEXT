# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-08-21

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
| Branch | `fable/handoff`, starting baseline `66afd375`; tracks `origin/fable/handoff` and was clean/aligned 0/0 at packet start |
| Base | `main@ba969f8` |
| Scope | Register the Context Steward, reconcile current room/workspace routing, and create a readiness-only Landing Page + Launch Entry package shell. |
| Owner | Context Steward is the sole writer for this one documentation packet. The lease ends with its scoped pushed commit; no standing writer follows it. |
| Validation | `pnpm run docs:lint` passed (including 10-file canon lint); `pnpm run workspace:audit` passed with one unregistered open-PR head warning and one unregistered local-ref warning; `git diff --check` exited 0 with line-ending warnings only. Commit, push, and clean-worktree proof remain the closeout gate. |
| Out of Scope | Product behavior or decisions, canon, code, design implementation, marketing promises, providers, database/schema work, deployment, preserved-workspace extraction, and any second writer |

## Open Queue

| Work | State | Action |
| --- | --- | --- |
| Landing Page + Launch Entry readiness | Blocked on required inputs | Marketing must provide an approved landing/content brief and the Manager must record disposition before design continuation or implementation. The existing prototype remains exploration evidence. |
| Hermes automation loadouts | Revalidation needed | Keep documented loadouts narrow; confirm any actually running profile before treating it as an owner. |
| City-tier RADIYO lifecycle worker | Complete (Slice A) | Internal untriggered worker now orchestrates existing ingestion/graduation per active city-tier community. Fresh HY3 review passed. Defer runner activation, recurrence automation, and durable lease/run persistence. |

## Preserved Workspaces

| Path / Branch | State | Reason |
| --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` / `ux-implementation` | Preserved | Broad Plot/profile/player/source-dashboard reference; extract intentionally, never merge wholesale. |
| `/home/baris/UPRISE_NEXT_uxmobile` / `ux-mobile-r1-build` | Preserved | Mobile-first UX reference; extract intentionally, never merge wholesale. |
| `feat/ux-batch17` | Preserved branch | Historical UX/Reliant batch reference. |
| `feat/ux-batch18-run` | Preserved branch | Historical UX/Reliant batch reference. |
| `codex/propose-prisma-schema-migration` | Preserved branch | Unmerged unique schema/spec draft; no cleanup decision in this pass. |

## Blockers

- No repo-owned approved Marketing landing/content brief was found for the
  Landing Page + Launch Entry package.
- Manager disposition is required after that brief exists and before design
  continuation or implementation.
- RADIYO automatic polling, recurrence aggregation, production deployment, and durable run/lease persistence remain separate schema/operations decisions.
- Preserved UX workspaces remain outside the current scope.

## Next Signal

1. Marketing supplies an approved landing/content brief through the Manager.
2. The Manager records disposition and, if accepted, issues the next bounded
   Landing Page + Launch Entry design-package packet.
3. Retain Slice A as an untriggered internal seam; do not activate a runner
   without a durable lease/run design and explicit approval.
4. Keep the preserved UX references and unresolved Prisma draft untouched until
   a dedicated review assigns them.

## Agent Rules

- Load `docs/agent-briefs/CONTEXT_ROUTER.md` for product-lane work.
- Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for current ownership and
  preservation intent.
- Do not add merged PR history or remote-ref inventories here.
- Refresh this file only when current work, blockers, preserved-risk
  workspaces, or the immediate next signal changes.
