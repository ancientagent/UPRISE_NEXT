
# UPRISE NEXT

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

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL with PostGIS extension
- FFmpeg (for transcoder worker)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/socket/.env.example apps/socket/.env
cp apps/workers/transcoder/.env.example apps/workers/transcoder/.env

# Initialize database
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter web dev
pnpm --filter api dev
pnpm --filter socket dev
pnpm --filter transcoder dev
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build
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
