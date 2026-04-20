# 2026-04-20 — Artist profile recommendation gate

## What changed
- Artist-profile track rows now support `Recommend` in addition to `Collect`.
- Recommendation is only available once the listener genuinely holds the song.
- The artist-profile payload now includes viewer-specific collected/recommended state so the page can render the correct button state on first load.

## Why
- Founder direction clarified that the artist page is a discovery / listening / recommendation surface outside `RADIYO`.
- The action matrix already requires `Recommend` to be gated by actual ownership/holding.
- The runtime previously offered only `Collect`, which left the artist page short of the intended direct-listen flow.

## Runtime notes
- API: `GET /artist-bands/:id/profile` now resolves viewer-specific `viewerHasCollected` and `viewerHasRecommended` booleans per track when a matching signal exists.
- API: `POST /signals/:id/recommend` now rejects listeners who do not already hold the signal in one of their collections.
- Web: artist-page song rows render `Recommend` only when the listener already holds the song.

## Guardrails preserved
- No wheel on the artist page.
- No `Blast` on the artist page.
- No feed-card inline recommendation.
- Recommendation remains downstream of listening + holding, not a drive-by card action.
