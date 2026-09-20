# Academia–Industry Collaboration Subsystem

## Overview
The **Academia–Industry Collaboration Subsystem** bridges academic scholarship and corporate R&D in the Ayush sector. It enables pharmaceutical companies and regulatory bodies to fund targeted research challenges, request technical expert consultation, sponsor faculty corporate sabbaticals, and award National Ayush Mission (NAM) grants.

$$\mathbf{Sponsored\ R\&D\ Call} \longrightarrow \mathbf{Faculty\ Proposal} \longrightarrow \mathbf{Corporate\ Review} \longrightarrow \mathbf{Joint\ Execution} \longrightarrow \mathbf{Deliverables\ Validation}$$

---

## Collaboration Categories

| Category | Type Key | Target Initiator | Scope & Scientific Deliverables |
| :--- | :--- | :--- | :--- |
| **Joint R&D Projects** | `Joint_R&D` | Industry | Collaborative drug standardization, HPTLC assaying, ICP-MS heavy metal chelation, and joint Scopus/SCI publications. |
| **Consulting Requests** | `Consulting_Request` | Industry | Direct faculty advisory calls (e.g., Schedule T cleanroom validation, Batch Manufacturing Record audits, pharmacovigilance reports). |
| **Faculty Sabbaticals** | `Faculty_Sabbatical` | Industry | Semester-long corporate research residencies in industrial extraction plants. |
| **Ministry Grants** | `Grant_Call` | Ministry / Govt | Multi-center clinical efficacy trials registered with CTRI. |

---

## Data Schema: `CollaborationProposal`

```javascript
{
  title: String,                     // Required project title
  type: String,                      // Enum: ['Joint_R&D', 'Consulting_Request', 'Faculty_Sabbatical', 'Grant_Call']
  initiatorType: String,             // Enum: ['Industry', 'Faculty', 'Institute', 'Ministry']
  industry: ObjectId,                // Ref: 'IndustryProfile'
  faculty: ObjectId,                 // Ref: 'FacultyProfile'
  institute: ObjectId,               // Ref: 'InstituteProfile'
  description: String,               // Scientific scope & methodology
  budget: String,                    // e.g. "₹25,00,000 (Industry Sponsored)"
  durationMonths: Number,            // e.g. 18
  deliverables: [String],            // List of concrete milestones & reports
  status: String,                    // Enum: ['Open_Call', 'Under_Review', 'Approved', 'Completed', 'Declined']
  applications: [{
    applicantFaculty: ObjectId,      // Ref: 'FacultyProfile'
    proposalAbstract: String,        // Methodology & experimental design
    proposedBudget: String,
    estimatedMonths: Number,
    status: String,                  // Enum: ['Submitted', 'Accepted', 'Rejected']
    submittedAt: Date
  }]
}
```

---

## API Endpoints Reference

| Method | Endpoint | Access Guard | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/collaborations` | Public / Auth | List all active collaboration calls with `type`, `status`, and text filters. |
| `GET` | `/api/collaborations/:id` | Public / Auth | Retrieve single collaboration details with populated faculty proposals. |
| `POST` | `/api/collaborations` | Industry, Faculty, Institute, Admin | Publish a new R&D challenge, consulting call, or sabbatical opportunity. |
| `POST` | `/api/collaborations/:id/apply` | Faculty, Admin | Submit formal research methodology, budget, and timeline to an open call. |
| `PUT` | `/api/collaborations/:id/review-proposal` | Industry, Admin | Accept or decline submitted faculty proposals; transitions call to `Approved`. |
| `PUT` | `/api/collaborations/:id/consulting-response` | Faculty, Admin | Accept or decline direct industrial consulting calls. |

---

## Frontend Hub: `CollaborationsHub.jsx`

Mounted at `/collaborations` and `/faculty/collaborations`:
- **Category Navigation:** Instant filtering across `Joint R&D`, `Consulting Requests`, `Faculty Sabbaticals`, and `Ministry Grants`.
- **Proposal Submission Wizard:** Faculty modal capturing research abstract, budget, and timeline.
- **R&D Call Creation Wizard:** Enterprise modal capturing deliverables, budget, duration, and scientific scope.
- **Proposal Review & Decision Engine:** Industry controls to accept or reject faculty proposals with immediate state transitions.

---

## Verification & Automated Test Suite

Validated via [`backend/tests/phase12_collaboration_test.js`](file:///c:/Users/vj789/.gemini/antigravity/scratch/skillbridge-ayush/backend/tests/phase12_collaboration_test.js):
- `✔ Test 1`: Faculty authentication successful.
- `✔ Test 2`: Industry recruiter authentication successful.
- `✔ Test 3`: Active collaborations catalog retrieved with populated sponsors.
- `✔ Test 4`: Type query filter (`?type=Joint_R&D`) validated.
- `✔ Test 5`: Industry published new Joint R&D Call.
- `✔ Test 6`: Faculty submitted formal research proposal.
- `✔ Test 7`: Duplicate proposal prevented with `400 ALREADY_SUBMITTED`.
- `✔ Test 8`: Industry accepted proposal and transitioned status to `Approved`.
- `✔ Test 9`: Faculty accepted direct industrial consulting request.

**Pass Rate:** 9/9 (100%).
