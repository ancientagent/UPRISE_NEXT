# UPRISE Modular Listener Avatar And Wearable Asset System R1

Status: historical R1 design foundation; superseded where the R2 contract,
source map, or current owner specs differ
Date: 2026-07-11
Prepared by: Fable (avatar-system design architect)
Mode: read-only synthesis from the bounded task packet and its named sources
Context expansion: none — all evidence comes from packet-named files
Authority: this document is a design contract proposal, not an owner spec. On
promotion, durable rules belong in an avatar/customization owner spec under
`docs/specs/**` per the documentation framework.

---

## 1. System Thesis And Non-Goals

**Thesis.** The UPRISE listener avatar is a stylized fit model for local-music
identity and band merch — not the collectible itself. `[SETTLED]` Clothing,
band artwork, and merch artifacts are the visual payload; the avatar exists so
that payload has a body to hang on. The system's core design object is
therefore the **asset contract** — layers, canvas, per-asset placement
manifests, and rendering rules — not any particular art set. `[SETTLED]` Final
art does not need to exist before this contract is ratified.

The contract has one governing invariant: **a clothing or artwork swap must
never require regenerating the avatar, and a new garment must never require
re-authoring the avatar system.** `[SETTLED]` Everything below serves that
invariant.

**Non-goals.** `[SETTLED]` unless noted:

- No avatar editor runtime, user-upload pipeline, or dress-up toy in MVP.
- No marketplace, resale, bidding, NFT, wallet, paid cosmetics, or billing.
- No new avatars or generated assets from this document.
- No change to source registration, voting, Fair Play, RADIYO, Support,
  Participation, or community routing.
- No public listener-account links, DMs, or identity disclosure from any
  avatar rendering.
- No full-body runtime requirement for MVP; the contract is full-body
  forward-compatible but bust-first.
- No generic social-profile conventions and no platform-trope drift.
- No hardcoded city/community/genre runtime behavior; punk is a launch
  reference direction, not the platform default.

---

## 2. Authority Classification

Every major claim in this document carries one label:

- `[SETTLED]` — stated in AGENTS.md, an active owner spec, the UI lane brief,
  or a founder clarification the packet marks as settled.
- `[CURRENT RUNTIME]` — observed in the named runtime files; a fact, not an
  authorization to change it.
- `[DEFERRED]` — valid direction explicitly parked by owner docs.
- `[OPEN]` — a real decision no current owner doc settles.
- `[PROPOSED]` — this document's recommendation; requires founder/owner-spec
  promotion before it becomes product truth.
- `[CONFLICT]` — two current sources disagree, or settled policy has no
  runtime carrier; flagged, never silently resolved.

---

## 3. Identity Boundary Matrix

Four image classes exist on the platform and must never substitute for each
other. `[SETTLED]`

| Class | Identifies | Supplied by | Renders on | Prohibited uses |
| --- | --- | --- | --- | --- |
| **Listener-account avatar** | A signed-in listener account | Avatar configuration saved in Personal Space (future); flat `avatar` URL today | Plot top shell, Feed identity rail, expanded listener profile/collection | Never the default public band-member image; never a public-profile link, DM entry point, or identity disclosure |
| **Source image** | A registered artist/band/promoter source entity | Source operators via source tooling | Source Dashboard masthead, public Artist Profile header, source-family Feed rails | Not a person; must not imply an individual member's identity |
| **Public artist/member headshot** | A real band member on the public Artist Profile | Source-provided, per member | Public Artist Profile member section | Must not fall back to the member's listener-account avatar by default; no DM/inbox/contact entry point; no permission controls |
| **System/source artwork** | Community, scene, or system context (atmosphere photos, RADIYO/system card flare, album art) | Curated/approved asset sets | Backdrops, card flare, inserts | Must not imply real venue/event facts; must not become per-community behavior |

Boundary consequences:

- Source Dashboard's member strip is **source-facing** tooling and may show
  member visuals from account data today `[CURRENT RUNTIME]`, but any future
  member-avatar link to a listener account/profile requires explicit identity
  routing and privacy rules first. `[SETTLED]`
- The runtime member contract (`packages/types/src/artist-band.ts`,
  `ArtistBandMemberUserSchema`) carries only `user.avatar` — the
  listener-account avatar. There is **no source-provided headshot field
  anywhere in the named contracts or schema**. Settled headshot policy
  therefore has no runtime carrier: any public member display built on the
  current contract would default to listener avatars, which policy forbids.
  `[CONFLICT]` — flagged for the implementation-readiness map (§11); the
  resolution is a new source-owned member-headshot field, not reuse of
  `user.avatar`.

---

## 4. Asset Taxonomy

### 4.1 Layer families

The starter vocabulary is settled. `[SETTLED]` Default paint order (bottom →
top) and sub-layer splits are this document's proposal. `[PROPOSED]`

| # | Family | Default z-band | Optional? | Depends on | MVP (bust) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Head base | 100 | **Required** | — | Yes | Carries face shape, skin tone, body/neck/shoulder silhouette. Genuinely different head/face shapes, not one face re-haired `[SETTLED]` |
| 2 | Hair (back) | 200 | Optional (incl. bald) | Head base | Yes | Hair is a separate layer from head `[SETTLED]`; assets may split back/front |
| 3 | Top | 300 | **Required** (default tee) | Head base silhouette family | Yes | Tees, tanks, long sleeves; owns the chest print zone |
| 4 | Neck details | 400 | Optional | Head base | Yes | Chains, chokers, bandanas, collars |
| 5 | Outerwear / strap overlay | 500 | Optional | Top | Yes | Jackets, vests, hoodies-as-outer, overshirts/flannels, **suspenders**, straps/harness overlays. Suspenders live here, never baked into shirts `[SETTLED]` |
| 6 | Headwear | 600 | Optional | Head base, hair interaction | Yes | Caps, beanies; may require hair-compressed variant (§5.6) |
| 7 | Hair (front) | 650 | Optional sub-layer | Hair | Yes | Fringe/strands over headwear brim or face edge `[PROPOSED]` |
| 8 | Face details | 700 | Optional, stackable | Head base | Yes | Nose/ear/lip/eyebrow piercings, face tattoos, scars/marks, glasses — anchored to the head/face `[SETTLED]` |
| 9 | Digital merch objects | host z + Δ | Optional, stackable | A host zone on a worn asset | Later (contract now) | Buttons, pins, patches, stickers — printable/digital artifacts with attachment targets, never baked pixels `[SETTLED]`. Render just above their host layer, not at a global top band, so a pin on a shirt sits correctly under an open jacket `[PROPOSED]` |
| — | Pants / shoes / full-body accessories | reserved 320–380 | — | — | **No** | Full-body families are reserved z-space and naming only; no MVP renderer obligation `[SETTLED]` |

Exclusions and rules:

- Exactly one asset per required family; stackable families declare per-asset
  stack limits in their manifests. `[PROPOSED]`
- Digital merch objects are a distinct class from wearables: wearables are
  worn on the body; merch objects attach to wearables. `[SETTLED]`
- Community style tagging partitions the catalog (§8) but never changes the
  taxonomy itself. `[SETTLED]`

### 4.2 The two-level anchor model

Two anchor systems coexist, and keeping them separate resolves the apparent
tension between "keep a consistent neck anchor, shoulder width, crop height"
(UI lane brief) and "the anchors can be attached by the designer because all
clothes will be different" (founder clarification). They operate at different
levels: `[PROPOSED]` interpretation, consistent with the packet's own reading.

- **Level 1 — body registration (shared, fixed).** The master canvas defines
  named guides and sockets: crown line, hairline zone, hat-band zone, brow,
  chin, neck anchor, shoulder line, chest print band, belly crop line. Every
  wearable mounts to a named socket (`socket.head`, `socket.torso`,
  `socket.shoulders`) so all garments agree on where the body is. `[SETTLED]`
  as design guidance; formalization `[PROPOSED]`.
- **Level 2 — garment-local attachment zones (designer-authored, per asset).**
  Each garment/object declares its own zones — where a pin can sit on *this*
  vest, where a patch can sit on *this* jacket panel — in its own manifest,
  because all clothes are different. `[SETTLED]` No universal fixed anchor map
  is imposed on garments. `[SETTLED]`

The system standardizes the **language** of zones (types, geometry format,
validation) while designers author the **geometry** per asset.

### 4.3 Bust now, full body later

All assets are authored on a full-body master canvas but are only required to
ship bust-crop renders in MVP. `[PROPOSED]` The bust ("belly-up") crop is the
canonical MVP view everywhere listener identity renders. `[SETTLED]` Pants,
shoes, and full-body accessories become authoring obligations only when a
full-body context activates. `[DEFERRED]`

---

## 5. Per-Asset Placement / Attachment Manifest

All manifest shapes below are logical design contracts, not storage schemas or
code. `[PROPOSED]` throughout unless labeled otherwise.

### 5.1 Shared canvas and coordinate convention

- **Master canvas:** one normalized full-body frame per body silhouette
  family. Coordinates are normalized floats, origin top-left, x ∈ [0,1], y ∈
  [0,1] over the full-body frame, fixed aspect ratio declared once in the
  CanvasSpec.
- **Named horizontal guides** (fixed y-values per silhouette family): `crown`,
  `hairline`, `hat_band`, `brow`, `chin`, `neck_anchor`, `shoulder_line`,
  `chest_print_band`, `belly_crop` — the settled consistency set. `[SETTLED]`
- **Crops are named, not ad hoc:** `crop.bust` (crown → belly_crop, the
  canonical MVP view), `crop.rail` (same box, small-size export),
  `crop.full` (reserved). Renderers request crops by name; no context invents
  its own rectangle.
- **Asset-local space:** each asset is authored in its own normalized box with
  a declared mount transform onto a body socket. Zones are declared in
  asset-local space so a garment's zones travel with it.

### 5.2 CanvasSpec (one per body silhouette family)

| Field | Meaning |
| --- | --- |
| `canvas_id`, `version` | Identity and versioning of the frame |
| `aspect_ratio` | Fixed master frame ratio |
| `guides{}` | Named y-values for the guide set above |
| `sockets{}` | Named mount points with position + allowed families |
| `crops{}` | Named crop boxes (`bust`, `rail`, `full`) |
| `safe_zones{}` | Regions that must stay unobstructed at rail size (face core, chest print readability box) |

### 5.3 WearableAssetManifest (per garment/hair/headwear/detail asset)

| Field | Meaning |
| --- | --- |
| `asset_id`, `slug`, `family`, `version` | Identity; family from §4.1 |
| `style_profiles[]` | Catalog partitions this asset belongs to (§8) |
| `body_compatibility[]` | Head-base/silhouette families this asset fits |
| `mount` | Body socket + offset transform |
| `z_band`, `z_offset` | Default family band; bounded per-asset offset within the band |
| `sub_layers[]` | Optional split renders (e.g., `hair.back`/`hair.front`) with their own z |
| `renders{}` | Required exports per named crop and size tier |
| `interaction_rules[]` | Declared interactions with other families: `requires_variant` (beanie → hair must supply `compressed`), `masks` (region another layer is clipped by), `excludes` (hard incompatibility) |
| `attachment_zones[]` | Designer-authored zones — see 5.4. Empty array = nothing attaches to this asset |
| `legibility_flags` | QA results: rail-size readable, dark/light backdrop safe |
| `provenance` | Source sheet / layered file reference, license state (§9) |

### 5.4 Attachment zone record (inside a wearable manifest)

| Field | Meaning |
| --- | --- |
| `zone_id` | Unique within the asset |
| `zone_type` | From the shared zone vocabulary: `lapel`, `chest_print`, `vest_panel`, `jacket_panel`, `strap`, `suspender`, `hat_band`, `beanie_fold`, `sleeve`, `back_panel` (extensible by owner-spec addition) `[SETTLED]` vocabulary seeds; formal list `[PROPOSED]` |
| `geometry` | Polygon or ellipse in asset-local normalized coordinates; must lie within the asset's visible alpha `[PROPOSED validation]` |
| `capacity` | Max simultaneous objects (e.g., a lapel holds 2 pins) |
| `allowed_object_classes[]` | `pin`, `button`, `patch`, `sticker`, … |
| `slot_transforms[]` | Designer-set default position/scale/rotation per slot — this is how placement stays deterministic without freeform drag |
| `bust_visible` | Whether the zone is visible in `crop.bust`; invisible zones are valid but flagged in equip UX |

### 5.5 MerchObjectManifest (per button/pin/patch/sticker)

| Field | Meaning |
| --- | --- |
| `object_id`, `slug`, `class`, `version` | Identity; class drives zone eligibility |
| `artwork_ref` | The band/print artwork carried by the object — the actual product `[SETTLED]` framing |
| `allowed_zone_types[]` | Zone types this object may occupy |
| `scale_range`, `rotation_range` | Bounded designer-permitted variation |
| `render_treatment` | Flat, embroidered-patch edge, glossy-button rim, etc. |
| `issuance_ref` | Future link to Print Shop Run/Artifact issuance `[DEFERRED]` — no marketplace semantics |

### 5.6 Layer interaction, validation, and fallback

- **Interactions are declared, not discovered:** hat-over-hair, jacket-over-
  top occlusion, and similar cases resolve through `interaction_rules`
  (variant swap or mask), authored by designers, validated at publish time.
- **Publish-time validation:** manifest schema-valid; zones inside alpha
  bounds; z within family band; compatibility and interaction references
  resolve to published assets; all required crop renders present; capacity and
  transform bounds sane; legibility flags set by QA.
- **Equip-time validation:** object class allowed in zone; capacity free;
  owner actually owns the object (future, §7); configuration references only
  published, compatible assets.
- **Render-time fallback (deterministic degradation):**
  1. Missing/retired layer asset → skip that layer, render the rest, emit a
     telemetry flag; never block the identity render.
  2. Missing/invalid zone for an equipped object → object is visually
     unequipped but stays in the saved configuration for repair.
  3. Unresolvable configuration → community-neutral default configuration.
  4. No configuration and no legacy URL → initials chip, matching the current
     runtime fallback pattern. `[CURRENT RUNTIME]`

---

## 6. Rendering-Context Matrix

One renderer contract, six contexts. Every context consumes the same saved
configuration and a named crop; no context owns avatar creation. `[SETTLED]`

| Context | Crop / size | Visibility | Interaction | Privacy rules | Status |
| --- | --- | --- | --- | --- | --- |
| **Home/Plot top shell** | `crop.bust`, medium; avatar rests on top of the player | Signed-in listener's own avatar | Tap-to-center / expand into Personal Space is design-only direction `[OPEN]`; pull-down profile behavior is the locked interaction `[SETTLED]` | Own-account surface | Slot exists as CSS placeholder, no image wiring `[CURRENT RUNTIME]` |
| **Feed identity rail** | `crop.rail`, small; belly-up, **never circular** `[SETTLED]` | All listener-family cards; same normalized footprint as every source family `[SETTLED]` | None on the avatar itself; card grammar owns actions | Username + support score in rail once the score metric is defined; this system must not invent the score `[SETTLED]` | Design target; requires rail-size legibility QA gate (§10) |
| **Expanded listener profile / collection** | `crop.bust`, large; avatar as transition object between public Home Scene and private space | Own account | Design-only/open; must not become a runtime mandate `[OPEN]` | Private workspace; no public route | `[OPEN]` design direction |
| **Source Dashboard member strip** | `crop.bust`, compact, belly-up per the layout brief `[SETTLED design target]` | Source-facing (manager/member) | Avatars may become links only after identity routing/privacy rules exist `[OPEN]` | Internal tooling may show account-derived visuals today | Runtime currently renders **circular** member chips from `user.avatar` — runtime lags the settled belly-up direction `[CONFLICT: design target vs current runtime]` |
| **Public Artist Profile members** | Headshot treatment, not avatar system | Public | No DM, no permission controls `[SETTLED]` | Source-provided headshots first; listener avatars never the default; no headshot field exists yet in contracts (§3) `[CONFLICT]` | Outside the avatar renderer by design |
| **Discover map / shared-listen presence** | Future | — | — | — | `[DEFERRED]` — not an MVP requirement; the contract's full-body reservation keeps it possible |

Cross-context rules:

- The avatar system never introduces public listener-profile links, DMs, or
  identity disclosure in any context. `[SETTLED]`
- Community switching changes scene skin around the avatar, never the avatar
  contract (§8). `[SETTLED]`
- Every context must implement the §5.6 fallback ladder; no context may
  hard-fail on avatar resolution. `[PROPOSED]`

---

## 7. Personal Space Inventory / Equipping UX

Personal Space (the signed-in listener's private Collection workspace) is the
future inventory and equipping surface for owned patches, pins, buttons,
stickers, and compatible wearables. `[SETTLED]` The collection workspace
already reserves a `Merch` shelf. `[SETTLED]` Equipping runtime is future
work; this section defines the bounded interaction contract so manifests are
authored correctly now.

**Flow (future activation):** `[PROPOSED]`

1. Listener opens Personal Space → Merch shelf → selects an owned object.
2. The avatar preview highlights **eligible worn items** — those whose
   manifests contain a zone matching the object's class with free capacity.
3. Listener selects a highlighted item, then one of its **designer-approved
   zones** (zones render as discrete highlighted targets, not a freeform
   surface).
4. The object snaps to the zone's next free `slot_transform`. Optional
   variation stays inside the designer's declared scale/rotation ranges.
5. Save updates the avatar configuration; every render context picks it up
   through the standard handoff (§12).

**Interaction model decision** — the packet requires a bounded choice:

- **Option A — zone selection (recommended):** tap object → tap highlighted
  zone → snap to designer slot. Deterministic, validates trivially, works on
  touch and pointer, honors the per-asset manifest exactly.
- **Option B — compatible-variant selection:** garments ship pre-composed
  variants (vest, vest+pin-left, …). Simplest renderer but multiplies art
  production combinatorially and breaks the "artwork is the product" model.
- **Option C — constrained drag with zone snapping:** freer feel, more code,
  more failure modes at small sizes; can be layered onto A later.

**Recommendation: Option A now, C as a later enhancement.** `[PROPOSED]`

Boundaries: only owned objects equip; equipping is non-destructive and
reversible; zones invisible in the bust crop are equippable but flagged
("not visible in your current view"); no trading, gifting, or resale
mechanics. `[SETTLED]` Ownership issuance itself belongs to the deferred
Print Shop Run/Artifact lane. `[DEFERRED]`

---

## 8. Community Style-Profile Model

The platform architecture is invariant across every city + state + music
community; avatar architecture must be systemic. `[SETTLED]` Punk boards are
a candidate launch direction, not the platform look. `[SETTLED]`

**Catalog partition model.** `[PROPOSED]` Every asset carries
`style_profiles[]`:

- `core` — a platform-neutral general set available in every community.
- `<community>` sets (e.g., `punk`, `country`, `hiphop`) — additive smaller
  sets layered onto `core`, mirroring the founder-thread "shared general set
  plus community-specific set" direction `[OPEN founder direction]`.
- Style profiles partition **catalog availability only**. They never change
  taxonomy, canvas, zones, validation, or rendering behavior — the same rule
  that lets scene skins vary while product architecture stays fixed.
  `[SETTLED]` principle applied to avatars.

**Open direction — avatar style rooted in the original Home Scene.** The
founder thread suggests a listener's avatar style may stay rooted in their
original Home Scene while community switching changes the surrounding skin.
Not yet promoted into an owner spec. `[OPEN]` Options:

- **Option A — community-agnostic config:** the avatar renders identically
  everywhere; only the scene skin changes. Simplest, fully non-destructive,
  no data migration risk.
- **Option B — provenance-rooted style:** the configuration records the Home
  Scene / style profile in effect at creation (`style_context`), and catalog
  *access* is filtered by provenance; the render still travels unchanged.
- **Option C — per-community wardrobes:** multiple configurations per
  listener keyed by community. Highest art and product cost; risks making
  identity feel disposable.

**Recommendation: render Option A behavior now, but record Option B's
`style_context` provenance field in the configuration from day one** — it is
one inert field that keeps the founder's rooted-style direction activatable
without migration, while committing to nothing. `[PROPOSED]`

---

## 9. Art-Production Workflow

The workflow must let designers author attachment points per asset, and must
end in owned, layered, versioned production files. `[SETTLED]` requirement;
pipeline shape `[PROPOSED]`.

1. **Direction sheets.** Generated boards (e.g.,
   `art/avatar-system/references/legacy-avatar-boards/`) and
   sketches are candidate visual directions only — not approved, not modular,
   not production assets. `[SETTLED]`
2. **Candidate selection.** `tools/midjourney-avatar-picker` crops individual
   tiles and exports a `manifest.json` with source URL, crop bounds, and
   selected cells `[CURRENT RUNTIME]` — use it as a provenance/selection
   record, never as a production pipeline. `[SETTLED]`
3. **Licensing / privacy gate.** Generated candidates inform direction;
   production assets are original layered art authored by designers.
   Direct-use policy for generated imagery is an unresolved licensing
   decision — until settled, treat generated tiles as reference-only.
   `[OPEN]` No real person's likeness enters the avatar catalog.
4. **Layered source authoring.** Designer builds the asset on the master
   full-body canvas template for its silhouette family: separates layers per
   §4.1, supplies required variants (e.g., `compressed` hair), and authors
   the asset's attachment zones and interaction rules directly in the
   manifest.
5. **Manifest lint (automated).** §5.6 publish-time validation.
6. **Visual QA (human).** Render at every named crop/size against light and
   dark scene backdrops; rail-size legibility check for garments and chest
   print zone; identity-diversity check across head bases (§10). Sets
   `legibility_flags`.
7. **Export + naming + versioning.**
   `avatar/<family>/<style-profile>/<slug>/v<major>/<crop>@<size>.png` plus
   `manifest.json`. Breaking geometry/zone changes bump major; additive
   changes bump minor. Saved configurations pin asset majors; retiring a
   major triggers the §5.6 fallback plus a repair path, never silent
   substitution. `[PROPOSED]`
8. **Catalog publication.** Only lint-clean, QA-flagged assets with resolved
   provenance/license state enter the published catalog.

---

## 10. Accessibility, Performance, And Responsive Constraints

`[PROPOSED]` as the QA contract; the small-size and non-visual requirements
derive from settled Feed and identity rules.

**Accessibility.**

- Non-visual label for every avatar render: the username plus "avatar" (e.g.,
  "mika's avatar") — never an outfit enumeration in Feed contexts. Equipped
  item names are exposed as text in Personal Space inventory UI, where they
  are the content.
- Support score and username are text in the rail, never baked into avatar
  imagery. `[SETTLED]`
- Contrast: every garment ships a silhouette/outline treatment validated on
  both light and dark scene backdrops (QA gate §9.6); face core must stay
  readable inside the `safe_zones` at rail size.
- Reduced motion: avatar transitions (center/expand, space entry fades)
  honor the user's reduced-motion preference; static render is always the
  baseline.
- Head-base diversity is an accessibility-adjacent requirement: genuinely
  different face/head shapes and skin tones as authored head-base variants,
  not palette swaps of one face. `[SETTLED]` intent; variant mechanics
  `[PROPOSED]`.

**Performance.**

- Feed lists never composite live: each saved configuration version produces
  a **flattened cached render** per named crop/size; the compositor runs at
  save time (and in Personal Space previews), not per Feed row.
- Size tiers per crop (rail-small, bust-medium, bust-large) with fixed pixel
  budgets set during Dev Spec; assets ship pre-sized exports per §5.3
  `renders{}`.
- Lazy-load with the initials-chip skeleton as the loading state — the same
  visual as the terminal fallback, so failure and loading degrade to the same
  calm state.

**Responsive.**

- The rail crop is one fixed-aspect box across breakpoints; identity-rail
  footprint normalization is owned by the Feed card grammar, not by variable
  avatar sizing. `[SETTLED]`
- The member strip behaves as a responsive container that resizes belly-up
  member visuals as count changes `[SETTLED design target]`; sizing rules
  belong to that package's Dev Spec.

---

## 11. Implementation-Readiness Map

**Current state.** All `[CURRENT RUNTIME]`, observed in named files:

- `User.avatar` is a flat optional URL column (`apps/api/prisma/schema.prisma`
  User model); `Community.avatar` likewise.
- The `ArtistBand` Prisma model has **no** avatar/bio/coverImage columns, yet
  the `ArtistBandProfile` type contract exposes all three as nullable — the
  source-image field is contract-level projection, not a source-owned column.
  (Refines the packet's runtime map, which states both user and source models
  expose flat avatar fields.)
- `PlotTopShell.tsx` has a `listener-avatar-bust` slot rendered as a pure CSS
  placeholder shape — no image URL is wired into it.
- Source Dashboard renders `sourceProfile.avatar` and `member.user.avatar`
  URLs with initials fallbacks; member chips are circular crops.
- No wearable domain, manifest, inventory, renderer, or avatar-editor runtime
  exists anywhere in the named files.
- Net: today is flat-image MVP presentation plus this design contract — not a
  partially built modular engine. `[SETTLED]` packet framing, confirmed.

**Domains needed (design-level contracts, no code/Prisma/API here).**
`[PROPOSED]`

1. **CanvasSpec registry** — §5.2, one per silhouette family.
2. **Asset catalog + manifest registry** — published WearableAssetManifests
   and MerchObjectManifests with versioning (§5.3–5.5, §9.7).
3. **Avatar configuration record** — per listener: head base, hair, optional
   headwear/outerwear, top, face/neck details, attachments
   (object → asset → zone → slot), `style_context` provenance (§8), pinned
   asset majors.
4. **Render pipeline** — save-time compositor + flattened-render cache per
   crop/size; §5.6 fallback ladder.
5. **Configuration → flat-URL bridge** — the flattened bust render's URL is
   written into the existing `User.avatar` field, so every current surface
   keeps working with zero contract change while upgraded surfaces adopt the
   configuration contract. This is the configuration handoff's compatibility
   spine (§12).
6. **Member headshot field** — a source-owned, per-member headshot reference
   to give the settled public-headshot policy a runtime carrier (§3
   `[CONFLICT]` resolution).
7. **Ownership/inventory records** — future, tied to Print Shop Run/Artifact
   issuance when that lane activates. `[DEFERRED]`

**Phasing.** `[PROPOSED]`

- **Phase 0 — contract ratification (docs only):** promote this document's
  settled-compatible parts into an avatar/customization owner spec; ratify
  CanvasSpec, manifest schema, naming/versioning, zone vocabulary.
- **Phase 1 — first vertical slice (§14):** starter catalog + configuration
  record + flattened-render bridge into `User.avatar`; top shell and Feed
  rail consume it.
- **Phase 2 — Personal Space beta creation flow (§12):** bounded picker,
  configuration save, all contexts read the config.
- **Phase 3 — inventory/equipping (§7):** requires Print Shop artifact
  issuance activation and ownership records. `[DEFERRED]` until then.
- **Phase 4 — full-body contexts, map/shared-listen presence, player
  faceplates:** `[DEFERRED]`.

---

## 12. Avatar-Creation Flow (Beta)

**Placement revised 2026-07-12** (founder session
`2026-07-12_avatar-creation-inventory-boundary`, promoted via PR #237 into
`docs/specs/users/identity-roles-capabilities.md`): base avatar creation and
core identity edits live on the **listener account/profile surface** — a
listener creates or revises their base avatar without entering Personal Space
and without holding any collectible. `[SETTLED]` Personal Space/Inventory owns
the collection context only: equip/placement of owned digital merch and wall
decoration (§7). The two are contexts of one avatar composer, not two avatar
systems. `[SETTLED]` This supersedes this document's original packet-settled
"creation in Personal Space" placement. Authentication remains untouched; no
auth provider selection or migration is implied. `[SETTLED]`

**Bounded beta flow.** `[PROPOSED]` scope within the settled placement:

1. Entry: a single "Your avatar" affordance on the listener account/profile
   surface (exact first-run prompt, route, and modal remain unselected per the
   2026-07-12 session).
2. Step 1 — **head base**: choose among genuinely different face/head shapes
   and skin tones (authored variants, not sliders).
3. Step 2 — **hair**: style + a bounded authored color set per style.
4. Step 3 — **starter top**: small `core` set; chest print zone present but
   empty (band merch arrives via future issuance, not the creation flow).
5. Step 4 — **limited details**: a few face details (glasses, piercings) and
   neck details; strictly optional.
6. Save → configuration record persists; compositor produces flattened
   renders; the bust render URL lands in `User.avatar` (§11.5).

Deliberately excluded from beta: outerwear racks, headwear walls, merch
objects, inventory, undo-history editing, randomize buttons, and anything
that reads as a dress-up toy. `[SETTLED]` boundary; the four-step scope
itself is `[PROPOSED]` and remains open founder calibration. `[OPEN]`

**Configuration handoff.** One saved configuration is the single source of
truth. Downstream surfaces never own creation and never store their own
portrait: upgraded surfaces render from the configuration at their named
crop; legacy surfaces read the bridged flat URL. Re-saving regenerates
flattened renders and bumps a config version so caches invalidate
deterministically. Default for never-configured accounts: the initials chip
(current behavior) until first save — assigning a default configuration
instead is a founder choice, §13. `[PROPOSED]`

---

## 13. Open Founder Decisions

Only material decisions; each recommendation is `[PROPOSED]`, none settled.

1. **Default avatar for unconfigured accounts.**
   - A: keep initials chip until the listener creates an avatar.
   - B: auto-assign a neutral `core` configuration at signup.
   - Tradeoff: A makes creation feel earned and avoids clone-crowds of one
     default body; B makes Feed/scene visuals richer immediately but risks a
     sea of identical defaults.
   - **Recommendation: A** — the avatar is identity; let it be chosen.
2. **Equipping interaction model (§7).** A zone-select / B variant sets /
   C constrained drag. **Recommendation: A**, C later.
3. **Community style rooting (§8).** A agnostic / B provenance-rooted
   catalog / C per-community wardrobes. **Recommendation: A behavior with
   B's provenance field recorded now.**
4. **Generated-art usage policy (§9.3).** Reference-only (redraw everything)
   vs. cleaned direct use after legal review. Tradeoff: redraw costs art time
   but guarantees ownership, layer separation, and style consistency;
   generated tiles are flat and unlayered anyway. **Recommendation:
   reference-only; redraw as layered production assets.**
5. **Beta creation scope (§12).** Confirm the four-step scope (head, hair,
   top, limited details) or trim further. **Recommendation: confirm as
   stated** — smaller than this stops proving the modular contract.
6. **Member headshot carrier (§3).** Confirm a source-owned member-headshot
   field so public policy stops depending on listener-account avatars.
   **Recommendation: confirm; treat as part of the artist-profile owner spec,
   not this system.**

---

## 14. First Vertical Slice

One bounded slice that makes current MVP presentation future-compatible
without activating an editor or merch economy. `[PROPOSED]`

**In scope:**

1. Ratify CanvasSpec + manifest schema + zone vocabulary (paper contracts).
2. Commission a starter `core` catalog as layered production assets with
   designer-authored manifests — indicative size: 4 head bases × 6 hair × 6
   tops × a small details set (counts are calibration, not doctrine).
3. Introduce the avatar configuration record and save-time compositor with
   the flattened-render bridge into `User.avatar`.
4. Wire the top-shell `listener-avatar-bust` slot to the bust render; Feed
   identity rail consumes the rail render, belly-up, non-circular, initials
   fallback preserved.
5. Ship the §12 beta creation flow as the only write path to the
   configuration.

**Explicitly out of scope:** inventory/equipping, merch objects, outerwear/
headwear beyond the starter set if trimmed, marketplace anything, full-body,
Source Dashboard member-strip rework (tracked separately against its own
brief), public Artist Profile changes.

**Acceptance criteria:**

- A listener can create, save, and re-edit a base configuration from the
  listener account/profile surface; every render context updates from one save
  with no per-surface uploads. Personal Space remains the later
  inventory/equipment context.
- Swapping a top changes no other layer asset — verified by asset-id diff of
  the rendered layer stack.
- A garment added to the catalog after launch renders on existing avatars
  with zero changes to head/hair assets or saved configurations.
- Feed rail renders pass the rail-size legibility QA gate on light and dark
  backdrops.
- Deleting/retiring a catalog asset degrades per the §5.6 ladder — no blank
  identities, no hard failures.
- No new public routes, links, or identity disclosures exist after the slice.

---

## 15. Rollout Risks

1. **Small-size legibility is the make-or-break constraint.** Garment
   readability at rail size drives the whole merch thesis; gate every asset
   on it (§9.6, §10) rather than discovering failure in Feed.
2. **Editor scope creep.** The beta picker will attract "just add one more
   rack" pressure; the §12 exclusion list and the non-goals in §1 are the
   defense. Any expansion is a founder decision, not a design drift.
3. **Version drift between configurations and catalog.** Without pinned
   majors and the fallback ladder, retiring art breaks identities silently.
   The registry + pinning rules (§9.7) must land with the first slice, not
   after.
4. **Licensing debt.** Shipping generated tiles directly would bake
   un-ownable art into identity infrastructure; the §9.3 gate must precede
   catalog publication. `[OPEN]` until policy is settled.
5. **Identity-boundary erosion.** The moment listener avatars leak into
   public member display (the §3 `[CONFLICT]`), settled privacy policy is
   violated by default-path code. Resolve the headshot carrier before any
   public member-visual work.
6. **Per-community art debt.** Community style sets multiply production
   cost; the `core`-first partition model (§8) keeps launch bounded and
   makes community sets additive rather than obligatory.
7. **Performance regression in Feed.** Live compositing per row would be the
   naive implementation; the flattened-cache rule (§10) is a contract, not
   an optimization to defer.
8. **Placement-rule flattening.** Future implementers will be tempted to
   impose one universal garment anchor map for simplicity; the two-level
   anchor model (§4.2) and per-asset manifests are settled founder direction
   and must survive Dev Spec translation. `[SETTLED]`
