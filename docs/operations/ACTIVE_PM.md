# UPRISE Active PM

Status: active execution snapshot
Owner: current branch owner / context-steward
Last Updated: 2026-08-16

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
| Branch | `fable/handoff` @ `5e6781e` |
| Base | `main@ba969f8` |
| Scope | Preserve the Fable handoff and current narrow Hermes automation loadouts; prepare the city-tier RADIYO worker contract and implement only the untriggered, no-schema Slice A. |
| Owner | Codex local, sole writer |
| Validation | Hermes profile tool/skill checks and fresh HY3 smoke calls; `pnpm run docs:lint`, `pnpm run workspace:audit`, `git diff --check` |
| Out of Scope | Product behavior, canon, legacy-document deletion, preserved UX extraction, provider/database changes, automatic polling/cron, recurrence automation, durable lease schema, and production deployment |

## Open Queue

| Work | State | Action |
| --- | --- | --- |
| Hermes automation loadouts | Active | Keep HY3 planner/auditor/reviewer/watchdog profiles narrow and use their documented loadouts only. |
| City-tier RADIYO lifecycle worker | Active | Fresh trace and HY3 audit confirm scheduling/manual ingestion/manual graduation exist but no worker invokes them. Owner spec now permits a bounded untriggered worker seam; defer runner activation and durable lease/run persistence. |

## Preserved Workspaces

| Path / Branch | State | Reason |
| --- | --- | --- |
| `/home/baris/UPRISE_NEXT_uximpl` / `ux-implementation` | Preserved | Broad Plot/profile/player/source-dashboard reference; extract intentionally, never merge wholesale. |
| `/home/baris/UPRISE_NEXT_uxmobile` / `ux-mobile-r1-build` | Preserved | Mobile-first UX reference; extract intentionally, never merge wholesale. |
| `feat/ux-batch17` | Preserved branch | Historical UX/Reliant batch reference. |
| `feat/ux-batch18-run` | Preserved branch | Historical UX/Reliant batch reference. |
| `codex/propose-prisma-schema-migration` | Preserved branch | Unmerged unique schema/spec draft; no cleanup decision in this pass. |

## Blockers

- No active blocker for the tooling update.
- RADIYO Slice A must not activate automatic polling, recurrence aggregation, or production deployment; durable run/lease persistence remains a separate schema/operations decision.
- Preserved UX workspaces remain outside the current scope.

## Next Signal

1. Validate the current agent-loadout update and preserve its handoff.
2. Implement the approved untriggered RADIYO worker Slice A from the fresh packet.
3. Keep the preserved UX references and unresolved Prisma draft untouched until
   a dedicated review assigns them.

## Agent Rules

- Load `docs/agent-briefs/CONTEXT_ROUTER.md` for product-lane work.
- Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for current ownership and
  preservation intent.
- Do not add merged PR history or remote-ref inventories here.
- Refresh this file only when current work, blockers, preserved-risk
  workspaces, or the immediate next signal changes.
