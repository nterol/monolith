FROM --platform=amd64 node:18-alpine AS base
 
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install --global turbo
COPY --chown=node:node . .
RUN turbo prune @monolith/backend --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --chown=node:node --from=builder /app/out/json/ .
COPY --chown=node:node --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install
 
# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TZ=Europe/Paris
ENV NODE_ENV="production"

# ADD api/prisma api/prisma

# RUN cd api && npx prisma generate

RUN npm run build

FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix-api
USER remix-api
 
# ENV TZ=Europe/Paris
# ENV NODE_ENV="production"

COPY --chown=remix-api:nodejs --from=installer /app/backend/package.json ./backend/package.json
COPY --chown=remix-api:nodejs --from=installer /app/backend/dist ./backend/dist
COPY --chown=remix-api:nodejs --from=installer /app/node_modules ./node_modules
COPY --chown=remix-api:nodejs --from=installer /app/node_modules/@monolith/frontend ./node_modules/@monolith/frontend
COPY --chown=remix-api:nodejs --from=installer /app/node_modules/@monolith/typescript-config ./node_modules/@monolith/typescript-config
COPY --chown=remix-api:nodejs --from=installer /app/node_modules/@monolith/eslint-config ./node_modules/@monolith/eslint-config

COPY --chown=remix-api:nodejs --from=builder /app/start.sh ./app/start.sh

ENTRYPOINT [ "start.sh" ]