# 2026-04-14 — Action System Matrix Reconciliation

## Summary
Captured a new founder-level matrix for class taxonomy, action grammar, and version-scoped known instances:

- `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`

This pass was needed because older active docs were no longer coherent with the latest founder direction on:
- `Collect` vs `Add`
- `React` vs `Support`
- `flyer` as event-bound artifact rather than default signal
- `event` as object rather than source
- Registrar as listener-side in the intended model
- source-family grouping (`creator`, `organizer`, `entity`, `scene body`)
- current-vs-later handling for `ambassador`, `venue`, business promos, and contributor lanes

## What Changed
- Added `docs/solutions/MVP_ACTION_SYSTEM_MATRIX_R1.md`.
- Added solution-index entry in `docs/solutions/README.md`.
- Added explicit precedence/reconciliation notes to:
  - `docs/solutions/MVP_SIGNAL_SYSTEM_CONTRACT_R1.md`
  - `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`

## Locked Direction
### Direct live actions
- `Follow`
- `Donate`
- `Collect`
- `Blast`
- `Recommend`
- `Rock`
- `Add` (events/calendar only)
- `React`

### Non-live / special-case actions
- `Back` = Registrar-only prerequisite action
- `Support` = derived backing/activity state, not a direct button in the intended model

### Class placement
- `single`, `Uprise` => `signal`
- `flyer`, `poster`, `gear` => `artifact`
- `show`, `benefit show`, `afterparty`, `meet-and-greet` => `event`
- posts/comments/replies => `social post`

### Current source families
- `creator > artist`
- `organizer > promoter`
- `organizer > organizing group`
- `entity > business`
- `scene body > community`
- `scene body > sect`

## Reconciliation Still Pending
The new matrix is doctrine-first. Runtime/spec cleanup is not finished.

Known pending reconciliation:
1. runtime still contains direct `SUPPORT` actions/counters
2. active signal docs/specs still carry `flyer` as signal language
3. older docs still describe events as sources in some places
4. Registrar docs/runtime still carry source-facing bridge language that conflicts with the intended listener-side model
5. current docs/runtime still use `ADD` where the intended long-term keep/save verb is `Collect`

## Verification
- `pnpm run docs:lint`
- `git diff --check`
