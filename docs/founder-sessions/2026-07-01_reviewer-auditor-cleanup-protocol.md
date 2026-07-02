# Reviewer/Auditor Cleanup Protocol Founder Session

Status: raw founder-session capture
Date: 2026-07-01
Source: current chat/session
Related lane(s): context-steward, branch-hygiene, external-agent-review
Owner spec candidates: docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md, docs/specs/system/documentation-framework.md, docs/operations/ACTIVE_PM.md

## Raw Founder Notes

> sorry i missed the audit earlier, i confirm the delete, please do this for all branches.  this is the new protocol for work like this, large refactors, complex isseuws etc need to be checked by a reviewer/audito etc

## Clarifications

- Branch cleanup after broad/complex work should not rely only on the implementation agent's local judgment; for large refactors, complex issues, or uncertain branch absorption, use an independent reviewer/auditor check before delete/merge decisions.
- Type: settled
- Likely owner: docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md and docs/specs/system/documentation-framework.md; keep this founder-session note as the raw wording behind the promoted protocol.

- The approved deletion applied to the audited absorbed branches only: `docs/active-pm-post-context-panel-removal`, `docs/active-pm-refresh-after-plot-cleanup`, `docs/discover-transport-owner-spec-promotion`, and `refactor/plot-community-context-panel`.
- Type: implementation detail
- Likely owner: git branch state / branch hygiene history, not product specs.

## Feature Sets

- Reviewer/auditor gate for complex cleanup
- Raw basis: “large refactors, complex isseuws etc need to be checked by a reviewer/audito etc”
- Included behavior:
  - Use a Hermes reviewer/auditor, Cloud Codex review, or equivalent independent lane review for broad refactors, complex issues, branch absorption uncertainty, or cleanup with possible product/spec impact.
  - Keep tiny surgical docs/local cleanup PRs lightweight when risk is demonstrably low.
  - Branch deletion should follow an explicit classify-first flow: absorbed, superseded, preserve-only, or extract-only.
- Excluded / not activated:
  - This does not require reviewer + QA gates for every small PR.
  - This does not authorize deleting preserved UX/reference worktrees or prototype branches without explicit approval.
- Status: settled as workflow guidance; promoted into the AI stack and documentation-framework owner docs by this PR.

## Working Interpretation

- The branch cleanup we just performed followed this protocol: local branch audit first, Hermes `upriseauditor` absorption review second, then deletion only after founder approval.
- Future large refactors and complex issue cleanups should use this as the expected pattern.
- The independent review should classify branch/work content before merge/delete, not just approve final code.

## Promotion Targets

- Owner spec: `docs/specs/system/documentation-framework.md` if the conditional review gate needs stronger wording later.
- Lane brief / workflow map: `docs/solutions/UPRISE_AI_STACK_AND_AGENT_LANES_R1.md` if external-agent routing needs an explicit “complex cleanup requires independent review” sentence.
- Runtime/tests: none.
- Linear/PM: `docs/operations/ACTIVE_PM.md` may mention reviewer/auditor gate only when it affects current execution state.

## Do Not Drift

- Do not delete branches from a broad refactor or complex issue just because they look stale from file names.
- Do not merge prototype/reference branches wholesale.
- Do not treat a single implementation agent's summary as enough when branch content may contain unabsorbed product/spec/runtime work.
- Do not add heavyweight reviewer/QA gates to every tiny docs-only cleanup; apply the gate when risk, complexity, or cross-lane impact justifies it.
