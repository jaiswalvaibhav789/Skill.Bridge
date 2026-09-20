/**
 * Phase 13: Verifiable Digital Portfolio & Cryptographic Credentialing Automated Test Suite
 * Tests Cryptographic Credential Generation, Verification Endpoint, URL Slug Management, and Registry Integrity.
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

async function runPhase13Tests() {
  console.log('=== Phase 13: Verifiable Digital Portfolio & Cryptographic Credentialing Verification ===\n');
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
    // 1. Authenticate Student
    const studentLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'student.ayush@gmail.com',
      password: 'Password@123'
    });
    const studentToken = studentLogin.data?.data?.token;
    assert(studentLogin.status === 200 && !!studentToken, 'Student authenticated successfully');

    // 2. Fetch Public Portfolio without Auth
    const publicRes = await makeRequest('/api/students/portfolio/ayush-sharma-aiia');
    const portfolio = publicRes.data?.data;
    assert(
      publicRes.status === 200 && portfolio && portfolio.fullName === 'Ayush Sharma',
      'Public portfolio resolved without authentication token via slug (/portfolio/ayush-sharma-aiia)'
    );

    // 3. Verify Cryptographic Credential Ledger in Public Portfolio
    const ledger = portfolio?.credentialsLedger || [];
    assert(
      ledger.length >= 2,
      `Portfolio includes Verifiable Cryptographic Ledger with ${ledger.length} credentials`
    );

    const firstCred = ledger[0] || {};
    const isSha256 = typeof firstCred.hash === 'string' && firstCred.hash.length === 64 && /^[0-9a-f]{64}$/i.test(firstCred.hash);
    assert(
      isSha256 && firstCred.skillName && firstCred.proficiencyScore > 0,
      `Credential contains valid 64-char SHA-256 signature (${firstCred.hash?.substring(0, 16)}...) for "${firstCred.skillName}"`
    );

    // 4. Verify Credential via Public Registry Endpoint
    const verifyRes = await makeRequest(`/api/students/verify-credential/${firstCred.hash}`);
    const verifiedData = verifyRes.data?.data;
    assert(
      verifyRes.status === 200 &&
      verifiedData?.valid === true &&
      verifiedData?.verificationStatus === 'AUTHENTIC_AND_VERIFIED' &&
      verifiedData?.student?.fullName === 'Ayush Sharma' &&
      verifiedData?.issuer?.instituteName?.includes('All India Institute of Ayurveda'),
      `Public credential verification confirmed authentic & tamper-evident for candidate ${verifiedData?.student?.fullName}`
    );

    // 5. Verify Tampered / Non-Existent Hash is Rejected
    const fakeHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const fakeRes = await makeRequest(`/api/students/verify-credential/${fakeHash}`);
    assert(
      fakeRes.status === 404,
      'Tampered / unregistered SHA-256 hash properly rejected with 404 NOT_FOUND'
    );

    // 6. Update Custom Portfolio URL Slug (Student Protected)
    const updateSlugRes = await makeRequest(
      '/api/students/portfolio-slug',
      'PUT',
      { slug: 'ayush-sharma-bams' },
      studentToken
    );
    assert(
      updateSlugRes.status === 200 && updateSlugRes.data?.data?.portfolioSlug === 'ayush-sharma-bams',
      'Student successfully claimed new custom portfolio slug (/portfolio/ayush-sharma-bams)'
    );

    // 7. Verify Public Portfolio is Accessible Under New Slug
    const newSlugRes = await makeRequest('/api/students/portfolio/ayush-sharma-bams');
    assert(
      newSlugRes.status === 200 && newSlugRes.data?.data?.portfolioSlug === 'ayush-sharma-bams',
      'Public portfolio immediately resolved at newly configured custom address'
    );

    // 8. Re-sync / Generate Cryptographic Credentials
    const syncRes = await makeRequest(
      '/api/students/generate-credentials',
      'POST',
      {},
      studentToken
    );
    assert(
      syncRes.status === 200 && syncRes.data?.data?.verifiedSkillsCount >= 2,
      `Student synchronized micro-credentials ledger (${syncRes.data?.data?.verifiedSkillsCount} verified credentials sealed)`
    );

    // 9. Revert Slug Back for Continuous Integration Consistency
    await makeRequest(
      '/api/students/portfolio-slug',
      'PUT',
      { slug: 'ayush-sharma-aiia' },
      studentToken
    );
    const finalCheck = await makeRequest('/api/students/portfolio/ayush-sharma-aiia');
    assert(
      finalCheck.status === 200 && finalCheck.data?.data?.portfolioSlug === 'ayush-sharma-aiia',
      'Portfolio slug reverted to baseline standard (ayush-sharma-aiia) for test repeatability'
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

runPhase13Tests();
