# Avatar System Source Map

Status: current-repo reconciliation
Date: 2026-07-22

## Authority Order

This project follows the repo authority order. The documents below own product
truth; this project organizes design and asset implications only.

## Current Repo Connections

| Area | Current source | What the avatar project inherits |
| --- | --- | --- |
| Visible listener avatar | `docs/agent-briefs/UI_CURRENT.md` | The avatar is visible MVP presentation. Feed avatars are belly-up and never circular. Customization/editor runtime is a separate activation. |
| Listener identity boundary | `docs/specs/users/identity-roles-capabilities.md` | Base avatar creation/core edits belong to listener account/profile. Listener profile is not source management. |
| Personal Space / Inventory | `docs/founder-sessions/2026-07-12_avatar-creation-inventory-boundary.md`; `docs/specs/economy/print-shop-and-promotions.md` | Personal Space owns future equipment/placement of owned wearable artifacts and wall placement of flyers. It does not own initial identity creation. |
| Modular taxonomy | `docs/founder-sessions/2026-07-11_avatar-modular-merch-taxonomy.md` | Separate head bases and hair; top, headwear, outerwear/straps, face details, neck details, and digital merch objects. Suspenders are outerwear. Piercings/tattoos are face details. |
| Feed rendering | `docs/founder-sessions/2026-07-09_home-feed-card-grammar-and-support.md`; `docs/solutions/FEED_CARD_FAMILY_INVENTORY_R1.md` | Normalized left rail, belly-up listener crop, clothing-readable silhouette, username/support score when its metric is defined. The avatar system does not define Support. |
| Home/Plot rendering | `docs/specs/communities/plot-and-scene-plot.md`; `docs/founder-sessions/2026-07-06_player-dropdown-inventory-visual-language.md` | Compact and expanded top-shell phases consume the same avatar configuration. The shell changes framing/atmosphere, not avatar identity. |
| Digital merch | `docs/specs/economy/print-shop-and-promotions.md` | Buttons, pins, patches, stickers, and related artifacts attach only to designer-authored compatible zones. No marketplace/token/wallet behavior. |
| Public member identity | `docs/founder-sessions/2026-07-06_public-artist-profile-headshots.md`; `docs/screen-packages/artist-profile-source-dashboard/design-spec/2026-07-11_member-identity-visuals-design-handoff.md` | Public Artist Profile members use source-provided headshots, never listener-avatar fallback. |
| Current source-member runtime | `packages/types/src/artist-band.ts`; `apps/web/src/app/source-dashboard/page.tsx` | Source Dashboard may use a listener avatar only as an internal source-facing fallback. Public headshot routing remains separate. |
| Current listener runtime | `apps/web/src/components/plot/PlotListenerProfile.tsx`; current Plot shell components | Current data model is still a flat avatar URL. The modular system needs a flattened-render compatibility bridge. |

## Existing Design Foundation

| File | Use |
| --- | --- |
| `art/avatar-system/specifications/avatar-design-context-packet.md` | Original bounded context and current/settled/deferred classification. |
| `art/avatar-system/specifications/fable-avatar-system-design-spec.md` | R1 layer, manifest, anchor, renderer, Personal Space, performance, and rollout proposal. |
| `art/avatar-system/specifications/fable-restriction-prompt.md` | Drift restrictions used for the original synthesis. |

## R1 Reconciliation

| R1 statement | Current evidence / founder direction | R2 treatment |
| --- | --- | --- |
| Head base carries face, skin tone, body, neck, and shoulders. | Current founder direction requires bodies to be interchangeable at the neck; head/face may be combined while hair remains separate. | Split `Body Base` from `Head-Face Preset`. Both share `socket.neck`. Skin palette applies to exposed-skin masks across both. |
| Skin tones are authored head-base variants. | Latest direction asks for selectable shade and considers light/dark ambiguity. | Keep authored palette values but separate color from geometry. Recommend six tones, no continuous slider and no light/dark binary. |
| Beta acceptance says re-edit in Personal Space. | The 2026-07-12 founder lock moved base creation/editing to listener account/profile. | Account/profile is the only base-identity write entry. Personal Space is equipment/display only. |
| Source Dashboard member chips are circular. | Current runtime uses a flat-bottom, rounded-top belly-up crop. | Mark current runtime as already aligned with the belly-up direction. |
| First slice combines paper contract, catalog, data record, compositor, shell wiring, Feed wiring, and editor. | Current workflow defaults to one narrow vertical slice. | Separate design ratification, art production, renderer bridge, and editor into distinct slices. |
| Public member-headshot field is missing. | Current `ArtistBandMemberSchema` includes `headshotUrl`. | Treat the public headshot carrier as implemented; keep it outside listener-avatar rendering. |

## Art References

These are reference-only and must be redrawn as layered production assets:

- `art/avatar-system/references/legacy-avatar-boards/0_3 (1).jpeg`
- `art/avatar-system/references/legacy-avatar-boards/0_3.jpeg`
- `art/avatar-system/references/legacy-avatar-boards/I_need_a_202603311857.png`
- `art/avatar-system/references/legacy-avatar-boards/Voider_a_set_of_black_white_and_color_icons_featuring_simple__3758a8cf-3de2-4d1e-b59a-82dfbf1ce40b_1.png`
- the three `Voider_ten_cartoon_avatars...` boards

Use them for crop, silhouette, clothing readability, and illustrated attitude.
Do not crop them into production avatar parts.

## Promotion Targets

When the founder approves R2:

1. Capture the latest founder wording under `docs/founder-sessions/`.
2. Create a dedicated owner spec under `docs/specs/users/` or another owner
   location selected by the documentation framework.
3. Link the owner spec from `UI_CURRENT.md`, identity roles/capabilities, and
   Print Shop artifact rules.
4. Create a screen package only when the avatar editor/composer becomes an
   active page/module implementation effort.

This project already lives inside the repo Art Department. Promote only
approved product rules into owner specs; do not treat this design artifact as
durable product authority.
