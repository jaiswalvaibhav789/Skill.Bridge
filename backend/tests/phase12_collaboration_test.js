/**
 * Phase 12: Academia–Industry Collaboration Subsystem Automated Test Suite
 * Tests Joint R&D Calls, Proposal Submissions, Industry Proposal Review, and Consulting Requests.
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

async function runCollaborationTests() {
  console.log('=== Phase 12: Academia–Industry Collaboration Subsystem Verification ===\n');
  let passed = 0;
  let total = 0;

  let facultyToken = null;
  let industryToken = null;
  let seededJointRdId = null;
  let seededConsultingId = null;
  let createdCallId = null;
  let submittedProposalId = null;

  // 1. Authenticate Faculty
  total++;
  try {
    const facLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'dr.sharma@aiia.ac.in',
      password: 'Password@123'
    });
    if (facLogin.status === 200 && facLogin.data.data?.token) {
      facultyToken = facLogin.data.data.token;
      console.log('✔ Test 1 Passed: Faculty authenticated successfully');
      passed++;
    } else {
      console.error('✖ Test 1 Failed: Faculty login failed', facLogin.data);
    }
  } catch (err) {
    console.error('✖ Test 1 Error:', err.message);
  }

  // 2. Authenticate Industry
  total++;
  try {
    const indLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'careers@dabur.com',
      password: 'Password@123'
    });
    if (indLogin.status === 200 && indLogin.data.data?.token) {
      industryToken = indLogin.data.data.token;
      console.log('✔ Test 2 Passed: Industry recruiter authenticated successfully');
      passed++;
    } else {
      console.error('✖ Test 2 Failed: Industry login failed', indLogin.data);
    }
  } catch (err) {
    console.error('✖ Test 2 Error:', err.message);
  }

  // 3. Fetch All Collaborations List
  total++;
  try {
    const collabsRes = await makeRequest('/api/collaborations');
    if (collabsRes.status === 200 && collabsRes.data.success && collabsRes.data.data?.length >= 4) {
      const jointRd = collabsRes.data.data.find(c => c.type === 'Joint_R&D');
      const consulting = collabsRes.data.data.find(c => c.type === 'Consulting_Request');
      if (jointRd) seededJointRdId = jointRd._id;
      if (consulting) seededConsultingId = consulting._id;

      console.log(`✔ Test 3 Passed: /api/collaborations returned ${collabsRes.data.data.length} active collaboration calls & R&D projects`);
      passed++;
    } else {
      console.error('✖ Test 3 Failed: Collaborations fetch failed', collabsRes.data);
    }
  } catch (err) {
    console.error('✖ Test 3 Error:', err.message);
  }

  // 4. Filter Collaborations by Type (?type=Joint_R&D)
  total++;
  try {
    const filterRes = await makeRequest('/api/collaborations?type=Joint_R&D');
    if (filterRes.status === 200 && filterRes.data.success && filterRes.data.data.every(c => c.type === 'Joint_R&D')) {
      console.log('✔ Test 4 Passed: Type filtering (?type=Joint_R&D) properly isolated research calls');
      passed++;
    } else {
      console.error('✖ Test 4 Failed: Type filter failed', filterRes.data);
    }
  } catch (err) {
    console.error('✖ Test 4 Error:', err.message);
  }

  // 5. Industry Publishes a New Joint R&D Project Call
  total++;
  try {
    const newCallPayload = {
      title: 'HPTLC Method Development for Guggulsterone E & Z Isomers in Commiphora mukul',
      type: 'Joint_R&D',
      description: 'Industry-sponsored analytical project to optimize baseline separation of isomeric sterones in anti-hyperlipidemic herbal extracts.',
      budget: '₹18,50,000 (Industry Sponsored)',
      durationMonths: 12,
      deliverables: [
        'Validated HPTLC Chromatographic Fingerprint Protocol',
        'ICH Q2(R1) Analytical Method Validation Dossier',
        'Joint Peer-Reviewed Publication'
      ]
    };

    const createRes = await makeRequest('/api/collaborations', 'POST', newCallPayload, industryToken);
    if (createRes.status === 201 && createRes.data.success && createRes.data.data?._id) {
      createdCallId = createRes.data.data._id;
      console.log(`✔ Test 5 Passed: Industry published new R&D Call (ID: ${createdCallId})`);
      passed++;
    } else {
      console.error('✖ Test 5 Failed: R&D Call creation failed', createRes.data);
    }
  } catch (err) {
    console.error('✖ Test 5 Error:', err.message);
  }

  // 6. Faculty Submits Research Proposal
  total++;
  try {
    const proposalPayload = {
      proposalAbstract: 'The Department of Dravyaguna (AIIA) proposes a validated normal-phase silica gel 60 F254 chromatographic assay utilizing toluene:acetone (9:1) mobile phase with densitometric scanning at 254 nm.',
      proposedBudget: '₹17,80,000',
      estimatedMonths: 10
    };

    const applyRes = await makeRequest(`/api/collaborations/${createdCallId}/apply`, 'POST', proposalPayload, facultyToken);
    if (applyRes.status === 201 && applyRes.data.success && applyRes.data.data.applications?.length > 0) {
      submittedProposalId = applyRes.data.data.applications[0]._id;
      console.log(`✔ Test 6 Passed: Faculty submitted research proposal (Application ID: ${submittedProposalId})`);
      passed++;
    } else {
      console.error('✖ Test 6 Failed: Proposal submission failed', applyRes.data);
    }
  } catch (err) {
    console.error('✖ Test 6 Error:', err.message);
  }

  // 7. Duplicate Proposal Prevention
  total++;
  try {
    const dupRes = await makeRequest(`/api/collaborations/${createdCallId}/apply`, 'POST', {
      proposalAbstract: 'Duplicate proposal attempt'
    }, facultyToken);
    if (dupRes.status === 400 && dupRes.data.error === 'ALREADY_SUBMITTED') {
      console.log('✔ Test 7 Passed: Duplicate proposal prevented with 400 ALREADY_SUBMITTED');
      passed++;
    } else {
      console.error('✖ Test 7 Failed: Duplicate check failed', dupRes.data);
    }
  } catch (err) {
    console.error('✖ Test 7 Error:', err.message);
  }

  // 8. Industry Reviews and Approves Faculty Proposal
  total++;
  try {
    const reviewRes = await makeRequest(`/api/collaborations/${createdCallId}/review-proposal`, 'PUT', {
      applicationId: submittedProposalId,
      decision: 'Accepted'
    }, industryToken);

    if (reviewRes.status === 200 && reviewRes.data.success && reviewRes.data.data.status === 'Approved') {
      console.log('✔ Test 8 Passed: Industry approved faculty proposal (Collaboration status transitioned to "Approved")');
      passed++;
    } else {
      console.error('✖ Test 8 Failed: Proposal review failed', reviewRes.data);
    }
  } catch (err) {
    console.error('✖ Test 8 Error:', err.message);
  }

  // 9. Faculty Responds to Direct Consulting Request
  total++;
  if (seededConsultingId) {
    try {
      const consultRes = await makeRequest(`/api/collaborations/${seededConsultingId}/consulting-response`, 'PUT', {
        decision: 'Approved'
      }, facultyToken);

      if (consultRes.status === 200 && consultRes.data.success && consultRes.data.data.status === 'Approved') {
        console.log('✔ Test 9 Passed: Faculty accepted direct industrial consulting request (Status: Approved)');
        passed++;
      } else {
        console.error('✖ Test 9 Failed: Consulting response failed', consultRes.data);
      }
    } catch (err) {
      console.error('✖ Test 9 Error:', err.message);
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

runCollaborationTests();
