# SkillBridge Ayush — Master Technical Specification
**Smart India Hackathon 2026 | Problem Statement ID: SIH26044**  
**Organization:** Ministry of Ayush | **Theme:** Smart Automation | **Category:** Software  

---

## 1. Executive Problem Statement & Context
The **Ministry of Ayush** oversees India's traditional medicine disciplines: Ayurveda, Yoga & Naturopathy, Unani, Siddha, Sowa-Rigpa, and Homoeopathy. Millions of Ayush students (BAMS, BHMS, BUMS, BNYS, BSMS) graduate into an industry characterized by:
1. **Disconnected Curricula:** Academic studies emphasize ancient treatises and classical texts, whereas modern Ayush pharmaceutical manufacturers (GMP plants), wellness resorts, and clinical research centers require standardized competencies like clinical trial documentation, herbal extraction QC/QA, and electronic health record (EHR) operations.
2. **Fragmented Placement Channels:** Internships and recruitments happen via word-of-mouth or generic portals lacking Ayush taxonomy.
3. **Absence of Compatibility Insights:** Students don't know why they are rejected, and recruiters spend weeks manually reviewing resumes.
4. **Zero Institutional Visibility:** Colleges and the Ministry lack aggregated data on regional skill demand patterns.

---

## 2. Technical Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, React Router DOM
- **Backend:** Node.js, Express.js, REST API, JSON Web Token (JWT), bcryptjs
- **Database:** MongoDB Atlas, Mongoose ODM
- **Deployment Format:** Decoupled Client-Server architecture with RBAC security

---

## 3. Mathematical Skill Matching Engine
For candidate $S$ with skills $\{s_1, s_2, \dots, s_n\}$ and Opportunity $O$ with required skills $R = \{r_1, r_2, \dots, r_m\}$ and preferred skills $P = \{p_1, p_2, \dots, p_k\}$:

1. **Matched Required Set:** $M_R = S \cap R$
2. **Missing Skills (Gap):** $G = R \setminus S$
3. **Matched Preferred Set:** $M_P = S \cap P$
4. **Weighted Score:**
   $$\text{Score} = \begin{cases} 
   \text{round}\left(\frac{|M_R|}{|R|} \times 75 + \frac{|M_P|}{|P|} \times 25\right) & \text{if } |P| > 0 \\
   \text{round}\left(\frac{|M_R|}{|R|} \times 100\right) & \text{if } |P| = 0 
   \end{cases}$$

---

## 4. API Specification
- `POST /api/auth/register` — User signup (student, industry, institute, admin)
- `POST /api/auth/login` — User authentication & JWT delivery
- `GET /api/auth/me` — Current session verification
- `GET /api/students/profile` — Student profile details & verified skills
- `PUT /api/students/profile` — Student profile update
- `GET /api/students/matched-opportunities` — Opportunities sorted by Match %
- `POST /api/students/apply/:opportunityId` — Submit application
- `GET /api/students/my-applications` — Track application stages
- `POST /api/industry/opportunities` — Create job/internship listing
- `GET /api/industry/opportunities/:id/applicants` — Applicants ranked by match score
- `PUT /api/industry/applications/:id/status` — Shortlist/Reject candidate
- `GET /api/analytics/institute/summary` — Placement KPIs
- `GET /api/analytics/skill-demand` — Top Ayush skill demand breakdown
