
# UPRISE NEXT

[![CI Pipeline](https://github.com/ancientagent/UPRISE_NEXT/actions/workflows/ci.yml/badge.svg)](https://github.com/ancientagent/UPRISE_NEXT/actions/workflows/ci.yml) [![Secrets Scan](https://github.com/ancientagent/UPRISE_NEXT/actions/workflows/secrets-check.yml/badge.svg)](https://github.com/ancientagent/UPRISE_NEXT/actions/workflows/secrets-check.yml) [![Infrastructure Policy](https://github.com/ancientagent/UPRISE_NEXT/actions/workflows/infra-policy-check.yml/badge.svg)](https://github.com/ancientagent/UPRISE_NEXT/actions/workflows/infra-policy-check.yml)

Modernized rebuild of the UPRISE music community platform.

## Architecture

This is a Turborepo monorepo with the following structure:

### Applications

- **apps/web** - Next.js 15 web application (Vercel)
- **apps/api** - NestJS REST API service (Fly.io/AWS App Runner)
- **apps/socket** - Socket.IO real-time server (Fly.io/AWS App Runner)
- **apps/workers/transcoder** - Media transcoding worker (AWS Fargate/Fly.io)

### Packages

- **packages/ui** - Shared UI components (shadcn/ui based)
- **packages/config** - Shared configuration
- **packages/types** - Shared TypeScript types

## Tech Stack

- **Framework**: Next.js 15, NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with PostGIS
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Authentication**: JWT
- **Media Processing**: FFmpeg
- **Storage**: S3/Cloudflare R2
- **Monitoring**: Sentry, PostHog

## 🎯 Core Features (T1-T4 Implementation)

### ✅ T1: Web-Tier Contract Guard

Enforces architectural boundaries between web and data tiers with multiple layers of protection:

**Runtime Protection:**
- `web-tier-guard.ts` - Runtime checks that throw errors on database access attempts
- Next.js middleware that validates every request
- Module loader hooks to prevent Prisma Client imports

**Build-Time Protection:**
- TypeScript types that mark Prisma Client as `never` in web tier
- ESLint rules that block database import patterns
- Custom decorators to mark API-only functions

**Documentation:**
- See `apps/web/WEB_TIER_BOUNDARY.md` for complete guide
- Error messages clearly explain violations

```typescript
// ❌ This will fail in web tier
import { PrismaClient } from '@prisma/client';

// ✅ This is the correct pattern
import { api } from '@/lib/api';
const data = await api.get('/communities');
```

### ✅ T2: PostGIS Integration

Complete geospatial functionality for community features:

**Endpoints:**
```bash
# Create community with geofence
POST /api/communities
{
  "name": "SF Music Scene",
  "lat": 37.7749,
  "lng": -122.4194,
  "radius": 5000  # meters
}

# Find nearby communities
GET /api/communities/nearby?lat=37.7749&lng=-122.4194&radius=5000

# Verify user location
POST /api/communities/:id/verify-location
{
  "lat": 37.7749,
  "lng": -122.4194
}

# Health check
GET /api/health/postgis
```

**PostGIS Features:**
- `ST_GeogFromText` - Convert GPS coordinates to geography points
- `ST_DWithin` - Efficient spatial queries for nearby communities
- `ST_Distance` - Calculate distances in meters
- GIST indexes for optimal spatial query performance

**Validation:**
- Zod schemas for lat (-90 to 90), lng (-180 to 180), radius (10m to 50km)
- Type-safe geospatial DTOs

### ✅ T3: Real-Time Socket.IO

Dynamic community namespaces with full authentication and logging:

**Features:**
- JWT authentication middleware for all connections
- Dynamic community namespaces: `/community/:communityId`
- Structured logging with context tracking
- Graceful shutdown and error handling

**Events:**
```typescript
// Join a community
socket.emit('join-community', { communityId, location });

// Send message
socket.emit('community-message', { 
  content: 'Hello!',
  type: 'text'
});

// Leave community
socket.emit('leave-community', { communityId });

// Track sharing
socket.emit('track-share', { trackId, message });
```

**Logging:**
```
[2024-11-13T12:00:00.000Z] [INFO] 🔌 Socket connected | socketId: "abc123" userId: "user-456" username: "djsmith"
[2024-11-13T12:00:05.000Z] [INFO] 🏠 User joined room | userId: "user-456" room: "community:sf-music"
```

### ✅ T4: Comprehensive Testing

Full test coverage across all tiers:

**Test Suites:**
```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter web test
pnpm --filter api test
pnpm --filter socket test

# Watch mode
pnpm --filter web test:watch

# Coverage report
pnpm --filter api test:coverage
```

**Test Types:**
1. **Web-Tier Boundary Tests** (`apps/web/__tests__`)
   - Verify database access is blocked
   - Test runtime guard errors
   - Validate TypeScript types

2. **API Integration Tests** (`apps/api/test`)
   - PostGIS query validation
   - Geospatial endpoint testing
   - Health check verification

3. **Socket.IO Tests** (`apps/socket/test`)
   - JWT authentication flow
   - Community namespace events
   - Connection/disconnection logging

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL with PostGIS extension
- Docker & Docker Compose (for local database)
- FFmpeg (for transcoder worker)

### Quick Start with Docker

```bash
# Start PostgreSQL with PostGIS
docker-compose up -d

# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/socket/.env.example apps/socket/.env
cp apps/web/.env.example apps/web/.env.local

# Initialize database
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev

# Verify PostGIS is working
curl http://localhost:4000/api/health/postgis
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter web dev      # http://localhost:3000
pnpm --filter api dev      # http://localhost:4000
pnpm --filter socket dev   # http://localhost:4001
pnpm --filter transcoder dev
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm --filter api test:coverage

# Run tests in watch mode
pnpm --filter web test:watch
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Deployment

- **Web**: Deploy to Vercel
- **API**: Deploy to Fly.io or AWS App Runner
- **Socket**: Deploy to Fly.io or AWS App Runner
- **Transcoder**: Deploy to AWS Fargate or Fly.io

## Architecture Principles

### Web Tier Boundaries

The web application (apps/web) enforces strict tier boundaries:
- ❌ No direct database calls
- ❌ No direct service layer logic
- ✅ All data access through API endpoints
- ✅ Client-side state management
- ✅ Server components for SEO/performance

### API Architecture

- RESTful endpoints with consistent response format
- JWT-based authentication
- Rate limiting and CORS protection
- Zod schema validation
- PostGIS for GPS verification and geofencing

### Real-time Features

- Socket.IO with JWT authentication
- Dynamic community namespaces
- Event-driven architecture
- Presence tracking

### Media Processing

- Asynchronous transcoding pipeline
- S3/R2 storage integration
- Progress tracking via webhooks
- Multiple format/quality outputs

## License

Proprietary