# Screen Packages

Status: active execution workspace
Owner: context-steward

`docs/screen-packages/**` stores temporary coordination artifacts for UPRISE page, module, screen, or flow work when a shared packet prevents drift. Use this structure for whole pages/modules or major surface boundaries; it is not the default process for every small UI change. Packages should support small vertical slices inside that page/module, not force every slice through Dev Spec, Design Spec, implementation plan, art, review, and hardening ceremony.

## Authority

Screen packages are not product doctrine. Durable product, API, runtime, and data contracts remain in owner specs under `docs/specs/**`. If package work discovers or confirms a durable rule, promote that rule into the owner spec and keep the package as execution history.

## When To Use

Use a package for whole pages/modules, screens, or flows that need shared context across product, implementation, design, assets, or review. Examples: Plot, Artist Profile, Source Dashboard, Discover, Registrar, Release Deck, Print Shop, Archive, Events, and player surfaces.

Do not use this workflow for tiny docs-only, copy-only, test-only, isolated low-risk cleanup slices, or a minor component adjustment inside an already-understood surface; use the lean PR path. Even inside a package, default to one small vertical screen section at a time.

## Standard Shape

```text
docs/screen-packages/<screen-or-flow>/
  README.md
  instruction-packet.md
  source-map.md
  workflow-evaluation.md
  spec/
  design-spec/
  art-handoff/
  implementation/
  review/
  hardening/
```

## Design And Asset Folder Naming

When a package needs visual assets, mockups, prompts, or approved image
references, name the main folder for the screen or section covered. Use a clear
slug such as `source-dashboard`, `release-deck`, `calendar-print-shop`, or
`public-artist-profile`.

Do not use generator IDs, agent names, dates alone, or vague labels as the main
folder name when the screen/section is known.

Recommended asset handoff shape:

```text
docs/screen-packages/<screen-or-flow>/art-handoff/<screen-or-section>/
  prompts/
  mockups/
  approved/
  spec/
```

Use `prompts/` for the initial generation prompt and material references,
`mockups/` for working drafts, `approved/` for the selected visual target, and
`spec/` for the short design handoff that links the visual to the relevant Dev
Spec or Design Spec. Do not store generated mockups in the repo unless the user
approves that specific image as a durable reference.


## Automation Commands

Use the repo-native runner to inspect and advance package gates:

```bash
pnpm run screen-package:flow -- status --package artist-profile-source-dashboard
pnpm run screen-package:flow -- next --package artist-profile-source-dashboard
pnpm run screen-package:flow -- next --package artist-profile-source-dashboard --write
pnpm run screen-package:flow -- scaffold --package <slug> --title "<Title>" --owner-spec docs/specs/<path>.md --lane <lane>
```

The runner is intentionally deterministic and file-based. It checks the required package seed and inventories optional artifacts: slice contract, Dev Spec, Design Spec, package review, art handoff, integration review, and hardening closeout. It does not define mandatory gates, call models, or mutate product truth.

Run its test with:

```bash
pnpm run screen-package:flow:test
```

## Default Slice Shape

- One short slice: one visible screen section or behavior.
- One branch-owning executor.
- Optional `implementation/slice-contract.md` when the next step is not obvious from the package seed.
- Optional Product Design / Design Spec only when visual direction must be settled before implementation.
- Optional review when behavior/risk justifies it.
- Art / Creative Studio waits for approved visual direction and user-approved asset needs.
- Hardening closeout is for large/risky integrated work, not routine package slices.
