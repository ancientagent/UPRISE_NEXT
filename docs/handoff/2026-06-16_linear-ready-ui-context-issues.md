# Linear-Ready UI Context Issue Cards (2026-06-16)

Status: draft cards for Linear import
Scope: docs-only cleanup and follow-up planning

## UPR-UI-DOC-01: Lock UI/UX focus packet into future design-agent workflow

Classification: stale/context hygiene
Severity: medium

Problem:
- Future UI/design agents can still reach old mobile-first or screenshot-derived docs before the current lane packet.
- This can cause stale `Promotions` / `Statistics` tab language, standalone Plot assumptions, or profile/source blending to return in mockups.

Evidence:
- `docs/agent-briefs/UPRISE_UI_UX_FOCUS_PACKET_R1.md`
- `docs/agent-briefs/UPRISE_DESIGN_HANDOFF_SCREEN_PACKAGE_R1.md`
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`

Acceptance criteria:
- `docs/agent-briefs/README.md` lists both new UI/UX packets.
- Design-agent prompts reference the design package before legacy visual references.
- Any design handoff for Home/Plot includes baseline, profile-expanded, Feed, Events, Archive, and Artist Profile states.
- No design prompt treats `Promotions` or `Statistics` as current MVP Plot tabs.

## UPR-UI-DOC-02: Extend stale-tab linting to design-facing docs

Classification: stale/context hygiene
Severity: medium

Problem:
- Current active briefs are guarded, but older design-facing solution docs can still contain active-looking stale tab language.
- A future doc edit could reintroduce `Feed / Events / Promotions / Statistics` as current truth without touching runtime code.

Evidence:
- `docs/solutions/MVP_MOBILE_UX_SYSTEM_R1.md`
- `docs/solutions/MVP_SCREENSHOT_ELEMENT_SPEC_R1.md`
- `docs/solutions/MVP_UX_BATCH16_DRIFT_WATCHLIST.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`

Acceptance criteria:
- Docs lint or targeted stale-term check flags current-facing `Promotions` / `Statistics` Plot-tab claims outside explicit historical/deferred context.
- The check allows intentional historical references when the line also marks the language as legacy, historical, deferred, or not current MVP.
- The check is documented in the relevant handoff note or docs lint script comments.

## UPR-UI-ARCHIVE-03: Review Archive runtime after next UI implementation slice

Classification: verification follow-up
Severity: low

Problem:
- The docs now assert Archive is read-only/descriptive, but runtime should be rechecked after the next UI implementation slice to ensure no interactive analytics exploration returns.

Evidence:
- `docs/agent-briefs/UI_CURRENT.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`
- `apps/web/src/app/plot/page.tsx`
- `apps/web/__tests__/plot-ux-regression-lock.test.ts`

Acceptance criteria:
- `/plot` tab set remains exactly `Feed`, `Events`, `Archive`.
- Archive body renders descriptive history/snapshot modules only.
- No default Archive path mounts `StatisticsPanel`, Scene Map exploration, leaderboards, ranking, predictive analytics, or comparative artist scoring.
- Targeted web regression test confirms the tab and Archive-body contract.
