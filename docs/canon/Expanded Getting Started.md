--- Page 1 ---

🎵 UPRISE_NEXT — Getting Started Guide
Last Updated: January 10, 2026
Status: Active
Phase: Phase 1 Complete, Phase 2 In Progress
1. Project Overview
What is UPRISE?
UPRISE is discovery infrastructure with a hyper-local broadcast layer. It enables location-bound music
Scenes and the communities within them to surface and explore music through a listener-governed system.
The RaDIYo broadcast layer enables shared and passive discovery without algorithmic personalization.
UPRISE_NEXT is a complete rebuild of the legacy UPRISE platform using modern architecture, strict tier
boundaries, and scalable infrastructure.
What Problem Does It Solve?
UPRISE addresses structural challenges in location-bound music ecosystems: - Fragmented Scenes lacking
structured participation infrastructure - Discovery constraints requiring non-algorithmic broadcast traversal
- Need for shared distribution infrastructure instead of isolated feeds - Geographic context requiring robust
geospatial capabilities - Clear governance and participation boundaries
Who Is It For?
Primary Users - Musicians & Artists - Music Fans - Venue Owners & Promoters - Scene Participants
Technical Stakeholders - Developers - AI/LLM Agents - Product Owners - Operations
2. Architecture at a Glance
High-Level Architecture
UPRISE_NEXT is built as a Turborepo monorepo with strict tier separation.
Client Layer - Web (Next.js) - Mobile (React Native – planned)
Service Layer - REST API (NestJS) - Real-time Service (Socket.IO) - Media Worker (FFmpeg)
Data Layer - PostgreSQL + PostGIS - S3-compatible Object Storage
1

--- Page 2 ---

Architectural Principles
• Web tier has no direct database access
• API tier is the single source of truth
• Real-time layer distributes events only
• Workers handle asynchronous processing only
• No personalization or recommendation services exist
2.1 Architectural Rationale — Why This Structure Exists
UPRISE is discovery infrastructure, not a personalized content platform.
Discovery occurs through: - Scene selection - Tier toggling (City → State → National) - Geospatial queries -
Explicit user actions (voting, adding, blasting)
No collaborative filtering, taste modeling, or ranked feeds are permitted.
Broadcast is a passive discovery mechanism, not the system’s identity.
Fair Play isolation: - Engagement controls Main Rotation recurrence - Upvoting controls propagation only - No payment, role, or
subscription alters governance
Scenes are governance containers. Communities exist within Scenes.
Geospatial queries replace algorithmic personalization.
Architectural boundaries prevent governance manipulation.
2.2 Release Deck & Rotation Separation
The Release Deck is a submission gate, not a rotation controller.
• Release Deck slot ≠ rotation position
• Rotation ordering is computed by Fair Play in the API tier
• Promotional slots do not influence rotation
Fair Play governance is separated: - Main Rotation recurrence by engagement - Tier propagation by upvotes
2.3 Economic Surface Isolation
Economic features are structurally isolated from governance.
Includes: - Print Shop (Run model) - Promotional Pack - Label Visibility Service - Subscription tiers
Promotional Pack context: paid boost-style distribution across selected Scenes/communities in Promotions
surfaces only (no Fair Play or rotation impact).
2

--- Page 3 ---

None influence Fair Play or ranking.
2.4 Real-Time Layer & Event Containment
Socket.IO distributes events only.
It must not: - Modify rotation - Infer preference - Create ranking logic
All authoritative state changes occur in the API tier.
2.5 Role & Permission Containment
Roles define access, not authority.
No role may: - Override Fair Play - Reorder rotation - Assign legitimacy
Moderation operates at access level only.
2.6 Failure Modes & Drift Scenarios
Reject the following patterns: - Recommendation engines - Engagement-ranked feeds - Social velocity →
broadcast authority - Paid ordering influence - Cross-Scene blending
When in doubt, treat changes as drift and require a spec.
3. Current State
Phase 1: Complete
• Monorepo scaffolding
• Web, API, Socket, Worker
• PostGIS integration
• CI/CD enforcement
• Web-tier guard
Core Guarantees
• No algorithmic recommendation services
• Fair Play isolated
• Deterministic geospatial discovery
3

--- Page 4 ---

Phase 2: In Progress
• JWT authentication
• Scene membership & permissions
• Release Deck management
• Signal management
• Scene-based discovery interfaces
• Mobile app (planned)
4. Getting Started
Prerequisites
• Node.js (v20+)
• Yarn (corepack enabled)
• PostgreSQL 14+ with PostGIS (Docker recommended)
• Git
Setup
corepack enable
pnpm install
Configure environment variables in: - apps/api/.env - apps/socket/.env - apps/web/.env.local
Start database (Docker recommended):
docker-compose up -d
Run services:
pnpm dev
Verify:
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm infra-policy-check
4

--- Page 5 ---

5. Documentation Guide
Docs structure: - docs/RUNBOOK.md - docs/PROJECT_STRUCTURE.md - docs/
FEATURE_DRIFT_GUARDRAILS.md - docs/specs/ - docs/handoff/
Single Source of Truth: Specs define behavior.
6. Multi-Agent Workflow
Workflow: 1. Read required docs 2. Plan via spec 3. Implement per spec 4. Validate via CI 5. Document
handoff
Product Drift Prohibitions
• No recommendation engines
• No taste prediction
• No ranked feeds
• No personalization
• Fair Play domains separated: engagement for recurrence, upvotes for propagation
7. Development Workflow
Branching: - main - develop - feat/<scope> - fix/<scope> - chore/<scope> - docs/<scope> - hotfix/<scope>
PRs must include: - Deployment target - Phase - Specs - Tests - CI passing
8. Key Constraints & Guardrails
Zero Drift Policy: No feature without spec.
Web-tier must never access database or secrets.
9. Project Structure
Refer to docs/PROJECT_STRUCTURE.md.
5

--- Page 6 ---

10. Quick Reference
Common Commands:
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm infra-policy-check
You’re Ready. Follow specs. Respect boundaries. Build within the system.
6
