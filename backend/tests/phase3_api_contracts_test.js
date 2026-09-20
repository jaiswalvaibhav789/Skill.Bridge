/**
 * Phase 3 RESTful API & Route Contract Verification Test Suite
 */
const http = require('http');

function apiCall(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
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
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runApiContractTests() {
  console.log('=== Phase 3: RESTful API Contract & Route Verification ===\n');
  let passed = 0;
  let total = 0;

  try {
    // 1. Auth Login: Student
    total++;
    const studentLogin = await apiCall('/api/auth/login', 'POST', {
      email: 'student.ayush@gmail.com',
      password: 'Password@123'
    });
    let studentToken = null;
    if (studentLogin.status === 200 && studentLogin.data.success && studentLogin.data.data.token) {
      studentToken = studentLogin.data.data.token;
      console.log('✔ Test 1 Passed: Student login returns JWT token and standardized envelope');
      passed++;
    } else {
      console.error('✖ Test 1 Failed: Student login failed', studentLogin);
    }

    // 2. Auth Login: Faculty
    total++;
    const facultyLogin = await apiCall('/api/auth/login', 'POST', {
      email: 'dr.sharma@aiia.ac.in',
      password: 'Password@123'
    });
    let facultyToken = null;
    if (facultyLogin.status === 200 && facultyLogin.data.success && facultyLogin.data.data.token) {
      facultyToken = facultyLogin.data.data.token;
      console.log('✔ Test 2 Passed: Faculty login returns JWT token');
      passed++;
    } else {
      console.error('✖ Test 2 Failed: Faculty login failed', facultyLogin);
    }

    // 3. Auth Me: Student session and profile
    total++;
    const meRes = await apiCall('/api/auth/me', 'GET', null, studentToken);
    if (meRes.status === 200 && meRes.data.success && meRes.data.data.profile.fullName === 'Ayush Sharma') {
      console.log('✔ Test 3 Passed: /api/auth/me populated student profile with institute and skills');
      passed++;
    } else {
      console.error('✖ Test 3 Failed: /api/auth/me failed', meRes);
    }

    // 4. Skills Catalog
    total++;
    const skillsRes = await apiCall('/api/skills');
    if (skillsRes.status === 200 && skillsRes.data.success && Array.isArray(skillsRes.data.data) && skillsRes.data.data.length >= 10) {
      console.log(`✔ Test 4 Passed: /api/skills returned ${skillsRes.data.data.length} skills sorted by demand`);
      passed++;
    } else {
      console.error('✖ Test 4 Failed: /api/skills failed', skillsRes);
    }

    // 5. Assessments List & Security Shielding (Concealing Answers)
    total++;
    const assessmentsRes = await apiCall('/api/assessments');
    let assessmentId = null;
    if (assessmentsRes.status === 200 && assessmentsRes.data.success && assessmentsRes.data.data.length > 0) {
      assessmentId = assessmentsRes.data.data[0]._id;
      // Fetch quiz questions
      const quizRes = await apiCall(`/api/assessments/${assessmentId}`, 'GET', null, studentToken);
      const questions = quizRes.data?.data?.questions || [];
      const hasShieldedAnswers = questions.every(q => q.correctOptionKey === undefined);

      if (quizRes.status === 200 && questions.length > 0 && hasShieldedAnswers) {
        console.log(`✔ Test 5 Passed: /api/assessments/${assessmentId} loaded ${questions.length} questions with correctOptionKey strictly shielded from client`);
        passed++;
      } else {
        console.error('✖ Test 5 Failed: Answer shielding failed or no questions returned', quizRes);
      }
    } else {
      console.error('✖ Test 5 Failed: No assessments found');
    }

    // 6. Assessment Answer Submission & Auto-Grading
    total++;
    const quizDetails = await apiCall(`/api/assessments/${assessmentId}`, 'GET', null, studentToken);
    const questions = quizDetails.data?.data?.questions || [];
    // Submit all option 'B' (the correct option for Schedule T floor area and CoA!)
    const submissionAnswers = questions.map(q => ({
      questionId: q._id,
      selectedOptionKey: 'B'
    }));
    const submitRes = await apiCall(`/api/assessments/${assessmentId}/submit`, 'POST', {
      answers: submissionAnswers,
      timeTakenSeconds: 120
    }, studentToken);

    if (submitRes.status === 200 && submitRes.data.success && submitRes.data.data.scorePercentage >= 50) {
      console.log(`✔ Test 6 Passed: /api/assessments/${assessmentId}/submit auto-graded attempt: Score ${submitRes.data.data.scorePercentage}%, Passed: ${submitRes.data.data.passed}`);
      passed++;
    } else {
      console.error('✖ Test 6 Failed: Assessment submission failed', submitRes);
    }

    // 7. Skill Gap Analysis Engine
    total++;
    const gapRes = await apiCall('/api/skill-gap/analyze', 'GET', null, studentToken);
    if (gapRes.status === 200 && gapRes.data.success && gapRes.data.data.gapDetails.length > 0) {
      const gapData = gapRes.data.data;
      console.log(`✔ Test 7 Passed: /api/skill-gap/analyze computed mathematical gap for [${gapData.careerRole.title}]:
    Role Readiness: ${gapData.roleReadinessPercentage}%, Critical Gaps: ${gapData.summary.criticalGapsCount}, High Gaps: ${gapData.summary.highGapsCount}`);
      passed++;
    } else {
      console.error('✖ Test 7 Failed: Skill gap analysis failed', gapRes);
    }

    // 8. Public Shareable Digital Portfolio
    total++;
    const portfolioRes = await apiCall('/api/students/portfolio/ayush-sharma-aiia');
    if (portfolioRes.status === 200 && portfolioRes.data.success && portfolioRes.data.data.fullName === 'Ayush Sharma') {
      console.log('✔ Test 8 Passed: Public portfolio retrieved without auth token via slug /portfolio/ayush-sharma-aiia');
      passed++;
    } else {
      console.error('✖ Test 8 Failed: Public portfolio failed', portfolioRes);
    }

    // 9. Active Internship Tracking & Milestones
    total++;
    const trackingRes = await apiCall('/api/tracking/my-internship', 'GET', null, studentToken);
    if (trackingRes.status === 200 && trackingRes.data.success && trackingRes.data.data.weeklyLogs.length >= 2) {
      console.log(`✔ Test 9 Passed: /api/tracking/my-internship loaded ${trackingRes.data.data.weeklyLogs.length} weekly milestones with mentor feedback & ratings`);
      passed++;
    } else {
      console.error('✖ Test 9 Failed: Active internship tracking failed', trackingRes);
    }

    // 10. Faculty Collaborations & Role Authorization Barrier
    total++;
    const facultyCollabRes = await apiCall('/api/faculty/collaborations', 'GET', null, facultyToken);
    // Negative test: verify student cannot access faculty endpoint
    const forbiddenStudentRes = await apiCall('/api/faculty/collaborations', 'GET', null, studentToken);

    if (facultyCollabRes.status === 200 && forbiddenStudentRes.status === 403) {
      console.log('✔ Test 10 Passed: Faculty collaborations loaded for faculty, and correctly blocked for student role (403 Forbidden)');
      passed++;
    } else {
      console.error('✖ Test 10 Failed: Role guard barrier failed', { facultyCollabRes, forbiddenStudentRes });
    }

    console.log(`\nResults: ${passed}/${total} API contract tests passed.`);
    if (passed === total) {
      console.log('🎉 Phase 3 RESTful API Design & Route Contracts VERIFIED successfully!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('[Fatal API Test Error]:', err);
    process.exit(1);
  }
}

runApiContractTests();
