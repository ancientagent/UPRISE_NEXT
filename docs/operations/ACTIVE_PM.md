# UPRISE Active PM

Status: active execution snapshot
Owner: context-steward for documentation routing; this label is not a writer lease
Last Updated: 2026-08-27

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
| Branch | `fable/handoff`; this Phase 0 routing correction started clean and aligned 0/0 at `05f1b92e`; Git owns the live revision |
| Base | `main@ba969f8` |
| Scope | The Manager-approved Phase 0 routing correction is complete: the next product slice is `Onboarding → Listener Profile`. This is execution sequencing only and authorizes no design package or implementation. Landing Page + Launch Entry remains separately blocked on an approved Marketing brief and Manager disposition. |
| Owner | No active writer and no standing writer lease. The Context Steward held only this bounded documentation lease; every subsequent writer requires a fresh Manager lease. |
| Validation | The Phase 0 routing correction passed `pnpm run docs:lint`, `pnpm run workspace:audit`, focused diff review, and `git diff --check`; its factual check-in and Manager closeout carry scoped commit/push and clean/aligned evidence. |
| BUZZ Path | `PENDING`; no UPRISE-specific accepted transport path is recorded. |
| Out of Scope | Product behavior or decisions, canon, code, design implementation, marketing promises, providers, database/schema work, deployment, preserved-workspace extraction, and any second writer |

## Open Queue

| Work | State | Action |
| --- | --- | --- |
| Onboarding → Listener Profile | Phase 0 routing approved; no design package or active lease | The Manager may issue a separate design-package lease for `docs/screen-packages/listener-profile/`; Design remains read-only until then. |
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

1. The Manager may issue a separate design-package lease for `Onboarding →
   Listener Profile`; until then, Design remains read-only and no package is
   authorized.
2. Separately, Marketing supplies an approved landing/content brief through the
   Manager before any Landing design continuation or implementation.
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
