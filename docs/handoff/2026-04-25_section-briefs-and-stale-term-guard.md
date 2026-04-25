# 2026-04-25 — Section Briefs And Stale-Term Guard

## Summary
Expanded the section-specific agent brief system and added a targeted docs lint guard for current agent-facing context.

## Added
- `docs/agent-briefs/ACTIONS_AND_SIGNALS.md`
- `docs/agent-briefs/ARTIST_PROFILE_SOURCE_DASHBOARD.md`
- `docs/agent-briefs/EVENTS_ARCHIVE.md`

## Updated
- `docs/agent-briefs/README.md`
- `docs/solutions/AGENT_WIKI_STEERING_R1.md`
- `.devin/wiki.json`
- `scripts/docs-lint.mjs`
- `docs/CHANGELOG.md`

## Why
The repo had enough active product locks that assigning every agent to read every related document was becoming counterproductive.

These briefs give future agents a narrower read-first packet for:
- action grammar and signal placement
- public Artist Profile and source-side dashboard tools
- Events and Archive/descriptive stats boundaries

## Guardrail
`docs:lint` now scans current agent-facing context files for a small set of known stale phrases:
- `People Are Saying`
- old Plot tab sets with `Promotions` / `Statistics`
- old `RADIYO` wheel phrasing that includes `Blast`
- old artist-page `Follow / Add / Support` action grammar

The guard intentionally does not scan every historical doc. Older docs may preserve stale terms for audit/reconciliation, but current briefs and wiki steering should not teach those terms as active truth.

## Verification
- `node -e "JSON.parse(require('fs').readFileSync('.devin/wiki.json','utf8'))"`
- `pnpm run docs:lint`
- `git diff --check`
