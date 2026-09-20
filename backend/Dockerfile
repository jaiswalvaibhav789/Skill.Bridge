# -----------------------------------------------------------------------------
# SkillBridge Enterprise - Production Backend Containerfile
# Base: Alpine Linux with Node.js 18 LTS
# Security: Runs as non-root user 'node', includes container health check
# -----------------------------------------------------------------------------

FROM node:18-alpine AS base

WORKDIR /app

# Install curl / wget for container health diagnostics
RUN apk add --no-cache wget

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies (only production packages)
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy application source files
COPY . .

# Change ownership to non-root user 'node'
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose API port
EXPOSE 5000

# Container health check against /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start production API server
CMD ["node", "server.js"]
