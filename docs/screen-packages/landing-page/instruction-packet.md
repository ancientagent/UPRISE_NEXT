# Instruction Packet: Landing Page + Launch Entry Readiness

Status: blocked input packet; no design or implementation authority
Lane: `uprise-design-ui` after Marketing and Manager gates pass
Disposition owner: `🟣 UPRISE • Manager • Active`

## Goal

Turn accepted Marketing and Manager inputs into one bounded Landing Page +
Launch Entry design-package slice without inventing product truth or treating
the existing prototype as approval.

## Evidence And Authority Classification

- `.pm/checkins/2026-08-19/1010-reconcile-design-room.md`: operational evidence
  that a prototype was reported and a durable handoff was missing.
- `.pm/checkins/2026-08-19/1118-activate-marketing-head.md`: operational evidence
  that Marketing owns landing/content briefs while the Manager owns promises,
  timing, and disposition.
- `.pm/PROJECT_CREW.md` and `.pm/WORK_CYCLE.md`: current role and handoff routing.
- `docs/specs/system/documentation-framework.md`: documentation authority and
  screen-package rules.

These are routing inputs. The screen package is execution history, not product
authority.

## Must Read After Unblocking

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/specs/system/documentation-framework.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- `docs/agent-briefs/EXTERNAL_TOOLS.md`
- `docs/agent-briefs/UI_CURRENT.md`
- the exact approved Marketing brief
- the exact Manager disposition
- only the owner specs and founder locks named by that disposition

## Inputs Required To Unblock

1. Exact repo path to the approved Marketing landing/content brief.
2. Manager disposition accepting or returning that brief.
3. Exact prototype/artifact path or URL, revision, and accepted/rejected state.
4. One small vertical design slice with explicit acceptance criteria.

## First Allowed Output

After all inputs exist, the assigned design-package worker may add a concise
source map and one bounded design handoff for the accepted slice. It must state:

- the approved audience and purpose;
- source paths for every permitted product claim;
- prototype evidence and its status;
- visible hierarchy and states supported by the accepted brief;
- unresolved product or marketing questions returned to the Manager;
- validation and review expectations.

Any accepted durable cross-system rule must be promoted to its one owner spec;
it must not live only in this package.

## Out Of Scope

- Product contracts, routes, navigation, transition behavior, or action grammar
  not named by current owner authority.
- Marketing promises, pricing, launch timing, or public claims not accepted by
  the Manager.
- Design implementation, code, providers, database/schema work, deployment, or
  production/launch verification.
- Treating prototype, chat, memory, or external-tool output as approval.

## Stop Conditions

- The approved Marketing brief or Manager disposition is absent.
- Prototype identity or accepted/rejected state cannot be verified.
- The slice requires a product decision, new public promise, route, action,
  provider, database/schema change, or implementation.
- Another writer owns the checkout or Git no longer matches the assigned packet.

## Completion Routing

Reviewer/disposition owner: `🟣 UPRISE • Manager • Active`.

A factual `.pm/checkins/**` entry is required for a material readiness, design,
promotion, or implementation result. The check-in must name the branch/commit,
evidence, authority classification, conflicts, durable destination, blockers,
and Manager attention.
