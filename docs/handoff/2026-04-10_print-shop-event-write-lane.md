# 2026-04-10 Print Shop Event Write Lane

## Summary
- Added the first real source-facing Print Shop runtime slice.
- Creator-eligible users can now create scene-bound events through `POST /print-shop/events`.
- Eligibility is intentionally narrow:
  - active promoter capability, or
  - linked Artist/Band ownership/membership.

## Runtime
- API:
  - `POST /print-shop/events`
- Web:
  - `/print-shop`
  - creator-only event form
  - Home Scene-resolved community anchor
  - source-facing eligibility copy
- Registrar:
  - now exposes `Open Print Shop` when promoter capability is active

## Guardrails
- No billing/run-purchase runtime added
- No business/promotions runtime widened
- No listener-facing Print Shop flow added
- No full Print Shop artifact system added

## Current Boundaries
- Event creation is real
- Full Print Shop runtime remains deferred
- Current web flow uses resolved Home Scene as the event community anchor
- This is the minimum source-facing creator lane, not the full long-term Print Shop surface
