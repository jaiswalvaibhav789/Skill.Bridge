# 04. System Architecture: Academia–Industry Collaboration Portal

> **Architecture Style:** Decoupled Modular Client-Server Architecture  
> **Backend Runtime:** Node.js 20+ LTS / Express.js REST API  
> **Database:** MongoDB 7.0+ with Mongoose 8.x ODM  
> **Frontend:** React 18 / Vite 5 / Tailwind CSS  
> **Optional AI Layer:** Python 3.11+ / FastAPI (Targeted Semantic Embeddings)  

---

## 1. High-Level Architectural Diagram

```
+-------------------------------------------------------------------------------+
|                                CLIENT TIER                                    |
|   React 18 Single Page Application (SPA) with Vite & Tailwind CSS              |
|   - Multi-Role Route Protection (Student, Faculty, Industry, Admin)            |
|   - Reusable Component Tokens & Glassmorphic Dashboards                        |
|   - Axios Client with Automatic Bearer Interceptors & Expiry Management       |
+-------------------------------------------------------------------------------+
                                      │  HTTPS / REST JSON
                                      ▼
+-------------------------------------------------------------------------------+
|                          SECURITY & GATEWAY TIER                              |
|   - Helmet.js Security Headers (CSP, HSTS, Sniff Prevention)                   |
|   - Strict CORS Origin Whitelisting                                           |
|   - Granular Rate Limiting (express-rate-limit)                               |
|   - Distributed X-Request-ID Header Tracing                                   |
|   - JWT Authentication & Granular RBAC Role Guards                            |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼
+-------------------------------------------------------------------------------+
|                         APPLICATION SERVICE TIER                              |
|   - Authentication & Token Rotation Controller                                |
|   - Multi-Tenant Profile Management Service                                   |
|   - Diagnostic Assessment & Timed Question Bank Engine                         |
|   - Mathematical Skill Gap Engine (Current vs Target Role)                    |
|   - Multi-Factor Weighted Recommendation Engine                                |
|   - Opportunity Posting & Multi-Stage Application Pipeline                    |
|   - Internship Milestone Tracking & Mentor Sign-Off                           |
|   - Cross-Departmental Analytics & Skill Demand Heatmaps                      |
+-------------------------------------------------------------------------------+
                                      │
                                      ▼
+-------------------------------------------------------------------------------+
|                            DATA & PERSISTENCE                                 |
|   - MongoDB Atlas Replica Set / Local MongoDB Daemon                          |
|   - Indexed Mongoose Schemas (Compound, Unique, TTL indexes)                  |
|   - Immutable Audit Logging Collection                                        |
+-------------------------------------------------------------------------------+
```

## 2. Standardized Communication Contracts

### Success Envelope
Every successful response returns HTTP 200/201 with an identical structure:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable operation description",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "totalRecords": 85,
    "totalPages": 5
  }
}
```

### Error Envelope
Any operational or unexpected error returns the standard error contract:
```json
{
  "success": false,
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Specific error description",
  "details": [ ... ]
}
```

## 3. Reliability & Observability Features
* **Request Tracing:** Every HTTP transaction is injected with a unique `X-Request-ID` UUID passed from client to server logs.
* **Health Check & Diagnostics:** Dedicated `/api/health` and `/api/version` endpoints provide live uptime, memory RSS/heap, and database connection state.
* **Graceful Shutdown:** Intercepts `SIGTERM` and `SIGINT` signals to finish inflight requests and cleanly close database connections before process termination.
