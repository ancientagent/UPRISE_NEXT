# Screen Packages

Status: active execution workspace
Owner: context-steward

`docs/screen-packages/**` stores temporary coordination artifacts for UPRISE screen or flow work when a shared packet prevents drift. Packages should support small vertical slices, not force every slice through Dev Spec, Design Spec, implementation plan, art, review, and hardening ceremony.

## Authority

Screen packages are not product doctrine. Durable product, API, runtime, and data contracts remain in owner specs under `docs/specs/**`. If package work discovers or confirms a durable rule, promote that rule into the owner spec and keep the package as execution history.

## When To Use

Use a package for screens/flows that need shared context across product, implementation, design, assets, or review. Examples: Plot, Artist Profile, Source Dashboard, Discover, Registrar, Release Deck, Print Shop, Archive, Events, and player surfaces.

Do not use this workflow for tiny docs-only, copy-only, test-only, or isolated low-risk cleanup slices; use the lean PR path. Even inside a package, default to one small vertical screen section at a time.

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
