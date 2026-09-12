# UPRISE Active PM

Status: active execution snapshot
Owner: context-steward for documentation routing; this label is not a writer lease
Last Updated: 2026-09-09

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
| Branch | `fable/handoff` at `cf815ddd16f9646c1579b7b3cb4af8bf5f97dc3d`; tracking `origin/fable/handoff`, clean and aligned (0 ahead / 0 behind) after this packet is pushed |
| Base | `main@ba969f8` |
| Scope | The Listener Profile design package remains the accepted baseline. Reduced-motion parity and the bounded pointer-gesture/focus/visibility correction are source-reviewed; current-revision browser confirmation remains pending. Landing Page + Launch Entry remains separately blocked on an approved Marketing brief and Manager disposition. |
| Owner | No active writer. The `listener-profile-return-visibility` record closed on the independent browser review PASS at `599c472e` (`.pm/checkins/2026-09-09/0543-listener-profile-independent-browser-review.md`). Any further work requires a fresh Manager packet and collision check. |
| Validation | Independent browser QA at `1f5308d1` returned three pre-existing gesture/focus findings; `9b4400ac` fixed them, `f9689745` added `pointercancel` cleanup, and `cf815ddd` adds post-return seam visibility handling. Source review PASS and focused suites (46 tests), web typecheck, `pnpm run verify`, workspace audit, and diff check passed. A read-only reviewer subagent (packet-only, no implementation context, spawned in the implementer's session) ran the browser review at `599c472e` and returned PASS at 1280x800 and 390x844 for mouse, emulated touch, keyboard, reduced motion, and visuals. Physical-device touch and screen-reader announcement proof remain unverified. |
| BUZZ Path | `PENDING`; no UPRISE-specific accepted transport path is recorded. |
| Out of Scope | Product behavior or decisions, canon, code, design implementation, marketing promises, providers, database/schema work, deployment, preserved-workspace extraction, and any second writer |

## Open Queue

| Work | State | Action |
| --- | --- | --- |
| Onboarding → Listener Profile | Interaction corrections browser-reviewed PASS at `599c472e`; writer record closed | No open action. Physical-touch and screen-reader evidence remain separate proof gaps; the Manager may require an external-session rerun if the subagent reviewer route does not meet the independence bar. |
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
