# Phase 16: Real-Time Notification Subsystem & Immutable System Audit Logging

## 1. Executive Architectural Overview

Phase 16 establishes the **Real-Time Notification Subsystem & Immutable System Audit Logging Subsystem** for SkillBridge Enterprise (SIH Statement ID: **SIH26044**).

The architecture bifurcates operational event handling into two synchronized channels:
1. **User Notification Channel:** Provides immediate, role-tailored notifications to Students, Faculty, Industry Recruiters, and Institutional Deans when significant lifecycle transitions occur (e.g., application status changes, milestone evaluations, credential minting).
2. **Forensic Audit Logging Channel:** Implements an append-only, tamper-evident audit ledger recording every high-value state transition, administrative action, and authentication event with client IP origins, timestamps, actor roles, and serialized payload snapshots.

```
                                    +-----------------------------------------+
                                    |        BUSINESS TRANSACTION EVENT       |
                                    | (Application, Endorsement, Evaluation)  |
                                    +-----------------------------------------+
                                                         |
                          +------------------------------+------------------------------+
                          |                                                             |
                          v                                                             v
        +-----------------------------------+                         +-----------------------------------+
        |       NOTIFICATION SERVICE        |                         |         AUDIT LOG ENGINE          |
        |   (Asynchronous / Recipient)      |                         |      (Append-Only / Forensics)    |
        +-----------------------------------+                         +-----------------------------------+
                          |                                                             |
                          v                                                             v
        +-----------------------------------+                         +-----------------------------------+
        |        Notification Schema        |                         |          AuditLog Schema          |
        |  recipient, title, message, link  |                         | actor, role, action, entity, IP   |
        +-----------------------------------+                         +-----------------------------------+
                          |                                                             |
                          v                                                             v
        +-----------------------------------+                         +-----------------------------------+
        |       NotificationDropdown        |                         |       AdminAuditLogs Explorer     |
        |   (Live Unread Counter & Bell)    |                         |  (Filtering, JSON Payload Viewer) |
        +-----------------------------------+                         +-----------------------------------+
```

---

## 2. Notification Subsystem Specifications

### Notification Event Types

| Event Identifier | Target Role | Trigger Source | UI Visual Icon | Destination Link |
|---|---|---|---|---|
| `APPLICATION_UPDATE` | Student | Recruiter modifies application state (Shortlisted, Offered, Accepted, Rejected) | `GraduationCap` (Emerald) | `/applications` |
| `OPPORTUNITY_MATCH` | Student | AI Recommendation Engine detects high compatibility ($\ge 75\%$) vacancy | `Sparkles` (Amber) | `/opportunities` |
| `SKILL_ENDORSED` | Student | Institute Dean signs off on clinical rotation competency | `ShieldCheck` (Purple) | `/portfolio` |
| `ASSESSMENT_COMPLETED` | Student | Auto-grading engine scores diagnostic quiz or certificate issued | `Award` (Blue) | `/skill-gap` |
| `MENTOR_FEEDBACK` | Student | Industry supervisor evaluates weekly internship milestone | `CalendarCheck` (Indigo) | `/internship-tracker` |
| `COLLABORATION_UPDATE` | Faculty / Industry | Joint R&D proposal submitted, approved, or consulting accepted | `Building2` (Teal) | `/collaborations` |
| `SYSTEM_ALERT` | All Roles | Security alerts, statutory NCISM notices, password updates | `AlertCircle` (Slate) | Dynamic |

### REST Endpoints for Notifications

- `GET /api/notifications`: Retrieves user notifications with pagination (`limit`, `page`), filter (`?unreadOnly=true`), and total `unreadCount`.
- `PUT /api/notifications/:id/read`: Marks a single notification as read and returns decremented unread count.
- `PUT /api/notifications/mark-all-read`: Bulk marks all unread notifications as read.
- `DELETE /api/notifications/:id`: Deletes a specific notification from user feed.
- `DELETE /api/notifications/clear-all`: Clears all read notifications.

---

## 3. Immutable Forensic Audit Logging

The platform adheres to strict statutory and cybersecurity standards (W3C Append-Only Audit Logging). The schema disables the Mongoose `updatedAt` field (`{ timestamps: { createdAt: true, updatedAt: false } }`), guaranteeing that once an audit record is committed to the database, it cannot be modified.

### Key Audit Actions Tracked

1. **Authentication & Identity:**
   - `USER_LOGIN`
   - `USER_REGISTER`
   - `PASSWORD_RESET`
2. **Academic & Industry Opportunities:**
   - `OPPORTUNITY_CREATED`
   - `OPPORTUNITY_UPDATED`
3. **Application Lifecycle State Machine:**
   - `APPLICATION_SUBMITTED`
   - `APPLICATION_STATUS_CHANGE` (`Under_Review`, `Shortlisted`, `Interview_Scheduled`, `Offered`, `Accepted`, `Rejected`, `Withdrawn`)
4. **Verifiable Credentialing:**
   - `CREDENTIAL_SEAL_MINTED` (Deterministic 64-char SHA-256 seal issued)
5. **Internship Milestone Tracking:**
   - `INTERNSHIP_MILESTONE_SUBMITTED`
   - `INTERNSHIP_MILESTONE_EVALUATED`
   - `INTERNSHIP_COMPLETED`
6. **Academia-Industry Collaboration:**
   - `COLLABORATION_PROPOSAL_SUBMITTED`
   - `COLLABORATION_STATUS_CHANGE`

### REST Endpoints for Audit Logs (Admin Only)

- `GET /api/audit-logs`: Retrieves paginated audit logs with multi-factor filtering (`action`, `entityType`, `actorRole`, `startDate`, `endDate`).
- `GET /api/audit-logs/summary`: Returns forensic telemetry (total events, events past 24 hours, actor role distribution, top actions, governance standard).
- `GET /api/audit-logs/:id`: Retrieves full forensic audit record with complete serialized JSON payload.

---

## 4. Frontend UI Components

### 1. Interactive Notification Center (`NotificationDropdown.jsx`)
- Replaces static bell in `Navbar.jsx`.
- Live unread counter badge with pulsing visual alert when `unreadCount > 0`.
- Filter tabs: `All` and `Unread`.
- Item metadata: Category icon, title, truncated preview, relative timestamp (`5m ago`, `2h ago`), unread indicator dot, and 1-click delete button.
- Direct navigation: Clicking notification automatically marks it read and navigates to the target context route.
- Periodic polling every 30 seconds for background refresh.

### 2. Administrator Forensic Activity Explorer (`AdminAuditLogs.jsx`)
- Dedicated administrative page mounted at `/admin/audit-logs`.
- 4 Forensic KPI cards: Total Events, Events in Past 24h, Actor Roles Active, Governance Standard.
- Multi-dimensional filter toolbar (by Action, Entity Type, Actor Role).
- Chronological activity stream table with actor emails, entity links, client IP origins, and Action badges.
- **Inspect Payload Modal**: Displays the full serialized JSON event metadata for statutory audits and incident response.
