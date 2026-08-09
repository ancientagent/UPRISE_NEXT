# City-Tier RADIYO Lifecycle Slice A Preview Coordinator

**Date:** 2026-08-02
**Branch:** `codex/classic-avatar-asset-production`
**Phase:** local no-schema preview checkpoint
**Deployment target:** none
**Status:** implemented and independently reviewed

## Delivered

`RadiyoLifecyclePreviewCoordinator` is a local Nest provider with an explicit
`runOnce()` method. It has no route, application lifecycle hook, timer, worker
process, or other runtime caller.

For one injected UTC clock value, it:

1. selects only active city-tier communities in deterministic `state`, `city`,
   `musicCommunity`, `id` order;
2. invokes the current ingestion and graduation services with `dryRun: true`;
3. records each preview result or stage failure without blocking later work;
4. reports recurrence as `deferred_no_preview_api`.

## Explicit Non-Goals

- No direct lifecycle writes or transactions in the coordinator.
- No recurrence invocation; its current API mutates rotation rows and lacks
  durable 48-hour cadence state.
- No controller, startup hook, API timer, dedicated worker, schema, migration,
  provider configuration, deployment, staging, Sect, voting, propagation, or
  state/national behavior.

## Validation

- Focused API tests: coordinator, Fair Play module, ingestion, and graduation:
  22 tests passed.
- `pnpm --filter api typecheck`: passed.
- `pnpm run docs:lint`: passed.
- `pnpm run workspace:audit`: passed.
- `git diff --check`: passed.
- Independent Sol code review: passed with no findings.

## Next Gate

Do not start Slice B until a dedicated owner-contract promotion and schema
migration approval define durable run/lease identity, atomic claims, completion,
failure, retry, stale-lease expiry, and real-Postgres concurrency evidence.
