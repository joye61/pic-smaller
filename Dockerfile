FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG BUILD_SHA=development
ARG BUILD_VERSION=development
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_VERSION=$BUILD_VERSION
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ARG BUILD_SHA=development
ARG BUILD_VERSION=development
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_VERSION=$BUILD_VERSION
LABEL org.opencontainers.image.title="LunePic"
LABEL org.opencontainers.image.source="https://github.com/ArcaneLune/pic-smaller"
LABEL org.opencontainers.image.revision=$BUILD_SHA
LABEL org.opencontainers.image.version=$BUILD_VERSION
RUN apk add --no-cache tini
COPY --from=builder --chown=node:node /app/.next/standalone ./
USER node
EXPOSE 3000
STOPSIGNAL SIGTERM
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider "http://127.0.0.1:${PORT}/api/health" || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
