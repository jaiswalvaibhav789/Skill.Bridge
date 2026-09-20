# 06. RESTful API Contract Specification

> **Base URL:** `/api`  
> **Payload Format:** JSON  
> **Authentication:** Bearer JWT in `Authorization` header  
> **Standard Envelope:** Enabled on 100% of endpoints  

---

## 1. Unified REST API Envelopes

### Success Contract (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable status description",
  "data": { ... },
  "meta": {
    "totalRecords": 25,
    "page": 1,
    "limit": 10
  }
}
```

### Error Contract (`400`, `401`, `403`, `404`, `422`, `500`)
```json
{
  "success": false,
  "statusCode": 403,
  "error": "FORBIDDEN",
  "message": "Role [student] is not authorized to perform this operation",
  "details": null
}
```

---

## 2. API Route Directory

### Authentication & Sessions (`/api/auth`)
* `POST /api/auth/register` — Register new user (student, faculty, industry, institute, admin) and create profile.
* `POST /api/auth/login` — Authenticate email/password; returns JWT and user metadata.
* `GET /api/auth/me` — *(Protected: Any)* Fetch authenticated user profile and related organization.

### Diagnostic Assessment Engine (`/api/assessments`)
* `GET /api/assessments` — *(Public)* List all active skill assessments.
* `GET /api/assessments/:id` — *(Protected: Student)* Load assessment questions. **Security constraint:** Correct answers and explanations are suppressed.
* `POST /api/assessments/:id/submit` — *(Protected: Student)* Submit answers array `[{ questionId, selectedOptionKey }]`. Auto-grades test, records `AssessmentAttempt`, and updates student's profile skill score upon passing.

### Skill Gap Analysis Engine (`/api/skill-gap`)
* `GET /api/skill-gap/roles` — *(Public)* List benchmark career roles and their required/preferred skills.
* `GET /api/skill-gap/analyze/:roleId?` — *(Protected: Student)* Compare student's skill proficiency vector against the target role's minimum thresholds:
  $$\text{Deficit} = \text{TargetScore} - \text{StudentScore}$$
  Categorizes deficits into `Critical`, `High`, `Medium`, `Low`, and `Satisfactory`, and recommends matching `LearningProgram` items.

### Skills & Taxonomy (`/api/skills`)
* `GET /api/skills` — *(Public)* Search and filter skills by `category`, `ayushBranch`, and keyword.
* `GET /api/skills/:id` — *(Public)* Retrieve single skill metadata and benchmark standards.

### Student Portfolio & Opportunities (`/api/students`)
* `GET /api/students/profile` — *(Protected: Student)* Get student profile, skills, and target career role.
* `PUT /api/students/profile` — *(Protected: Student)* Update student bio, CGPA, projects, certifications.
* `GET /api/students/portfolio/:slug` — *(Public)* Retrieve verified public digital portfolio by URL slug.
* `GET /api/students/matched-opportunities` — *(Protected: Student)* Opportunities ranked descending by match score percentage with missing skill alerts.
* `POST /api/students/apply/:opportunityId` — *(Protected: Student)* Submit application.
* `GET /api/students/my-applications` — *(Protected: Student)* Track application stages.

### Industry & Recruitment Pipeline (`/api/industry`)
* `GET /api/industry/profile` — *(Protected: Industry)* Get corporate profile.
* `PUT /api/industry/profile` — *(Protected: Industry)* Update corporate details.
* `POST /api/industry/opportunities` — *(Protected: Industry)* Post internship or job opening.
* `GET /api/industry/opportunities` — *(Protected: Industry)* List posted opportunities with applicant counts.
* `GET /api/industry/opportunities/:id/applicants` — *(Protected: Industry)* Applicants ranked by match score.
* `PUT /api/industry/applications/:id/status` — *(Protected: Industry)* Update status (`Under_Review`, `Shortlisted`, `Interview_Scheduled`, `Offered`, `Rejected`). When set to `Offered`, initializes `InternshipProgress`.

### Experiential Internship Tracking (`/api/tracking`)
* `GET /api/tracking/my-internship` — *(Protected: Student)* Fetch active internship with weekly milestone logs.
* `POST /api/tracking/milestone` — *(Protected: Student)* Submit weekly tasks, hours worked, and reflection.
* `GET /api/tracking/industry-interns` — *(Protected: Industry)* View active interns.
* `PUT /api/tracking/milestone/:progressId/:weekNumber/evaluate` — *(Protected: Industry)* Mentor feedback, 1-5 rating, and status approval.
* `PUT /api/tracking/:progressId/complete` — *(Protected: Industry)* Final sign-off and SHA-256 certificate generation.

### Faculty & Academia Collaboration (`/api/faculty`)
* `GET /api/faculty/profile` — *(Protected: Faculty)* Faculty profile.
* `PUT /api/faculty/profile` — *(Protected: Faculty)* Update research, publications, and consulting.
* `GET /api/faculty/collaborations` — *(Protected: Faculty)* FDPs and corporate research fellowships.
