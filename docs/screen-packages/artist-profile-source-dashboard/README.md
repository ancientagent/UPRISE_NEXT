# Artist Profile / Source Dashboard Screen Package

Status: initial Release Deck readiness slice implemented; additive scheduling client final review active locally
Package owner: current UPRISE implementation owner / Dev Team Manager
Owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Workflow evaluation: `docs/screen-packages/artist-profile-source-dashboard/workflow-evaluation.md`

## Purpose

Coordinate the major page/module workflow for the path where a listener registers and materializes an Artist/Band source through Registrar, operates the source through Source Dashboard, and exposes the public Artist Profile to listeners.

This package exists because Artist Profile, Source Dashboard, Registrar transition,
Release Deck, Calendar/Print Shop, and public profile boundaries touch multiple
page/module surfaces. It should not be copied as the default process for minor
component changes or one-off screen polish.

This package is an execution workspace. Product truth remains in owner specs under `docs/specs/**`.

## Current Artifacts

- `instruction-packet.md` — shared packet for Dev Spec and Design Spec agents.
- `source-map.md` — repo authority, runtime, tests, and handoff links.
- `workflow-evaluation.md` — team-manager evaluation of the proposed workflow.
- `spec/dev-spec.md` — passed Dev Spec gate for runtime/API/test/file-ownership trace.
- `spec/source-dashboard-release-deck-readiness-dev-spec.md` — executor-ready Dev Spec for the `Source Dashboard Release Deck Readiness Slice`.
- `design-spec/ux-plan.md` — passed Design Spec gate for UX hierarchy, states, accessibility, responsive behavior, and art needs.
- `design-spec/artist-dashboard-design-inventory.md` — Product Design inventory and handoff for the next Source Dashboard / Release Deck readiness Dev Spec.
- `design-spec/public-artist-profile-design-inventory.md` — Product Design inventory for the listener-facing public Artist Profile content, states, later lanes, and visual handoff.
- `design-spec/source-dashboard-management-shell-layout-brief.md` — focused Product Design layout brief for the source-management shell mockup, including Profile, Releases, Calendar, release metrics, and the fourth paid ad spot.
- `review/spec-package-review.md` — `Decision: pass`; approves moving to implementation.

## Next Signal

The original `Source Dashboard Release Deck Readiness Slice` is already present
in `apps/web/src/app/source-dashboard/release-deck/page.tsx` with rendered
behavior coverage in `apps/web/__tests__/source-dashboard-runtime.test.ts`.
Do not route another executor to repeat that slice.

Current local additive slice connects the loaded source-owned ready row to the
implemented schedule availability and `soonest` / `chosen` write APIs. Current
owner truth is `docs/specs/media/release-deck-and-eligibility.md`; the older
readiness Dev Spec predates the schedule runtime and remains historical package
evidence where it conflicts. The first read-only review found server capacity,
authorization, atomicity, and client race issues; the sole writer corrected
those findings and the final reviewer gate is pending.

After this scheduling client is locally verified and reviewed, do not infer a
second implementation slice from this package. New Releases graduation,
song-level sect backing, source metrics, replacement, uploads, and paid-ad
runtime each require their own current owner-contract check before execution.

Optional artifacts remain available when risk requires them:

- `implementation/slice-contract.md`
- `art-handoff/creative-brief.md` after the user approves visual/art direction.
- `review/implementation-integration-review.md` for risky integrated dev/design work.
- `hardening/closeout.md` for large/risky closeout.
