# Document 20: Master User Guide & Operational Manual

## 1. Introduction & Multi-Role Ecosystem

**SkillBridge Enterprise** (SIH Problem Statement ID: **SIH26044**) bridges the gap between academic education (BAMS, BHMS, BUMS, BNYS, BSMS) and enterprise hiring across the Ayush healthcare and pharmaceutical sectors.

The portal provides tailored experiences for five distinct user personas:
1. **Students & Scholars:** Diagnostic assessments, radar gap analysis, remedial courses, AI-matched opportunities, weekly internship milestone logs, and verifiable digital portfolios.
2. **Industry Recruiters:** Vacancy posting, 5-factor candidate recommendations, application review pipelines, interview scheduling, and internship milestone evaluations.
3. **Faculty & Researchers:** Joint R&D call applications, industrial consulting requests, faculty sabbaticals, and student multidisciplinary squad mentorship.
4. **Institutional Deans & Directors:** Affiliated student directories, 1-click clinical competency sign-offs with SHA-256 micro-credentials, 6-stage placement absorption funnels, and 5-sector curriculum gap heatmaps.
5. **Ministry Administrators:** Pan-India ministerial rollups, multi-tenant governance, immutable forensic audit trails, and platform telemetry.

```
       +-------------------------------------------------------------------------------+
       |                      SKILLBRIDGE MULTI-ROLE ECOSYSTEM                         |
       +-------------------------------------------------------------------------------+
                                               |
         +-----------------+-------------------+-------------------+-----------------+
         |                 |                   |                   |                 |
         v                 v                   v                   v                 v
   +-----------+     +------------+     +-------------+     +-------------+     +-----------+
   |  STUDENT  |     |  INDUSTRY  |     |   FACULTY   |     |  INSTITUTE  |     |   ADMIN   |
   |  PORTAL   |     |  PORTAL    |     |   PORTAL    |     |   PORTAL    |     |  PORTAL   |
   +-----------+     +------------+     +-------------+     +-------------+     +-----------+
         |                 |                   |                   |                 |
         v                 v                   v                   v                 v
   • Assessment      • Job Posting       • Joint R&D         • Student Roster    • National
   • Gap Radar       • Candidate Match   • Consulting Calls  • Clinical Sign-off   Overview
   • Remedial Hub    • Kanban Pipeline   • Team Mentorship   • Placement Funnel  • Forensic
   • Weekly Logs     • Weekly Review                         • Curriculum Gap      Audit Logs
   • Digital Ledger  • Cryptographic                           Heatmap
                       Certificates
```

---

## 2. Standard Demonstration Accounts

All demonstration accounts are pre-seeded and active in the database with standard credentials:

| Persona | Email Address | Password | Initial Redirect | Core Focus Area |
|---|---|---|---|---|
| **Student** | `student.ayush@gmail.com` | `Password@123` | `/student` | Diagnostic Radar, Gaps & Applications |
| **Industry Recruiter** | `careers@dabur.com` | `Password@123` | `/industry` | Talent Search & Kanban Management |
| **Academic Faculty** | `dr.sharma@aiia.ac.in` | `Password@123` | `/faculty` | Joint R&D & Industrial Consulting |
| **Institute Director** | `director@aiia.ac.in` | `Password@123` | `/institute` | Placement Funnels & Curriculum Gap Heatmap |
| **Ministry Admin** | `admin@ayush.gov.in` | `Password@123` | `/institute` | Pan-India Telemetry & Forensic Audit Logs |

---

## 3. Step-by-Step Persona User Journeys

### 3.1 Student Operational Journey

```
[Onboard Profile] -> [Take Diagnostic Quiz] -> [Analyze Skill Gap] -> [Study Remedial Courses]
         |
         v
[Apply to Matched Roles] -> [Track Pipeline State] -> [Submit Weekly Logs] -> [Share SHA-256 Ledger]
```

1. **Profile Setup & Baseline Skills:**
   - Log in with student credentials.
   - Navigate to **Overview (`/student`)** to view current diagnostic status and target career role (*e.g., Ayush Quality Assurance & GMP Officer*).
2. **Diagnostic Skill Assessment:**
   - Navigate to **Assessments (`/assessments`)**.
   - Select an available test (*e.g., Ayush GMP & Quality Control Diagnostic*).
   - Answer timed multiple-choice questions covering Samhita knowledge, regulatory compliance, and laboratory protocols.
   - Upon submission, results are instantly auto-graded with explanation keys and proficiency updates.
3. **Mathematical Skill Gap Analysis:**
   - Navigate to **Skill Gap Analyzer (`/skill-gap`)**.
   - View the interactive SVG radar chart comparing current proficiency against the industry role benchmark.
   - Inspect the categorization of gaps (*Critical*, *High*, *Moderate*, *Satisfied*).
4. **Closing Gaps via Remedial Learning:**
   - Explore recommended remedial courses listed directly on the skill gap and dashboard pages.
   - Enroll in targeted modules (*e.g., Schedule T Industrial Validation*) to close competency deficits.
5. **Applying to Matched Vacancies:**
   - Navigate to **Matched Opportunities (`/opportunities`)**.
   - Review AI-ranked postings with 5-factor compatibility scores and explainable badges.
   - Click **Apply Now** with 1-click submission.
6. **Internship Milestone Tracking:**
   - Once placed, navigate to **Internship Tracker (`/internship-tracker`)**.
   - Submit weekly milestone reflections, hours worked, and clinical case logs.
   - Receive notifications when your industry supervisor evaluates and rates your submission.
7. **Verifiable Digital Portfolio:**
   - Navigate to **Digital Portfolio (`/portfolio`)**.
   - Customize your public slug (*e.g., `/portfolio/ayush-sharma-aiia`*).
   - Share your tamper-evident SHA-256 micro-credentials ledger with external recruiters.

---

### 3.2 Industry Recruiter Operational Journey

1. **Posting Opportunities:**
   - Log in with industry credentials (`careers@dabur.com`).
   - On the **Recruiter Dashboard (`/industry`)**, click **Post New Opportunity**.
   - Enter vacancy title, category, stipend/package, required skills, and preferred competencies.
2. **AI Candidate Matchmaking:**
   - Switch to the **AI Candidate Recommendations** tab.
   - Select any posted role from the dropdown.
   - View candidate profiles pre-ranked by the 5-factor mathematical compatibility formula with sub-factor breakdown bars.
   - Send 1-click candidate invitations or review incoming submissions.
3. **Managing Candidate Pipeline (State Machine):**
   - Click on any active opportunity to review applicants.
   - Move candidates through the 6 validated states: `Applied` $\to$ `Under_Review` $\to$ `Shortlisted` $\to$ `Interview_Scheduled` $\to$ `Offered` $\to$ `Accepted`.
   - On scheduling an interview, enter date, Google Meet link, and preparation instructions.
4. **Weekly Milestone Evaluation & Certification:**
   - Navigate to **Active Interns Tracking (`/industry/interns`)**.
   - Review weekly submissions from candidates, enter star ratings ($1-5$), and provide qualitative feedback.
   - Upon completion of the internship tenure, click **Complete Internship** to generate a verifiable cryptographic completion certificate.

---

### 3.3 Academic Faculty Operational Journey

1. **Faculty Profile & Academic Competencies:**
   - Log in with faculty credentials (`dr.sharma@aiia.ac.in`).
   - View your institutional affiliation, recognized specialization (*Dravyaguna, Rasashastra*), and active consulting areas.
2. **Exploring Joint R&D Opportunities:**
   - Navigate to **Faculty Collaborations (`/faculty/collaborations`)**.
   - Filter listings by `Joint_R&D`, `Consulting_Request`, or `Faculty_Sabbatical`.
   - Submit research proposals detailing methodology, timeline, and deliverables for industry-sponsored calls.
3. **Industry Consulting Inquiries:**
   - Review incoming corporate consulting requests submitted by pharmaceutical units.
   - Accept or decline consulting scopes with timeline and fee terms.
4. **Multidisciplinary Team Mentorship:**
   - Navigate to **AI Team Builder (`/teams`)**.
   - Review 4-member student squads formed by the complementary team formation algorithm and provide guidance on project deliverables.

---

### 3.4 Institutional Dean & Director Operational Journey

1. **Institutional Telemetry & Overview:**
   - Log in with institute credentials (`director@aiia.ac.in`).
   - On the **Executive Analytics (`/institute`)** dashboard, monitor high-level KPIs: Enrolled Scholars, Industry Roles, Placed Candidates, Placement Rate %, and Active Interns.
2. **6-Stage Placement Absorption Funnel:**
   - Inspect the sequential absorption funnel tracking candidates from initial application through to accepted industrial placements.
   - Review stage conversion percentages, drop-off rates, and average placement turnaround (14 days).
3. **Ayush Industry Demand Heatmap:**
   - Switch to the **Ayush Industry Demand Heatmap** tab.
   - Compare enterprise demand against institutional graduate supply across 5 core Ayush sectors.
   - Identify critical gap areas (*e.g., Schedule T GMP Compliance, Clinical Trial Protocols*).
4. **Academic Council Curriculum Advisories:**
   - Open the **Curriculum Advisory & Academic Council** tab.
   - Review empirical syllabus remediation recommendations for the Board of Studies.
   - Click **Export / Print Advisory Report** to generate a print-ready briefing for Senate meetings.
5. **Student Clinical Competency Endorsement:**
   - Switch to the **Student Clinical Verification** tab.
   - Filter scholars by name, roll number, or degree.
   - Click **Verify & Sign Seal** on clinical rotation competencies to instantly mint a 64-character SHA-256 micro-credential seal to the student's digital ledger.

---

### 3.5 Ministry Administrator Operational Journey

1. **Pan-India Multi-Tenant Overview:**
   - Log in with administrator credentials (`admin@ayush.gov.in`).
   - Monitor aggregate national counts across Students, Faculties, Industries, and Educational Institutes.
   - Evaluate national placement absorption rates and active R&D collaborations.
2. **Forensic Audit Activity Stream:**
   - Navigate to **System Audit Logs (`/admin/audit-logs`)**.
   - Filter immutable system events by Action, Entity Type, or Actor Role.
   - Click **Inspect** on any event to view the full serialized JSON payload snapshot and client IP address.
3. **Health & Diagnostics:**
   - Query `/api/health` and `/api/version` to review database connectivity, memory utilization, and active system modules.

---

## 4. UI Assistant Chatbot & Contextual Guidance

- The floating **Ayush AI Assistant Chatbot** is present on every page at the bottom-right corner.
- It provides instant contextual explanations for:
  - How matching scores and 5-factor weights are calculated.
  - How to interpret radar gap charts.
  - State machine transition rules.
  - Direct navigation shortcuts across the portal.

---

## 5. Troubleshooting & Frequently Asked Questions

### Q1: Why is an application status transition rejected?
**Answer:** The portal implements a strict finite state machine. Transitions must follow sequential progression:
`Applied` $\to$ `Under_Review` $\to$ `Shortlisted` $\to$ `Interview_Scheduled` $\to$ `Offered` $\to$ `Accepted`.
Invalid jumps (e.g. `Applied` directly to `Offered`) are rejected with `400 INVALID_STATE_TRANSITION`.

### Q2: How do recruiters verify a student's credential?
**Answer:** Every micro-credential contains a 64-character SHA-256 digest. Recruiters can verify authenticity either by clicking the badge on the candidate's public portfolio URL (`/portfolio/:slug`) or by calling the public verification endpoint `GET /api/students/verify-credential/:hash`.

### Q3: How do I run all automated tests locally?
**Answer:**
```bash
cd backend
node tests/run_all_tests.js
```
This executes all 10 test suites covering 97 tests with a unified execution matrix.
