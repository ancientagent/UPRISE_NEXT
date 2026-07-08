# Artist Profile / Source Dashboard Screen Package

Status: spec package passed; ready for small vertical implementation slice
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

Pick one small vertical section from the passed Dev Spec / Design Spec package and implement it with focused validation. If scope is not obvious, create `implementation/slice-contract.md` first.

Current recommended next slice: implement the `Source Dashboard Release Deck Readiness Slice` from `spec/source-dashboard-release-deck-readiness-dev-spec.md`.

Optional artifacts remain available when risk requires them:

- `implementation/slice-contract.md`
- `art-handoff/creative-brief.md` after the user approves visual/art direction.
- `review/implementation-integration-review.md` for risky integrated dev/design work.
- `hardening/closeout.md` for large/risky closeout.
