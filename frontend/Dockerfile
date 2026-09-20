# -----------------------------------------------------------------------------
# SkillBridge Enterprise - Multi-Stage Production Frontend Containerfile
# Stage 1: Build Vite React SPA into optimized static production assets
# Stage 2: Serve compiled assets with Alpine Nginx and custom reverse proxy
# -----------------------------------------------------------------------------

# --- Stage 1: Build Phase ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Clean installation of dependencies
RUN npm ci

# Copy frontend source files
COPY . .

# Build production bundle with Vite
RUN npm run build

# --- Stage 2: Production Nginx Runtime ---
FROM nginx:1.25-alpine AS runtime

# Copy compiled static distribution from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

# Health check against Nginx web server
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
