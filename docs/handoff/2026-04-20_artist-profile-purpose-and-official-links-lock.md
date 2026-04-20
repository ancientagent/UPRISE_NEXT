# 2026-04-20 — Artist Profile Purpose And Official Links Lock

## Summary
Locked the artist profile more explicitly so future sessions stop treating it as a narrow preview-only surface.

## What changed
- `docs/solutions/MVP_ARTIST_PROFILE_FOUNDER_LOCK_R1.md`
  - reframed the artist profile as a direct-listen, discovery, and information surface outside `RADIYO`
  - locked the page role as a place to:
    - discover the artist
    - listen to songs directly from the artist page
    - learn about the artist
    - share artist information
    - collect songs from the artist-page listening context
    - reach official artist-controlled off-platform destinations when configured
  - added official outbound-link language for merch, album purchase, donation/support, and other official external destinations
  - kept the no-wheel and no-`Blast` boundaries intact
- `docs/solutions/MVP_ARTIST_PROFILE_DOC_AUDIT_R1.md`
  - updated the audit summary to use direct-listen language instead of demo-listen language
  - aligned the carry-forward notes with the official outbound-link lock
- `docs/solutions/EXTERNAL_ASSISTANT_REPO_BRIEF_R1.md`
  - updated the external-assistant briefing so outside tools stop describing the artist page as a demo-only surface
- `docs/handoff/2026-04-16_notebooklm_artist-profile-and-dashboard_briefing.md`
  - synced the external-memory briefing to the newer artist-profile purpose lock
- `apps/web/src/app/artist-bands/[id]/page.tsx`
  - removed the user-facing `Demo` wording from the listening area
- `apps/web/__tests__/community-artist-page-lock.test.ts`
  - updated the route lock to match the newer artist-page copy

## Result
The repo now describes the artist profile as a direct-listen and discovery page rather than a narrow demo surface, and the live artist-page copy no longer teaches the wrong concept.

## Remaining gaps
- The page still needs a fuller official outbound-link area in runtime if those links are configured.
- Feed-insert click handoff into artist-profile listening remains a follow-on slice.
- Recommendation/sharing behavior from the artist context is now part of the page purpose, but not all of that pathway is built out yet.

## Verification
- `pnpm --filter web test -- community-artist-page-lock`
- `pnpm run docs:lint`
- `git diff --check`
