# 08. Multi-Tenant Profile Management Architecture

> **Architecture:** Decoupled Polymorphic Profiles with Public Digital Credentials  
> **Stakeholders:** Students, Faculty, Corporate Recruiters, Academic Institutions  
> **Public Credentialing:** Verification Badges, Shareable Slugs, PDF Printable Resumes  

---

## 1. Multi-Tenant Profile Typology

| Profile Model | Entity Scope | Key Capabilities |
| :--- | :--- | :--- |
| **`StudentProfile`** | Undergraduate & Postgraduate Scholars | Academic degrees (BAMS/BHMS), empirical skill radar, target career role, project showcase, verified certifications, public portfolio slug |
| **`FacultyProfile`** | University Professors & Researchers | Department, designation, publications list, corporate consulting history, FDP participation, research fellowships |
| **`IndustryProfile`** | Pharma Plants, Hospitals, CROs, Wellness Resorts | Corporate Identity Number (CIN), AYUSH drug license, HQ location, verification status, active opportunity management |
| **`InstituteProfile`** | Colleges, Universities, Placement Directors | AISHE accreditation code, affiliated university, department management, cohort skill endorsement |

---

## 2. Public Digital Portfolio (`/portfolio/:slug`)

Students are assigned a unique, URL-safe slug (e.g. `/portfolio/ayush-sharma-aiia`):
* **No Authentication Required:** Recruiters and external hiring managers can inspect candidate credentials without requiring a platform login.
* **Verified Badging:** Competencies passed through standardized diagnostic tests display a **Verified** shield and percentage score.
* **One-Click Actions:** External users can copy the public shareable link or trigger browser print-to-PDF formatting for formal job applications.

---

## 3. Faculty Academic & Research Hub (`/faculty`)

Designed to break the isolation between universities and commercial enterprises:
* **Academic Record:** Displays indexed publications with direct DOI / journal links.
* **Consulting History:** Highlights past commercial R&D collaborations.
* **Collaboration Discovery:** Directly integrates calls for Principal Investigators (PI), clinical research sabbaticals, and Faculty Development Programs (FDPs).
