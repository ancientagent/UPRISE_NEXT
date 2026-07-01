# Plot Archive And Registrar Placement Founder Session

Status: raw founder-session capture
Date: 2026-07-01
Source: current chat/session
Related lane(s): UX_UI, REGISTRAR_GOVERNANCE, EVENTS_ARCHIVE
Owner spec candidates: docs/specs/communities/plot-and-scene-plot.md, docs/specs/system/registrar.md, docs/agent-briefs/UI_CURRENT.md

## Raw Founder Notes

> yeah so i kind of remember talking about this becasue we were trying to figure out where the best place for the registrar would be, I thought we likely made it a part of the archives screen. otherwise I dont see what the point of what you are describing as the rest seem either unnecessary, at least to have forced in a box,  so was it supposed to have different information in each plot window?

> yeah i dont like this, get rid of it, the source selector can be linked from their profile and i dont even know what the other feature is for

> remove all mention of the deprecated community-information label

> the registrar should be on top and records should be below it

## Clarifications

- The forced non-expanded Plot context grouping should be removed rather than preserved as a permanent surface.
- Type: settled
- Likely owner: docs/specs/communities/plot-and-scene-plot.md

- Registrar placement should be handled through Archive/community information or a future dedicated owner-spec slice, not as a forced always-visible Plot companion box. When rendered there, the Registrar entry/control belongs at the top and registrar records/status history belong below it.
- Type: settled
- Likely owner: docs/specs/communities/plot-and-scene-plot.md and docs/specs/system/registrar.md

- Source selector access should move toward the listener profile/source identity path, not the non-expanded Plot body.
- Type: settled
- Likely owner: apps/web/src/app/plot/page.tsx and Plot regression tests after spec confirmation

## Feature Sets

- Plot Archive / community information civic information placement
- Raw basis: "I thought we likely made it a part of the archives screen."
- Included behavior:
  - Registrar and deeper community information may belong in Archive / community information rather than a forced always-visible context column.
  - Registrar should appear on top, with records/status history below.
  - The current grouped context box should not become permanent unless it has explicit per-tab purpose.
- Excluded / not activated:
  - No source selector implementation inside profile in this slice.
  - No new Registrar module design in this slice.
- Status: implementation-ready for removal of the forced non-expanded Plot panel

## Working Interpretation

- The current extracted component preserved existing runtime behavior, but that behavior is now rejected as forced Plot furniture.
- Remove the non-expanded Plot context panel and keep Source/Registrar placement as a separate follow-up if needed.
- Replace the deprecated community-information label with plain Archive/community information wording.

## Promotion Targets

- Owner spec: docs/specs/communities/plot-and-scene-plot.md
- Lane brief: docs/agent-briefs/UI_CURRENT.md
- Tests/runtime: apps/web/src/app/plot/page.tsx, apps/web/__tests__/plot-ux-regression-lock.test.ts
- Linear/PM: docs/operations/ACTIVE_PM.md if this becomes the next active slice

## Do Not Drift

- Do not treat the current right-column context grouping as permanent product truth just because it exists in runtime.
- Do not call this a sidebar.
- Do not force Registrar into a generic Plot context box. When Registrar is rendered in Archive/community information, put Registrar on top and records/status history below.
