# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-08-18

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
| Branch | `fable/handoff` @ `87fffe80`; tracks `origin/fable/handoff` |
| Base | `main@ba969f8` |
| Scope | Reconcile the existing dirty checkout and missing upstream, then appoint the next narrow project-native manager seat. The latest OSS fit audit was read-only and is complete. |
| Owner | No write-enabled owner confirmed. Codex OSS auditor is read-only/resumable. |
| Validation | Scoped onboarding diffs pass `git diff --check`; no clean-worktree, push, PR, deployment, or full-project verification is claimed. |
| Out of Scope | New product behavior, canon changes, legacy-document deletion, preserved UX extraction, provider/database changes, automatic polling/cron, recurrence automation, durable lease schema, and production deployment |

## Open Queue

| Work | State | Action |
| --- | --- | --- |
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

- The checkout contains pre-existing modified and untracked work. Ownership and
  intended disposition must be reconciled before implementation.
- RADIYO automatic polling, recurrence aggregation, production deployment, and durable run/lease persistence remain separate schema/operations decisions.
- Preserved UX workspaces remain outside the current scope.

## Next Signal

1. Reconcile the dirty checkout, intended upstream, current room ownership, and
   the latest relevant check-ins.
2. Appoint a narrow manager seat using `.pm/AGENT_ONBOARDING.md` before assigning
   a write-enabled executor.
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
