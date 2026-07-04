# Screen Packages

Status: active execution workspace
Owner: context-steward

`docs/screen-packages/**` stores temporary coordination artifacts for major UPRISE screen or flow work. These packages help Dev Spec, Design Spec, implementation, art, review, and hardening agents work from the same packet without turning chat or Linear into product truth.

## Authority

Screen packages are not product doctrine. Durable product, API, runtime, and data contracts remain in owner specs under `docs/specs/**`. If package work discovers or confirms a durable rule, promote that rule into the owner spec and keep the package as execution history.

## When To Use

Use a package for major screens/flows that need coordinated product narrative, design direction, implementation, assets, review, and hardening. Examples: Plot, Artist Profile, Source Dashboard, Discover, Registrar, Release Deck, Print Shop, Archive, Events, and player surfaces.

Do not use this workflow for tiny docs-only, copy-only, test-only, or isolated low-risk cleanup slices; use the lean PR path.

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

The runner is intentionally deterministic and file-based. It models the same gates that a future LangGraph runner would orchestrate: package seed, Dev Spec, Design Spec, spec-package review, implementation plan, art handoff, integration review, and hardening closeout. It does not call models or mutate product truth.

Run its test with:

```bash
pnpm run screen-package:flow:test
```

## Required Gates

- One shared instruction packet before Dev Spec and Design Spec split.
- Dev Spec and Design Spec reviewed together before implementation starts.
- File/surface ownership assigned before implementation.
- Art / Creative Studio waits for an approved Design Spec.
- Integrated review checks dev and design work together.
- Hardening owns tests, accessibility, edge states, copy consistency, regression locks, and closeout.
