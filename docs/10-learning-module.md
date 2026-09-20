# Learning & Skill Development Programs Documentation

## Overview
The **Learning & Skill Development Programs Subsystem** forms the third pillar of the closed-loop skill intelligence framework:
$$\mathbf{Assess} \longrightarrow \mathbf{Analyze} \longrightarrow \mathbf{Learn} \longrightarrow \mathbf{Apply} \longrightarrow \mathbf{Collaborate}$$

When a student undergoes diagnostic assessment or skill-gap evaluation, deficits in core competencies (such as ASU Good Manufacturing Practices, Phytochemical HPLC Chromatography, or GCP Clinical Trial Documentation) trigger personalized course recommendations directly tied to that student's target career role.

---

## Program Classification Architecture

Programs in the SkillBridge catalog are categorized along three primary axes:

| Category Dimension | Permitted Values | Purpose / Target Audience |
| :--- | :--- | :--- |
| **Program Type** | `Course`, `Certification`, `Workshop`, `FDP`, `HandsOn_Training` | Form of instruction from foundational lecture to hands-on laboratory work. |
| **Difficulty Tier** | `Beginner`, `Intermediate`, `Advanced` | Progressive complexity aligned with Blooms taxonomy and NEP-2020. |
| **Provider Entity** | `Industry`, `Institute`, `Ministry`, `Autonomous_Body` | Accredited sources such as Dabur, AIIA, CCRAS, ICMR, or Ayush Grid. |

---

## Data Schema & Relationships

### `LearningProgram` Schema
```javascript
{
  title: String,                  // Required, e.g. "Masterclass in Schedule T: ASU Drug GMP"
  providerType: String,           // Enum: ['Industry', 'Institute', 'Ministry', 'Autonomous_Body']
  providerName: String,           // e.g. "Dabur Ayush Research Academy"
  type: String,                   // Enum: ['Course', 'Certification', 'Workshop', 'FDP', 'HandsOn_Training']
  description: String,            // Detailed curriculum breakdown
  coveredSkills: [ObjectId],      // Ref: 'Skill' (Target competencies imparted)
  difficulty: String,             // Enum: ['Beginner', 'Intermediate', 'Advanced']
  durationHours: Number,          // e.g. 24
  cost: String,                   // e.g. "Free (Sponsored by Ayush Ministry)"
  enrollmentUrl: String,          // Direct syllabus or LMS link
  rating: Number,                 // 1.0 - 5.0 (default: 4.8)
  enrolledStudentsCount: Number,  // Dynamically incremented on enrollment
  isActive: Boolean               // Soft deletion flag
}
```

### Student Profile Integration (`StudentProfile.enrolledPrograms`)
```javascript
enrolledPrograms: [{
  program: { type: ObjectId, ref: 'LearningProgram', required: true },
  enrolledAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Enrolled', 'In_Progress', 'Completed'], default: 'Enrolled' },
  progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
  completedAt: { type: Date }
}]
```

---

## API Endpoints

| Method | Route | Access Guard | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/learning` | Public | List all active programs with filters (`type`, `difficulty`, `providerType`, `search`). |
| `GET` | `/api/learning/:id` | Public | Retrieve single program details populated with covered skills. |
| `GET` | `/api/learning/recommended` | Private (`student`) | Returns programs covering skills the logged-in student does NOT yet hold. |
| `GET` | `/api/learning/my-enrollments` | Private (`student`) | Retrieves all active and completed programs enrolled by the student. |
| `POST` | `/api/learning/:id/enroll` | Private (`student`) | Enrolls student into the program, increments enrollment counter, prevents duplicates. |
| `PUT` | `/api/learning/:id/progress` | Private (`student`) | Increments completion progress by delta; auto-marks `Completed` at 100%. |

---

## Verification & Automated Testing

The subsystem is validated via `backend/tests/phase9_learning_test.js`:
- `✔ Test 1`: Student authentication and JWT authorization.
- `✔ Test 2`: Public catalog retrieval with populated `coveredSkills`.
- `✔ Test 3`: Multi-parameter query filtering (`type=Course&difficulty=Intermediate`).
- `✔ Test 4`: Targeted deficit-based recommendation resolution (`/api/learning/recommended`).
- `✔ Test 5`: Active student enrollment listing (`/api/learning/my-enrollments`).
- `✔ Test 6`: Program enrollment lifecycle and duplicate prevention (409 Conflict check).
- `✔ Test 7`: Course progress update (+30%) and status transition to `In_Progress` / `Completed`.

**Pass Rate:** 7/7 (100%).
