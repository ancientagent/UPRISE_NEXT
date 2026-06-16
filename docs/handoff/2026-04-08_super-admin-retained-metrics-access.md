# Super Admin Retained Metrics Access

Date: 2026-04-08
Branch: feat/ux-founder-locks-and-harness

## Summary
- Locked the rule that if a metric can be tracked cleanly and has operational, audit, admin, or future analytics value, it should be retained even when not surfaced publicly in MVP UI.
- Locked that Super Admin access is broader than MVP display scope and includes retained hidden metrics.

## Updated authorities
- `docs/solutions/MVP_STATS_FOUNDER_LOCK_R1.md`
- `docs/specs/admin/super-admin-controls.md`

## Effect
- Current MVP public stats surfaces stay narrow.
- Super Admin retains access to:
  - surfaced MVP metrics
  - hidden retained metrics
  - tier-level metrics
  - platform-wide metrics
  - future-domain analytics inputs where the platform is already capable of tracking them

## Boundary
- This does not create new public MVP stats surfaces.
- This does not authorize metrics to alter Fair Play, governance, legitimacy, or ranking.
