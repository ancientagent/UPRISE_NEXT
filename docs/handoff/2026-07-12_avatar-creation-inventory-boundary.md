# Avatar Creation / Inventory Boundary Promotion

**Agent:** `Codex`
**Date:** `2026-07-12`
**Related Spec:** `USER-IDENTITY`; `ECON-PRINTSHOP`
**Scope:** documentation-only founder clarification promotion

## Summary

The founder settled the listener-avatar surface boundary. Listener account/profile owns base avatar creation and core edits; Personal Space/Inventory owns collected-item equipment, placement, and decoration context. This is a documentation decision only and does not activate runtime work.

## Scope & Deliverables

- Raw evidence: `docs/founder-sessions/2026-07-12_avatar-creation-inventory-boundary.md`.
- Primary owner contract: `docs/specs/users/identity-roles-capabilities.md#listener-avatar-and-personal-space-boundary`.
- Collection/wearable join updated in `docs/specs/economy/print-shop-and-promotions.md#future-wearable-join`.
- UI routing summary updated in `docs/agent-briefs/UI_CURRENT.md#avatar--merch-visual-boundary`.
- Out of scope: avatar editor, onboarding flow, asset production, persistence, API work, inventory runtime, public rooms, and Artist/Band headshot changes.

## Decisions Made

- Base avatar creation is account/profile-accessible and cannot depend on entry to Personal Space/Inventory or owned collection items.
- Personal Space/Inventory is the collection-facing equipment and decoration context: owned wearable artifacts attach to valid anchors; owned flyers can appear on the wall.
- A future shared composition system may serve both contexts without splitting the avatar into separate account and inventory models.

## Implementation Notes

- No code, schema, API, tests, migrations, or deployment configuration changed.
- Exact first-run prompt, route, modal, composer interaction, asset catalog, ownership persistence, and renderer behavior remain future implementation decisions.

## Outstanding Questions & Recommendations

- Design the avatar composer only when an implementation slice activates it; preserve the established modular base-layer and attachment-anchor contract.
- Keep source-provided Artist/Band member headshots separate from listener-avatar output.

## References

- Founder session: `docs/founder-sessions/2026-07-12_avatar-creation-inventory-boundary.md`
- Owner spec: `docs/specs/users/identity-roles-capabilities.md`
- Companion spec: `docs/specs/economy/print-shop-and-promotions.md`
