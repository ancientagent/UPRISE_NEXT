# Agent Section Briefs

Purpose: give agents a small, section-specific context packet when work shifts into a product area.

These briefs are not canon replacements. They are routing documents that point agents to the current repo truth for a section and summarize the active locks that are easy to forget.

## Authority
If anything conflicts, use this order:
1. `AGENTS.md`
2. `docs/canon/`
3. active `docs/specs/`
4. current section brief in this folder
5. active founder locks / solution docs linked by the brief
6. current code/runtime evidence
7. dated handoffs
8. chat memory

If a section brief is stale, patch the section brief in the same pass as the product correction.

## How To Use
When the user says a session is about a section, load `CONTEXT_ROUTER.md` after the core repo entry docs, then load the matching brief for the active focus lane.

The brief is the default section context. It is not an instruction to read every linked document.

Use the linked docs selectively:
- Orientation / design prompt: read the matching section brief; pull more only if the brief is ambiguous.
- Runtime UI/API change: read the brief, the exact files being edited, and the one lock/spec that authorizes the behavior.
- Spec/canon edit: read the brief, the exact spec/canon file in scope, and any directly referenced authority.
- Canon-sensitive work: use `CONTEXT_ROUTER.md` to identify the specific canon document for the domain; do not bulk-load every canon file by default.
- QA/review: read the brief, the target route/files, and the test/handoff tied to the branch state if needed.

Current briefs:
- `CONTEXT_ROUTER.md` - work-lane routing map; use first to decide which section brief and companion briefs are needed.
- `UI_CURRENT.md` - frontend/app UI, Home/Plot, player/profile interaction, Artist Profile, Feed/Events/Archive, design-agent handoff.
- `ACTIONS_AND_SIGNALS.md` - listener actions, signal/action boundaries, engagement wheel split, and stale `Add` / `Support` wording.
- `ARTIST_PROFILE_SOURCE_DASHBOARD.md` - public Artist Profile, Source Dashboard, Release Deck, Print Shop, and source account switching.
- `EVENTS_ARCHIVE.md` - Plot Events, Archive, event calendar behavior, event-bound artifacts, and descriptive stats/history boundaries.

Planned brief families:
- `ONBOARDING_HOME_SCENE.md` - onboarding, Home Scene resolution, GPS/pioneer fallback, registrar questions.
- `EXTERNAL_TOOLS.md` - NotebookLM, Claude Designer, Abacus, Stitch, and other assistant handoff rules.

## Maintenance Rule
Whenever a founder correction changes a section's active truth:
- update the affected spec/founder lock first
- update the matching section brief second
- add a dated handoff if runtime/docs behavior materially changed
- update `docs/CHANGELOG.md` when required by repo policy

The goal is to let future agents start from `docs/agent-briefs/<SECTION>.md` instead of rediscovering the same screen rules from long chat history.
