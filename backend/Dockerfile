# Multi-stage build para optimización
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage de desarrollo
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3002
CMD ["npm", "run", "dev"]

# Stage de construcción
FROM base AS builder
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# Stage de producción
FROM node:20-alpine AS production
WORKDIR /app

# Instalar dependencias de producción (tsconfig-paths es necesario en runtime)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Crear directorio de logs con permisos de escritura para el usuario no-root
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

# Copiar archivos de construcción, el script de registro de aliases y los seeds
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/register.js ./register.js
COPY --from=builder --chown=nodejs:nodejs /app/scripts ./scripts

# Configurar permisos
USER nodejs

EXPOSE 3002

ENV NODE_ENV=production
ENV PORT=3002

CMD node scripts/seed-admin-moderacion.js && node -r ./register.js dist/index.js
