# MVP Uizard Prompt Pack R1

Use these prompts directly in Uizard to generate mobile mockups aligned to current UPRISE decisions.

## 0) Global Setup Prompt (paste first)
Design a mobile-first music community app called UPRISE.

Hard constraints:
- Build for phone viewport only (Android-like proportions, compact vertical rhythm).
- Keep a persistent top profile strip in collapsed mode with only: avatar, username, notifications icon, options menu (three dots).
- Keep a persistent player strip below profile in Plot route.
- No desktop layout patterns.
- No generic streaming-platform lookalikes.
- Dark UI, high contrast, compact spacing.
- Emphasize clarity, fast one-handed interactions, and minimal text clutter.
- Bottom nav has 3 anchors: Home (left), central UPRISE logo action button, Discover (right).

Product semantics:
- Two player modes: RADIYO and Collection.
- Expanded profile replaces Plot body area in-place (same route).
- Expanded profile top shows larger avatar + profile details (activity score, band/promoter status if present).
- Expanded profile tabs order:
  1) Singles/Playlists
  2) Events
  3) Merch
  4) Saved Uprises
  5) Saved Promos/Coupons

Do not add “coming soon”, “upgrade”, or speculative CTAs.

---

## 1) Screen Prompt: Plot + Collapsed Profile + RADIYO Mode
Create a mobile screen for UPRISE Plot route with collapsed profile.

Layout order:
1. Collapsed profile strip:
   - left avatar + username
   - right notification bell + options menu
2. Player strip (RADIYO mode):
   - scene title line (ex: Austin, TX Hip-Hop Uprise)
   - compact track area with cover art thumbnail
   - tier controls on right side (National / State / City in vertical stack)
   - mode control for RADIYO/Collection
3. Plot tabs:
   - Feed, Events, Promos, Statistics
4. Plot body card area (Feed selected)
5. Bottom nav:
   - Home, center UPRISE button, Discover

Style goals:
- Compact, proportioned like legacy mobile UI.
- Dense but readable spacing.
- Keep player height tight.

---

## 2) Screen Prompt: Plot + Collapsed Profile + Collection Mode
Create the same mobile Plot screen, but player switched to Collection mode.

Requirements:
- Profile remains collapsed at top.
- Plot tabs and body remain available (no expansion yet).
- Player title changes context to user collection playback.
- Keep same compact player footprint as RADIYO mode.
- Keep bottom nav identical.

---

## 3) Screen Prompt: Expanded Profile - Singles/Playlists (Default)
Create expanded profile state in UPRISE.

Behavior:
- Expanded profile replaces Plot body area (same route, no navigation push).
- Player context remains available.

Layout:
1. Expanded profile header block:
   - larger avatar
   - username/handle
   - activity score
   - band membership status (if applicable)
   - promoter status (if applicable)
2. Profile collection tabs:
   - Singles/Playlists (active), Events, Merch, Saved Uprises, Saved Promos/Coupons
3. Singles/Playlists content:
   - saved singles list
   - playlist groupings

Design:
- Prioritize scannable list cards and quick playback intent.
- Keep spacing compact.

---

## 4) Screen Prompt: Expanded Profile - Events
Create expanded profile with Events tab active.

Content contract:
- Calendar at top.
- Collected event fliers list below calendar.
- Keep same expanded profile header and tab row.

Interaction cues:
- Date chips / month navigation should be visible.
- Flyer cards should feel collectible, not ticketing checkout.

---

## 5) Screen Prompt: Expanded Profile - Merch
Create expanded profile with Merch tab active.

Content contract:
- Category shelves:
  - Posters
  - Shirts
  - Patches
  - Buttons
  - Special Items

Design:
- Shelf/carousel style sections.
- Focus on collectible identity, not generic storefront.

---

## 6) Screen Prompt: Expanded Profile - Saved Uprises
Create expanded profile with Saved Uprises tab active.

Content contract:
- Saved/followed Uprise list.
- Scene identity chips (city/state/community).
- Quick “open scene” style affordance (no extra speculative actions).

---

## 7) Screen Prompt: Expanded Profile - Saved Promos/Coupons
Create expanded profile with Saved Promos/Coupons tab active.

Content contract:
- Promo/coupon cards.
- Show status and expiration clearly.
- Keep visual hierarchy simple and compact.

---

## 8) Optional Refinement Prompt (run after first generation)
Refine this design system for production-ready mobile wireframes:
- Reduce unnecessary text labels.
- Keep all controls thumb-reachable.
- Tighten spacing to preserve legacy compact proportions.
- Keep profile strip and player visually distinct but connected.
- Keep interactions obvious with minimal instructional text.
- Preserve exact tab/menu names and order from the prompt pack.

Return:
- one polished frame per state
- one mini-flow map showing transitions:
  collapsed plot -> expanded profile -> tab switch -> collapse back
