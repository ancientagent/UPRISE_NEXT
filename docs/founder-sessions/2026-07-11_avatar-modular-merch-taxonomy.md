# Avatar Modular Merch Taxonomy Founder Session

Status: raw founder-session capture
Date: 2026-07-11
Source: current chat/session
Related lane(s): Home/Plot UI, listener avatar, collection workspace, Print Shop, merch artifacts
Owner spec candidates: `docs/specs/economy/print-shop-and-promotions.md`; future avatar/customization owner spec; `docs/specs/core/signals-and-universal-actions.md`

## Raw Founder Notes

> so the best way would be to create heads  hair  tops  yeah?

> and have people make there own

> well i was wanting different shapes for people to pick so its not the same exact face wearing different hair,   I think we're going to do hair separate from head

> do the assets need to be available to actually design the system? probably not right?

> we have suspenders as outerwear?

> accessory should be piercing nose/ear

> buttons can be attached to suspenders

> fave access should also be tatto

> no buttons are printable / digital merch, they must be able to be attached to suspenders , hates lapels. etc

> please search the repo docs this should becovered already

> are there suggested clothing and stuff

> we can get it in there

> dont worry about it the avatar is in mvp

## Clarifications

- The visible listener avatar is MVP presentation, not a deferred-only concept.
- Type: settled correction
- Likely owner: `docs/agent-briefs/UI_CURRENT.md`; current Home/Plot UI specs.

- Avatar customization, avatar-interactive merch, user-created avatar assets, and dress-up tooling remain separate from the visible MVP avatar unless an implementation slice explicitly activates them.
- Type: settled boundary
- Likely owner: `docs/specs/economy/print-shop-and-promotions.md`; future avatar/customization owner spec.

- Final art assets do not need to exist before the avatar system is designed. The first durable design object should be the asset contract: layers, anchors, safe zones, allowed attachment targets, and small-size UI constraints.
- Type: implementation detail
- Likely owner: future avatar/customization owner spec; Product Design handoff.

- Head bases and hair should be separate layers. The system needs selectable head/face shapes, not one repeated face with different hair.
- Type: settled design clarification
- Likely owner: future avatar/customization owner spec; Product Design handoff.

- The starter modular layer model is: head base, hair, headwear, top, outerwear/strap layer, face details, neck details, and digital merch objects.
- Type: settled design clarification
- Likely owner: future avatar/customization owner spec.

- Suspenders belong in the outerwear/strap overlay family, not baked into shirts.
- Type: settled design clarification
- Likely owner: future avatar/customization owner spec.

- Nose and ear piercings belong in face details/accessories. Face tattoos should also be supported as face details.
- Type: settled design clarification
- Likely owner: future avatar/customization owner spec.

- Buttons are printable/digital merch objects, not merely decorative texture. They must be able to attach to valid wearable targets such as suspenders, hats/beanies, jacket lapels, vest panels, straps, and similar anchor zones.
- Type: settled design clarification
- Likely owner: `docs/specs/economy/print-shop-and-promotions.md`; future avatar/customization owner spec.

## Feature Sets

- Modular listener avatar and wearable merch system
- Raw basis: "create heads hair tops"; "people make there own"; "buttons are printable / digital merch"
- Included behavior:
  - visible MVP listener avatars can be designed against a modular contract;
  - head bases support different face/head shapes;
  - hair is its own layer;
  - shirts/tops preserve a readable merch print zone;
  - outerwear includes jackets, vests, hoodies/overshirts, suspenders, and strap/harness-style overlays;
  - face details include piercings, glasses, and tattoos;
  - digital merch objects such as buttons, pins, patches, and stickers can later attach to supported target zones;
  - attachment targets should be explicit, such as lapel, hat/beanie, suspender, vest panel, jacket panel, shirt chest, strap, or bag if bags are added later.
- Excluded / not activated:
  - no current runtime avatar editor unless a separate implementation slice activates it;
  - no user upload-anything pipeline by default;
  - no marketplace or fashion-game behavior;
  - no assumption that final generated art exists before the system contract.
- Status: design-only / deferred runtime.

## Working Interpretation

- Current MVP should show the listener avatar where the active Home/Plot UI calls for it.
- The modular system should be designed now so MVP avatar art does not block future wearable merch, but the full editor/customization mechanics can remain deferred.
- "Buttons" in this context are collectible/digital merch artifacts with placement anchors, not generic UI buttons and not baked-in clothing decoration.
- The clothing starter set should stay punk/local-music practical: tees, tanks, long sleeves, hoodies, denim/leather jackets, denim/leather vests, overshirts/flannels, suspenders, straps/harness overlays, caps, beanies, glasses, piercings, tattoos, patches, pins, and buttons.

## Promotion Targets

- Owner spec: `docs/specs/economy/print-shop-and-promotions.md`
- Lane brief: `docs/agent-briefs/UI_CURRENT.md`
- Future owner spec: avatar/customization/rendering spec if this becomes implementation work.
- Runtime/tests if activated: avatar renderer, collection/merch shelves, Print Shop artifact issuance, `Rock`/displayable artifact behavior.

## Do Not Drift

- Do not say "no avatar in MVP" when referring to the visible listener avatar.
- Do not treat avatar customization and avatar editor runtime as active just because the visible avatar is MVP.
- Do not bake buttons, patches, or pins permanently into clothing art when they are meant to be digital merch objects with attachment anchors.
- Do not collapse head and hair into one fixed portrait if the design task is about selectable avatar parts.
- Do not turn the avatar system into a generic fashion game or marketplace.
