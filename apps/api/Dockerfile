FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache openssl \
  && corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY packages/types packages/types
COPY apps/api apps/api
RUN rm -f packages/types/tsconfig.tsbuildinfo apps/api/tsconfig.tsbuildinfo apps/api/dist/tsconfig.build.tsbuildinfo
RUN pnpm --filter @uprise/types build
RUN pnpm --filter api prisma:generate
RUN pnpm --filter api build
RUN pnpm --filter api deploy --prod /prod/api \
  && BUILD_PRISMA_CLIENT="$(find node_modules/.pnpm -path '*/node_modules/.prisma/client' -type d -print -quit)" \
  && PROD_PRISMA_CLIENT="$(find /prod/api/node_modules/.pnpm -path '*/node_modules/@prisma/client' -type d -print -quit)" \
  && test -n "$BUILD_PRISMA_CLIENT" \
  && test -n "$PROD_PRISMA_CLIENT" \
  && PROD_NODE_MODULES="$(dirname "$(dirname "$PROD_PRISMA_CLIENT")")" \
  && cp -R "$(dirname "$BUILD_PRISMA_CLIENT")" "$PROD_NODE_MODULES/"

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=4000
WORKDIR /app
COPY --from=build /prod/api ./
EXPOSE 4000
CMD ["node", "dist/main.js"]
