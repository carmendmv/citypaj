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

# Instalar dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copiar archivos de construcción
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Configurar permisos
USER nodejs

EXPOSE 3002

ENV NODE_ENV=production
ENV PORT=3002


CMD ["node", "dist/index.js"]
