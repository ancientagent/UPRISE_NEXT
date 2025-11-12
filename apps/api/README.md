
# UPRISE API

NestJS REST API service with Fastify, Zod validation, and Prisma ORM.

## Features

- **Framework**: NestJS with Fastify adapter
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: Zod schemas
- **Rate Limiting**: Throttler
- **CORS**: Configurable origins

## Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Start development server
pnpm dev
```

## Database

The API uses PostgreSQL with the PostGIS extension for geospatial features.

### PostGIS Setup

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Migrations

```bash
# Create new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Open Prisma Studio
pnpm prisma:studio
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users
- `GET /users` - List users (paginated)
- `GET /users/:id` - Get user by ID

### Communities
- `GET /communities` - List communities (paginated)
- `GET /communities/:id` - Get community by ID
- `POST /communities` - Create community

### Tracks
- `GET /tracks` - List tracks (paginated)
- `GET /tracks/:id` - Get track by ID

### Events
- `GET /events` - List events (paginated)
- `GET /events/:id` - Get event by ID

## Deployment

Optimized for deployment on Fly.io or AWS App Runner.
