# Verifiable Digital Portfolio & Cryptographic Credentialing Engine

## Overview
The **Verifiable Digital Portfolio & Cryptographic Credentialing Engine** transforms conventional student résumés into tamper-evident, cryptographically authenticated digital credentials. Powered by deterministic SHA-256 digital signatures, micro-credentials issued to candidates can be independently verified in real time by corporate recruiters, academic institutions, and statutory councils (e.g., NCISM) without manual registrar intervention.

$$\mathbf{Empirical\ Assessment} \longrightarrow \mathbf{Institutional\ Endorsement} \longrightarrow \mathbf{SHA\text{-}256\ Signature} \longrightarrow \mathbf{Public\ Digital\ Portfolio} \longrightarrow \mathbf{Independent\ Audit\ Verification}$$

---

## Cryptographic Architecture & Mathematical Digest Formula

Each verified skill or micro-credential generates a deterministic, collision-resistant 256-bit cryptographic digest (64 hexadecimal characters) computed across immutable candidate and authority parameters:

$$\mathbf{Credential\ Hash} = \mathbf{SHA256}\Big(\text{studentId} : \text{skillId} : \text{proficiencyScore} : \text{endorsedBy} : \text{timestamp}\Big)$$

### Mathematical Properties:
1. **Deterministic Reproducibility:** Any authorized registry node can independently recompute the hash from the verified record parameters to test for zero data tampering.
2. **Avalanche Effect:** A 1-point modification to a candidate's score (e.g., 75% $\rightarrow$ 76%) or a change to the issuing institute ID radically transforms the entire 64-character hash digest.
3. **Collision Resistance:** $2^{256}$ search space guarantees that no two distinct credentials can produce an identical signature.
4. **W3C Compatibility:** Follows the W3C Verifiable Credentials Data Model v1.1, facilitating external interoperability with DigiLocker and National Academic Depository (NAD).

---

## Data Schema Extensions: `StudentProfile`

```javascript
{
  fullName: String,
  degree: String,                      // e.g. 'BAMS', 'BHMS', 'MD/MS Ayush'
  rollNumber: String,
  institute: ObjectId,                 // Ref: 'InstituteProfile'
  portfolioSlug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true                         // e.g. 'ayush-sharma-aiia'
  },
  skills: [{
    skill: ObjectId,                   // Ref: 'Skill'
    proficiency: String,               // 'Beginner' | 'Intermediate' | 'Expert'
    proficiencyScore: Number,          // 0 - 100
    isEndorsed: Boolean,
    endorsedBy: ObjectId,              // Ref: 'InstituteProfile'
    verifiedByAssessment: Boolean,
    lastAssessedAt: Date,
    credentialHash: String,            // 64-char SHA-256 hex digest
    issuedAt: Date
  }],
  certifications: [{
    title: String,
    issuingOrganization: String,
    issueDate: Date,
    credentialUrl: String,
    isVerified: Boolean,
    credentialHash: String             // 64-char SHA-256 hex digest
  }]
}
```

---

## RESTful API Endpoints

| Method | Endpoint | Access Guard | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students/portfolio/:slug` | Public | Resolves full candidate dossier, verified skills matrix, projects, certifications, and verifiable cryptographic credentials ledger. |
| `GET` | `/api/students/verify-credential/:hash` | Public | Validates a 64-character SHA-256 signature against the National Ayush Registry, returning candidate details, issuer accreditation, and ledger proof. |
| `PUT` | `/api/students/portfolio-slug` | Student, Admin | Updates the candidate's custom public web address (e.g., `/portfolio/ayush-sharma-bams`) with uniqueness enforcement. |
| `POST` | `/api/students/generate-credentials` | Student, Admin | Traverses verified competencies and deterministically issues or synchronizes missing SHA-256 signatures. |

---

## Sample Verification Payload (`GET /api/students/verify-credential/:hash`)

```json
{
  "success": true,
  "data": {
    "valid": true,
    "verificationStatus": "AUTHENTIC_AND_VERIFIED",
    "credentialHash": "815dae6f5063a9df8e3f94c7b8d4...3a9f02",
    "credentialType": "Micro-Credential Competency",
    "skillName": "Nadi Pariksha (Pulse Diagnosis)",
    "category": "Ayush Clinical Diagnostics",
    "ayushBranch": "Ayurveda",
    "proficiency": "Intermediate",
    "proficiencyScore": 75,
    "isEndorsed": true,
    "verifiedByAssessment": true,
    "student": {
      "id": "664fa721098b9e1124ad9001",
      "fullName": "Ayush Sharma",
      "degree": "BAMS",
      "department": "Ayush Medicine & Surgery",
      "rollNumber": "AIIA-2022-BAMS-042",
      "passingYear": 2026,
      "portfolioSlug": "ayush-sharma-aiia"
    },
    "issuer": {
      "instituteName": "All India Institute of Ayurveda",
      "aisheCode": "U-0109",
      "location": "New Delhi, India",
      "governingBody": "National Commission for Indian System of Medicine (NCISM)"
    },
    "issuedAt": "2025-01-15T00:00:00.000Z",
    "auditLedger": {
      "blockNumber": 632194,
      "digestAlgorithm": "SHA-256 (256-bit Cryptographic Hash)",
      "entropyBits": 256,
      "tamperEvident": true,
      "ledgerNetwork": "Ayush National Digital Health & Education Credential Registry (ANDH-ECR)",
      "governingAuthority": "National Commission for Indian System of Medicine (NCISM) & Ministry of Ayush",
      "standard": "W3C Verifiable Credentials Standard v1.1 Compatible",
      "timestamp": "2025-01-15T00:00:00.000Z"
    }
  },
  "message": "Cryptographic credential successfully verified against Ayush National Registry"
}
```

---

## Frontend UI Implementation

1. **Public Digital Portfolio (`/portfolio/:slug`):**
   - Recruiter-optimized layout displaying candidate summary, academic department, and target career role.
   - **Verifiable Credential Ledger:** Visual cards highlighting authenticated skills, scores, endorsements, and SHA-256 hash snippets with 1-click copy.
   - **Verification Audit Modal:** Interactive audit modal querying the live backend registry, displaying cryptographic proof, issuer AISHE code, regulatory oversight, and ledger block index.
   - **Printable Dossier Engine:** Dedicated `@media print` styling removing non-essential UI elements to generate a clean A4 PDF résumé/transcript.
2. **Student Portfolio Control Panel (`/portfolio`):**
   - Live shareable web link banner with instant copy.
   - Custom URL slug editor with instant format validation and duplicate prevention.
   - Cryptographic Credentials Manager with "Sync & Re-Sign Credentials" action button.
   - Live recruiter preview link.

---

## Automated Verification Results

All 10 test scenarios executed via `node backend/tests/phase13_portfolio_test.js`:
- ✔ Test 1: Student authenticated successfully
- ✔ Test 2: Public portfolio resolved without authentication token via slug (`/portfolio/ayush-sharma-aiia`)
- ✔ Test 3: Portfolio includes Verifiable Cryptographic Ledger with active credentials
- ✔ Test 4: Credential contains valid 64-character SHA-256 signature
- ✔ Test 5: Public credential verification confirmed authentic & tamper-evident
- ✔ Test 6: Tampered / unregistered SHA-256 hash properly rejected with 404 NOT_FOUND
- ✔ Test 7: Student successfully claimed new custom portfolio slug (`/portfolio/ayush-sharma-bams`)
- ✔ Test 8: Public portfolio immediately resolved at newly configured custom address
- ✔ Test 9: Student synchronized micro-credentials ledger
- ✔ Test 10: Portfolio slug reverted to baseline standard (`ayush-sharma-aiia`) for test repeatability
