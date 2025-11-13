
# UPRISE Socket Server

Socket.IO real-time server with JWT authentication and dynamic namespaces.

## Features

- **Real-time Communication**: Socket.IO for bidirectional event-based communication
- **JWT Authentication**: Secure WebSocket connections with JWT tokens
- **Dynamic Namespaces**: Community-specific namespaces for isolated communication
- **Presence Tracking**: Track user online/offline status
- **Typing Indicators**: Show when users are typing

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Events

### Client → Server

- `presence:update` - Update user presence status
- `typing:start` - Indicate user started typing
- `typing:stop` - Indicate user stopped typing
- `message:send` - Send a chat message
- `community:message` - Send message to community (in community namespace)
- `track:react` - React to a track (in community namespace)

### Server → Client

- `presence:changed` - User presence status changed
- `typing:user` - User typing status changed
- `message:new` - New chat message received
- `user:joined` - User joined community (in community namespace)
- `user:left` - User left community (in community namespace)
- `community:message:new` - New community message (in community namespace)
- `track:reaction` - Track reaction received (in community namespace)

## Namespaces

### Main Namespace (`/`)
General real-time events for all authenticated users.

### Community Namespaces (`/community/:id`)
Dynamic namespaces for each community, providing isolated communication channels.

## Authentication

All connections require a JWT token passed in the `auth.token` field:

```javascript
const socket = io('http://localhost:4001', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## Deployment

Optimized for deployment on Fly.io or AWS App Runner.
