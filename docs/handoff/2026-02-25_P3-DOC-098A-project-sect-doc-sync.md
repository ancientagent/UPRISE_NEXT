# 2026-02-25 — P3-DOC-098A: Project + Sect Registrar Doc Sync

> **Sect authority correction (2026-07-14):** This historical sync accurately
> records the legacy `sect_motion` skeleton, but its approval/pending-threshold
> framing is superseded. Current authority is listener request, five eligible
> Artist/Band memberships for legitimacy, and `45` current eligible minutes
> after the `15`-minute/source cap for active state, with no routine approval.

## Updated Docs
- `docs/specs/system/registrar.md`
  - marked project submit primitive as implemented (slice 98A)
  - marked sect-motion submit skeleton as implemented (slice 99A)
  - kept project activation lifecycle deferred; the former Sect approval-state interpretation is superseded by the correction above
- `docs/specs/communities/scenes-uprises-sects.md`
  - added implemented note for sect-motion registrar submission skeleton
  - historical threshold/approval-pending language is superseded by the correction above
- `docs/CHANGELOG.md`
  - added entries for slices 98A/99A plus QA handoff

## Handoff Artifacts Added
- `docs/handoff/2026-02-25_P3-WEB-098A-project-contract-scaffolding.md`
- `docs/handoff/2026-02-25_P3-QA-098A-project-sect-validation.md`
- `docs/handoff/2026-02-25_P3-REV-098A-project-sect-risk-signoff.md`

## Validation Reference
- Validation command outputs captured in:
  - `docs/handoff/2026-02-25_P3-QA-098A-project-sect-validation.md`
