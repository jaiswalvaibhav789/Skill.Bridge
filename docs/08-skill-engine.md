# 08. Skill Taxonomy & Diagnostic Assessment Engine

> **Subsystem:** Diagnostic Assessment & Empirical Skill Benchmarking  
> **Question Bank Security:** Server-Side Answer Shielding (`correctOptionKey` omitted)  
> **Evaluation:** Timed Auto-Grading with Real-Time Skill Profile Updating  

---

## 1. Skill Taxonomy Categories

1. **Clinical:** Classical diagnostic examination (Nadi Pariksha), therapy planning (Panchakarma), and clinical interventions.
2. **Pharma_Manufacturing:** Schedule T Good Manufacturing Practice (GMP), batch manufacturing records (BMR), cleanroom operations, and phytochemical solvent extraction.
3. **Regulatory_Research:** Good Clinical Practice (GCP), clinical trial documentation, Pharmacovigilance (NPvC), and ASU drug safety reporting.
4. **Hospital_Admin:** Electronic Health Records (EHR), hospital accreditation (NABH), and telemedicine protocols.
5. **General_Technical:** Digital healthcare tools, chromatography data systems, and tele-consultation triage.
6. **Soft_Skills:** Patient dietary counseling (Pathya-Apathya) and bedside communication.
7. **Aptitude:** Clinical logic, problem-solving, and numerical dosage calculations.

---

## 2. Assessment Runner Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Candidate)
    participant UI as AssessmentRunner.jsx
    participant API as /api/assessments API
    participant DB as MongoDB (Question & StudentProfile)

    Student->>UI: Selects Quiz (/assessments/:id)
    UI->>API: GET /api/assessments/:id
    API->>DB: Question.find({ assessment }).select('prompt options weightage')
    Note over API,DB: correctOptionKey strictly withheld
    DB-->>API: Question Prompts & Options
    API-->>UI: 200 OK { assessment, questions }
    UI->>UI: Starts local countdown timer
    Student->>UI: Answers questions (Q1 to Qn)
    Student->>UI: Clicks "Submit Assessment" (or timer expires)
    UI->>API: POST /api/assessments/:id/submit { answers, timeTakenSeconds }
    API->>DB: Question.find({ assessment }).select('+correctOptionKey')
    API->>API: Computes weighted score % & compares with passingScorePercentage
    alt Score >= Passing Threshold
        API->>DB: Updates/Adds skill in StudentProfile.skills with verifiedByAssessment = true
        API->>DB: Saves AssessmentAttempt record
        API-->>UI: 200 OK { passed: true, scorePercentage: 75, skillUpdated: true }
        UI->>Student: Displays congratulations badge & links to updated profile
    else Score < Passing Threshold
        API->>DB: Saves AssessmentAttempt record (failed)
        API-->>UI: 200 OK { passed: false, scorePercentage: 45, skillUpdated: false }
        UI->>Student: Displays "Needs Practice" & retake button
    end
```

---

## 3. Real-Time Radar Update Rule
When a candidate passes an assessment:
* If the skill is already in their profile, `proficiencyScore` is upgraded to the new score if it exceeds their previous record.
* If the skill was missing, it is appended to `StudentProfile.skills` with `verifiedByAssessment = true` and `lastAssessedAt = new Date()`.
* The updated score directly flows into the **Skill Gap Analyzer** and the **Opportunity Recommendation Engine**!
