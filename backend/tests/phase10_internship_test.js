/**
 * Phase 10: Internship & Opportunity System Automated Test Suite
 * Tests Opportunity creation, student application, state machine transitions,
 * offer acceptance, withdrawal, and internship progress initialization.
 */
const http = require('http');

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
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
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

async function runInternshipTests() {
  console.log('=== Phase 10: Internship System & State Machine Verification ===\n');
  let passed = 0;
  let total = 0;

  let industryToken = null;
  let studentToken = null;
  let createdOpportunityId = null;
  let createdApplicationId = null;
  let sampleSkillId = null;

  // 1. Authenticate Industry Recruiter
  total++;
  try {
    const indLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'careers@dabur.com',
      password: 'Password@123'
    });
    if (indLogin.status === 200 && indLogin.data.data?.token) {
      industryToken = indLogin.data.data.token;
      console.log('✔ Test 1 Passed: Industry recruiter authenticated successfully');
      passed++;
    } else {
      console.error('✖ Test 1 Failed: Industry login failed', indLogin.data);
    }
  } catch (err) {
    console.error('✖ Test 1 Error:', err.message);
  }

  // 2. Authenticate Student
  total++;
  try {
    const stuLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'student.ayush@gmail.com',
      password: 'Password@123'
    });
    if (stuLogin.status === 200 && stuLogin.data.data?.token) {
      studentToken = stuLogin.data.data.token;
      console.log('✔ Test 2 Passed: Student authenticated successfully');
      passed++;
    } else {
      console.error('✖ Test 2 Failed: Student login failed', stuLogin.data);
    }
  } catch (err) {
    console.error('✖ Test 2 Error:', err.message);
  }

  // 3. Get Skills to use for Opportunity Posting
  total++;
  try {
    const skillsRes = await makeRequest('/api/skills');
    if (skillsRes.status === 200 && skillsRes.data.data?.length > 0) {
      sampleSkillId = skillsRes.data.data[0]._id;
      console.log(`✔ Test 3 Passed: Retrieved active skills for requirement matching`);
      passed++;
    } else {
      console.error('✖ Test 3 Failed: Skills fetch failed', skillsRes.data);
    }
  } catch (err) {
    console.error('✖ Test 3 Error:', err.message);
  }

  // 4. Industry Posts New Internship Opportunity
  total++;
  try {
    const oppPayload = {
      title: 'Ayush Quality Control & Schedule T Trainee',
      type: 'Internship',
      description: 'Hands-on quality validation and batch testing under AYUSH GMP guidelines.',
      location: 'Ghaziabad, Uttar Pradesh',
      stipendOrSalary: '₹22,000 / month',
      durationMonths: 6,
      requiredSkills: [sampleSkillId],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
    };
    const postRes = await makeRequest('/api/industry/opportunities', 'POST', oppPayload, industryToken);
    if (postRes.status === 201 && postRes.data.success && postRes.data.data?._id) {
      createdOpportunityId = postRes.data.data._id;
      console.log(`✔ Test 4 Passed: Opportunity posted with ID: ${createdOpportunityId}`);
      passed++;
    } else {
      console.error('✖ Test 4 Failed: Opportunity posting failed', postRes.data);
    }
  } catch (err) {
    console.error('✖ Test 4 Error:', err.message);
  }

  // 5. Student Applies to the Opportunity
  total++;
  try {
    const applyRes = await makeRequest(`/api/students/apply/${createdOpportunityId}`, 'POST', {}, studentToken);
    if (applyRes.status === 201 && applyRes.data.success && applyRes.data.data?._id) {
      createdApplicationId = applyRes.data.data._id;
      console.log(`✔ Test 5 Passed: Student successfully applied (Status: ${applyRes.data.data.status}, Match: ${applyRes.data.data.matchScore}%)`);
      passed++;
    } else {
      console.error('✖ Test 5 Failed: Apply to opportunity failed', applyRes.data);
    }
  } catch (err) {
    console.error('✖ Test 5 Error:', err.message);
  }

  // 6. Prevent Duplicate Application
  total++;
  try {
    const dupRes = await makeRequest(`/api/students/apply/${createdOpportunityId}`, 'POST', {}, studentToken);
    if (dupRes.status === 400 && dupRes.data.error === 'ALREADY_APPLIED') {
      console.log('✔ Test 6 Passed: Duplicate application prevented with 400 ALREADY_APPLIED');
      passed++;
    } else {
      console.error('✖ Test 6 Failed: Duplicate check failed', dupRes.data);
    }
  } catch (err) {
    console.error('✖ Test 6 Error:', err.message);
  }

  // 7. Recruiter State Machine Step 1: Transition Applied -> Under_Review
  total++;
  try {
    const step1Res = await makeRequest(`/api/industry/applications/${createdApplicationId}/status`, 'PUT', {
      status: 'Under_Review',
      feedback: 'Initial portfolio review initiated'
    }, industryToken);
    if (step1Res.status === 200 && step1Res.data.data?.status === 'Under_Review') {
      console.log('✔ Test 7 Passed: Valid transition Applied -> Under_Review');
      passed++;
    } else {
      console.error('✖ Test 7 Failed: Step 1 transition failed', step1Res.data);
    }
  } catch (err) {
    console.error('✖ Test 7 Error:', err.message);
  }

  // 8. State Machine Check: Invalid transition test (Under_Review -> Offered directly)
  total++;
  try {
    const invalidRes = await makeRequest(`/api/industry/applications/${createdApplicationId}/status`, 'PUT', {
      status: 'Offered'
    }, industryToken);
    if (invalidRes.status === 400 && invalidRes.data.error === 'INVALID_STATE_TRANSITION') {
      console.log('✔ Test 8 Passed: State machine blocked invalid transition (Under_Review -> Offered)');
      passed++;
    } else {
      console.error('✖ Test 8 Failed: Invalid transition was unexpectedly permitted', invalidRes.data);
    }
  } catch (err) {
    console.error('✖ Test 8 Error:', err.message);
  }

  // 9. Valid Sequential Transition: Under_Review -> Shortlisted -> Interview_Scheduled -> Offered
  total++;
  try {
    // Under_Review -> Shortlisted
    await makeRequest(`/api/industry/applications/${createdApplicationId}/status`, 'PUT', { status: 'Shortlisted' }, industryToken);
    // Shortlisted -> Interview_Scheduled
    await makeRequest(`/api/industry/applications/${createdApplicationId}/status`, 'PUT', { status: 'Interview_Scheduled' }, industryToken);
    // Interview_Scheduled -> Offered
    const offerRes = await makeRequest(`/api/industry/applications/${createdApplicationId}/status`, 'PUT', {
      status: 'Offered',
      feedback: 'Selected for 6-month ASU Drug QA Trainee internship'
    }, industryToken);

    if (offerRes.status === 200 && offerRes.data.data?.status === 'Offered') {
      console.log('✔ Test 9 Passed: Valid sequential progression reached "Offered" status');
      passed++;
    } else {
      console.error('✖ Test 9 Failed: Progression failed', offerRes.data);
    }
  } catch (err) {
    console.error('✖ Test 9 Error:', err.message);
  }

  // 10. Student Accepts the Offer
  total++;
  try {
    const acceptRes = await makeRequest(`/api/students/applications/${createdApplicationId}/accept`, 'PUT', {}, studentToken);
    if (acceptRes.status === 200 && acceptRes.data.data?.status === 'Accepted') {
      console.log('✔ Test 10 Passed: Student accepted offer; status transitioned to "Accepted"');
      passed++;
    } else {
      console.error('✖ Test 10 Failed: Accept offer failed', acceptRes.data);
    }
  } catch (err) {
    console.error('✖ Test 10 Error:', err.message);
  }

  // 11. Verify InternshipProgress Tracking Created
  total++;
  try {
    const trackRes = await makeRequest('/api/tracking/my-internship', 'GET', null, studentToken);
    if (trackRes.status === 200 && trackRes.data.data) {
      console.log('✔ Test 11 Passed: InternshipProgress tracking record successfully verified for accepted offer');
      passed++;
    } else {
      console.error('✖ Test 11 Failed: Internship tracking record not found', trackRes.data);
    }
  } catch (err) {
    console.error('✖ Test 11 Error:', err.message);
  }

  // 12. Student Application Withdrawal Test
  total++;
  try {
    // Post a temporary opportunity and apply to test withdrawal
    const tempOppRes = await makeRequest('/api/industry/opportunities', 'POST', {
      title: 'Temporary Clinical Research Volunteer',
      type: 'Clinical Observership',
      description: 'Temporary testing role for candidate withdrawal verification.',
      location: 'Delhi',
      stipendOrSalary: 'Unpaid',
      durationMonths: 1,
      requiredSkills: [sampleSkillId],
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    }, industryToken);

    const tempAppRes = await makeRequest(`/api/students/apply/${tempOppRes.data.data._id}`, 'POST', {}, studentToken);
    const tempAppId = tempAppRes.data.data._id;

    const withdrawRes = await makeRequest(`/api/students/applications/${tempAppId}/withdraw`, 'PUT', {
      reason: 'Accepted alternate offer'
    }, studentToken);

    if (withdrawRes.status === 200 && withdrawRes.data.data?.status === 'Withdrawn') {
      console.log('✔ Test 12 Passed: Candidate successfully withdrew active application (Status: Withdrawn)');
      passed++;
    } else {
      console.error('✖ Test 12 Failed: Withdrawal failed', withdrawRes.data);
    }
  } catch (err) {
    console.error('✖ Test 12 Error:', err.message);
  }

  console.log(`\n==============================================`);
  console.log(`Results: ${passed}/${total} Tests Passed (${Math.round((passed/total)*100)}%)`);
  console.log(`==============================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runInternshipTests();
