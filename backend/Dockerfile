# Multi-stage build para optimización
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage de desarrollo
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Stage de construcción
FROM base AS builder
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Stage de producción
FROM node:20-alpine AS production
WORKDIR /app

# Instalar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copiar archivos de construcción
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Configurar permisos
USER nodejs

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js || exit 1

CMD ["node", "dist/index.js"]
