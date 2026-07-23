# UPRISE Avatar System Art Project

Status: canonical design-art workspace; no production asset set is approved

This directory is the single repo home for listener-avatar visual research,
system specifications, reference boards, review rounds, approved artwork, and
future developer handoff packages.

Do not create new avatar-system folders elsewhere under `art/` or in external
artifact directories. Windows-visible copies may be used for temporary review,
but this directory remains canonical and every retained result must be filed
here with its prompt and review note.

## Authority

Product behavior remains owned by `docs/specs/**`. The documents in
`specifications/` translate those boundaries into visual and asset-production
requirements; they do not activate an editor, inventory runtime, marketplace,
or new product behavior.

The Claude/Fable R1 specification is the existing architectural foundation.
The R2 contract records later founder-reviewed refinements. New art must fit
that larger system instead of creating a parallel avatar model.

## Directory Map

- `specifications/`
  - Claude/Fable R1 foundation, R2 refinement, source map, production matrix,
    approval plan, and bounded handoff material.
- `research/`
  - Source-backed visual and cultural research used to define asset families.
- `references/`
  - Historical boards and retained comparison material. Reference-only unless
    an approval record says otherwise.
- `rounds/`
  - Versioned exploration batches. Each round keeps its prompt, images, and
    review notes together.
- `approved/`
  - Founder-approved visual directions or individual assets only.
- `production-package/`
  - Layered masters, exports, manifests, compatibility data, and QA evidence
    prepared for a separately authorized implementation task.

## Current State

- R1-R5 style-calibration material is in `rounds/01-style-calibration/`.
- The R5 die-cut ink sheet is the current front-runner, not an approved base.
- The older Avatar Boards are retained under
  `references/legacy-avatar-boards/`.
- No file belongs in `approved/` until the founder explicitly approves it.
- No full catalog should be produced before a modular construction proof passes.

## Batch Rule

Every retained generation batch must include:

1. a bounded prompt or task packet;
2. all comparison outputs using consistent subjects when applicable;
3. a review note recording approved, rejected, or revision-needed status;
4. provenance and rights notes when the source is external or generated;
5. a link from this index or the relevant subdirectory index.
