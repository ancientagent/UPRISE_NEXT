# UPRISE Active PM

Status: active execution snapshot
Owner: context-steward for documentation routing; this label is not a writer lease
Last Updated: 2026-09-01

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
| Branch | `fable/handoff` at `68efa16826ee7636d2702cf68c9144835e87380a`; tracking `origin/fable/handoff`, clean and aligned (0 ahead / 0 behind) at this refresh |
| Base | `main@ba969f8` |
| Scope | The Listener Profile design package remains the accepted baseline. A bounded Manager lease implemented reduced-motion parity for the existing expanded profile panel only; Landing Page + Launch Entry remains separately blocked on an approved Marketing brief and Manager disposition. |
| Owner | No active writer lease. The bounded Listener Profile reduced-motion lease closed at `df4a0054`; any further work requires a fresh Manager packet and collision check. |
| Validation | Source lock and four focused regression/contract suites passed (44 tests), and `pnpm --filter web typecheck` passed for the reduced-motion parity implementation. Browser QA has not run. |
| BUZZ Path | `PENDING`; no UPRISE-specific accepted transport path is recorded. |
| Out of Scope | Product behavior or decisions, canon, code, design implementation, marketing promises, providers, database/schema work, deployment, preserved-workspace extraction, and any second writer |

## Open Queue

| Work | State | Action |
| --- | --- | --- |
| Onboarding → Listener Profile | Design package baseline plus reduced-motion source parity; browser proof remains unverified | Run independent browser QA against `docs/screen-packages/listener-profile/` at the implementation commit before accepting the first-session slice as complete. |
| Landing Page + Launch Entry readiness | Blocked on required inputs | Marketing must provide an approved landing/content brief and the Manager must record disposition before design continuation or implementation. The existing prototype remains exploration evidence. |
| Hermes automation loadouts | Revalidation needed | Keep documented loadouts narrow; confirm any actually running profile before treating it as an owner. |
| City-tier RADIYO lifecycle worker | Durable manual capability implemented; still untriggered | Every direct internal run now uses a cross-instance durable lease and factual run record while orchestrating existing ingestion/graduation per active city-tier community. Defer runner activation, automatic retry, recurrence automation, and deployment. |

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
- RADIYO automatic polling, recurrence aggregation, automatic retry, and production deployment remain separate operational decisions. The durable manual run/lease capability is implemented but has no trigger.
- Preserved UX workspaces remain outside the current scope.

## Next Signal

1. Complete independent browser QA for the Listener Profile package and reduced-motion parity at the implementation commit; a dedicated authorized UPRISE browser target is required. Do not treat source tests/typecheck as browser proof.
2. Separately, Marketing supplies an approved landing/content brief through the
   Manager before any Landing design continuation or implementation.
3. Retain the durable manual lifecycle seam as untriggered; do not activate a
   runner without explicit approval for its operational model.
4. Keep the preserved UX references and unresolved Prisma draft untouched until
   a dedicated review assigns them.

## Agent Rules

- Load `docs/agent-briefs/CONTEXT_ROUTER.md` for product-lane work.
- Use `docs/operations/BRANCH_WORKSPACE_REGISTRY.md` for current ownership and
  preservation intent.
- Do not add merged PR history or remote-ref inventories here.
- Refresh this file only when current work, blockers, preserved-risk
  workspaces, or the immediate next signal changes.
