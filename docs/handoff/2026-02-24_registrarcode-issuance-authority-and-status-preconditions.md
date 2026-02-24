# 2026-02-24 — RegistrarCode Issuance Authority and Status Preconditions (P3-REV-001)

## Scope
- Resolve the Phase 3 policy ambiguity blocking `RegistrarCode` foundation work:
  - who is authorized to issue a registrar capability code,
  - which registrar-entry status is required before issuance.
- Keep this as policy lock only (no endpoint/model implementation in this memo).

## Inputs Reviewed
- `docs/handoff/2026-02-24_platform-mvp-roadmap-phase3-kickoff.md`
- `docs/specs/system/registrar.md`
- `docs/specs/users/identity-roles-capabilities.md`
- `docs/canon/Master Narrative Canon.md` (Registrar section)
- `docs/canon/Legacy Narrative plus Context .md` (Registrar receive-code flow)

## Decision (Locked)
1. `RegistrarCode` issuance authority is **system-only**.
2. Issuance is performed by trusted API-tier registrar code paths only (not client-provided issuer identity, not user self-issuance).
3. Issuance status precondition is `RegistrarEntry.status = approved`.
4. For Phase 3 kickoff, this lock applies to promoter capability code flows tied to `RegistrarEntry.type = promoter_registration`.

## Rationale
- Preserves registrar as a civic gate with explicit authority boundaries.
- Prevents self-escalation risk from user-issued capability codes.
- Keeps capability grant progression aligned with existing initiation-only promoter flow (`submitted` is not grant-ready).
- Aligns with additive sequencing: schema/service foundation can proceed now, while state transitions and visibility are handled in subsequent slices.

## Consequences for Slice Planning
- Slice 89 (`RegistrarCode` foundation) should encode issuer provenance as internal/system actor and model compatibility with `approved`-gated issuance.
- Slice 90 (verification/redemption path) should treat non-approved-linked codes as non-issuable.
- Slice 91 (promoter capability transition states) owns submitter/admin status transitions into `approved` and associated visibility.

## Validation
- `pnpm run docs:lint` — passed.
- `pnpm run infra-policy-check` — passed.
- `rg -n "Coming Soon|\\bJoin\\b|\\bUpgrade\\b" <touched-docs>` — one historical changelog match only (`docs/CHANGELOG.md` existing legacy line), no new placeholder CTA semantics introduced by this task.

## Out of Scope (Unchanged)
- No approval workflow endpoint additions in this memo.
- No promoter capability grant implementation in this memo.
- No web CTA/surface expansion in this memo.
