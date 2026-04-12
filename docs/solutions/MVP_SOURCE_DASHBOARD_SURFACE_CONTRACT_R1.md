# MVP Source Dashboard Surface Contract (R1)

Status: Active  
Owner: Founder + product engineering  
Last updated: 2026-04-12

## 1) Purpose
Define the first explicit Source Dashboard surface for the one-account web MVP so source-side tools stop feeling like detached routes.

This contract is implementation-facing and sits under:
- `docs/solutions/MVP_ACCOUNT_SOURCE_SIGNAL_SYSTEM_PLAN_R1.md`
- `docs/solutions/MVP_SOURCE_AND_FEED_RULES_FOUNDER_LOCK_R1.md`

## 2) System Role
Source Dashboard is the source-side operating shell inside the signed-in web platform.

It is:
- not a second login tree
- not a public listener surface
- not a rename of Registrar

It is:
- the place where a signed-in user operates a managed source account
- the place where source-facing tools are grouped
- the bridge between listener identity and source operations

## 3) MVP Entry Rule
The dashboard is available only to signed-in users who manage one or more source entities.

Current managed-source runtime:
- linked Artist/Band entities

Current MVP route:
- `/source-dashboard`

Current MVP entrypoints:
- Plot `Source Accounts` switcher
- linked artist/band source page
- direct navigation when a valid source context is already known

## 4) Current MVP Surface Structure
### 4.1 Header
Must show:
- `Source Dashboard`
- active source name when selected
- source type / slug / membership role summary
- listener-account return path

### 4.2 Context Switcher
Must support:
- listener account context
- switching between managed source accounts

Current active runtime:
- Artist/Band entities

### 4.3 Current Context Panel
Must explain:
- which source account is active
- that source tools are being operated from that context
- that source context is operator context even where backend ownership fields are not yet fully modeled

### 4.4 Live Tool Cards
Current MVP live cards:
- `Source Profile`
- `Print Shop`
- `Registrar`

No placeholder tool cards.
Do not add fake analytics, billing, or growth modules.

## 5) Route/Tool Relationship
### Source Profile
- public/source-facing identity page
- reachable from Source Dashboard

### Print Shop
- remains source-facing
- remains conceptually inside the source dashboard system even if `/print-shop` is still a direct route

### Registrar
- remains a separate civic/formalization system
- but must stay reachable from the same source-side operating context

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
- a user understands they are still in one signed-in account
- a managed source feels like a switchable operating context
- Print Shop no longer feels like a random isolated route
- source-side work can begin from one coherent shell
