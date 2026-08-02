# Avatar Starter Outfit And Punk Gear Founder Session

Status: raw founder-session capture
Date: 2026-07-30
Source: current chat/session
Related lane(s): listener avatar, Personal Space/Inventory, avatar asset production
Owner spec candidates: `docs/specs/users/identity-roles-capabilities.md`; `docs/specs/economy/print-shop-and-promotions.md`

## Raw Founder Notes

> i think we put them in a tee and a open vest jacket etc we should have a lot of different styles of punk gear to offer

> these will need to be able to have button / patches assigned to them later on once the user gets placed in the collection section where they will be able to apply them

> they will be able to change there band shirt later (this will likely just be a logo or word) for now just want to lock the image style and wardrobe stuff will likely be like 5 main types with random color / spikes /studs / paint / etc

## Clarifications

- The intended avatar presentation is a readable tee beneath an open outerwear layer such as a vest or jacket.
- Open outerwear preserves the shirt-print area and later patch/button host zones.
- Collection is the later listener-facing surface where a user applies owned buttons and patches to compatible garment zones.
- The shirt is a replaceable graphic layer. A later selected band shirt may initially be limited to a logo or word treatment.
- The intended wardrobe catalog is approximately five main outerwear families with bounded visual variants such as color, spikes, studs, paint, and comparable finish treatments.
- Type: settled visual direction.
- Likely owner: avatar art contract and future wardrobe/catalog specification.

## Feature Sets

- Punk gear catalog
  - Raw basis: the founder wants many different punk-gear styles to offer.
  - Included direction: approximately five main open-outerwear families, with bounded color, spike, stud, paint, and comparable finish variants; shirts are a separate replaceable graphic layer.
  - Excluded / not activated: acquisition, rarity, pricing, participation thresholds, trading, or an automatic subculture outfit inferred from the user's photo.
  - Status: design direction; catalog scope and onboarding selection point remain open.

## Working Interpretation

- The photo-guided generator must preserve a listener's likeness independently of clothing.
- A tee remains visible in every approved starter composition. Open outerwear is a separately authored layer, not permanent identity art.
- The initial catalog should have broad punk silhouette and gear variety rather than a single default leather-jacket look.
- Lock the avatar image language and wardrobe-family construction before deciding the exact band-shirt catalog or acquisition flow.
- Do not decide whether the listener chooses an outerwear layer during generation or immediately after identity selection without a focused flow decision.

## Promotion Targets

- Art contract: `art/avatar-system/specifications/photo-guided-avatar-and-promotional-wearables-design-spec.md`
- Asset matrix: `art/avatar-system/specifications/asset-production-matrix.md`
- Future owner-spec updates under `docs/specs/users/**` and `docs/specs/economy/**` after onboarding and acquisition behavior are approved.

## Do Not Drift

- Do not bake a jacket, vest, patches, buttons, or hats into the photo-derived identity.
- Do not make all listeners wear the same punk outfit.
- Do not bake a band's logo or wordmark into an outerwear asset or the photo-derived identity.
- Do not infer a punk substyle or wardrobe from a person's photo.
- Do not turn the requested gear variety into paid, collectible, or currency behavior without an owner-spec decision.
