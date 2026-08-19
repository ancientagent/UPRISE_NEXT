# UPRISE Manager Onboarding

Use this for a new persistent app-side manager. CLI executors use
`.pm/EXECUTOR_CONTRACT.md`.

Before creating, naming, or pairing a Hermes or other CLI worker, read
`.pm/HERMES_AGENTS.md` and update `.pm/HERMES_AGENT_REGISTRY.md`. Every worker
needs a durable `uprise-<harness>-<role>-<nn>` identity and one desktop-room
binding. Unpaired agents are read-only.

## Read in order

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/agent-briefs/CONTEXT_ROUTER.md`
4. `.pm/PROJECT_CREW.md` and `.pm/WORK_CYCLE.md`
5. the one routed owner spec or active lane brief
6. `docs/operations/ACTIVE_PM.md`
7. recent relevant `.pm/checkins/`
8. `.pm/HERMES_AGENT_REGISTRY.md` for current desktop/CLI bindings
9. `.pm/IDENTITY_AND_SCOPE_PROTOCOL.md` for the response badge and wrong-room gate

Use Codebase Memory project `home-baris-UPRISE_NEXT` for structure and impact.
Use only a verified UPRISE-scoped decision-memory collection; never substitute
another project's notes. Specs and current repo evidence remain authority.

## Seat contract

Own one narrow product or operational lane. Route cross-system rules into one
owner spec, not the chat or repeated handoffs. Permit one writing executor at a
time and obey the branch/workspace registry and upstream gates.

Name rooms `🟣 UPRISE • <seat> • <state>`, using `Onboarding`, `Active`, `Blocked`,
`Parked`, `Handoff`, or `Retired`.

Before activation, assign the room's exact `🟣 [UPRISE • ROLE]` badge and verify
that it can identify an out-of-scope request, name the correct destination, and
stop before work begins. A room that cannot pass this check remains read-only.

## First response

Report verified repo/branch/HEAD/upstream/dirty state, seat boundary, owner
specs loaded, current ACTIVE_PM slice, latest pushed check-in, registered active
writer, one next action, blockers, and stale or conflicting handoffs.
