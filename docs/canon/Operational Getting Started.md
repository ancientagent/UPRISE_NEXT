--- Page 1 ---

🎵 UPRISE_NEXT — Getting Started Guide Welcome to UPRISE. This document is the technical entry point
for understanding and contributing to the UPRISE platform. It is intended for developers, agents, and
stakeholders working on the current build and architecture. Last Updated: January 10, 2026 Status: ✅
Active Phase: Phase 1 Complete, Phase 2 In Progress
📋 Table of Contents 1. Project Overview 2. Architecture at a Glance 3. Current State 4. Getting Started 5.
Documentation Guide 6. Multi-Agent Workflow 7. Development Workflow 8. Key Constraints & Guardrails 9.
Project Structure 10. Quick Reference
1. Project Overview
What is UPRISE? UPRISE is a Scene-centered broadcast platform that enables location-bound music Scenes
and the communities within them to operate through a listener-governed distribution system. UPRISE_NEXT
is a complete rebuild of the legacy UPRISE platform using modern architecture, strict tier boundaries, and
scalable infrastructure.
What Problem Does It Solve? UPRISE addresses several key structural challenges in location-bound music
ecosystems: • Fragmented Scenes: Musicians and listeners lack infrastructure for structured, location-bound
participation • Discovery Constraints: Scene-based broadcast and traversal mechanisms are required for
non-algorithmic discovery • Broadcast Infrastructure: Communities require shared distribution
infrastructure rather than isolated content feeds • Geographic Context: Scenes are inherently local and
require robust geospatial capabilities • Structured Participation: Artists and listeners require defined roles,
governance boundaries, and surface separation
Who Is It For? Primary Users: - Musicians & Artists: Share music, collaborate, and build local followings -
Music Fans: Discover local talent, join communities, and attend events - Venue Owners & Promoters:
Connect with artists and promote events - Scene Participants: Operate within and contribute to location-
bound music Scenes
Technical Stakeholders: - Developers: Building and maintaining the platform - Agents (AI/LLM): Autonomous
contributors following strict architectural patterns - Product Owners: Defining features and roadmap -
Operations: Maintaining infrastructure and deployments
Vision & Goals Core Vision: Provide a robust, scalable broadcast and participation infrastructure for location-
bound music Scenes with clear architectural boundaries and strong geospatial support.
Key Goals: - ✅ Build a scalable, maintainable monorepo architecture - ✅ Enforce strict separation between
web, API, and data tiers - ✅ Implement robust geospatial features with PostGIS - ✅ Support real-time
interaction via Socket.IO - 🔄 Enable rich media management and transcoding - 🔄 Provide broadcast-based
discovery through Scene traversal and user-initiated exploration (non-algorithmic) - 📋 Support events,
promotions, and business features - 📋 Build mobile applications (React Native)
1. Architecture at a Glance
High-Level Architecture UPRISE_NEXT is built as a Turborepo monorepo with strict tier boundaries. The
architecture follows a multi-service pattern with explicit separation of concerns aligned to the platform’s
Scene-based broadcast model.
1

--- Page 2 ---

Client Layer - Web Application (Next.js 15) - Mobile Application (React Native – planned)
Service Layer - REST API (NestJS) - Real-time Service (Socket.IO) - Media Worker (FFmpeg transcoder)
Data Layer - PostgreSQL + PostGIS (geospatial support) - Object Storage (S3-compatible)
Architectural Principles - Web tier has no direct database access - API tier is the single source of truth for
data and business logic - Real-time layer handles subscription-based events only - Workers perform
asynchronous processing only - No personalization or recommendation services are present in the
architecture
Key Technologies Core Stack - Monorepo: Turborepo with Yarn workspaces - Frontend: Next.js (App Router) -
Backend: NestJS (REST API) - Real-time: Socket.IO (authenticated namespaces) - Database: PostgreSQL with
PostGIS - ORM: Prisma - Language: TypeScript (strict mode)
Geospatial Model - Communities are implemented as location-bound Scene containers - PostGIS is used for
geofence validation and proximity search - Discovery is implemented via geospatial queries and user-
initiated traversal, not behavioral modeling
1. Current State
What’s Been Completed
Phase 1: Foundation (Complete) - Monorepo scaffolding - Web application (apps/web) - REST API (apps/api) -
Real-time server (apps/socket) - Media worker (apps/workers/transcoder) - Shared packages (ui, types,
config) - PostGIS-ready Prisma schema - CI/CD enforcement - Web-tier boundary guard
Core System Guarantees - Web tier cannot access database directly - Fair Play logic is isolated from UI layer -
No algorithmic recommendation services exist in the codebase - Geospatial features are deterministic and
query-based
Phase 2 (In Progress) - User authentication system (JWT-based) - User profile management - Scene
membership and role-based permissions (non-governance altering) - Release Deck management (track
entry into Fair Play) and Signal management (posts within defined Scene surfaces) - Scene-based discovery
interfaces (non-algorithmic) - Mobile application (React Native)
Architectural Compliance Check The current build does not include: - Behavioral recommendation engines -
Collaborative filtering systems - Engagement-ranked feeds - Taste modeling infrastructure - Predictive
content surfacing
Discovery is implemented through: - Scene selection - Tier toggling - Geospatial search - Explicit user
traversal
Further sections remain structurally unchanged and focused on development workflow, CI/CD, guardrails,
and project structure.
2

--- Page 3 ---

1. Getting Started
Prerequisites Before you begin, ensure you have the following installed:
Required • Node.js: v20.x or later (v22.x recommended) • Install via fnm (https://github.com/Schniz/fnm) or
nvm (https://github.com/nvm-sh/nvm) • Yarn: v1.x (Classic) or Yarn Berry (repo-defined) • Install/enable via
corepack: corepack enable • PostgreSQL: 14+ with PostGIS extension • Use Docker (recommended) or install
locally • Git: For version control
Optional (but recommended) • Docker & Docker Compose: For local database and workers • FFmpeg:
Required for transcoder worker • VSCode: Recommended editor with extensions: • ESLint • Prettier •
TypeScript • Tailwind CSS IntelliSense
Environment Setup
1. Clone the Repository git clone <repository-url> cd UPRISE_NEXT
2. Install Dependencies
Enable corepack (for Yarn)
corepack enable
Install all dependencies
yarn install
1. Set Up Environment Variables
Copy environment templates
cp apps/api/.env.example apps/api/.env cp apps/socket/.env.example apps/socket/.env cp apps/
web/.env.example apps/web/.env.local
3

--- Page 4 ---

Edit each .env file with your configuration
Key variables to set:
- DATABASE_URL (PostgreSQL connection string)
- JWT_SECRET (for authentication)
- NEXT_PUBLIC_API_URL (for web app)
- NEXT_PUBLIC_SOCKET_URL (for web app)
Example apps/api/.env : DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uprise?
schema=public" JWT_SECRET="your-super-secret-jwt-key-change-this" PORT=4000 NODE_ENV=development
Example apps/web/.env.local : NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
1. Start PostgreSQL with PostGIS
Option A: Docker (Recommended)
Start PostgreSQL + PostGIS
docker-compose up -d
Verify PostGIS is available
docker exec -it uprise-postgres psql -U postgres -d uprise -c "SELECT PostGIS_version();"
Option B: Local Installation
Install PostgreSQL and PostGIS
Ubuntu/Debian:
(Optional) Local Installation Note: Local installs may require admin privileges and are not recommended for
constrained environments. Prefer Docker. - If you choose local installation, follow your OS-specific
4

--- Page 5 ---

PostgreSQL + PostGIS installation guide and ensure the PostGIS extension is enabled for the target
database.
1. Initialize Database cd apps/api
Generate Prisma Client
yarn prisma generate
Run migrations
yarn prisma migrate dev
(Optional) Seed development data
yarn prisma db seed
1. Verify Setup
Run all checks
yarn lint # ✅ Should pass yarn typecheck # ✅ Should pass yarn build # ✅ Should build all apps yarn test #
✅ Should run all tests yarn infra-policy-check # ✅ Should pass
Quick Start Commands
Development Mode
Run all services in development mode
yarn dev
5

--- Page 6 ---

Services will be available at:
- Web: http://localhost:3000
- API: http://localhost:4000
- Socket: http://localhost:4001
- Transcoder: (background worker)
Run Individual Services
Run specific app
yarn workspace web dev # Next.js web app yarn workspace api dev # NestJS API yarn workspace socket dev
# Socket.IO server yarn workspace transcoder dev # Transcoder worker
Run multiple specific apps
yarn workspace web dev && yarn workspace api dev
How to Run Locally
Step-by-Step: 1. Terminal 1 - Database: docker-compose up
1. Terminal 2 - API: yarn workspace api dev Wait for: 🚀 API server running on http://localhost:4000
2. Terminal 3 - Socket: yarn workspace socket dev Wait for: 🔌 Socket.IO server running on port 4001
3. Terminal 4 - Web: yarn workspace web dev Wait for: ✓ Ready on http://localhost:3000
4. Test the Setup:
# Check API health
curl http://localhost:4000/api/health
# Check PostGIS health
curl http://localhost:4000/api/health/postgis
6

--- Page 7 ---

# Open web app
Visit http://localhost:3000 in your browser
How to Run Tests
All Tests
Run all tests across all workspaces
yarn test
With coverage
yarn test --coverage
Specific App Tests
Web app tests
yarn workspace web test
API tests (requires database)
DATABASE_URL="postgresql://..." yarn workspace api test
Socket tests
yarn workspace socket test
Watch Mode (for development)
Watch mode for web
yarn workspace web test:watch
Watch mode for API
yarn workspace api test:watch
7

--- Page 8 ---

Test Coverage
Generate coverage report
yarn workspace api test:coverage
Coverage report will be in apps/api/coverage/
How to Build
Production Build
Build all apps
yarn build
Build outputs:
- apps/web/.next/
- apps/api/dist/
- apps/socket/dist/
- apps/workers/transcoder/dist/
Build Individual Apps yarn workspace web build yarn workspace api build yarn workspace socket build
Clean Build
Remove all build artifacts and node_modules
yarn clean
Reinstall and rebuild
yarn install yarn build
8

--- Page 9 ---

Troubleshooting Common Issues
Issue: Prisma Client not found
Solution: Generate Prisma Client
cd apps/api yarn prisma generate
Issue: PostGIS extension not available
Solution: Enable PostGIS in your database
psql uprise -c "CREATE EXTENSION IF NOT EXISTS postgis;"
Verify
psql uprise -c "SELECT PostGIS_version();"
Issue: Port already in use
Solution: Kill process on port
Linux/macOS:
Port already in use
• Use your OS process manager to stop the process using the port, or change ports in the
relevant .env files.
• For Windows (PowerShell): use Resource Monitor or Get-NetTCPConnection -LocalPort
<port> to identify the PID, then stop the process.
Or change port in .env
Issue: Web-tier boundary violations
Solution: Run policy check to see violations
yarn infra-policy-check
9

--- Page 10 ---

Common fixes:
- Remove @prisma/client imports from apps/web
- Use API client instead: import { api } from '@/lib/
api'
- Use NEXT_PUBLIC_ env vars for client-side
Issue: Tests failing due to database
Solution: Ensure DATABASE_URL is set for tests
DATABASE_URL="postgresql://..." yarn test
Or add to apps/api/.env.test
1. Documentation Guide
Documentation Structure UPRISE uses a comprehensive, hierarchical documentation system organized by
purpose:
docs/ ├── RUNBOOK.md # Operational manual (START HERE) ├── PROJECT_STRUCTURE.md #
Monorepo layout and conventions ├── GETTING_STARTED.md # This document ├──
ENVIRONMENTS.md # Development environment setup ├── CHANGELOG.md # Auto-generated change
history ├── FEATURE_DRIFT_GUARDRAILS.md # Zero-drift policy ├──
PHASE1_COMPLETION_REPORT.md # Phase 1 milestone ├── STRATEGY_CRITICAL_INFRA_NOTE.md #
Infrastructure boundaries │ ├── architecture/ # High-level architecture │ └── UPRISE_OVERVIEW.md
# System overview │ ├── blueprints/ # Design patterns and workflows │ ├──
MULTI_AGENT_DOCUMENTATION_STRATEGY.md │ └── README.md │ ├── specs/ # Feature
specifications (NEW) │ ├── TEMPLATE.md # Spec template │ ├── README.md # Specs index │ ├──
system/ # Cross-cutting specs │ │ ├── web-tier-contract-guard.md (T5) │ │ ├── ci-cd-pipeline.md
(T8) │ │ ├── documentation-framework.md (T7) │ │ └── agent-handoff-process.md │ ├──
communities/ # Community feature specs │ └── users/ # User/auth feature specs │ ├── handoff/ #
Agent handoff documents │ ├── TEMPLATE_agent-handoff.md │ ├── TEMPLATE_handoff-phase.md
│ └── handoff-phase-1.md │ └── Specifications/ # Legacy specs (canonical IDs) ├── README.md #
Legacy spec index ├── 01_UPRISE_Master_Overview.md ├── 02_UPRISE_Skeleton_Framework.md
├── 04_UPRISE_Community_Location_System.md └── ... (other legacy specs)
10

--- Page 11 ---

1. Multi-Agent Workflow
How the Multi-Agent Documentation Strategy Works UPRISE uses a structured documentation strategy to
enable multiple agents (AI/LLM and human) to collaborate effectively without fragmenting knowledge or
causing regressions.
Core Concepts
1. Documentation Hierarchy Blueprints (Patterns) → Specs (Requirements) → Handoffs (Outcomes) •
Blueprints: High-level design patterns and workflows (e.g., multi-agent strategy) • Specs: Feature
requirements and contracts (organized by module) • Handoffs: Agent notes and phase completion
reports
2. Strict Boundaries
3. Web-tier: No database access, no secrets, no server imports
4. API-tier: Single source of truth for data
5. Socket-tier: Subscribe-only real-time events
6. Worker-tier: Asynchronous processing
Product Drift Prohibitions (Development Guardrail) - Do NOT implement recommendation engines,
collaborative filtering, or taste prediction systems. - Do NOT introduce engagement-ranked feeds or
algorithmic content boosting. - Do NOT add personalization layers that infer preferences from behavior. -
Discovery must remain Scene-based and user-initiated (geospatial queries, tier toggling, explicit traversal). -
Fair Play may only be influenced by upvoting and song engagement as defined in canon.
1. Zero-Drift Policy
2. No feature implemented without a spec
3. No spec changes without human approval
4. No architectural violations (enforced by CI)
Workflow Phases 1. ONBOARDING - Agent reads: RUNBOOK, STRATEGY NOTE, GUARDRAILS, SPECS
1. PLANNING
2. Agent creates/extends spec under docs/specs/
3. Follows TEMPLATE.md structure
4. Gets approval if new behavior
5. IMPLEMENTATION
6. Agent implements per spec requirements
7. Creates agent handoff doc (docs/handoff/agent-<name>-<task>.md)
8. Records decisions, challenges, lessons
9. VALIDATION
11

--- Page 12 ---

10. CI enforces boundaries (web-tier, secrets, etc.)
11. Tests validate behavior
12. PR links to specs and includes deployment target
13. HANDOFF
14. Agent updates agent handoff document
15. At phase end, compile handoff-phase-<n>.md
16. Document outcomes, issues, next steps
How to Onboard as a New Agent Step 1: Read Mandatory Documents In this exact order: 1. docs/
RUNBOOK.md 2. docs/STRATEGY_CRITICAL_INFRA_NOTE.md 3. docs/FEATURE_DRIFT_GUARDRAILS.md 4.
docs/blueprints/MULTI_AGENT_DOCUMENTATION_STRATEGY.md 5. docs/PROJECT_STRUCTURE.md
Step 2: Understand Your Task • Read the spec: Find relevant spec in docs/specs/<module>/ • Check legacy
specs: If spec references canonical IDs, read docs/Specifications/ • Review recent handoffs: Read docs/
handoff/handoff-phase-<n>.md for context
Step 3: Validate Boundaries • Web-tier: Read apps/web/WEB_TIER_BOUNDARY.md if touching web •
Database: Ensure you’re in apps/api for data access • Secrets: Verify no hardcoded secrets in code
Step 4: Set Up Locally • Follow Section 4: Getting Started of this document • Run all checks: yarn lint && yarn
typecheck && yarn test • Run infra policy check: yarn infra-policy-check
Step 5: Create Agent Handoff Document
Copy template
cp docs/handoff/TEMPLATE_agent-handoff.md docs/handoff/agent-<your-name>-<task>.md
1. Development Workflow
Branching Strategy UPRISE uses a trunk-based development strategy with feature branches:
Branch Types - Main: main - Development: develop - Feature: feat/<scope> - Bugfix: fix/<scope> - Chore:
chore/<scope> - Docs: docs/<scope> - Hotfix: hotfix/<scope>
PR Requirements Every pull request MUST include: - Deployment Target - Phase - Specs links - Tests + build
validation - CHANGELOG update (when applicable)
1. Key Constraints & Guardrails
Feature Drift Policy (Zero Tolerance) CRITICAL RULE: No feature is implemented without an explicit,
approved specification.
12

--- Page 13 ---

Web-Tier Boundary (CRITICAL) RULE: The web tier (apps/web) must NEVER access the database, server-only
modules, or secrets directly.
Prohibited in Web Tier - Database clients/ORM imports - Server-only modules - Non-NEXT_PUBLIC_ secrets
in client components
Allowed in Web Tier - API client - Socket.IO client - Shared packages (ui/types/config) - NEXT_PUBLIC_
environment variables
What NOT to Do - Do not bypass architectural boundaries - Do not commit secrets - Do not implement
features without specs - Do not ignore CI failures
1. Project Structure
Directory Layout (See docs/PROJECT_STRUCTURE.md for canonical details.)
1. Quick Reference
Common Commands - Install: yarn install - Dev: yarn dev - Lint: yarn lint - Typecheck: yarn typecheck - Test:
yarn test - Build: yarn build - Policy check: yarn infra-policy-check
You’re Ready Follow Section 4, read RUNBOOK + Guardrails, then work from approved specs only.
13