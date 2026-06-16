# 2026-04-11 Artist Source Print Shop Entrypoint

## Summary
- Added a source-facing `Open Print Shop` CTA on artist/band profile pages.
- The CTA appears only when the signed-in user is already a linked member of that Artist/Band source.

## Why
- Live browser QA proved `/print-shop` worked for eligible creator accounts.
- The remaining UX gap was discoverability from the source-facing side of the platform.
- This closes that gap without widening event-authoring access for ordinary listeners.

## Runtime Rule
- Artist/Band profile membership is used as the gate for showing the CTA.
- Non-members still see the public source page, but they do not see the Print Shop creator shortcut.

## QA Target
- Sign in as a linked Artist/Band member.
- Open that source profile.
- Use `Open Print Shop`.
- Confirm `/print-shop` loads with creator eligibility intact.
