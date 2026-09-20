# Placement & Full-Time Job Portal Documentation

## Overview
The **Placement & Full-Time Job Portal Subsystem** elevates SkillBridge from an internship matchmaking portal to a comprehensive campus recruitment and corporate placement ecosystem. It introduces full-time placement role attributes (CTC, openings count, workplace model, minimum CGPA thresholds), an interactive **Interview Scheduling Subsystem**, and a **Campus Talent Pool Explorer** allowing enterprise recruiters to discover, filter, and invite graduating scholars.

---

## Placement Role Schema Extensions

The [`Opportunity`](file:///c:/Users/vj789/.gemini/antigravity/scratch/skillbridge-ayush/backend/models/Opportunity.js) model was enhanced with corporate placement fields:

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | `'Internship'` | Enum: `['Internship', 'Full-time', 'Clinical Observership', 'Research Fellowship']` |
| `openingsCount` | Number | `2` | Number of corporate vacancies available |
| `workplaceType` | String | `'On-site'` | Enum: `['On-site', 'Remote', 'Hybrid']` |
| `minCgpa` | Number | `6.0` | Academic eligibility cutoff |
| `eligibleDegrees` | Array[String] | `['BAMS', ...]` | Approved Ayush qualifications (`BAMS`, `BHMS`, `BUMS`, `MD/MS Ayush`, `B.Pharma Ayush`) |
| `stipendOrSalary` | String | `'Unpaid'` | Annual CTC (e.g., `₹7.5 LPA - ₹9.0 LPA`) or monthly stipend |

---

## Interview Scheduling Subsystem

Integrated directly within the [`Application`](file:///c:/Users/vj789/.gemini/antigravity/scratch/skillbridge-ayush/backend/models/Application.js) schema under the `interviewSchedule` subdocument:

```javascript
interviewSchedule: {
  scheduledDate: Date,             // ISO timestamp for viva or panel discussion
  roundName: String,               // e.g. "Round 1: Clinical & Analytical Panel Viva"
  meetingLink: String,             // Google Meet, Zoom, or campus boardroom URI
  locationDetails: String,         // Virtual room or corporate lab address
  instructions: String,            // Preparation guidelines for the candidate
  scheduledAt: Date                // Creation timestamp
}
```

### Recruiter & Candidate Workflow
1. **Recruiter Review:** Recruiter inspects candidate's verified skills vs required competencies in `IndustryDashboard.jsx`.
2. **Scheduling:** Clicking **"Schedule Placement Viva"** opens an inline scheduler to specify Date/Time, Round Title, and Virtual Meeting Link.
3. **Automated Candidate Alert:** The candidate's `StudentApplications.jsx` portal displays a high-visibility interview invitation banner with date, time, notes, and a **"Join Virtual Interview"** 1-click launch button.

---

## Campus Talent Pool Explorer

Accessible to recruiters via `/industry` (Talent Pool tab) and backed by `GET /api/industry/talent-pool`:
- **Degree Filter:** `BAMS`, `BHMS`, `BUMS`, `MD/MS Ayush`, `B.Pharma Ayush`.
- **CGPA Cutoff:** Dynamic filter (`7.0+`, `7.5+`, `8.0+`, `8.5+`).
- **Live Competencies:** Displays verified faculty-endorsed skill tags per student.
- **1-Click Portfolio:** Direct link to each student's verifiable public portfolio (`/portfolio/:slug`).
- **Direct Invitation:** Instant **"Invite to Apply"** recruiter action.

---

## API Endpoints Reference

| Method | Endpoint | Access Guard | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/industry/talent-pool` | Industry, Admin | Searches student directory with `degree`, `minCgpa`, `skillId`, and text filters. |
| `POST` | `/api/industry/opportunities` | Industry, Admin | Creates full-time placement postings with CTC, openings count, and min CGPA. |
| `PUT` | `/api/industry/applications/:id/status` | Industry, Admin | Supports `Interview_Scheduled` with nested `interviewSchedule` details. |
| `GET` | `/api/students/my-applications` | Student | Returns application pipeline including populated interview schedule and links. |

---

## Automated Verification Suite

Tested and validated through [`backend/tests/phase11_placement_test.js`](file:///c:/Users/vj789/.gemini/antigravity/scratch/skillbridge-ayush/backend/tests/phase11_placement_test.js):
- `✔ Test 1`: Industry recruiter authenticated.
- `✔ Test 2`: Student authenticated.
- `✔ Test 3`: Skills catalog loaded.
- `✔ Test 4`: Full-time placement role posted (`CTC: ₹7.5 LPA - ₹9.0 LPA`, `minCgpa: 7.5`, `openingsCount: 3`).
- `✔ Test 5`: Campus Talent Pool queried (`degree=BAMS&minCgpa=7.0`).
- `✔ Test 6`: Student applied to full-time placement role.
- `✔ Test 7`: Recruiter scheduled interview round with virtual meeting link and instructions.
- `✔ Test 8`: Student verified interview invitation in application tracker with matching link and schedule details.

**Pass Rate:** 8/8 (100%).
