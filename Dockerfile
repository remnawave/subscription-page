FROM node:24.17-trixie-slim AS backend-build
WORKDIR /opt/app

COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/tsconfig.build.json ./

RUN npm ci

COPY backend/ .

RUN npm run build

RUN npm cache clean --force 

RUN npm prune --omit=dev

FROM node:24.17-trixie-slim
WORKDIR /opt/app

LABEL org.opencontainers.image.title="Remnawave Subscription Page"
LABEL org.opencontainers.image.description="Remnawave Subscription Page"
LABEL org.opencontainers.image.url="https://github.com/remnawave/subscription-page"
LABEL org.opencontainers.image.source="https://github.com/remnawave/subscription-page"
LABEL org.opencontainers.image.vendor="Remnawave"
LABEL org.opencontainers.image.licenses="AGPL-3.0"
LABEL org.opencontainers.image.documentation="https://docs.rw"


RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=backend-build /opt/app/dist ./dist
COPY --from=backend-build /opt/app/node_modules ./node_modules

COPY frontend/dist/ ./frontend/

COPY backend/package*.json ./


COPY backend/ecosystem.config.js ./
COPY backend/docker-entrypoint.sh ./

ENV PM2_DISABLE_VERSION_CHECK=true
ENV NODE_OPTIONS="--max-old-space-size=16384"

RUN npm install pm2 -g

# Liveness only: the app intentionally destroys sockets rather than answering
# unauthorised or unknown requests (see proxy-check.middleware.ts and
# not-found-exception.filter.ts), so an HTTP probe cannot distinguish "up" from
# "down". A TCP accept on loopback can, and exposes no new surface.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('net').connect(parseInt(process.env.APP_PORT||'3010',10),'127.0.0.1').on('connect',function(){process.exit(0)}).on('error',function(){process.exit(1)})"

ENTRYPOINT [ "/bin/sh", "docker-entrypoint.sh" ]

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]