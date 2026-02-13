# Message Boards, Groups, and Blast

**ID:** `SOCIAL-MSG`
**Status:** `draft`
**Owner:** `platform`
**Last Updated:** `2026-02-13`

## Overview & Purpose
Defines community communication surfaces and rules for public and group messaging. The Social tab message board is the primary place for users to see each other and follow.

## User Roles & Use Cases
- Listeners post in Scene message boards.
- Group members communicate privately.
- Artists and businesses broadcast to followers.

## Functional Requirements
- Message Boards are the only public communication surface within a Scene.
- Groups allow private communication between members.
- Sect members can communicate within a Sect channel.
- Artists, Businesses, Events, and Promoters can message followers (one‑way).
- Users cannot DM Artists, Businesses, Events, or Promoters directly.
- No direct DMs between users outside groups.
- BLAST is a public signal that amplifies content to the community feed.
- Users can discover and follow other users through Social tab message boards.
- Users can also discover and follow other users from Activity Feed (S.E.E.D Feed) actions.

## Non-Functional Requirements
- Clear separation of public vs private channels.
- No algorithmic amplification of communication.

## Architectural Boundaries
- Communication is Scene‑bound except for private groups.
- BLAST is a signal, not a private message.

## Data Models & Migrations
- MessageBoard
- Post
- Thread
- Group
- GroupMessage
- SectChannel

## API Design
- TBD

## Web UI / Client Behavior
- Social tab hosts message boards and group access.
- Followers receive one‑way updates from entities they follow.
- Message board posts and Activity Feed items surface user identity and follow actions.

## Acceptance Tests / Test Plan
- Public posts appear only in Scene message boards.
- DMs blocked outside groups.

## References
- `docs/canon/Legacy Narrative plus Context .md`
