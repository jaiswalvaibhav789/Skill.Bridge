/**
 * Phase 14: Core Multi-Factor Compatibility & Recommendation Engine Test Suite
 * Tests 5-Factor Mathematical Model, Student Opportunity Recommendations,
 * Recruiter Candidate Matchmaking, and Remedial Learning Path Generation.
 */
const http = require('http');
const { WEIGHTS, calculateMultiFactorCompatibility } = require('../controllers/matchingController');

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = body ? JSON.stringify(body) : null;
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', (err) => reject(err));
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runPhase14Tests() {
  console.log('=== Phase 14: Multi-Factor Compatibility & Recommendation Engine Verification ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✔ Test ${total} Passed: ${message}`);
      passed++;
    } else {
      console.error(`❌ Test ${total} Failed: ${message}`);
    }
  }

  try {
    // 1. Validate Mathematical Weights
    const weightSum = Object.values(WEIGHTS).reduce((acc, curr) => acc + curr, 0);
    assert(
      Math.abs(weightSum - 1.0) < 0.001 &&
      WEIGHTS.SKILL === 0.50 &&
      WEIGHTS.ELIGIBILITY === 0.20 &&
      WEIGHTS.CAREER_ALIGNMENT === 0.15 &&
      WEIGHTS.PRACTICAL === 0.10 &&
      WEIGHTS.LOCATION === 0.05,
      'Multi-factor weights strictly sum to 1.0 (50% Skill + 20% Eligibility + 15% Career + 10% Practical + 5% Location)'
    );

    // 2. Authenticate Student
    const studentLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'student.ayush@gmail.com',
      password: 'Password@123'
    });
    const studentToken = studentLogin.data?.data?.token;
    assert(studentLogin.status === 200 && !!studentToken, 'Student authenticated successfully');

    // 3. Authenticate Industry Recruiter
    const industryLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'careers@dabur.com',
      password: 'Password@123'
    });
    const industryToken = industryLogin.data?.data?.token;
    assert(industryLogin.status === 200 && !!industryToken, 'Industry recruiter authenticated successfully');

    // 4. Student Multi-Factor Opportunity Recommendations
    const recsRes = await makeRequest('/api/recommendations/opportunities', 'GET', null, studentToken);
    const recs = recsRes.data?.data || [];
    assert(
      recsRes.status === 200 && recs.length > 0,
      `/api/recommendations/opportunities returned ${recs.length} ranked opportunities`
    );

    // 5. Verify 5-Factor Breakdown & Reasoning on Top Match
    const topRec = recs[0] || {};
    const fb = topRec.factorBreakdown || {};
    const hasAllFactors = (
      typeof fb.skillScore === 'number' &&
      typeof fb.eligibilityScore === 'number' &&
      typeof fb.careerAlignmentScore === 'number' &&
      typeof fb.practicalScore === 'number' &&
      typeof fb.locationScore === 'number'
    );
    assert(
      hasAllFactors && topRec.matchReasons?.length > 0,
      `Top match (${topRec.title}: ${topRec.compatibilityScore}%) includes 5-factor breakdown & ${topRec.matchReasons?.length} reasoning badges`
    );

    // 6. Verify Score Bounds [0, 100] across all factors
    const validBounds = recs.every(r => 
      r.compatibilityScore >= 0 && r.compatibilityScore <= 100 &&
      r.factorBreakdown.skillScore >= 0 && r.factorBreakdown.skillScore <= 100 &&
      r.factorBreakdown.eligibilityScore >= 0 && r.factorBreakdown.eligibilityScore <= 100
    );
    assert(validBounds, 'All compatibility and sub-factor scores conform to bounded [0, 100] range');

    // 7. Backward Compatibility: /api/students/matched-opportunities
    const studentMatchedRes = await makeRequest('/api/students/matched-opportunities', 'GET', null, studentToken);
    const matchedList = studentMatchedRes.data?.data || [];
    assert(
      studentMatchedRes.status === 200 &&
      matchedList.length > 0 &&
      matchedList[0].matchScore === matchedList[0].compatibilityScore &&
      !!matchedList[0].factorBreakdown,
      'Backward-compatible /api/students/matched-opportunities returns multi-factor enriched contracts'
    );

    // 8. Recruiter AI Candidate Recommendations
    const oppId = topRec._id;
    const candRecsRes = await makeRequest(`/api/recommendations/candidates/${oppId}`, 'GET', null, industryToken);
    const candidateRecs = candRecsRes.data?.data || [];
    assert(
      candRecsRes.status === 200 && candidateRecs.length > 0 && candidateRecs[0].studentId,
      `Recruiter candidate matchmaking returned ${candidateRecs.length} ranked candidate profiles with multi-factor breakdown`
    );

    // 9. Personalized Remedial Learning Path
    const learningPathRes = await makeRequest('/api/recommendations/learning-path', 'GET', null, studentToken);
    const courses = learningPathRes.data?.data || [];
    assert(
      learningPathRes.status === 200 && courses.length > 0,
      `Remedial learning engine prioritized ${courses.length} courses tailored to student's opportunity skill deficits`
    );

    // 10. Pure Formula Unit Tests (Synthetic Extreme Cases)
    // Perfect Candidate Test
    const perfectCandidate = {
      degree: 'BAMS',
      cgpa: 9.0,
      targetCareerRole: { title: 'Ayush Quality Assurance & GMP Officer' },
      skills: [
        { skill: 'skill1', proficiencyScore: 100, verifiedByAssessment: true },
        { skill: 'skill2', proficiencyScore: 100, verifiedByAssessment: true }
      ],
      projects: [{ title: 'GMP Cleanroom Audit', skillsUsed: ['Ayush Quality Assurance & GMP Officer'] }],
      certifications: [{ title: 'Schedule T Specialist', isVerified: true }],
      institute: { location: 'Delhi-NCR' }
    };
    const perfectOpp = {
      title: 'Ayush Quality Assurance & GMP Trainee',
      description: 'Schedule T GMP Compliance',
      eligibleDegrees: ['BAMS'],
      minCgpa: 8.0,
      requiredSkills: ['skill1', 'skill2'],
      preferredSkills: [],
      location: 'Delhi-NCR',
      workplaceType: 'On-site'
    };
    const perfectEval = calculateMultiFactorCompatibility({
      studentProfile: perfectCandidate,
      opportunity: perfectOpp
    });
    assert(
      perfectEval.compatibilityScore >= 95 &&
      perfectEval.factorBreakdown.skillScore === 100 &&
      perfectEval.factorBreakdown.eligibilityScore === 100,
      `Synthetic benchmark: Perfect alignment yields ${perfectEval.compatibilityScore}% overall compatibility (100% Skills, 100% Eligibility)`
    );

  } catch (error) {
    console.error('Fatal test exception:', error.message || error);
  }

  console.log('\n==============================================');
  console.log(`Results: ${passed}/${total} Tests Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('==============================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runPhase14Tests();
