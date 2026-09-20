# SkillBridge Enterprise 🌿

> **Production-Grade Academia–Industry Collaboration Portal for Skill Mapping, Internships and Placement**  
> **Smart India Hackathon (SIH 2026) | Problem Statement ID: SIH26044 | Ministry of Ayush**

[![CI/CD Pipeline](https://github.com/ayush-skillbridge/skillbridge-enterprise/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ayush-skillbridge/skillbridge-enterprise/actions/workflows/ci-cd.yml)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg?logo=docker&logoColor=white)](docker-compose.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-97%2F97%20passing-brightgreen.svg)](backend/tests/run_all_tests.js)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg?logo=node.js)](package.json)
[![React](https://img.shields.io/badge/react-18.2.0-cyan.svg?logo=react)](frontend/package.json)

---

## 📌 Executive Summary

**SkillBridge Enterprise** is an enterprise-grade full-stack MERN platform purpose-built to eliminate the structural misalignment between Ayush academic education (BAMS, BHMS, BUMS, BNYS, BSMS) and enterprise industrial requirements (GMP herbal manufacturing, phyto-pharmaceutical analytics, clinical trial GCP monitoring, Ayush hospital administration, and wellness tourism).

The system replaces fragmented academic portals with a unified, **8-stage closed-loop talent lifecycle**:

$$\mathbf{Assess} \longrightarrow \mathbf{Analyze} \longrightarrow \mathbf{Learn} \longrightarrow \mathbf{Apply} \longrightarrow \mathbf{Collaborate} \longrightarrow \mathbf{Intern} \longrightarrow \mathbf{Get\ Placed} \longrightarrow \mathbf{Track\ Progress}$$

Every stage is underpinned by rigorous mathematical scoring models, deterministic cryptographic audit ledgers, role-based access control, and executive telemetry.

---

## 🏛️ System Architecture

SkillBridge Enterprise is architected as a resilient, decoupled 3-tier micro-service system containerized for zero-downtime deployment:

```
+---------------------------------------------------------------------------------------------------------+
|                                      SKILLBRIDGE 3-TIER ARCHITECTURE                                    |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                   [ HTTPS / Web Browser / Mobile ]
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PRESENTATION LAYER (Vite + React 18 SPA)                                                                |
| - Role-based routing (Student, Industry, Faculty, Institute Dean, Ministry Admin)                       |
| - Custom Tailwind CSS design tokens, HSL color system, Glassmorphism, Micro-animations                 |
| - SVG Interactive Radar Skill Visualizer, Placement Absorption Funnel, Curriculum Gap Heatmaps         |
| - Client-side Axios interceptors with request correlation tracing (X-Request-Id)                        |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                        Reverse Proxy via Nginx
                                      (Port 80 / 443 -> Port 5000)
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| APPLICATION & API GATEWAY LAYER (Node.js 18 + Express)                                                  |
| - Security Perimeter: Helmet (HSTS, CSP, XSS), NoSQL injection sanitizer, Rate Limiting (100 req/15m)    |
| - Identity & RBAC: Stateless JWT bearer tokens, Bcrypt (10 salt rounds), 5-Role Authorizer guards       |
| - Uniform Envelope: ApiResponse.success() and ApiResponse.error() with W3C error codes                  |
| - Core Analytical & Pedagogical Engines:                                                                |
|   * 10-Sector Diagnostic MCQ Assessment & Auto-Grading Engine                                           |
|   * 5-Tier Mathematical Skill Gap Analyzer (Deficit = max(0, Required - Current))                       |
|   * 5-Factor Weighted Candidate-Job Recommendation Engine (0.50S + 0.20E + 0.15C + 0.10P + 0.05L)      |
|   * Deterministic SHA-256 Micro-Credential Cryptographic Ledger                                         |
|   * 6-Stage Application State Machine & Weekly Milestone Progress Tracking                              |
|   * Real-Time In-App Notification Dispatcher & Append-Only W3C Audit Logger                             |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                        Mongoose 8 ODM (TCP 27017)
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| DATA & PERSISTENCE LAYER (MongoDB 7.0 Cluster)                                                          |
| - 18 Normalized Schemas with Compound Indexing (studentId + vacancyId, userId + createdAt)              |
| - Collections: Users, Profiles, Skills, Assessments, SkillGaps, Courses, Enrollments, Internships,      |
|                Placements, Applications, WeeklyLogs, Projects, Sabbaticals, Consultancies, Portfolios,  |
|                Certificates, Notifications, AuditLogs                                                   |
+---------------------------------------------------------------------------------------------------------+
```

---

## 👥 5-Role Ecosystem Capabilities

SkillBridge Enterprise accommodates all key stakeholders in the Ayush educational and industrial ecosystem:

| Role | Target Users | Core Portal Capabilities |
|---|---|---|
| 🎓 **Student / Intern** | BAMS, BHMS, BUMS, BNYS, BSMS undergraduates & graduates | • Diagnostic skill assessments across 10 Ayush competencies<br>• Real-time SVG radar gap visualizer with deficit analysis<br>• Remedial course enrollments & verifiable SHA-256 digital micro-credentials<br>• 1-click internship and full-time job applications with 5-factor compatibility match scores<br>• Weekly internship milestone logging and supervisor feedback review |
| 🏢 **Industry Partner** | Herbal Pharma, Ayush Hospitals, Wellness Retreats, CROs | • High-yield internship & full-time job vacancy posting<br>• 6-stage candidate recruitment kanban (Applied $\to$ Under Review $\to$ Shortlisted $\to$ Interview $\to$ Offered $\to$ Accepted)<br>• Faculty R&D collaboration call publishing & consulting engagement requests<br>• Weekly intern milestone evaluation and qualitative scoring |
| 👨‍🏫 **Faculty Member** | Ayush Professors, Clinicians, Researchers | • Industry consulting profiles & verified expertise directory<br>• Joint R&D proposal submissions & corporate partnership matching<br>• Faculty Industrial Sabbatical applications (1–6 months)<br>• Student clinical supervision & institutional mentorship |
| 🏛️ **Institutional Dean** | Ayush College Principals, Placement Cells, TPOs | • Executive placement absorption funnel telemetry & batch conversion metrics<br>• 5-sector Ayush curriculum gap heatmap (Enterprise Demand vs Graduate Supply)<br>• Academic Council syllabus update advisories & Board of Studies recommendations<br>• Cryptographic verification and batch clinical endorsement of student credentials |
| 🛡️ **Ministry Admin** | Ministry of Ayush Evaluators, Regulators, System Admins | • Platform-wide immutable W3C audit trail inspection with IP and actor tracking<br>• System health monitoring, RBAC permission enforcement, and account lifecycle control<br>• National Ayush workforce skill demand vs supply registry analytics |

---

## 🧮 Mathematical Engines & Algorithms

### 1. 5-Tier Mathematical Skill Gap Analyzer
Calculates quantitative competency deficits against industry job requirements:

$$\text{Deficit}_i = \max(0, \text{Required Level}_i - \text{Student Level}_i)$$

Deficit severity is categorized deterministically:
- $\text{Deficit} = 0$: **Mastered / Aligned** (Target exceeded)
- $\text{Deficit} = 1$: **Minor Gap** (Self-directed remedial reading recommended)
- $\text{Deficit} = 2$: **Moderate Gap** (Structured micro-course module recommended)
- $\text{Deficit} \ge 3$: **Critical Gap** (Mandatory supervised institutional lab practicum)

### 2. 5-Factor Weighted Compatibility Recommendation Formula
Scores student-job compatibility from $0\%$ to $100\%$:

$$\text{Score} = 0.50 \cdot S_{\text{skills}} + 0.20 \cdot S_{\text{exp}} + 0.15 \cdot S_{\text{certs}} + 0.10 \cdot S_{\text{pref}} + 0.05 \cdot S_{\text{loc}}$$

Where:
- $S_{\text{skills}} = \frac{\sum_{i=1}^n \min(\text{Current}_i, \text{Required}_i)}{\sum_{i=1}^n \text{Required}_i}$ (Weighted domain skill match)
- $S_{\text{exp}} = \min(1.0, \frac{\text{Student Experience Months}}{\text{Required Experience Months}})$ (Practical field tenure)
- $S_{\text{certs}} = \frac{\text{Matching Verified Certificates}}{\text{Required Certifications}}$ (SHA-256 verified micro-credentials)
- $S_{\text{pref}} = 1.0 \text{ if preferred system matches (Ayurveda/Homeopathy/Unani/Yoga/Siddha), else } 0.0$
- $S_{\text{loc}} = 1.0 \text{ if preferred state matches vacancy location or is remote, else } 0.5$

### 3. Deterministic SHA-256 Micro-Credential Verification Ledger
Every course completion generates an immutable cryptographic verification hash:

$$\text{Certificate Hash} = \text{SHA-256}(\text{StudentId} \,\|\, \text{CourseId} \,\|\, \text{CompletedAt} \,\|\, \text{Grade} \,\|\, \text{IssuerSalt})$$

Recruiters and institutions verify credential authenticity instantaneously without third-party reliance via `/verify/:certificateId`.

---

## 🚀 Quick Start Guide

### Option A: 1-Command Production Stack via Docker Compose (Recommended)

Ensure Docker Desktop and Docker Compose are installed and running:

```bash
# Clone the repository
git clone https://github.com/ayush-skillbridge/skillbridge-enterprise.git
cd skillbridge-enterprise

# Build and start all services in detached mode
docker compose up -d --build
```

**Access Endpoints:**
- **Frontend Application:** [http://localhost](http://localhost) (or [http://localhost:80](http://localhost:80))
- **Backend API Gateway:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MongoDB Database:** `mongodb://localhost:27017/skillbridge_ayush`

To inspect container logs:
```bash
docker compose logs -f
```

To stop all services:
```bash
docker compose down
```

---

### Option B: Local Native Development Setup

#### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance running on port `27017` or MongoDB Atlas URI

#### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env (pre-configured for local MongoDB)
cp .env.example .env

# Pre-populate database with seed data (skills, assessments, vacancies, demo users)
npm run seed

# Launch backend in development mode with nodemon
npm run dev
# Server runs on http://localhost:5000
```

#### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Launch Vite development server
npm run dev
# Application runs on http://localhost:5173
```

---

## 🧪 Master Automated Test Suites

The backend includes a comprehensive, unified Master Test Runner covering unit, integration, RBAC, analytical, security, and cryptographic contracts across all phases:

```bash
cd backend
node tests/run_all_tests.js
```

### Test Suite Execution Breakdown (10 Suites / 97 Tests):
```
============================================================
           SKILLBRIDGE ENTERPRISE MASTER TEST RUNNER        
============================================================
[1/10] Running: phase04_foundation_test.js ... PASSED (10/10)
[2/10] Running: phase07_auth_test.js ... PASSED (9/9)
[3/10] Running: phase08_profile_test.js ... PASSED (8/8)
[4/10] Running: phase08_skill_engine_test.js ... PASSED (8/8)
[5/10] Running: phase09_skill_gap_test.js ... PASSED (9/9)
[6/10] Running: phase10_learning_test.js ... PASSED (7/7)
[7/10] Running: phase11_internship_test.js ... PASSED (8/8)
[8/10] Running: phase15_analytics_test.js ... PASSED (12/12)
[9/10] Running: phase16_notification_audit_test.js ... PASSED (12/12)
[10/10] Running: phase17_security_qa_test.js ... PASSED (14/14)
============================================================
Test Suites: 10 passed, 10 total
Tests:       97 passed, 97 total
Duration:    ~6.24 seconds
All systems operational and verified!
============================================================
```

### Production Frontend Build Verification:
```bash
cd frontend
npm run build
# Compiles all JSX, CSS tokens, and vendor chunks cleanly into /dist in ~6.0s
```

---

## 🔑 Pre-Seeded Demo Credentials

All demo accounts are pre-seeded with full operational data and share a uniform password:

> **Universal Password:** `Password@123`

| Role | Full Name / Organization | Email Address | Access Scope |
|---|---|---|---|
| 🎓 **Student** | Ayush Sharma (BAMS Final Year) | `student.ayush@gmail.com` | Assessments, Gap Analysis, Learning, Jobs, Portfolio |
| 🏢 **Industry** | Dabur Herbal Research Centre | `careers@dabur.com` | Vacancy Postings, Candidate Kanban, Milestone Grading |
| 👨‍🏫 **Faculty** | Dr. Rajesh Sharma (HOD Dravyaguna) | `dr.sharma@aiia.ac.in` | Consulting Profile, Joint R&D, Sabbaticals |
| 🏛️ **Institute** | All India Institute of Ayurveda (AIIA) | `director@aiia.ac.in` | Placement Funnel, Gap Heatmaps, Curriculum Advisories |
| 🛡️ **Admin** | Ministry of Ayush Directorate | `admin@ayush.gov.in` | Audit Log Explorer, User Management, Global Telemetry |

---

## 📚 Living Documentation Library (`/docs`)

SkillBridge Enterprise includes **21 comprehensive living engineering documents** covering every layer of design, implementation, and operation:

| File Name | Topic Covered | Key Specifications |
|---|---|---|
| [docs/00-documentation-index.md](docs/00-documentation-index.md) | **Master Documentation Index** | Complete sitemap, cross-links, and directory of all 21 living documents |
| [docs/01-project-overview.md](docs/01-project-overview.md) | **Project Vision & Scope** | SIH26044 alignment, Ayush sector analysis, 8-stage closed loop |
| [docs/04-system-architecture.md](docs/04-system-architecture.md) | **3-Tier Enterprise Topology** | Decoupled client-server architecture, `ApiResponse` standard envelopes |
| [docs/04-ui-ux-design.md](docs/04-ui-ux-design.md) | **Design Tokens & UI System** | Tailwind CSS custom color tokens, glassmorphism, micro-animations |
| [docs/05-database-design.md](docs/05-database-design.md) | **Data Architecture & Schemas** | 18 normalized Mongoose schemas, compound indexes, ER diagrams |
| [docs/06-api-documentation.md](docs/06-api-documentation.md) | **RESTful API Contracts** | Endpoints, HTTP methods, status codes, request/response schemas |
| [docs/07-authentication.md](docs/07-authentication.md) | **Identity & RBAC Security** | JWT lifecycle, Bcrypt hashing, 5-role middleware guards |
| [docs/08-profile-management.md](docs/08-profile-management.md) | **Multi-Tenant Profiles** | Student, Faculty, Industry, and Institute profiles and CRUD |
| [docs/08-skill-engine.md](docs/08-skill-engine.md) | **Diagnostic Skill Engine** | 10 Ayush competencies, timed MCQs, auto-grading calculations |
| [docs/09-skill-gap-engine.md](docs/09-skill-gap-engine.md) | **Mathematical Gap Analyzer** | Gap deficit formulas, SVG radar charts, benchmark evaluations |
| [docs/10-learning-module.md](docs/10-learning-module.md) | **Remedial Learning Hub** | Course catalogs, remedial enrollments, modular progression |
| [docs/11-internship-system.md](docs/11-internship-system.md) | **Internship State Machine** | 6-stage candidate state machine, weekly supervisor milestone logs |
| [docs/12-placement-portal.md](docs/12-placement-portal.md) | **Corporate Placement Portal** | Full-time job postings, applicant kanban, CTC compensation |
| [docs/13-collaboration-module.md](docs/13-collaboration-module.md) | **Faculty R&D Subsystem** | Joint R&D proposals, faculty sabbaticals, corporate consultancies |
| [docs/14-digital-portfolio.md](docs/14-digital-portfolio.md) | **Verifiable Digital Portfolio** | Deterministic SHA-256 micro-credential ledger, public verification |
| [docs/15-recommendation-engine.md](docs/15-recommendation-engine.md) | **5-Factor Matchmaking Engine** | Mathematical formula ($0.50S + 0.20E + 0.15C + 0.10P + 0.05L$) |
| [docs/16-analytics-dashboards.md](docs/16-analytics-dashboards.md) | **Executive Analytics Dashboards** | 6-stage placement absorption funnel, 5-sector curriculum heatmap |
| [docs/17-notifications-audit-logging.md](docs/17-notifications-audit-logging.md) | **Notifications & Audit Trails** | Real-time notification engine, immutable W3C audit logging |
| [docs/18-security-qa.md](docs/18-security-qa.md) | **Security Hardening & QA** | NoSQL sanitizer, Helmet headers, rate limiters, 97-test suite |
| [docs/19-deployment-devops.md](docs/19-deployment-devops.md) | **Containerization & CI/CD** | Multi-stage Dockerfiles, Nginx reverse proxy, GitHub Actions |
| [docs/20-master-user-guide.md](docs/20-master-user-guide.md) | **Master User Guide** | Step-by-step user journeys for all 5 roles with FAQ & workflows |

---

## 🔒 Security & Compliance Standards

- **Defense-in-Depth Sanitization:** Custom recursive NoSQL sanitizer strips `$` and `.` operators from all request bodies, query params, and route params.
- **HTTP Security Headers:** Hardened via Helmet with `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN`.
- **Brute-Force Rate Limiting:** Global rate limit (100 req/15 min) with strict auth rate limiting (10 req/15 min) on `/api/auth/login` and `/api/auth/register`.
- **Immutable W3C Audit Trails:** All state mutations across internships, placements, R&D proposals, and administrative actions are logged with actor ID, IP address, user-agent, and before/after payloads.
- **Micro-Credential Integrity:** SHA-256 certificate hashing ensures digital portfolios cannot be forged or tampered with.

---

## 📦 Project Structure

```
skillbridge-ayush/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # 4-stage GitHub Actions CI/CD automation
├── backend/
│   ├── config/                      # Database & environment configurations
│   ├── controllers/                 # Express controllers (auth, profiles, jobs, analytics, etc.)
│   ├── middleware/                  # JWT auth, RBAC guards, NoSQL sanitize, rate limiters
│   ├── models/                      # 18 Mongoose data models
│   ├── routes/                      # Modular RESTful API route definitions
│   ├── scripts/                     # Database seeders and maintenance utilities
│   ├── tests/                       # 10 comprehensive test suites (97 tests) + run_all_tests.js
│   ├── utils/                       # ApiResponse envelopes, audit logger, notification dispatcher
│   ├── Dockerfile                   # Hardened multi-stage Node.js container
│   ├── ecosystem.config.js          # PM2 production process cluster configuration
│   └── server.js                    # Express application entry point
├── frontend/
│   ├── public/                      # Static brand assets and favicons
│   ├── src/
│   │   ├── components/              # Reusable UI components (Navbar, NotificationDropdown, Radar, etc.)
│   │   ├── context/                 # React Context providers (AuthContext, SocketContext)
│   │   ├── pages/                   # Full-page views for all 5 roles and public verification
│   │   ├── services/                # Axios HTTP client with request correlation tracing
│   │   ├── styles/                  # Tailwind CSS tokens, HSL color definitions, animations
│   │   ├── App.jsx                  # Main application router with RBAC RouteGuards
│   │   └── main.jsx                 # Vite application mount
│   ├── Dockerfile                   # 2-stage build (Vite -> Alpine Nginx runtime <25MB)
│   ├── nginx.conf                   # Nginx reverse proxy, SPA fallback, gzip compression
│   └── vite.config.js               # Vite build bundler configuration
├── docs/                            # 21 comprehensive living engineering specifications
├── docker-compose.yml               # Multi-container production orchestration
└── README.md                        # Master project documentation
```

---

## 🏆 Smart India Hackathon Alignment (SIH26044)

SkillBridge Enterprise satisfies and exceeds all core requirements of SIH Problem Statement **SIH26044**:
1. **Dynamic Skill Mapping:** Real-time alignment of Ayush curriculum with Ayurvedic pharmacopoeia, GMP standards, and modern clinical trial protocols.
2. **Transparent Internship & Placement Funnel:** End-to-end recruiter kanban with automated milestone evaluation and supervisor verification.
3. **Faculty Industry Immersion:** Institutionalized R&D partnership, consultancy matching, and sabbatical management.
4. **Data-Driven Curriculum Advisory:** Automatic institutional gap heatmaps providing actionable syllabus enhancement advisories to Academic Councils.
5. **Verifiable Micro-Credentials:** Cryptographically sealed achievement records eliminating credential fraud across the sector.

---

## 📄 License

SkillBridge Enterprise is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

Developed with 🌿 for the **Ministry of Ayush** and **Smart India Hackathon 2026**.
