# UPRISE Active Rooms

Operational snapshot refreshed 2026-08-21. Reverify before granting write access.

## Current app-side rooms

| Room | Task ID | Scope | State | Write authority |
| --- | --- | --- | --- | --- |
| `🟣 UPRISE • Manager • Active` | `01a011fa-7958-7412-9af3-17a942f6cec6` | Project integration, packets, writer assignment, and disposition | Accepted read-only manager | None unless a packet records the lease |
| `🟣 UPRISE • Context Steward • Active` | `01a0233e-1dfd-7b41-8adc-fb38b5709125` | Documentation authority, owner-contract routing, handoff promotion, and stale-doc cleanup | Accepted for the bounded 2026-08-21 documentation packet | This packet only; no product or implementation authority, and no standing lease after its scoped commit is pushed |
| `🟣 UPRISE • Landing Page + Launch Entry • Active` | `019f2f16-1ab2-76c3-92bb-e8d9fe625f02` | Public prelaunch zine, launch activation/transition, and handoff into Registrar/onboarding | Bounded design room; prototype exists; durable handoff required | None unless a packet records the lease |
| `🟣 UPRISE • Marketing + Community Growth • Active` | `01a01ab9-eac5-7090-aaaa-6a14fb690be6` | Campaign/launch roadmaps, positioning, landing/content briefs, media, channels, community outreach, and measurement proposals | Accepted read-only department head | None |
| `🟣 UPRISE • Auditor • Active` | OpenCode `ses_fce524c38ffekfSrg8RxSPkt9T` | Founder-seated Project Gap Analysis Auditor; Stage 1 shallow audit only after Manager gate | Read-only; fixed to `/home/baris/UPRISE_NEXT` at `fable/handoff@636cbd2f` | None; audit evidence only |
| `🟣 UPRISE • Design • Active` | `01a03517-9d8c-7503-8b87-5415212f5c80` | Post-onboarding Listener Profile UX, onboarding continuity, design-reference extraction, and design handoffs | Read-only first packet: extract only relevant patterns from preserved UX worktrees | None; no Landing or implementation authority |

The design room does not own Home/Plot, Registrar internals, Avatar/Wardrobe,
Public Artist Profile, Source Dashboard, Events, or Print Shop. Its next durable
output belongs under `docs/screen-packages/landing-page/`; the existing
visualization prototype is exploration evidence, not production completion.

The Auditor reads `AGENTS.md`, `docs/PLATFORM_START_HERE.md`,
`docs/agent-briefs/CONTEXT_ROUTER.md`, `.pm/OPERATIONAL_MEMORY.md`, and its
routed authority before work. It reports to `🟣 UPRISE • Manager • Active`.
Raw Ox output is evidence for Manager adjudication, not project truth; it does
not enter canon, memory, or implementation authority on its own.

Design does not own the public Landing Page + Launch Entry, whose seat remains
exclusive. Design's first output is a read-only Listener Profile/onboarding
reference handoff from the preserved UX worktrees; it returns to the Manager
for disposition before any design or implementation packet is opened.

## Legacy sessions

| Session | Last known scope | State | Write authority | Action |
| --- | --- | --- | --- | --- |
| `uprise-codex-oss-audit-01` / Codex `01a012ca-dd14-7470-850a-7058e7c6330d` | Independent OSS fit audit | Unpaired legacy session; audit complete and shell resumable | None | Park or bind only to a bounded OSS-audit room |

The Manager granted the Context Steward one documentation-only lease starting
from clean, aligned `fable/handoff` at `66afd375`. The lease covers the scoped
operations reconciliation, landing readiness shell, and factual check-in in
the same pushed commit; it does not survive that commit. No standing writer or
implementation authority is recorded.

Identity, profile, desktop-room, and WSL-checkout bindings live in
`.pm/HERMES_AGENT_REGISTRY.md`.
