/**
 * Phase 11: Placement & Full-Time Job Portal Automated Test Suite
 * Tests Full-Time Job Postings, Talent Pool Search, and Interview Scheduling Subsystem.
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

async function runPlacementTests() {
  console.log('=== Phase 11: Placement & Full-Time Job Portal Verification ===\n');
  let passed = 0;
  let total = 0;

  let industryToken = null;
  let studentToken = null;
  let sampleSkillId = null;
  let fullTimeOppId = null;
  let placementAppId = null;

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

  // 3. Retrieve Active Skill for Job Requirements
  total++;
  try {
    const skillsRes = await makeRequest('/api/skills');
    if (skillsRes.status === 200 && skillsRes.data.data?.length > 0) {
      sampleSkillId = skillsRes.data.data[0]._id;
      console.log('✔ Test 3 Passed: Skills catalog retrieved');
      passed++;
    } else {
      console.error('✖ Test 3 Failed: Skills fetch failed', skillsRes.data);
    }
  } catch (err) {
    console.error('✖ Test 3 Error:', err.message);
  }

  // 4. Post Full-Time Job with Placement Attributes
  total++;
  try {
    const jobPayload = {
      title: 'Senior Herbal Formulations & GMP Lead Chemist',
      type: 'Full-time',
      description: 'Lead commercial extraction plant scaling, Schedule T cleanroom validation, and quality audits.',
      location: 'Ghaziabad, Uttar Pradesh',
      stipendOrSalary: '₹7.5 LPA - ₹9.0 LPA',
      durationMonths: 24,
      openingsCount: 3,
      workplaceType: 'On-site',
      minCgpa: 7.5,
      eligibleDegrees: ['BAMS', 'B.Pharma Ayush', 'MD/MS Ayush'],
      requiredSkills: [sampleSkillId],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    };

    const postRes = await makeRequest('/api/industry/opportunities', 'POST', jobPayload, industryToken);
    if (postRes.status === 201 && postRes.data.success && postRes.data.data?._id) {
      fullTimeOppId = postRes.data.data._id;
      console.log(`✔ Test 4 Passed: Full-time job posted (ID: ${fullTimeOppId}, CTC: ${postRes.data.data.stipendOrSalary})`);
      passed++;
    } else {
      console.error('✖ Test 4 Failed: Job post failed', postRes.data);
    }
  } catch (err) {
    console.error('✖ Test 4 Error:', err.message);
  }

  // 5. Query Talent Pool Explorer
  total++;
  try {
    const talentRes = await makeRequest('/api/industry/talent-pool?degree=BAMS&minCgpa=7.0', 'GET', null, industryToken);
    if (talentRes.status === 200 && talentRes.data.success && Array.isArray(talentRes.data.data)) {
      console.log(`✔ Test 5 Passed: Talent pool explorer returned ${talentRes.data.data.length} pre-ranked candidates (Degree: BAMS, CGPA >= 7.0)`);
      passed++;
    } else {
      console.error('✖ Test 5 Failed: Talent pool query failed', talentRes.data);
    }
  } catch (err) {
    console.error('✖ Test 5 Error:', err.message);
  }

  // 6. Student Applies to Full-Time Placement Role
  total++;
  try {
    const applyRes = await makeRequest(`/api/students/apply/${fullTimeOppId}`, 'POST', {}, studentToken);
    if (applyRes.status === 201 && applyRes.data.success && applyRes.data.data?._id) {
      placementAppId = applyRes.data.data._id;
      console.log(`✔ Test 6 Passed: Student applied to full-time placement role (App ID: ${placementAppId})`);
      passed++;
    } else {
      console.error('✖ Test 6 Failed: Apply to placement failed', applyRes.data);
    }
  } catch (err) {
    console.error('✖ Test 6 Error:', err.message);
  }

  // 7. Recruiter Shortlists and Schedules Technical Placement Interview
  total++;
  try {
    // Step 1: Move to Shortlisted
    await makeRequest(`/api/industry/applications/${placementAppId}/status`, 'PUT', { status: 'Shortlisted' }, industryToken);

    // Step 2: Schedule Interview with meeting link and date
    const schedulePayload = {
      status: 'Interview_Scheduled',
      feedback: 'Selected for Panel Viva on Ayush GMP and Schedule T compliance',
      interviewSchedule: {
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        roundName: 'Round 1: Clinical & Analytical Panel Viva',
        meetingLink: 'https://meet.google.com/dabur-ayush-panel',
        locationDetails: 'Google Meet Virtual Boardroom',
        instructions: 'Please bring your research thesis and clinical case summaries.'
      }
    };

    const schedRes = await makeRequest(`/api/industry/applications/${placementAppId}/status`, 'PUT', schedulePayload, industryToken);
    if (schedRes.status === 200 && schedRes.data.data?.status === 'Interview_Scheduled' && schedRes.data.data?.interviewSchedule?.meetingLink) {
      console.log('✔ Test 7 Passed: Placement interview successfully scheduled with virtual link & instructions');
      passed++;
    } else {
      console.error('✖ Test 7 Failed: Interview scheduling failed', schedRes.data);
    }
  } catch (err) {
    console.error('✖ Test 7 Error:', err.message);
  }

  // 8. Student Verifies Interview Details in Applications Pipeline
  total++;
  try {
    const stuAppsRes = await makeRequest('/api/students/my-applications', 'GET', null, studentToken);
    if (stuAppsRes.status === 200 && stuAppsRes.data.success) {
      const scheduledApp = stuAppsRes.data.data.find(a => a._id === placementAppId);
      if (scheduledApp && scheduledApp.interviewSchedule?.roundName === 'Round 1: Clinical & Analytical Panel Viva') {
        console.log(`✔ Test 8 Passed: Student received verified interview invitation: "${scheduledApp.interviewSchedule.roundName}" at ${scheduledApp.interviewSchedule.meetingLink}`);
        passed++;
      } else {
        console.error('✖ Test 8 Failed: Interview schedule mismatch in student view', scheduledApp);
      }
    } else {
      console.error('✖ Test 8 Failed: Student applications fetch failed', stuAppsRes.data);
    }
  } catch (err) {
    console.error('✖ Test 8 Error:', err.message);
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

runPlacementTests();
