# Artist Profile / Source Dashboard Screen Package

Status: spec package passed; ready for small vertical implementation slice
Package owner: current UPRISE implementation owner / Dev Team Manager
Owner spec: `docs/specs/users/artist-profile-and-source-dashboard.md`
Workflow evaluation: `docs/screen-packages/artist-profile-source-dashboard/workflow-evaluation.md`

## Purpose

Coordinate the major-screen workflow for the path where a listener registers and materializes an Artist/Band source through Registrar, operates the source through Source Dashboard, and exposes the public Artist Profile to listeners.

This package is an execution workspace. Product truth remains in owner specs under `docs/specs/**`.

## Current Artifacts

- `instruction-packet.md` — shared packet for Dev Spec and Design Spec agents.
- `source-map.md` — repo authority, runtime, tests, and handoff links.
- `workflow-evaluation.md` — team-manager evaluation of the proposed workflow.
- `spec/dev-spec.md` — passed Dev Spec gate for runtime/API/test/file-ownership trace.
- `design-spec/ux-plan.md` — passed Design Spec gate for UX hierarchy, states, accessibility, responsive behavior, and art needs.
- `review/spec-package-review.md` — `Decision: pass`; approves moving to implementation.

## Next Signal

Pick one small vertical section from the passed Dev Spec / Design Spec package and implement it with focused validation. If scope is not obvious, create `implementation/slice-contract.md` first.

Optional artifacts remain available when risk requires them:

- `implementation/slice-contract.md`
- `art-handoff/creative-brief.md` after the user approves visual/art direction.
- `review/implementation-integration-review.md` for risky integrated dev/design work.
- `hardening/closeout.md` for large/risky closeout.
