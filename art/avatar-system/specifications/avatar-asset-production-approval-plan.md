# UPRISE Avatar Asset Production and Approval Plan

Status: proposed founder-review workflow
Date: 2026-07-22
Scope: art direction, modular asset creation, review, and production packaging

## Purpose

This plan governs the avatar art process from the first style comparison through
the final developer-ready asset package. The founder approves or rejects work at
each gate. Approval never authorizes runtime implementation, data-model changes,
new product behavior, or silent expansion of the asset inventory.

The governing system contract is `avatar-system-contract-r2.md`. The expected
asset families and provisional quantities are in `asset-production-matrix.md`.

## Responsibility Boundary

The Product Design/Creative Production lane owns:

- visual exploration and comparison sheets;
- modular avatar artwork and editable source files;
- transparent exports, identifiers, anchors, and compatibility metadata;
- assembly previews and visual QA;
- approval records and the final asset handoff.

This lane does not own:

- the avatar editor, renderer, API, persistence, or account flow;
- Personal Space implementation;
- production routes or database contracts;
- public Artist Profile headshots;
- new digital-merch economics or marketplace behavior.

## Approval Rule

Every batch stops at a founder review gate. The available decisions are:

- **Approve:** the named output becomes a locked input to the next stage.
- **Approve with listed corrections:** only the listed corrections may be made.
- **Revise:** the batch remains unapproved and a numbered revision is produced.
- **Reject:** the batch is excluded from production but retained as labeled
  history unless the founder explicitly requests deletion.

An approval applies only to the specific batch and revision named in the review
record. Later stages may not quietly change an approved silhouette, proportion,
palette, line language, neck socket, layer order, or attachment rule.

## Batch Contract

Each review batch must contain:

1. Batch ID, revision, purpose, and current status.
2. Source documents and visual references used.
3. Inherited approved decisions that cannot change.
4. Exact items created and exact items intentionally omitted.
5. A contact sheet at consistent scale.
6. Relevant small-context and large-context previews.
7. Prompt or construction notes sufficient to reproduce the work.
8. Known defects, compatibility limits, and unresolved questions.
9. A short founder decision record.

Allowed statuses are `DRAFT`, `IN REVIEW`, `APPROVED`, `REJECTED`, and
`SUPERSEDED`.

## Production Stages

### Stage 0 - Contract Baseline

Current state: complete, pending founder acceptance as the production baseline.

Inputs:

- prior Claude/Fable avatar-system specification;
- current repo specs, founder sessions, runtime consumers, and art references;
- `avatar-system-contract-r2.md`;
- `asset-production-matrix.md`.

Gate 0 decision:

- accept combined head-face presets with separate hair;
- accept three neutral body bases sharing one neck socket;
- accept six authored selectable skin tones;
- accept base editing in listener account/profile and equipment in Personal
  Space.

No art direction is locked at this stage.

### Stage 1 - Style Calibration

Current state: complete.

Gate 1 decision recorded 2026-07-23:

- selected direction: classic black-ink illustrated listener avatars already
  used in Plot/Home Scene work;
- primary character-language anchor:
  `art/avatar-system/references/legacy-avatar-boards/0_3 (1).jpeg`;
- context anchors:
  `art/mockups/a43315d7-5c4f-4638-bab3-90f3a4b43591.png` and
  `art/mockups/Gemini_Generated_Image_1mao4j1mao4j1mao.png`;
- R4/R5 experimental sheets remain historical exploration and are not the
  production baseline.

Create three independent illustrated/comic directions using the same controlled
character requirements. These are art-direction proofs, not production assets.

Each direction must demonstrate:

- several genuinely different head and face silhouettes;
- belly-up readability with usable shirt, jacket, or vest area;
- light-through-dark skin-tone handling without changing geometry;
- multiple hair silhouettes, including a bald option;
- at least one hat or beanie interaction;
- color and monochrome/xerox viability;
- feed-size readability and larger top-shell presence;
- stylized human identity without photorealism or rigid demographic labels.

All directions inherit the founder art-direction lock: heavily stylized,
facially ambiguous fit models; minimal face marks; monochrome black, off-white,
and grayscale; and one restrained fluorescent accent outside skin.

Gate 1 decision:

- approve one direction;
- request a specific revision;
- reject all three and authorize another calibration round.

No blending of directions occurs unless the founder names the exact traits to
combine.

### Stage 2 - Modular Construction Proof

Current state: in progress under
`rounds/02-modular-construction-proof/classic-plot-avatar-r1/`.

Rebuild a small subset of the approved direction as separated production parts.
This proves that the chosen look can function as a system before the full asset
count is produced.

Minimum proof set:

- all three body bases;
- three distinct head-face presets;
- six skin-tone applications;
- four hair options plus one bald configuration;
- two starter tops;
- one outerwear or suspender example;
- one headwear example;
- one face detail and one neck detail;
- one button or patch attached to an approved host zone.

Required tests:

- every head joins every body at the same neck socket;
- hair does not expose gaps around the head;
- headwear follows the declared hair-compatibility rule;
- garments cover the intended body geometry;
- skin recoloring does not recolor hair, garments, ink, or accessories;
- the assembled avatar remains readable in the approved UI crops.

Gate 2 decision: approve the construction language and anchors before expansion.

### Stage 3 - Core Identity Set

Produce the approved core identity inventory from the production matrix:

- three body bases;
- twelve beta head-face presets;
- six skin tones;
- eighteen hair options including bald;
- the approved bounded hair-color palette.

The contact sheet must show variety in silhouette and features, not one repeated
face with different hair. Neutral IDs are used instead of gender, race,
personality, or attractiveness labels.

Gate 3 decision: approve, revise, or reject individual assets. Approval may be
item-specific; unapproved items do not block already approved items from being
recorded, but the stage does not close until the required coverage is accepted.

### Stage 4 - Clothing and Headwear Fit Set

Produce the initial starter clothing and compatibility examples:

- starter tops;
- the approved initial outerwear set;
- suspenders as outerwear/straps, not as a body base;
- approved initial headwear;
- host-local attachment zones for patches and buttons.

Each clothing asset must declare compatible body bases or provide the required
body variants. Buttons and patches remain separate digital-merch objects; they
are not permanently painted into starter garments.

Gate 4 decision: approve fit, layer order, and attachment-zone behavior.

### Stage 5 - Details and Digital-Merch Proofs

Produce the approved limited detail set:

- neck details;
- face details such as glasses, piercings, and tattoos;
- a minimal button and patch proof set;
- placement examples on suspenders, hats, lapels, jackets, or other authorized
  host zones.

This stage proves attachment behavior. It does not create a marketplace catalog
or authorize collectible/economy rules.

Gate 5 decision: approve visual hierarchy, placement, and host compatibility.

### Stage 6 - Surface and Crop Verification

Render the same saved avatar configuration across the known contexts:

- compact Home/Plot top shell;
- expanded Home/Plot top shell;
- listener Feed source rail, belly-up and not circular;
- listener profile;
- Personal Space/Inventory;
- Source Dashboard internal fallback where permitted.

Public Artist Profile member images remain source headshots and are outside this
avatar renderer.

Gate 6 decision: approve context consistency and identify any asset that fails a
required crop or scale.

### Stage 7 - Production Package and Developer Handoff

Assemble only approved assets into a versioned package containing:

- editable source files;
- transparent production exports;
- contact sheets and approved reference renders;
- asset manifest with stable IDs, layer family, dimensions, anchors, z-order,
  compatible hosts, and variants;
- palette definitions and recolor masks;
- attachment-zone metadata;
- QA results and known limitations;
- rejected/superseded index kept outside the production manifest;
- implementation handoff referencing the existing system contract.

Gate 7 decision: final founder approval of the production asset package. Runtime
implementation begins only under a separate developer task.

## Storage and Promotion

During review, work stays in the canonical repo project at
`art/avatar-system/`. Each round gets its own batch folder and keeps its prompt,
references, outputs, and review note together. A Windows-visible review copy is
temporary and must not become a second source of truth.

Recommended review structure:

```text
art/avatar-system/
  references/
  rounds/
    01-style-calibration/
    02-construction-proof/
    03-core-identity-set/
    04-clothing-fit-set/
    05-details-merch-proofs/
    06-surface-verification/
  approved/
  rejected-reference/
  production-package/
```

No draft is promoted to `approved/` without an explicit founder decision. No
asset is moved into the repo or runtime bundle until the final package path and
implementation owner are authorized.

## Skill and Tool Routing

- Product Design audit: constraints, comparison criteria, and approval review.
- Product Design ideate: three independent style directions.
- Creative Production: visual generation, controlled revision, and source
  preservation.
- Image generation: concept exploration only until a style is approved.
- Visualize: layer, anchor, compatibility, and handoff diagrams.
- Figma/component tooling: structured modular construction after Gate 1, when
  useful for the selected art style.
- Local scripted checks: dimensions, transparency, registration, naming, and
  combination coverage.

Tools are selected by stage. Adding more tools does not override the batch
contract or approval gate.

## Drift Controls

- Do not make the avatar photorealistic.
- Do not produce portrait-specific faces or realistic anatomy detail.
- Do not exceed the monochrome-plus-one-accent base treatment without a new
  founder decision.
- Do not close outerwear over the undershirt or obstruct its printable chest
  area.
- Do not let modular construction seams make the assembled avatar read as a
  paper-doll diagram instead of a cohesive illustration.
- Do not label body/head choices by gender, race, personality, or desirability.
- Do not reduce skin choice to only light and dark without a new founder lock.
- Do not treat the avatar as an NFT, collectible identity, or source/band image.
- Do not merge account/profile creation with Personal Space equipment.
- Do not use circular crops where the approved feed rail requires belly-up
  clothing visibility.
- Do not create full-body dependencies before a full-body surface is activated.
- Do not mass-produce assets before the relevant gate is approved.
- Do not delete rejected work without explicit founder instruction.

## Immediate Next Batch

The R5 punk/skin comparison is the latest retained style-calibration batch.
The founder must select an R5 direction at Gate 1 before it advances. After
that approval, use the selected direction for one modular construction proof:
interchangeable body, head-face preset, hair, open outerwear, readable starter
top, and one compatible button or patch.

The construction proof starts only after Gate 0 is accepted or corrected and
Gate 1 records the selected visual direction.
