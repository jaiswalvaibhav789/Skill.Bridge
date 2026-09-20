# Multi-Factor Compatibility & Recommendation Engine

## Overview
The **Multi-Factor Compatibility & Recommendation Engine** replaces naive single-attribute keyword search with an empirical, multi-dimensional decision model. It computes calibrated compatibility scores between students and opportunities (and vice versa for recruiters), while generating personalized remedial learning paths to bridge diagnostic skill deficits.

$$\mathbf{Candidate\ Profile} \times \mathbf{Opportunity\ Requisites} \xrightarrow{\mathbf{5\text{-}Factor\ Engine}} \mathbf{Ranked\ Matches} + \mathbf{Explainable\ Badges} + \mathbf{Remedial\ Pathways}$$

---

## The 5-Factor Mathematical Compatibility Formula

The engine weights 5 distinct dimensions summing strictly to $1.0$ ($100\%$):

$$\mathbf{Compatibility\ Score} = \min\Big(100, \max\big(0, \text{round}(0.50 \cdot S + 0.20 \cdot E + 0.15 \cdot C + 0.10 \cdot P + 0.05 \cdot L)\big)\Big)$$

### Mathematical Parameter Breakdown

| Dimension | Symbol | Weight | Evaluation Method & Mathematical Bounds |
| :--- | :---: | :---: | :--- |
| **Diagnostic Skill Match** | $S$ | **50%** | Ratio of required competencies covered, weighted by candidate diagnostic assessment score ($\text{Score} / 100$) + preferred skills ratio: $S = \text{round}\big((S_{\text{req}} \times 80) + (S_{\text{pref}} \times 20)\big)$. |
| **Academic Eligibility** | $E$ | **20%** | Degree alignment ($100\%$ if direct match in `eligibleDegrees`, $55\%$ if related Ayush discipline) and CGPA compliance ($100\%$ if $\ge \text{minCgpa}$, scaled proportionally otherwise). |
| **Career Role Alignment** | $C$ | **15%** | Semantic alignment between the candidate's target benchmark role (`targetCareerRole`) and the opportunity's industrial classification ($95\%$ for direct domain match, $70\%$ for general Ayush sector alignment). |
| **Practical Experience** | $P$ | **10%** | Verified research projects and certifications matching required technology or pharmacology standards ($70\% - 100\%$). |
| **Location & Workplace Mode** | $L$ | **5%** | Full score ($100\%$) for remote roles or matching metropolitan regions (e.g., Delhi-NCR); $85\%$ for hybrid; $75\%$ for interstate on-site. |

---

## Explainable Recommendation Badges (`matchReasons`)

Rather than presenting an uninterpretable "black-box" percentage, the engine generates human-readable reasoning pills for candidates and hiring managers:
- `⚡ High Competency Coverage (86% diagnostic match)`
- `🎯 100% Academic Degree Match (BAMS)`
- `🎓 Academic Standard Met (CGPA 8.4 ≥ 6.5)`
- `⭐ Career Role Alignment (Ayush Quality Assurance & GMP Officer)`
- `🔬 Practical Project Portfolio Match (2 projects, 1 verified cert)`
- `📍 Regional Proximity (Delhi-NCR)`
- `🌐 Remote Flexibility (Available pan-India)`

---

## API Endpoints Reference

| Method | Endpoint | Access Guard | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/recommendations/opportunities` | Student, Admin | Retrieves active opportunities ranked by multi-factor compatibility with complete factor breakdown and reasoning badges. |
| `GET` | `/api/recommendations/candidates/:opportunityId` | Industry, Admin | Matchmaker endpoint allowing corporate recruiters to view candidates ranked against a vacancy with sub-scores. |
| `GET` | `/api/recommendations/learning-path` | Student, Admin | Analyzes candidate skill gaps across top matched opportunities and prioritizes remedial courses solving those deficits. |
| `GET` | `/api/students/matched-opportunities` | Student | Backward-compatible endpoint returning enriched multi-factor compatibility contracts. |

---

## Sample Response Contract (`GET /api/recommendations/opportunities`)

```json
{
  "success": true,
  "data": [
    {
      "_id": "6aad5bbaca4393fbb9cca51f",
      "title": "Ayush Quality Control & Schedule T Trainee",
      "type": "Internship",
      "industry": {
        "companyName": "Dabur Ayush Research & Manufacturing Ltd",
        "industryType": "Pharmaceuticals & ASU Healthcare"
      },
      "location": "Ghaziabad, Uttar Pradesh",
      "workplaceType": "On-site",
      "compatibilityScore": 86,
      "matchScore": 86,
      "factorBreakdown": {
        "skillScore": 80,
        "eligibilityScore": 100,
        "careerAlignmentScore": 95,
        "practicalScore": 90,
        "locationScore": 100
      },
      "weights": {
        "SKILL": 0.5,
        "ELIGIBILITY": 0.2,
        "CAREER_ALIGNMENT": 0.15,
        "PRACTICAL": 0.1,
        "LOCATION": 0.05
      },
      "matchReasons": [
        "⚡ High Competency Coverage (80% diagnostic match)",
        "🎯 100% Academic Degree Match (BAMS)",
        "🎓 Academic Standard Met (CGPA 8.4 ≥ 6.0)",
        "⭐ Career Role Alignment (Ayush Quality Assurance & GMP Officer)",
        "🔬 Practical Project Portfolio Match (1 project(s), 1 verified cert(s))",
        "📍 Regional Proximity (Ghaziabad, Uttar Pradesh)"
      ],
      "missingSkills": [
        {
          "_id": "6aad5ae218561bec406238ee",
          "name": "Ayush Good Manufacturing Practice (GMP)",
          "category": "Ayush Regulatory & Quality Control"
        }
      ],
      "applicationStatus": null
    }
  ],
  "meta": {
    "totalRecords": 4,
    "topMatch": 86
  }
}
```

---

## Frontend Integration

1. **Opportunity Card Component (`OpportunityCard.jsx`):**
   - Compatibility score badge with dynamic color coding (Emerald $\ge 80\%$, Amber $\ge 60\%$, Rose $< 60\%$).
   - Expandable **"5-Factor Compatibility Math"** accordion visualizing sub-factor progress bars.
   - Dynamic `matchReasons` tag badges.
2. **Student Dashboard (`StudentDashboard.jsx`):**
   - Sorting dropdown: "Overall Multi-Factor", "Diagnostic Skills", "Academic Eligibility", "Career Role".
   - Explanation banner explaining the 5-factor model.
   - **Remedial Courses Widget**: Live courses automatically suggested to resolve candidate deficits.
3. **Industry Recruiter Portal (`IndustryDashboard.jsx`):**
   - **"AI Candidate Recommendations"** tab.
   - Select any published opportunity to rank candidates instantly with 1-click invitation triggers.

---

## Automated Verification Results

All 10 test scenarios passed via `node backend/tests/phase14_recommendation_test.js`:
- ✔ Test 1: Multi-factor weights strictly sum to 1.0 (50% + 20% + 15% + 10% + 5%)
- ✔ Test 2: Student authenticated successfully
- ✔ Test 3: Industry recruiter authenticated successfully
- ✔ Test 4: `/api/recommendations/opportunities` returned 4 ranked opportunities
- ✔ Test 5: Top match includes 5-factor breakdown & 5 reasoning badges
- ✔ Test 6: All compatibility and sub-factor scores conform to bounded [0, 100] range
- ✔ Test 7: Backward-compatible `/api/students/matched-opportunities` returns multi-factor enriched contracts
- ✔ Test 8: Recruiter candidate matchmaking returned ranked candidate profiles with multi-factor breakdown
- ✔ Test 9: Remedial learning engine prioritized courses tailored to student's opportunity skill deficits
- ✔ Test 10: Synthetic benchmark: Perfect alignment yields 99% overall compatibility
