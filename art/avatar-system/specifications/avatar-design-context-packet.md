# UPRISE Modular Avatar And Wearable Design Context Packet

Status: bounded planning packet for Fable
Date: 2026-07-11
Prepared by: Codex local context steward
Mode: read-only design-system synthesis

## 1. Objective

Create one implementation-ready design specification for UPRISE's visible
listener avatar system and its future compatibility with wearable band merch and
digital merch artifacts.

This is not a request to build an avatar editor, create assets, change schema,
or activate a marketplace. It is a request to define the visual system,
asset contract, rendering contexts, and phased rollout so future art and code
can work together without recreating every avatar for each clothing change.

## 2. Authority And Scope Rule

Use this authority order:

1. `AGENTS.md`
2. This packet for bounded task scope and pre-traced evidence
3. `docs/PLATFORM_START_HERE.md`
4. Named active briefs and owner specs below
5. Named founder-session captures below
6. Named runtime files and art boards below

This packet is a synthesis aid, not durable product authority. Founder-session
captures preserve raw wording and may contain future or open directions. If one
conflicts with active owner docs, identify the conflict rather than silently
resolving it.

Do not read `docs/legacy/**` or broad canon by default.

## 3. Safety And Token Controls

- The local repo is currently on `feat/release-deck-scheduling-stack` at
  `54f884c` and contains unrelated, uncommitted work. This packet task is
  authorized as read-only only.
- Read the named sources. Do not do a broad repo rediscovery.
- Fable may use relevant built-in skills for document analysis, product/design
  synthesis, asset-system reasoning, or output quality. Skills must operate
  within this packet's named sources and scope.
- Do not use subagents, a swarm, delegated/background workers, web research,
  broad file searches, or git-history archaeology.
- Do not run tests, builds, typechecks, provider commands, browser automation,
  migrations, or database operations.
- Do not edit the repo, art, docs, branch registry, git state, provider state,
  schema, or env/secrets.
- Do not generate, crop, export, or modify image assets. Existing art boards are
  visual references only.
- Write exactly one output document to the output path in the companion prompt.

## 4. Required Reading

Read in this order:

1. `AGENTS.md`
2. `docs/PLATFORM_START_HERE.md`
3. `docs/agent-briefs/UI_CURRENT.md` - especially `Avatar / Merch Visual Boundary`
4. `docs/specs/economy/print-shop-and-promotions.md`
5. `docs/founder-sessions/2026-07-11_avatar-modular-merch-taxonomy.md`
6. `docs/founder-sessions/2026-07-09_home-feed-card-grammar-and-support.md`
7. `docs/founder-sessions/2026-07-06_player-dropdown-inventory-visual-language.md`
8. `docs/founder-sessions/2026-07-06_public-artist-profile-headshots.md`
9. `docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`
10. `docs/screen-packages/artist-profile-source-dashboard/design-spec/public-artist-profile-design-inventory.md`
11. `docs/screen-packages/artist-profile-source-dashboard/design-spec/2026-07-11_member-identity-visuals-design-handoff.md`
12. `tools/midjourney-avatar-picker/README.md`

Runtime context only - do not expand beyond these unless the packet cannot be
answered:

- `apps/api/prisma/schema.prisma`
- `apps/web/src/components/plot/PlotTopShell.tsx`
- `apps/web/src/components/plot/PlotListenerProfile.tsx`
- `apps/web/src/app/source-dashboard/page.tsx`
- `apps/web/src/app/users/[id]/page.tsx`
- `packages/types/src/user.ts`
- `packages/types/src/artist-band.ts`

## 5. Settled Product And Design Truths

### Listener avatar is visible in MVP

- The Home identity avatar is part of the listener/player composition now.
- The visible avatar is not permission to assume a live avatar editor,
  user-created asset pipeline, wearable marketplace, or interactive merch
  runtime exists now.

### Avatar identity is separate from public source/member identity

- Listener-account avatars are an account identity surface.
- Public Artist Profile member display should use source-provided artist/member
  headshots when available.
- Do not use a listener avatar as the default public band-member headshot.
- Do not invent public listener-profile links, DMs, or identity disclosure from
  a member avatar.

### Feed avatar rendering

- Feed listener identities render belly-up, never as circular portraits.
- The crop must keep shirts, hats, patches, and other wearable expression
  visible.
- Listener cards use the same normalized left identity-rail footprint as other
  Feed source families.
- The left rail can include listener username and support score when that metric
  is defined; the avatar system must not invent the score or Support mechanics.

### Stable modular fit model

- Clothing and band artwork are the visual focus. The avatar is a stylized fit
  model, not the product being collected.
- Clothing/artwork swaps must not require regenerating the full avatar.
- Head base and hair are separate layers. There must be selectable, genuinely
  different head/face shapes, not one repeated face with new hair.
- The current starter layer vocabulary is:
  - head base
  - hair
  - headwear
  - top
  - outerwear/strap overlay
  - face details
  - neck details
  - digital merch objects
- The broader visual direction also includes pants, shoes, hats, and
  accessories, but current MVP display contexts are predominantly belly-up.
  Plan a forward-compatible contract without requiring a full-body MVP renderer.

### Wearables and digital merch are distinct

- Shirts, jackets, vests, hoodies, overshirts, flannels, suspenders, straps,
  and harness overlays are wearable layers.
- Nose/ear/lip/eyebrow piercings, face tattoos, scars/marks, and glasses are
  face/detail layers when correctly attached to the head/face.
- Suspenders belong to outerwear/strap overlays, not baked into shirts.
- Buttons, pins, patches, and stickers are printable/digital merch objects,
  not permanent pixels baked into a garment.
- These objects may later attach to garments or accessories.
- The system is not a generic fashion game, resale market, NFT system, or
  listener marketplace.

### Per-asset designer placement clarification

Founder clarification from this session:

> the anchors can be attached by the designer because all clothes will be different

Interpretation for this design task:

- Do not require one universal fixed set of attachment coordinates that every
  shirt, jacket, vest, hat, or accessory must share.
- Each wearable or digital-merch asset needs a designer-authored placement and
  attachment manifest appropriate to that asset's geometry.
- The system may still define a shared canvas, crop, coordinate convention,
  layer order, naming scheme, and validation rules. It must not force all
  assets into identical garment anchors.
- Explain how a designer supplies attachment points for a specific asset while
  keeping the runtime deterministic and safely validated.

### Settled account/profile and Personal Space boundary

Founder clarification for this planning task:

- Base listener-avatar creation and core identity edits belong to the signed-in
  listener account/profile surface. A person must be able to create or revise
  their base avatar without entering Personal Space/Inventory or owning a
  collectible.
- Personal Space/Inventory is the private collection and display workspace. It
  owns the equipment/placement context for owned wearable or display artifacts.
- Both contexts use one shared avatar composition/configuration system; they
  are separate entry points, not divergent avatar systems.
- This does not authorize an authentication migration, a separate identity
  provider, an avatar editor implementation, or a mobile-specific builder.
- For beta, a deliberately small account/profile flow may be enough: choose a
  head base, hair, starter top, and limited details. Wearable inventory,
  digital-merch attachment, user-created assets, and a full editor remain later
  work.
- Personal Space is also the future inventory/equipping surface where a listener
  adds owned patches, pins, buttons, stickers, and similar digital merch to an
  eligible worn item. A garment's designer-authored manifest determines the
  valid placement zones for that garment.
- Do not assume unrestricted drag-anywhere placement. Decide whether the user
  selects among designer-approved zones, chooses from compatible variants, or
  has another bounded interaction, and label that choice `[PROPOSED]` unless a
  current owner spec settles it.

Status: `[SETTLED]` product boundary. The specific beta configuration scope,
auth ownership, route/modal choice, and activation timing remain `[OPEN]` or
`[DEFERRED]` unless a current owner spec settles them.

## 6. Current Runtime Reality

These are observed implementation boundaries, not authorization to change them:

- User and source models currently expose flat optional `avatar` URL fields.
- The Plot top shell has a `listener-avatar-bust` rendering slot.
- Source Dashboard renders source and member avatar image URLs.
- A current uncommitted identity-boundary slice adds source-provided member
  `headshotUrl` data and moves public source `bio`, `avatar`, and `coverImage`
  ownership onto the band/source itself. Treat this as `[CURRENT RUNTIME -
  LOCAL UNCOMMITTED]`, not durable authority until its owning slice lands.
- In that slice, the public Artist Profile shows a source-provided member
  headshot only when present; no personal listener-avatar fallback is allowed.
- In that slice, the internal Source Dashboard member strip prefers the
  source-provided headshot and may fall back to the member's account avatar.
  That fallback is source-facing only and retains a belly-up crop.
- No modular wearable schema, renderer, attachment manifest, avatar inventory,
  or avatar-editor runtime is implemented.
- No runtime `wearable` domain was found.
- The current system is therefore flat-image MVP presentation plus a future
  design contract, not a partially implemented modular-avatar engine.

## 7. Rendering Contexts To Design For

Design a coherent rendering policy for these contexts. Preserve the stated
identity/privacy boundaries.

1. **Home/Plot top shell** - listener avatar bust integrated with the current
   Home Scene/player composition.
2. **Feed identity rail** - belly-up listener portrait in the normalized left
   source rail. Clothing must remain readable at small size.
3. **Expanded listener profile/collection direction** - a larger avatar can act
   as a transition object between public Home Scene and private listener space;
   the precise interaction is design-only/open and must not become an active
   runtime mandate.
4. **Source Dashboard member strip** - current design package uses compact,
   fictional belly-up member visuals in a responsive masthead strip. The
   current local identity slice prefers source-provided headshots and permits an
   internal-only listener-avatar fallback. Public linking/privacy remains
   unresolved.
5. **Public Artist Profile members** - source-provided headshots first, not
   listener avatars by default.
6. **Discover map and shared-listen/avatar animation** - future/deferred only.
   Do not turn them into MVP requirements.

## 8. Community Visual-System Context

The same core platform architecture applies to every city + state + music
community. Avatar architecture must therefore be systemic rather than a
one-off city or genre implementation.

Current direction:

- Community switching changes scene context and visual skin, not product
  architecture.
- Backdrops, wordmark/title treatment, color accents, player accents, skyline
  or genre overlays can vary by community.
- Punk avatar boards are reference material, not a universal look for every
  music community.

Founder-thread direction not yet promoted into an owner spec:

- A listener's avatar style may be rooted in their original Home Scene while
  community switching changes the surrounding scene skin.
- Each primary music community may eventually have a shared general avatar set
  plus a smaller community-specific/custom set.

Treat this as **open founder direction**. Give options and recommend a
non-destructive approach; do not state it as settled policy.

## 9. Existing Art References

All are in `art/avatar-system/references/legacy-avatar-boards/`. They are
candidate visual directions, not approved, modular, production-ready assets.

| File | Observed direction | Use in this task |
| --- | --- | --- |
| `0_3 (1).jpeg` | ten black/white belly-up punk profiles with visible jackets, shirts, hats, and accessories | source-dashboard member-strip reference; preserve clothing-readable crop |
| `0_3.jpeg` | another ten-profile black/white belly-up punk sheet | variation/reference only |
| `I_need_a_202603311857.png` | simplified belly-up avatar concepts with varied hair, head shapes, garments, and punk markings | useful for separating head, hair, and garment concepts |
| `Voider_a_set_of_black_white_and_color_icons_featuring_simple__3758a8cf-3de2-4d1e-b59a-82dfbf1ce40b_1.png` | cleaner, compact icon/bust set with varied faces and limited garments | small-size legibility reference |
| `Voider_ten_cartoon_avatars_with_a_punk_rock_aesthetic_are_arr_12783cab-417c-475c-9d83-6d571418440a_1.png` | textured, belly-up punk ensemble with strong garment silhouettes | garment/identity reference only |
| `Voider_ten_cartoon_avatars_with_a_punk_rock_aesthetic_are_arr_a523822e-d70b-4d82-a42a-db1c9f322ed9_3.png` | textured punk profile sheet, varied hair, vests, jackets, and details | garment/detail reference only |
| `Voider_ten_cartoon_avatars_with_a_punk_rock_aesthetic_are_arr_d5bcadba-ecb0-4d4f-a809-c11e250b3327_0.png` | textured punk profile sheet, varied body/head/hair silhouettes | diversity and crop reference only |

`tools/midjourney-avatar-picker/` can crop selected individual tiles from a
Midjourney sheet and export a manifest with source URL, crop bounds, and
selected cells. It is a manual candidate-selection tool, not a production
asset pipeline and not permission to use Midjourney images without review.

## 10. Required Fable Deliverable

Produce one concise but complete document titled:

`UPRISE Modular Listener Avatar And Wearable Asset System R1`

It must include:

1. **System thesis and non-goals** - why this is an identity/merch-fit system,
   not an avatar marketplace or social-profile replacement.
2. **Authority classification** - label major statements as `[SETTLED]`,
   `[CURRENT RUNTIME]`, `[DEFERRED]`, `[OPEN]`, `[PROPOSED]`, or
   `[CONFLICT]`.
3. **Identity boundary matrix** - listener avatar vs source image vs public
   artist/member headshot vs system/source artwork.
4. **Asset taxonomy** - canonical layer families, optionality, dependencies,
   exclusions, and what is bust-only now versus full-body later.
5. **Per-asset placement/attachment manifest** - a logical manifest shape,
   required fields, coordinate convention, z-order, safe zones, allowed
   attachable targets, validation, and fallback behavior. Do not prescribe one
   fixed anchor map for every garment.
6. **Rendering-context matrix** - top shell, Feed rail, expanded profile,
   Source Dashboard member strip, public Artist Profile, and deferred map/shared
   listen. Include crop, visibility, interaction, and privacy rules.
7. **Personal Space inventory/equipping UX** - show how a listener applies an
   owned patch, pin, button, sticker, or compatible wearable to their avatar
   using the designer-authored placement manifest. Preserve bounded placement,
   ownership, and future/deferred scope.
8. **Community style-profile model** - systemic variation without making punk
   the platform default. Address the open original-Home-Scene style direction
   without promoting it as settled.
9. **Art-production workflow** - source sheets, candidate approval, tile
   selection, layered source files, exports, naming, versioning, manifests,
   licensing/privacy review, and asset QA. The workflow must support designers
   authoring attachment points per asset.
10. **Accessibility, performance, and responsive constraints** - small-size
   legibility, non-visual labels, contrast, reduced motion, loading/fallback,
   and efficient asset loading.
11. **Implementation-readiness map** - current flat URL state, the future
    domains/contracts needed, and a small phased sequence. No code, Prisma,
    migration, API, or runtime patch.
12. **Two-context avatar composition flow** - recommend a bounded account/profile
    base-identity flow for beta and a separate Personal Space/Inventory
    owned-item equipment flow. Explain their shared configuration handoff to all
    render contexts. Do not redesign authentication or activate an editor.
13. **Open founder decisions** - only material decisions, with options,
    tradeoffs, and a clearly `[PROPOSED]` recommendation.
14. **First vertical slice** - a bounded first implementation/design slice that
    makes the existing MVP avatar presentation future-compatible without
    activating a full editor or merch economy.

## 11. Explicit Non-Goals

- No new avatars or asset generation.
- No avatar editor or user-upload pipeline.
- No merchandise marketplace, resale, NFT, wallet, paid cosmetics, or billing.
- No change to source registration, voting, Fair Play, RADIYO, Support,
  Participation, or community routing.
- No source/member public-account links, DMs, or privacy behavior.
- No full-body runtime requirement for MVP.
- No generic social-profile conventions.
- No hardcoded city/community/genre-specific runtime implementation.

## 12. Expansion Conditions

Expand context only if one of these cannot be resolved from the named files:

- a direct conflict between listener-avatar and public-member-headshot policy;
- an existing owner spec already defines an avatar storage or artifact-issuance
  contract that this packet failed to capture;
- a named source is missing.

If expanded, name the exact file and reason in the output. Do not expand merely
for confidence, completeness, or inspiration.
