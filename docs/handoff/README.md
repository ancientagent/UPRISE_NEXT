# Handoff

Dated execution notes, QA reports, closeout memos, and carry-forward corrections live here.

## Use This Folder For
- execution summaries tied to a date/commit
- QA reports and closeout notes
- reconciliation / carry-forward notes when multiple agents touched the same topic
- phase or batch summaries

## Do Not Use This Folder For
- canon/product semantics
- long-term feature specifications
- parallel “memory” docs for the same issue when one reconciliation note will do

## How To Read Handoffs Safely
- Treat handoffs as lower authority than current specs and current code.
- Prefer the latest relevant dated handoff over older notes on the same topic.
- If a handoff conflicts with current `HEAD`, call it out as stale instead of carrying it forward.

## Current High-Value Handoffs
- [`2026-04-26_listener-profile-source-management-separation.md`](./2026-04-26_listener-profile-source-management-separation.md) — locks the distinction between listener user profile, public Artist Profile, and separate source-management surface/domain.
- [`2026-04-25_missing-focus-lane-briefs.md`](./2026-04-25_missing-focus-lane-briefs.md) — closes the missing business, onboarding, registrar, and external-tool lane brief gaps called out by the focus-stage inventory.
- [`2026-04-25_cloud-codex-stale-language-audit-cleanup.md`](./2026-04-25_cloud-codex-stale-language-audit-cleanup.md) — accepted Cloud Codex stale-language audit cleanup for active Plot/Archive/Discover-placeholder docs.
- [`2026-04-25_context-router-focus-lanes.md`](./2026-04-25_context-router-focus-lanes.md) — current focus-lane context router for loading only the work area and companion briefs a task needs.
- [`2026-04-25_section-briefs-and-stale-term-guard.md`](./2026-04-25_section-briefs-and-stale-term-guard.md) — current section-brief expansion and targeted stale-term docs lint guard for active agent-facing context.
- [`2026-04-25_agent-section-briefs.md`](./2026-04-25_agent-section-briefs.md) — current section-specific agent brief system and maintenance rule.
- [`2026-04-18_handoff-staleness-reconciliation.md`](./2026-04-18_handoff-staleness-reconciliation.md) — current guide to which older handoffs are historical-only versus still useful carry-forward.
- [`2026-04-18_repo-authority-map-and-wiki-steering.md`](./2026-04-18_repo-authority-map-and-wiki-steering.md) — current repo authority and generated-wiki steering layer for external assistants.
- [`2026-04-18_art-department-structure.md`](./2026-04-18_art-department-structure.md) — current art/design workspace structure.
- [`2026-04-17_abacus-external-assistant-briefing.md`](./2026-04-17_abacus-external-assistant-briefing.md) — current external-assistant setup context.
- [`2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`](./2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md) — current curated briefing for artist-profile/source-dashboard questions.
- [`2026-04-16_discover-feed-insert-and-artist-demo-lock.md`](./2026-04-16_discover-feed-insert-and-artist-demo-lock.md) — current discovery-to-artist-profile demo-listen lock.
- [`2026-04-16_discover-deferred-local-only-mvp.md`](./2026-04-16_discover-deferred-local-only-mvp.md) — current MVP Discover deferment and feed-insert position.

## Finding Relevant Notes
Use search instead of reading large historical batches by default.

Examples:
```bash
rg -n "discover|plot|onboarding|registrar" docs/handoff
find docs/handoff -maxdepth 1 -type f | sort | tail -n 40
```

## Templates
- [`TEMPLATE_agent-handoff.md`](./TEMPLATE_agent-handoff.md)
- [`TEMPLATE_handoff-phase.md`](./TEMPLATE_handoff-phase.md)

## Coordination Control Plane
- [`agent-control/README.md`](./agent-control/README.md)
- [`agent-control/AGENT_DIRECTIVES.md`](./agent-control/AGENT_DIRECTIVES.md)

## Historical Material
Older phase notes and large slice batches remain in this folder for traceability, but they are historical context, not default reading.
