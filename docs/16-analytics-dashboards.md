# Phase 15: Role-Specific Dashboards & Executive Institutional Analytics

## 1. Executive Summary & Architectural Overview

The **Role-Specific Dashboards & Executive Institutional Analytics Subsystem** transforms raw transactional records into actionable, empirical intelligence for educational leadership, institutional directors, Academic Senates, and the Ministry of Ayush.

This module addresses a critical requirement of the SIH Problem Statement (SIH26044): bridging the visibility chasm between academic curriculum outputs and enterprise hiring realities. By coupling a **6-stage sequential placement absorption funnel** with a **5-sector industrial demand vs graduate supply matrix**, institutional authorities can pinpoint precisely where candidates drop out of the recruitment pipeline and what curricular interventions are required to restore alignment.

```
+--------------------------------------------------------------------------------------------------+
|                            INSTITUTIONAL EXECUTIVE ANALYTICS ENGINE                              |
+--------------------------------------------------------------------------------------------------+
                                               |
         +-------------------------------------+------------------------------------+
         |                                     |                                    |
         v                                     v                                    v
+------------------+                 +--------------------+               +--------------------+
| 6-Stage Pipeline |                 | 5-Sector Gap Matrix|               | Clinical Credential|
| Absorption Funnel|                 | Industrial Demand  |               | Verification & Seal|
| Applied -> Placed|                 | vs Graduate Supply |               | SHA-256 Digest     |
+------------------+                 +--------------------+               +--------------------+
         |                                     |                                    |
         v                                     v                                    v
+------------------+                 +--------------------+               +--------------------+
| Drop-off & Yield |                 | Academic Council   |               | W3C-Compatible     |
| Stage Reciprocity|                 | Remedial Advisories|               | Ledger Signature   |
+------------------+                 +--------------------+               +--------------------+
```

---

## 2. 6-Stage Placement Absorption Funnel

The recruitment lifecycle is modeled as a 6-stage sequential absorption pipeline:

$$\text{Funnel Stages} = \left[\text{Applied} \longrightarrow \text{Under\_Review} \longrightarrow \text{Shortlisted} \longrightarrow \text{Interview\_Scheduled} \longrightarrow \text{Offered} \longrightarrow \text{Accepted}\right]$$

### Pipeline Stage Definitions

| Stage Index | Stage Identifier | Clinical / Industrial Definition | Conversion Metric |
|---|---|---|---|
| **Stage 1** | `Applied` | Candidate submits formal application for posted role | $\text{Stage Base} = 100\%$ |
| **Stage 2** | `Under_Review` | Application passed initial screening by corporate HR | $\frac{N_{\text{under\_review}}}{N_{\text{applied}}} \times 100$ |
| **Stage 3** | `Shortlisted` | Candidate cleared for Samhita knowledge & technical evaluation | $\frac{N_{\text{shortlisted}}}{N_{\text{under\_review}}} \times 100$ |
| **Stage 4** | `Interview_Scheduled` | Candidate actively undergoing clinical OPD/viva rounds | $\frac{N_{\text{interview}}}{N_{\text{shortlisted}}} \times 100$ |
| **Stage 5** | `Offered` | Formal appointment / stipend letter issued | $\frac{N_{\text{offered}}}{N_{\text{interview}}} \times 100$ |
| **Stage 6** | `Accepted` | Candidate accepted offer and inducted into industrial rotation | $\frac{N_{\text{accepted}}}{N_{\text{offered}}} \times 100$ |

### Mathematical Reciprocity

For every stage $i > 1$, the stage conversion rate and drop-off rate maintain strict reciprocal consistency:

$$\text{ConversionRate}_i + \text{DropOffRate}_i = 100\%$$

$$\text{Overall Yield} = \frac{N_{\text{accepted}}}{N_{\text{applied}}} \times 100$$

---

## 3. 5-Sector Ayush Industrial Demand vs Graduate Supply Matrix

The platform continuously evaluates institutional graduate supply against industrial enterprise demand across 5 statutory Ayush sectors:

### Sector 1: Ayurveda Clinical Diagnostics & Panchakarma Protocols (`SEC-01`)
- **Evaluated Competencies:** `Panchakarma Protocol`, `Nadi Pariksha Diagnostics`, `Kshar Sutra Surgery`, `Prakriti Assessment`.
- **Industry Demand Index:** $88 / 100$
- **Institutional Supply Index:** $62 / 100$
- **Gap Delta:** $+26\%$ (`Critical`)
- **Curriculum Advisory:** Increase mandatory clinical OPD/IPD rotations by 40 hours and introduce simulated Panchakarma table handling in Semester 7.
- **Recommended Electives:** *Advanced Panchakarma Therapy & SOPs (4 Credits)*, *Nadi Vigyan & Pulse Diagnostic Clinical Workshop (2 Credits)*.

### Sector 2: Schedule T GMP Compliance & Pharma Quality Assurance (`SEC-02`)
- **Evaluated Competencies:** `Ayush GMP Compliance`, `Standard Operating Procedures (SOP)`, `Heavy Metal Limit Testing`, `Microbial Load Validation`.
- **Industry Demand Index:** $84 / 100$
- **Institutional Supply Index:** $46 / 100$
- **Gap Delta:** $+38\%$ (`Critical`)
- **Curriculum Advisory:** Integrate a 30-hour laboratory module on Schedule T industrial documentation, batch manufacturing records (BMR), and validation protocols before Semester 8.
- **Recommended Electives:** *Schedule T Statutory Validation & Cleanroom Standards (3 Credits)*, *Heavy Metal & Microbial Quality Control in Botanicals (2 Credits)*.

### Sector 3: Herbal Formulation Chemistry & Phytochemistry Standardization (`SEC-03`)
- **Evaluated Competencies:** `Dravyaguna Identification`, `HPTLC Fingerprinting`, `Herbal Extraction Kinetics`, `Phytochemical Assay`.
- **Industry Demand Index:** $76 / 100$
- **Institutional Supply Index:** $58 / 100$
- **Gap Delta:** $+18\%$ (`Moderate`)
- **Curriculum Advisory:** Upgrade central herbal testing laboratory with high-performance TLC instruments and partner with verified Ayush pharma for joint monograph projects.
- **Recommended Electives:** *HPTLC Fingerprinting & Chromatographic Profiling (3 Credits)*, *Ayurvedic Pharmacopoeia of India (API) Monograph Compliance (2 Credits)*.

### Sector 4: Ayush Clinical Trials, GCP & CTRI Regulatory Protocols (`SEC-04`)
- **Evaluated Competencies:** `Ayush Clinical Trials`, `CTRI Registry Protocols`, `GCP Compliance`, `Pharmacovigilance in Ayush`.
- **Industry Demand Index:** $70 / 100$
- **Institutional Supply Index:** $38 / 100$
- **Gap Delta:** $+32\%$ (`Critical`)
- **Curriculum Advisory:** Incorporate ICMR-Ayush Good Clinical Practice (GCP) certification and clinical trial protocol drafting as a mandatory degree prerequisite.
- **Recommended Electives:** *Ayush Good Clinical Practice (GCP) & Ethical Committee Submissions (3 Credits)*, *Pharmacovigilance & Adverse Drug Reaction (ADR) Monitoring (2 Credits)*.

### Sector 5: Hospital Administration, Morbidity Coding & NAMASTE Informatics (`SEC-05`)
- **Evaluated Competencies:** `NAMASTE Morbidity Coding`, `Ayush Hospital Information Systems`, `NABH Accreditation`, `Ayush Insurance Claims`.
- **Industry Demand Index:** $64 / 100$
- **Institutional Supply Index:** $56 / 100$
- **Gap Delta:** $+8\%$ (`Aligned`)
- **Curriculum Advisory:** Curriculum currently well-aligned with national benchmarks; maintain existing NAMASTE informatics elective and add practical sandbox EHR billing exercises.
- **Recommended Electives:** *NAMASTE & ICD-11 Traditional Medicine Module (2 Credits)*, *NABH Accreditation Standards for Ayush Hospitals (2 Credits)*.

---

## 4. Cryptographic Clinical Endorsement Engine

When an institutional director or dean verifies a student's clinical rotation proficiency via `POST /api/institute/endorse-skill`, the platform immediately computes a tamper-evident 64-character SHA-256 cryptographic seal:

$$\mathbf{CredentialHash} = \mathbf{SHA256}(\text{studentId} : \text{skillId} : \text{score} : \text{endorsedBy} : \text{timestamp})$$

- **Stored Attributes:** `isEndorsed: true`, `endorsedBy: institute._id`, `issuedAt: timestamp`, `credentialHash`.
- **Verification:** Recruiters can verify the credential in real time using the public endpoint `GET /api/students/verify-credential/:hash`, confirming that the badge was legitimately signed by an accredited institution.

---

## 5. REST API Specifications

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `GET` | `/api/analytics/institute/summary` | `institute`, `admin` | Returns institutional KPIs (enrolled scholars, active opportunities, placed count, placement rate %, active interns, verified ledger credentials) |
| `GET` | `/api/analytics/placement-funnel` | `institute`, `industry`, `admin` | Returns 6-stage absorption funnel with candidate volumes, stage percentages, conversion rates, and drop-offs |
| `GET` | `/api/analytics/curriculum-heatmap` | `institute`, `faculty`, `admin` | Returns 5-sector demand vs supply matrix with gap deltas and Academic Council syllabus advisories |
| `GET` | `/api/analytics/skill-demand` | Public / Protected | Returns aggregated high-demand competencies with momentum trend tags |
| `GET` | `/api/analytics/admin/overview` | `admin` | Pan-India ministerial roll-up covering multi-tenant users, active R&D calls, placement rates, and total ledger credentials |
| `POST` | `/api/institute/endorse-skill` | `institute` | Endorses a student clinical competency and generates a cryptographic SHA-256 micro-credential seal |

---

## 6. Frontend Executive Command Center UI

The `InstituteDashboard.jsx` interface is structured into four specialized executive tabs:

1. **Executive Overview & Placement Funnel:**
   - 4 Top-level StatCards (Enrolled Scholars, Industry Opportunities, Placed/Offered, Active Clinical Interns).
   - Interactive 6-Stage Absorption Funnel with color-coded progression bars and conversion/drop-off tags.
   - Summary telemetry cards (Average Time to Placement: 14 days, Top recruiting sectors).
   - Real-time Ayush Industry Competency Demand pulse widget.
2. **Ayush Industry Demand Heatmap:**
   - Sector filtering by Ayush branch (`All`, `Ayurveda`, `Pharma`, `Research`, `Health IT`).
   - Comparative dual-progress bars (Enterprise Demand vs Graduate Supply).
   - Gap Delta calculation and Urgency Badges (`Critical`, `Moderate`, `Aligned`).
3. **Curriculum Advisory & Academic Council:**
   - Formal Board of Studies alignment dossiers with identified deficits and recommended credit adjustments.
   - Single-click print/export report functionality (`window.print()`).
4. **Student Clinical Verification & Credentials:**
   - Searchable and filterable student roster.
   - Direct link to each student's public digital portfolio.
   - 1-Click "Verify & Sign Seal" button issuing immediate SHA-256 cryptographic credentials.
