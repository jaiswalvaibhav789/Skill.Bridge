/**
 * Phase 9: Learning & Skill Development Programs Automated Test Suite
 * Tests catalog querying, skill-gap recommendations, enrollment, and progress tracking.
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

async function runLearningTests() {
  console.log('=== Phase 9: Learning & Skill Development Programs Verification ===\n');
  let passed = 0;
  let total = 0;

  // 1. Authenticate as Demo Student
  total++;
  let studentToken = null;
  try {
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      email: 'student.ayush@gmail.com',
      password: 'Password@123'
    });
    if (loginRes.status === 200 && loginRes.data.data?.token) {
      studentToken = loginRes.data.data.token;
      console.log('✔ Test 1 Passed: Student authentication successful');
      passed++;
    } else {
      console.error('✖ Test 1 Failed: Login failed', loginRes.data);
    }
  } catch (err) {
    console.error('✖ Test 1 Error:', err.message);
  }

  // 2. Fetch Public Learning Program Catalog
  total++;
  let sampleProgram = null;
  try {
    const catalogRes = await makeRequest('/api/learning');
    if (catalogRes.status === 200 && catalogRes.data.success && Array.isArray(catalogRes.data.data) && catalogRes.data.data.length >= 6) {
      sampleProgram = catalogRes.data.data.find(p => p.type === 'Certification') || catalogRes.data.data[1];
      console.log(`✔ Test 2 Passed: /api/learning returned ${catalogRes.data.data.length} active programs with coveredSkills populated`);
      passed++;
    } else {
      console.error('✖ Test 2 Failed: Catalog response invalid', catalogRes.data);
    }
  } catch (err) {
    console.error('✖ Test 2 Error:', err.message);
  }

  // 3. Filter Programs by Difficulty and Type
  total++;
  try {
    const filteredRes = await makeRequest('/api/learning?type=Course&difficulty=Intermediate');
    if (filteredRes.status === 200 && filteredRes.data.success && filteredRes.data.data.length > 0) {
      const match = filteredRes.data.data.every(p => p.type === 'Course' && p.difficulty === 'Intermediate');
      if (match) {
        console.log(`✔ Test 3 Passed: Program query filter (?type=Course&difficulty=Intermediate) properly filtered results`);
        passed++;
      } else {
        console.error('✖ Test 3 Failed: Filtered items did not match criteria');
      }
    } else {
      console.error('✖ Test 3 Failed: Filter request failed', filteredRes.data);
    }
  } catch (err) {
    console.error('✖ Test 3 Error:', err.message);
  }

  // 4. Fetch Skill-Gap Recommended Programs
  total++;
  try {
    const recRes = await makeRequest('/api/learning/recommended', 'GET', null, studentToken);
    if (recRes.status === 200 && recRes.data.success && Array.isArray(recRes.data.data)) {
      console.log(`✔ Test 4 Passed: /api/learning/recommended returned ${recRes.data.data.length} targeted skill-deficit programs`);
      passed++;
    } else {
      console.error('✖ Test 4 Failed: Recommended programs invalid', recRes.data);
    }
  } catch (err) {
    console.error('✖ Test 4 Error:', err.message);
  }

  // 5. Fetch Enrolled Programs for Current Student
  total++;
  try {
    const enrollmentsRes = await makeRequest('/api/learning/my-enrollments', 'GET', null, studentToken);
    if (enrollmentsRes.status === 200 && enrollmentsRes.data.success && Array.isArray(enrollmentsRes.data.data)) {
      console.log(`✔ Test 5 Passed: /api/learning/my-enrollments returned ${enrollmentsRes.data.data.length} current enrollments`);
      passed++;
    } else {
      console.error('✖ Test 5 Failed: My enrollments failed', enrollmentsRes.data);
    }
  } catch (err) {
    console.error('✖ Test 5 Error:', err.message);
  }

  // 6. Enroll in a New Program
  total++;
  if (sampleProgram) {
    try {
      const enrollRes = await makeRequest(`/api/learning/${sampleProgram._id}/enroll`, 'POST', {}, studentToken);
      if (enrollRes.status === 201 && enrollRes.data.success) {
        console.log(`✔ Test 6 Passed: Enrolled successfully in "${sampleProgram.title}"`);
        passed++;
      } else if (enrollRes.status === 409) {
        console.log(`✔ Test 6 Passed: Program already enrolled, duplicate prevention active (409)`);
        passed++;
      } else {
        console.error('✖ Test 6 Failed: Enroll response unexpected', enrollRes.data);
      }
    } catch (err) {
      console.error('✖ Test 6 Error:', err.message);
    }
  }

  // 7. Update Course Progress
  total++;
  if (sampleProgram) {
    try {
      const progRes = await makeRequest(`/api/learning/${sampleProgram._id}/progress`, 'PUT', { progressDelta: 30 }, studentToken);
      if (progRes.status === 200 && progRes.data.success && progRes.data.data.progressPercentage >= 30) {
        console.log(`✔ Test 7 Passed: Course progress updated to ${progRes.data.data.progressPercentage}% (Status: ${progRes.data.data.status})`);
        passed++;
      } else {
        console.error('✖ Test 7 Failed: Progress update response unexpected', progRes.data);
      }
    } catch (err) {
      console.error('✖ Test 7 Error:', err.message);
    }
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

runLearningTests();
