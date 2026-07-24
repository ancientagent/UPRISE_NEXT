# Handoff

Handoffs are temporary execution evidence. They are lower authority than
`AGENTS.md`, owner specs, current code, and tests.

## Create A Handoff Only For

- unresolved work that another owner must continue;
- meaningful multi-agent reconciliation or carry-forward corrections;
- provider/schema incidents whose evidence must survive the PR;
- material QA evidence that cannot be represented by tests or the PR itself.

## Do Not Create A Handoff For

- routine single-owner PR summaries or successful closeout;
- validation output already visible in CI;
- branch-registry, `ACTIVE_PM`, or changelog refreshes;
- product rules that belong in an owner spec;
- another copy of a prompt, plan, review, or decision stored elsewhere.

## Reading Rules

- Search by topic; do not bulk-load this directory.
- Prefer owner specs and current runtime evidence.
- Treat a handoff as stale when current `HEAD` contradicts it.
- Promote accepted durable decisions into the relevant owner spec and leave
  the handoff as history.

Examples:

```bash
rg -n "discover|plot|onboarding|registrar" docs/handoff
find docs/handoff -maxdepth 1 -type f | sort | tail -n 40
```

## Templates

- [`TEMPLATE_agent-handoff.md`](./TEMPLATE_agent-handoff.md)
- [`TEMPLATE_handoff-phase.md`](./TEMPLATE_handoff-phase.md)

## Coordination Control Plane

- [`agent-control/README.md`](./agent-control/README.md)
- [`agent-control/AGENT_DIRECTIVES.md`](./agent-control/AGENT_DIRECTIVES.md)

Older files remain searchable historical evidence and are not default reading.
