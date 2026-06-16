# MVP Source Dashboard Surface Contract (R1)

Status: Active  
Owner: Founder + product engineering  
Last updated: 2026-04-26

## 1) Purpose
Define the first explicit Source Dashboard surface for source management so source-side tools are clearly separated from the listener profile/community experience.

This contract is implementation-facing and sits under:
- `docs/solutions/MVP_ACCOUNT_SOURCE_SIGNAL_SYSTEM_PLAN_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`

## 2) System Role
Source Dashboard is the source-side operating shell for managing source entities.

It is:
- not a second login tree
- not a public listener surface
- not a rename of Registrar
- not the listener user profile / collection workspace
- not part of the listener's Home/Plot community space

It is:
- the place where authorized users operate a managed source entity
- the place where source-facing tools are grouped
- the source/admin surface that the listener app can read from

Product model:
- listener profile = the in-app profile for everyone who has onboarded as a listener
- source entity = artist/band/promoter/business-style entity registered or attached to users
- source management = a separate source/admin web surface/domain that manages source data

Current MVP implementation note:
- `/source-dashboard` is currently implemented as a route in this web app.
- Treat that route as the current monorepo implementation stand-in for the separate source-management website/domain, not as proof that source tools belong inside the listener profile/community shell.
- Do not discard the current `/source-dashboard` work because it is not physically split onto a separate domain yet; preserve it as the working source-management shell and evolve its entry/routing model.

Future routing direction:
- after Registrar approves/materializes a source entity, the operator should receive a source-dashboard URL/domain for that entity
- clicking that URL/domain opens the managed source dashboard for the approved artist/band/source
- the source-dashboard URL/domain is the source management entry, not the listener profile
- exact domain/subdomain format is deferred until routing/deployment work is scoped

## 3) MVP Entry Rule
The dashboard is available only to signed-in users who manage one or more source entities.

Current managed-source runtime:
- linked Artist/Band entities

Current MVP route / stand-in:
- `/source-dashboard`

Future entry model:
- Registrar materialization/approval should be able to expose the managed source dashboard URL/domain.
- Source operators should enter management through that source-dashboard URL/domain instead of hunting for tools inside the listener app.

Current MVP entrypoints:
- Plot `Source Accounts` switcher
- linked artist/band source page
- direct navigation when a valid source context is already known

Entry-point rule:
- when a managed source page sends a user into source tools, it should set that source as the active source context instead of relying on whichever source was previously active

## 4) Current MVP Surface Structure
### 4.1 Header
Must show:
- `Source Dashboard`
- active source name when selected
- source type / slug / membership role summary
- listener-account return path

### 4.2 Managed Source Selector
Must support:
- selecting between managed source entities
- showing which source entity is currently being operated
- preserving a clear return path back to listener mode when entered from the listener app

Current active runtime:
- Artist/Band entities

### 4.3 Current Context Panel
Must explain:
- which source account is active
- that source tools are being operated from that context
- that source context is operator context even where backend ownership fields are not yet fully modeled
- current Home Scene / GPS / promoter-capability readiness may be surfaced there as descriptive state, not as a separate admin module

### 4.4 Live Tool Cards
Current MVP live cards:
- `Release Deck`
- `Source Profile`
- `Print Shop`
- `Registrar`

No placeholder tool cards.
Do not add fake analytics, billing, or growth modules.

### 4.5 Release Deck Runtime Slice
Current artist-side creator tool now live:
- `Release Deck`

Current locked direction:
- Release Deck belongs inside Source Dashboard
- it should not be modeled as a listener/public upload path
- it should expose `3` music upload slots
- it should also expose a `4th` paid ad-attachment slot inside the same Release Deck interface
- the paid slot is for a `10` second ad attached to the current new release
- the paid slot does not increase music upload capacity

Implementation note:
- current runtime uses the existing `/tracks` ingestion seam from active source context
- current runtime now passes an explicit optional `artistBandId` for new releases created from `Release Deck`
- current runtime shows the latest ready singles for the three visible music slots
- current runtime may distinguish explicitly source-owned rows from older compatible carry-forward tracks inside those visible slots
- current runtime does not yet widen billing/media-pipeline mechanics or paid ad-slot tooling
- community read surfaces should prefer explicit source attribution for new Release Deck tracks when a stored `artistBandId` is present
- current runtime should preserve source-side shell continuity by surfacing active source context and return paths back to Source Dashboard / Registrar / listener mode

## 5) Route/Tool Relationship
### Source Profile
- public/source-facing identity page
- reachable from Source Dashboard
- current runtime should prefer explicit source ownership on profile tracks/events when stored `artistBandId` is present
- legacy creator/name/uploader fallback may remain only for older rows where `artistBandId` is still null
- current runtime may surface restrained ownership cues on source-owned releases/events so the page does not visually flatten explicit source-owned rows back into generic profile items

### Print Shop
- remains source-facing
- remains conceptually inside the source dashboard system even if `/print-shop` is still a direct route
- current Source Dashboard card copy may reflect creator-lane state such as linked source membership, promoter capability, and GPS-gated promoter progression as long as it does not invent unsupported actions
- current runtime now passes an explicit optional `artistBandId` for new events created from active source context
- current runtime now validates that the signed-in user actually manages the submitted Artist/Band before persisting that link
- current runtime still falls back to creator-eligibility validation when no explicit source link is supplied
- current read-side event surfaces should prefer explicit source attribution when a stored `artistBandId` is present, instead of falling back to creator-user attribution
- current route shell should preserve source-side operating continuity:
  - direct return to listener mode when active source context is set
  - direct handoff to Source Dashboard
  - Release Deck / Registrar links when source context makes them actionable

### Registrar
- remains a separate civic/formalization system
- but must stay reachable from the same source-side operating context
- current MVP runtime should surface active source-context visibility on `/registrar` without changing Home Scene filing scope
- current Source Dashboard card copy should reflect source-attached civic follow-up work when a managed source is active (for example registration status, member sync, capability-code progress)
- current route shell should preserve source-side operating continuity:
  - direct return to listener mode when active source context is set
  - direct handoff to Source Dashboard
  - Release Deck / Print Shop links when source context makes them actionable

## 6) Explicit Non-Goals For Current MVP
Do not widen Source Dashboard into:
- business runtime
- causes
- social messaging
- source analytics packages beyond what already exists
- billing / package purchase flow
- promotion package management

## 7) Success Criteria
This surface is succeeding when:
- a listener understands their personal app profile is separate from source management
- a managed source feels like a distinct entity being operated from source/admin tooling
- Print Shop no longer feels like a random isolated route
- source-side work can begin from one coherent shell
- the listener app can pull source data without making source tools feel native to the listener profile
