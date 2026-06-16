# 2026-03-22 — narrative reconciliation gap report

## Scope
Completed a docs-only reconciliation pass across the required narrative source set to classify what was already locked in repo canon, what legacy canon still should have been carried forward, what the external comparison file only clarifies, and what remains unresolved.

## Files Added
- `docs/solutions/NARRATIVE_RECONCILIATION_GAP_REPORT_R1.md`

## Files Updated
- `docs/CHANGELOG.md`

## Key Findings
- The biggest misses were not new ideas from the external file. They were already-present repo-canon items that had been narrowed away: nearest-active onboarding fallback with preserved pioneer intent, tuning into Uprises rather than abstract Scenes, two-pool Fair Play with propagation separated from recurrence, Registrar scope beyond artist intake, event-bound Print Shop rules, and Activity Points non-authority.
- Legacy canon still carries operational detail that is easy to lose if only the newer master canon is read: Discover access/gating, Personal Play and collection persistence, communication boundaries, and named V2 collaborative constructs.
- The external file is useful as a comparison source for notifications, profiles, search, and a fuller inactive-scene onboarding sequence, but it also contains details that should not be treated as active behavior because they conflict with repo canon or exceed it.
- Open founder-decision items remain open in current repo canon and were not resolved by this pass.

## Founder-Lock Items Still Open
- Mid-rotation removal cooldown semantics
- Activity Points decay versus cumulative behavior and seasonality
- Moderation restriction duration, appeal flow, and report thresholds
- Additional unresolved items flagged inside `How Uprise Works — Canon Audit (working)`

## Verification
- `pnpm run docs:lint` — passed
- `pnpm run infra-policy-check` — passed
