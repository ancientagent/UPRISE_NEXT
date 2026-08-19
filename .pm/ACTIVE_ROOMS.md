# UPRISE Active Rooms

Operational snapshot refreshed 2026-08-19. Reverify before granting write access.

## Current app-side rooms

| Room | Task ID | Scope | State | Write authority |
| --- | --- | --- | --- | --- |
| `UPRISE • Manager • Active` | `01a011fa-7958-7412-9af3-17a942f6cec6` | Project integration, packets, writer assignment, and disposition | Accepted read-only manager | None unless a packet records the lease |
| `UPRISE • Landing Page + Launch Entry • Active` | `019f2f16-1ab2-76c3-92bb-e8d9fe625f02` | Public prelaunch zine, launch activation/transition, and handoff into Registrar/onboarding | Bounded design room; prototype exists; durable handoff required | None unless a packet records the lease |

The design room does not own Home/Plot, Registrar internals, Avatar/Wardrobe,
Public Artist Profile, Source Dashboard, Events, or Print Shop. Its next durable
output belongs under `docs/screen-packages/landing-page/`; the existing
visualization prototype is exploration evidence, not production completion.

## Legacy sessions

| Session | Last known scope | State | Write authority | Action |
| --- | --- | --- | --- | --- |
| `uprise-codex-oss-audit-01` / Codex `01a012ca-dd14-7470-850a-7058e7c6330d` | Independent OSS fit audit | Unpaired legacy session; audit complete and shell resumable | None | Park or bind only to a bounded OSS-audit room |

No write-enabled executor is recorded. The checkout was clean at
`6b36b2d9` on `fable/handoff`, aligned 0/0 with `origin/fable/handoff`, before
this room-registry update. The executor contract still requires an accepted
packet and one explicit writer lease before implementation.

Identity, profile, desktop-room, and WSL-checkout bindings live in
`.pm/HERMES_AGENT_REGISTRY.md`.
