# Phase 18: Production Deployment, Containerization & CI/CD Pipelines

## 1. Executive DevOps Overview

Phase 18 packages SkillBridge Enterprise (SIH Statement ID: **SIH26044**) for enterprise production deployment. The architecture implements **immutable multi-stage Docker containerization**, an **Alpine Nginx reverse proxy gateway**, **multi-container Docker Compose orchestration**, **PM2 production process clustering**, and **GitHub Actions automated CI/CD quality gates**.

```
+---------------------------------------------------------------------------------------------------+
|                           PRODUCTION MULTI-CONTAINER TOPOLOGY                                     |
+---------------------------------------------------------------------------------------------------+
                                                  |
                    +-----------------------------+-----------------------------+
                    |                                                           |
                    v                                                           v
+---------------------------------------+                   +---------------------------------------+
|          CLIENT BROWSER               |                   |         EXTERNAL ENTERPRISE           |
| (Student, Faculty, Industry, Dean)    |                   |           (API Clients)               |
+---------------------------------------+                   +---------------------------------------+
                    |                                                           |
                    +-----------------------------+-----------------------------+
                                                  |
                                                  v  (Port 80)
+---------------------------------------------------------------------------------------------------+
|                              SKILLBRIDGE FRONTEND (Alpine Nginx 1.25)                             |
|  • Serves Pre-Compiled Vite React Assets       • Gzip Compression (CSS, JS, SVG, JSON)            |
|  • SPA Route Fallback (try_files $uri /index)   • Security Headers (X-Frame, X-Content-Type)       |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v  Reverse Proxy: /api/* -> http://backend:5000/api/*
+---------------------------------------------------------------------------------------------------+
|                               SKILLBRIDGE BACKEND (Node.js 18 Alpine)                             |
|  • Hardened Non-Root User ('node')             • In-Memory / Clustering Ready                     |
|  • Multi-Tenant RBAC Security Architecture     • Container Health Check (/api/health)              |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v  (Port 27017)
+---------------------------------------------------------------------------------------------------+
|                                   MONGODB 6.0 DATABASE CONTAINER                                  |
|  • Persistent Storage Volume (mongo-data)       • Automatic Heartbeat Diagnostics (mongosh ping)   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Multi-Stage Containerization Specifications

### 2.1 Backend Containerfile (`backend/Dockerfile`)
- **Base Image:** `node:18-alpine` (lightweight, minimal attack surface).
- **Security:** Operates under dedicated non-root user `node`.
- **Dependency Isolation:** Runs `npm ci --only=production` to exclude developer tooling.
- **Container Health Diagnostics:** Executes periodic `wget` calls against `/api/health`.
- **Exposed Port:** `5000`.

### 2.2 Frontend Multi-Stage Containerfile (`frontend/Dockerfile`)
- **Stage 1 (`builder`):** `node:18-alpine` compiles the Vite React SPA, transforming JSX, Tailwind design tokens, and SVGs into an optimized production bundle (`dist`).
- **Stage 2 (`runtime`):** `nginx:1.25-alpine` receives only the compiled static assets and the tuned `nginx.conf`, resulting in a final container image under 25MB.
- **Exposed Port:** `80`.

### 2.3 Nginx Reverse Proxy Configuration (`frontend/nginx.conf`)
- **Single Page Application Fallback:** `try_files $uri $uri/ /index.html;` ensures React Router handles client navigation seamlessly.
- **API Proxy Routing:** Directs `/api/` traffic to `http://backend:5000/api/` with WebSocket upgrade headers, client IP forwarding (`X-Forwarded-For`), and 90-second read timeouts.
- **Gzip Compression:** Active for text/plain, CSS, JavaScript, JSON, and SVG.
- **Static Asset Cache-Control:** Enforces `public, max-age=31536000, immutable` on hashed assets.

---

## 3. Multi-Container Orchestration (`docker-compose.yml`)

The platform is spun up with a single command:
```bash
docker compose up -d --build
```

### Managed Services

| Service Name | Container Image | Host Port | Internal Port | Health Check Trigger | Volume Storage |
|---|---|:---:|:---:|---|---|
| `mongo` | `mongo:6-jammy` | `27017` | `27017` | `mongosh --eval 'db.adminCommand("ping")'` | `mongo-data:/data/db` |
| `backend` | Build `./backend` | `5000` | `5000` | `wget -qO- http://localhost:5000/api/health` | Application Root |
| `frontend` | Build `./frontend` | `80` | `80` | `wget -qO- http://localhost/` | Nginx Distribution |

### Dependency Chain
$$\text{mongo} \xrightarrow{\text{service\_healthy}} \text{backend} \xrightarrow{\text{service\_healthy}} \text{frontend}$$

---

## 4. Production Process Clustering (`ecosystem.config.js`)

For bare-metal Linux servers or virtual machines deploying outside Docker, PM2 process clustering provides high-availability multi-core utilization:

```javascript
module.exports = {
  apps: [{
    name: 'skillbridge-api',
    script: './server.js',
    instances: 'max',               // Utilize all available CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    max_memory_restart: '500M',     // Guard against unexpected memory expansion
    kill_timeout: 5000,
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

---

## 5. Automated CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

The GitHub Actions workflow implements four sequential quality gates on all pushes and pull requests to `main` and `master`:

1. **Gate 1 (`backend-ci`):**
   - Spins up an ephemeral `mongo:6` service container with live health probes.
   - Executes `npm ci` and seeds the demo environment.
   - Launches the API in the background and runs the 97-test master suite (`node tests/run_all_tests.js`).
2. **Gate 2 (`frontend-ci`):**
   - Installs frontend packages via `npm ci`.
   - Runs `npm run build` and verifies the generation of `dist/index.html`.
3. **Gate 3 (`docker-validation`):**
   - Validates `docker compose config`.
   - Builds both frontend and backend Docker images in parallel.
4. **Gate 4 (`security-audit`):**
   - Scans dependencies across both workspaces using `npm audit --audit-level=high`.
