# Avatar Asset Production Matrix

Status: proposed starter catalog and QA sheet
Date: 2026-07-22

Counts below are production targets, not owner-spec doctrine. Approve the
construction and visual style before commissioning the full catalog.

## Starter Catalog

| Family | Construction-sheet minimum | Beta target | Expansion target | Required compatibility work |
| --- | ---: | ---: | ---: | --- |
| Body Base | 3 | 3 | 5 | One neck socket; exposed-skin mask; bust/rail/full crop registration |
| Head-Face Preset | 6 | 12 | 24 | Fits every body neck socket; six skin-tone masks; hat/hair safe zones |
| Skin Tone | 6 | 6 | 8 only after review | Same palette IDs across every head/body; line contrast QA |
| Hair | 6 | 18 including bald | 36 | Back/front split where needed; head compatibility; headwear rule |
| Hair Color | 4 | 8 | 12 | Authored palette; contrast with skin/background/headwear |
| Starter Top | 2 | 8 | 16 | All body variants or declared variants; chest-print zone |
| Outerwear / Strap | 3 | Contract only; optional 4 | 12 | All compatible tops/bodies; local lapel/panel/strap/suspender zones |
| Headwear | 2 | Open: 0 or 4 plain items | 12 | Hair compressed/masked variants; hat-band attachment zone where valid |
| Neck Detail | 2 | 6 | 12 | Head/top compatibility; no chest-print obstruction unless intended |
| Face Detail | 3 | 10 | 24 | Named facial anchors; stack limit; no demographic labels |
| Digital Merch Object | 1 demo button | Deferred | Artifact-led | Allowed zone types, scale/rotation bounds, issuance/provenance reference |

## Head-Face Variety Checklist

The 12 beta presets should vary multiple structural traits rather than repeating
one face:

- overall head width and height;
- jaw/chin geometry;
- cheek/temple shape;
- ear placement/size;
- brow/eye geometry;
- nose treatment;
- mouth/resting expression;
- optional freckles/marks only when they are part of a deliberate preset.

Avoid assigning gender, race, personality, or music-community names to presets.

## Skin Palette Requirements

- Six flat authored values for the initial system.
- Neutral IDs only: `skin-01` to `skin-06`.
- No `light`, `medium`, `dark`, food, ethnicity, or value-laden labels.
- One palette drives head and body exposed-skin masks.
- Validate black/dark ink and reversed/light ink treatments against every tone.
- Do not use color alone to communicate selection.
- A context may render the avatar in monochrome, but it must not overwrite the
  listener's stored tone.

## Visual Style Lock

- Treat every avatar as a stylized fit model, not a specific-person portrait.
- Use strongly differentiated head silhouettes with minimal facial marks.
- Do not use detailed lips, nostrils, cheekbones, eyelashes, wrinkles, realistic
  facial-hair texture, or anatomy shading.
- Keep the base presentation monochrome: black, off-white, and grayscale.
- Use one fluorescent accent sparingly on hair, clothing, or optional
  accessories; never use the accent as skin.
- Communicate music-community context through interchangeable hair, clothing,
  headwear, and accessories rather than fixed facial identity.
- Reject an asset that reads as a completed portrait before evaluating its
  modular fit.
- Render all jackets, vests, cardigans, overshirts, and outerwear open.
- Preserve a clear, unobstructed undershirt chest plane for future readable
  shirt art and wearable merchandise.
- Hide modular seams in assembled renders; the result should read as one
  illustration, with a die-cut sticker edge where the approved context uses it.

## Required Source Package Per Asset

| Deliverable | Requirement |
| --- | --- |
| Layered master | Editable source with named layers and no baked background |
| Transparent render | Lossless source export at the master canvas size |
| Bust render | Named `bust` crop, same geometry across the family |
| Rail render | Named small crop, visually checked rather than blindly scaled |
| Manifest | Asset ID, family, version, compatibility, mount, z band, masks, zones, provenance |
| Preview | Light, dark, city-photo, and community-photo background sheet |
| Rights record | Artist/source, generation/reference provenance, approval and usage status |

## Naming

```text
avatar/<family>/<asset-slug>/<major-version>/
  source/<asset-slug>.kra-or-psd
  renders/<asset-slug>--master.png
  renders/<asset-slug>--bust.png
  renders/<asset-slug>--rail.png
  manifest/<asset-slug>.json
  qa/<asset-slug>--background-check.png
```

Suggested IDs:

```text
body-standard-01
head-face-07
hair-shag-03
top-tee-core-02
outerwear-suspenders-01
detail-nose-ring-01
merch-button-source-id
```

## Attachment-Zone QA

Every wearable with attachments must declare designer-authored local geometry.

| Host | Example zones | Valid objects |
| --- | --- | --- |
| Tee/top | chest print, upper chest | patch, sticker only when approved |
| Jacket/vest | lapel, chest panel, back panel, sleeve | pin, button, patch |
| Suspenders/strap | suspender left/right, strap | pin, button |
| Cap/beanie | hat band, beanie fold | pin, button, patch when size allows |

An object must not render if the host lacks a compatible zone. The object stays
owned and can be re-equipped elsewhere.

## Hair And Headwear QA

- Every headwear asset declares `fits`, `mask`, `compressed`, or `excludes` for
  every beta hair family.
- No hairline gaps, doubled bangs, hat-through-hair, or hidden facial features.
- Bald and very short hair remain valid under every compatible headwear item.
- Hair front/back splits must preserve the same silhouette in bust and rail crops.

## Surface QA

| Surface | Minimum acceptance |
| --- | --- |
| Compact Home/Plot shell | Face and top readable within the framed city-atmosphere area. |
| Expanded Home/Plot shell | Same configuration survives larger centered crop without changing proportions. |
| Feed rail | Belly-up silhouette remains identifiable; merch detail does not become noise. |
| Listener profile | Part choices and fallback states are legible without hover. |
| Personal Space | Compatible equip zones are understandable without unrestricted drag. |
| Source Dashboard internal fallback | Crop remains belly-up and does not imply public listener identity linkage. |

## Approval Sequence

1. Approve R2 layer/identity boundaries.
2. Approve six-tone skin strategy and three-body neck socket.
3. Generate three illustrated/comic construction-sheet styles.
4. Select one style and redraw a tiny layered proof set.
5. Test part swapping, skin masks, hair/headwear, garment zones, bust crop, and
   Feed rail crop.
6. Only then commission the beta catalog counts.
