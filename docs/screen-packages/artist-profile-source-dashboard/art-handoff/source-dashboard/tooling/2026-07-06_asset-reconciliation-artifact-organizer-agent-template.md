# Asset Reconciliation / Artifact Organizer Agent Template

Status: reusable execution packet template
Date: 2026-07-06
Applies to: UPRISE screen-package visual asset reconciliation
Default package context: `docs/screen-packages/artist-profile-source-dashboard/`

## Purpose

Use this packet to run an asset reconciliation pass after a screen has:

- an approved mockup;
- an approved Dev Spec / Design Spec;
- an implemented branch or PR;
- a named target screen or section.

The output is a dev-ready artifact packet that tells an implementation agent what visual elements are code-native, already available as repo assets, missing, fake/placeholder, or reference-only styling.

Do not use this packet to redesign, reinterpret the approved mockup, edit runtime code, generate new assets, or slice ordinary UI controls out of a mockup.

## Required Inputs

Fill these before starting. If any required input is missing, produce a blocked packet instead of guessing.

```md
Approved mockup image:
Approved Dev Spec / Design Spec:
Implemented branch or PR:
Repo: `/home/baris/UPRISE_NEXT`
Target screen/section:
Artifact output path:
```

Recommended Source Dashboard defaults:

```md
Approved mockup image:
`docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/2026-07-06_source-dashboard-report-paper_desktop-1487x1058_v01.png`

Approved Dev Spec / Design Spec:
`docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-management-shell-dev-spec.md`
`docs/screen-packages/artist-profile-source-dashboard/spec/source-dashboard-release-deck-readiness-dev-spec.md`
`docs/screen-packages/artist-profile-source-dashboard/design-spec/source-dashboard-management-shell-layout-brief.md`

Repo:
`/home/baris/UPRISE_NEXT`

Target screen/section:
`Source Dashboard / report-paper source file`
```

## Skills And Tools

Use:

- artifact-publisher / artifact template as the primary output path when available.
- Product Design `get-context` only in playback mode to restate the already-approved brief.
- Product Design `audit` to compare approved mockup, Dev Spec, and implemented UI evidence.
- Repo/spec intake from local docs and current repo files.
- GitHub/PR tooling only when the implementation reference is a PR.
- Browser screenshot tooling only when the implementation route is available and needs current visual evidence.

Do not use:

- Product Design `ideate`
- Product Design `image-to-code`
- `figma-generate-design`
- `figma-generate-library`
- Figma tools unless a Figma source is explicitly provided.

## Product Design Playback Brief

Use this pithy playback before audit work. Do not turn it into ideation.

```md
Brief locked: reconcile approved Source Dashboard assets against the approved Dev Spec and the implemented UI. The pass is evidence-only: compare mockup -> spec -> implementation, classify visual elements, identify true missing reusable assets, and produce a dev-ready artifact packet. No redesign, no runtime edits, no generated assets, and no asset extraction until the missing-asset list is reviewed.
```

## Required Workflow

1. Confirm repo state:

```bash
pwd
git rev-parse --show-toplevel
git branch --show-current
git rev-parse --short HEAD
git status --short
```

2. Read local authority:

- `AGENTS.md`
- `docs/PLATFORM_START_HERE.md`
- `docs/AGENT_STRATEGY_AND_HANDOFF.md`
- `docs/agent-briefs/CONTEXT_ROUTER.md`
- active lane briefs for the target screen;
- supplied approved mockup approval note;
- supplied Dev Spec / Design Spec;
- supplied branch/PR implementation evidence.

3. Inspect the approved mockup directly.

4. Inspect the implementation from the supplied branch or PR:

- branch name, commit, and dirty state;
- changed files;
- implemented route/component evidence;
- screenshots or browser captures if available or required by the task.

5. Compare:

- mockup -> Dev Spec / Design Spec;
- Dev Spec / Design Spec -> implementation;
- implementation -> current repo assets.

6. Classify every visible element:

- `code-native UI`
- `existing repo asset`
- `missing asset`
- `placeholder/fake asset`
- `reference-only styling`

7. Recommend only true reusable visual asset work:

- imagery;
- logos;
- illustrations;
- avatars;
- backgrounds;
- textures;
- reusable visual treatments that cannot be code-native.

Do not recommend slicing:

- table rules;
- borders;
- buttons;
- labels;
- form controls;
- icons that should come from the app icon library;
- ordinary UI status chips;
- generic plus/lock/check controls;
- layout panels or cards.

## Artifact Packet Output Shape

Write the packet as Markdown unless artifact-publisher supplies another approved template.

Recommended path:

```text
docs/screen-packages/<package>/art-handoff/<screen-or-section>/tooling/YYYY-MM-DD_<screen>_asset-reconciliation-packet.md
```

Required packet sections:

```md
# <Screen> Asset Reconciliation Packet

Status:
Date:
Repo:
Target screen/section:
Implementation reference:

## A. Evidence Used

- Mockup reference:
- Dev Spec / Design Spec reference:
- Implementation reference:
- Repo asset folders inspected:
- Runtime files inspected:
- Screenshots/captures used:

## B. Current State vs Deferred / Unknown

- Current implementation state:
- Deferred/future items:
- Unknowns:

## C. Visual Element Classification

| Element | Mockup location | Spec authority | Implementation evidence | Classification | Notes |
| --- | --- | --- | --- | --- | --- |

## D. Existing Asset Paths

| Asset | Path | Used where | Approval state | Notes |
| --- | --- | --- | --- | --- |

## E. Missing Asset List

| Missing asset | Needed for | Source reference | Target repo path | Dimensions/aspect ratio | Generation/export recommendation | Approval required |
| --- | --- | --- | --- | --- | --- | --- |

## F. Placeholder / Fake Asset List

| Placeholder | Current implementation | Why fake/placeholder | Replace with | Blocking level |
| --- | --- | --- | --- | --- |

## G. Generate / Export Recommendations

- Recommended now:
- Defer:
- Do not generate:

## H. Target Repo Paths

- Approved assets:
- Mockups:
- Prompts:
- Specs:
- Tooling/artifacts:

## I. Component / State Notes Affected By Assets

- Components:
- States:
- Accessibility concerns:
- Responsive concerns:

## J. Implementation Follow-Up Checklist

- [ ] 

## K. Reviewer Checklist

- [ ] Verify no ordinary UI controls were sliced from the mockup.
- [ ] Verify every stored asset has approval and rights/privacy notes.
- [ ] Verify generated assets do not imply unapproved runtime behavior.
- [ ] Verify implementation can fall back gracefully if optional imagery is absent.
- [ ] Verify mobile and desktop states are not blocked by missing decorative assets.

## L. Conflicts / Blockers

- Mockup vs Dev Spec:
- Dev Spec vs implementation:
- Implementation vs repo assets:
- Missing input blockers:

## M. Final Answer Fields

- Artifact packet path/link:
- Summary of missing assets:
- Can implementation proceed without new assets:
- Is asset generation/export needed next:
```

## Classification Guidance

Use `code-native UI` for:

- tables;
- rules/dividers;
- input fields;
- buttons;
- dropdowns;
- status labels;
- icons available from the app's icon system;
- layout panels;
- typography;
- spacing;
- focus/error/loading states.

Use `existing repo asset` for:

- approved PNG/JPG/SVG files already in the repo;
- repo art references explicitly approved for the target use;
- images with approval notes and rights/privacy coverage.

Use `missing asset` for:

- source logo or band mark if implementation needs a durable non-runtime placeholder;
- approved standalone stamp image if not code-native;
- paper texture if design chooses image texture over CSS;
- approved member avatar set if not runtime data;
- approved album-art placeholders if runtime data is unavailable and visual fidelity requires them.

Use `placeholder/fake asset` for:

- generic squares where source imagery is expected;
- generated-looking art without approval record;
- fake public/private user photos;
- images with unknown provenance;
- screenshots or cache files used as if they were repo assets.

Use `reference-only styling` for:

- paper texture direction if implemented with CSS;
- xerox/ink weight guidance;
- rubber-stamp feel if rendered with type/border styling instead of an image;
- avatar art direction before final avatar assets are approved.

## Source Dashboard Guardrails

- Do not generate or store assets until the missing-asset list is reviewed.
- Do not slice table borders, buttons, checkmarks, lock icons, source selectors, or dropdowns out of the approved mockup.
- Do not treat a mockup-only `Publish`, paid ad, metrics graph, payment account, or member lookup control as implementation authority.
- Do not create upload/storage, billing, metrics, event publication, source messaging, or profile-link assets that imply active runtime behavior.
- Keep approved assets in:
  `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/approved/`
- Keep prompts in:
  `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/prompts/`
- Keep specs and reconciliation packets in:
  `docs/screen-packages/artist-profile-source-dashboard/art-handoff/source-dashboard/spec/`
  or `tooling/` when the packet is operational rather than visual.

## Stop Conditions

Stop and report blocked if:

- approved mockup path is missing;
- approved Dev Spec / Design Spec path is missing;
- implementation branch/PR/link is missing;
- target screen/section is missing;
- implementation cannot be inspected;
- screenshot evidence is required but unavailable;
- mockup, spec, and implementation conflict on product behavior;
- a recommendation would require generating assets before the missing list is approved.

