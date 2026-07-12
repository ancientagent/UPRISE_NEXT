# Avatar Creation And Inventory Boundary Founder Session

Status: raw founder-session capture
Date: 2026-07-12
Source: current chat/session
Related lane(s): UX/UI, listener identity, collection/Personal Space, Print Shop
Owner spec candidates: `docs/specs/users/identity-roles-capabilities.md`; `docs/specs/economy/print-shop-and-promotions.md`

## Raw Founder Notes

> yeah im not exactly sure if the avatar creation should be on the web like originally suggested or in the inv space, one way or another the collection is in the inv which allows the user to place patches and buttons on clothing and flyers on the wall

> Ok I agree, thanks for the advise lets settle it

## Clarifications

- Base listener-avatar creation and core identity edits belong to the listener account/profile surface. A listener must be able to create or revise their base avatar without entering Personal Space/Inventory or first holding a collectible.
- Type: settled
- Likely owner: `docs/specs/users/identity-roles-capabilities.md`

- Personal Space/Inventory owns collection display, room decoration, and the equip/placement context for owned digital merch: wearable buttons, pins, patches, and similar items go onto valid wearable anchors; collectible flyers can be placed on the space wall.
- Type: settled
- Likely owner: `docs/specs/economy/print-shop-and-promotions.md`

- The future avatar composer has two contexts, not two divergent avatar systems: account/profile opens base identity creation and editing; Personal Space/Inventory opens owned-item equip/placement. The exact first-run prompt, route, modal, and implementation sequence remain unselected.
- Type: settled boundary / implementation detail open
- Likely owner: `docs/specs/users/identity-roles-capabilities.md`

## Feature Sets

- Listener avatar plus Personal Space collection loop
- Raw basis: "avatar creation should be on the web" and "the collection is in the inv"
- Included behavior:
  - a listener can establish an avatar before they own wearable or decor items;
  - the same underlying avatar composition supports base-layer editing and owned-item placement;
  - Inventory remains the collection context for wearable placement and wall decoration.
- Excluded / not activated:
  - avatar editor runtime, onboarding implementation, asset catalog, inventory persistence, artwork rendering, and public-room behavior;
  - using a listener avatar as a public Artist/Band member headshot.
- Status: settled product/design boundary; runtime deferred

## Working Interpretation

- The listener's avatar is identity first and collection display second.
- Inventory gives earned/owned artifacts a meaningful place without making it a prerequisite for a visible listener identity.
- The existing modular avatar asset contract remains unchanged: base layers are distinct from attached digital merch objects and their valid anchors.

## Promotion Targets

- Owner spec: `docs/specs/users/identity-roles-capabilities.md#listener-avatar-and-personal-space-boundary`
- Companion owner section: `docs/specs/economy/print-shop-and-promotions.md#future-wearable-join`
- Lane brief: `docs/agent-briefs/UI_CURRENT.md#avatar--merch-visual-boundary`
- Tests/runtime: none authorized by this decision alone.

## Do Not Drift

- Do not make Personal Space/Inventory a required avatar-creation screen.
- Do not treat collection ownership as a prerequisite for a listener avatar.
- Do not create two incompatible avatar models for account identity and Personal Space equipment.
- Do not treat source-owned artist/member headshots as listener-avatar output.
- Do not interpret this docs decision as authorization to build the deferred avatar editor, collectible inventory, or decoration runtime.
