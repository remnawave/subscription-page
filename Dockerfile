FROM node:24.11-alpine AS backend-build
WORKDIR /opt/app

COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/tsconfig.build.json ./

RUN npm ci

COPY backend/ .

RUN npm run build

RUN npm cache clean --force 

RUN npm prune --omit=dev

FROM node:24.11-alpine
WORKDIR /opt/app

COPY --from=backend-build /opt/app/dist ./dist
COPY --from=backend-build /opt/app/node_modules ./node_modules

COPY frontend/dist/ ./frontend/

COPY backend/package*.json ./


COPY backend/ecosystem.config.js ./
COPY backend/docker-entrypoint.sh ./

ENV PM2_DISABLE_VERSION_CHECK=true
ENV NODE_OPTIONS="--max-old-space-size=16384"

RUN npm install pm2 -g

ENTRYPOINT [ "/bin/sh", "docker-entrypoint.sh" ]

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]