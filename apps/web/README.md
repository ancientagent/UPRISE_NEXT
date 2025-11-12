
# UPRISE Web Application

Next.js 15 web application with TypeScript, Tailwind CSS, and shadcn/ui.

## Architecture Principles

### Strict Web Tier Boundaries

This application enforces strict tier boundaries:

- ❌ **NO direct database calls** - All data access must go through the API
- ❌ **NO direct service layer logic** - Business logic belongs in the API
- ✅ **API calls only** - All data operations through REST endpoints
- ✅ **Client-side state** - Zustand for global state, React Query for server state
- ✅ **Server components** - For SEO and performance where appropriate

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand (global), React Query (server state)
- **Real-time**: Socket.IO client
- **Validation**: Zod

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

Optimized for deployment on Vercel.
