# 2026-04-10 — Archive Community Info And Sect Tag Reconciliation

> **Sect authority correction (2026-07-14):** The former artist-initiated
> motion framing in this historical handoff is superseded. Current authority is
> listener request followed by Registrar-held Artist/Band membership and
> current member-artist Release Deck thresholds.

## Summary
- Locked the direction that the dry `Statistics` surface should give way to `Archive/community information` as the broader community-information area.
- Locked that `Registrar` should live inside `Archive/community information` as a feature/module with `Register` as the primary CTA, not as its own peer default-screen section.
- Reconciled sect language so new MVP work stops treating taste-tag structures as the live sect substrate.

## Key Founder Direction Captured
- Sects begin as Home Scene listener requests; eligible registered Artist/Band
  sources support them by becoming members.
- The older tag-based sect substrate should not drive new MVP work.
- Follow relationships should replace taste-tag association as the active audience-affinity/discovery layer around sects.

## Boundary
- Existing `SectTag`, `UserTag`, `homeSceneTag`, and `tasteTag` fields/models remain present in runtime/schema as terminology/runtime debt.
- This slice does not remove those tables or fields.
- It changes what future agents should treat as the authoritative product model.

## Files Reconciled
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`
- `docs/specs/communities/scenes-uprises-sects.md`
- `docs/specs/core/terminology-and-taxonomy.md`
- `docs/specs/communities/plot-and-scene-plot.md`
