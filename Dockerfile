# 1. Build frontend static bundle
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Same-origin API: bundle calls the backend in the same container (relative URLs).
# Vite reads VITE_-prefixed vars from the environment at build time.
ENV VITE_API_URL=/
# vite build (esbuild) emits the production bundle; tsc typecheck is run separately in CI
RUN npx vite build

# 2. Build backend (tsc -> dist)
FROM node:22-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# 3. Runtime image
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY --from=backend /app/backend/dist ./dist
COPY --from=frontend /app/frontend/dist ./public
EXPOSE 4010
CMD ["node", "dist/index.js"]
