# Terminology and Taxonomy

**ID:** `CORE-TERMS`  
**Status:** `draft`  
**Owner:** `platform`  
**Last Updated:** `2026-02-13`

## Overview & Purpose
This spec defines the canonical vocabulary for UPRISE. It prevents term drift and establishes the official meaning of structural terms used in specs, UI labels, and implementation notes.

## User Roles & Use Cases
- Spec authors and reviewers who need a single source of truth for platform terms.
- Product and design teams defining UI labels and flows.
- Engineers aligning implementation language with canon.
- Marketing and messaging writers who must avoid non-canonical language.

## Functional Requirements
- Use only canon-defined terms for structural concepts.
- Preserve the distinction between **Scene**, **Community**, and **Uprise**.
- Avoid genre hierarchy language in structural contexts; use “music community” for Home Scene selection.
- Use canon terms for participation states and actions.
- Do not introduce new terms that conflict with `docs/canon/`.

## Non-Functional Requirements
- Consistency: the same term means the same thing across all docs.
- Clarity: avoid ambiguous or overloaded labels.
- Stability: new docs must not redefine existing canon.

## Canonical Terms (Required Usage)
Use the following terms exactly as defined.

**UPRISE (proper noun):** the platform/movement and infrastructure.  
**Uprise:** the broadcast station operated by a Music Community within a Scene; the audible output of a Scene carried by RaDIYo. An Uprise is not a playlist and not a Signal.

**Scene:** the place‑bound container and cultural environment. Scenes exist at City, State, and National levels.  
**Community:** the people operating within a Scene.  
**Music Community:** the people and shared musical practice within a Scene; used for onboarding label and identity context.

**Home Scene:** a user’s local music Scene of choice and their civic anchor for platform actions.  
**Locally Affiliated:** a Listener who has selected a Home Scene. GPS verification affects voting only.  
**Visitor:** a Listener present in a Scene that is not their Home Scene. The term “Observer” is deprecated and must not be used.

**Sect:** the sum of listeners and artists sharing a taste tag inside a Home Scene. A Sect becomes an Uprise only after meeting the support threshold and having sufficient committed artist catalog to sustain rotation.

**The Plot:** the Home Scene dashboard surface. It is a civic interface, not a personalized feed.

**RaDIYo:** the listener‑governed broadcast infrastructure that carries Uprises across tiers; the player is a receiver, not a playlist.

**Tier System:** Citywide, Statewide, National. Citywide is the only tier with civic infrastructure. Statewide and National are aggregate broadcasts. National is non‑interactive and not a voting jurisdiction.

## Architectural Boundaries
- Canon is defined by `docs/canon/`. Specs must not introduce conflicting terms.
- Structural language must use **Scene** and **Community** instead of genre/subgenre hierarchies.
- “Genre/subgenre/microgenre” may appear only as optional **taste tags** or “other musical tastes (sub/microgenre)” and never as structural selectors.
- UI labels must use **Music Community** for Home Scene selection and avoid “Genre Selection.”

## Data Models & Migrations
None.

## API Design
None.

## Web UI / Client Behavior
- Home Scene selection labels use **City**, **State**, **Music Community**.
- The Plot is the Home Scene dashboard surface.

## Acceptance Tests / Test Plan
- Doc review: terms must match the canon list above.
- UI copy review: no “genre selection” or “observer” wording.
- Spec review: no redefinition of Scene/Community/Uprise/Conformance terms.

## Future Work & Open Questions
- Validate all existing product specs against this terminology spec.
- Add a lightweight doc lint to flag deprecated terms.

## References
- `docs/canon/Master Glossary Canon.md`
- `docs/canon/Master Identity and Philosohpy Canon.md`
- `docs/canon/Legacy Narrative plus Context .md`
- `docs/canon/UPRISE_VOICE_MESSAGING_CANONICAL.md`
