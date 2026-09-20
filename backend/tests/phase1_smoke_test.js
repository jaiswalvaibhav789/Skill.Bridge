/**
 * Phase 1 Smoke Test & Architecture Verification Script
 */
const http = require('http');

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Accept': 'application/json'
      }
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
    req.end();
  });
}

async function runSmokeTests() {
  console.log('=== Phase 1: Architecture Smoke Tests ===\n');

  let passed = 0;
  let total = 0;

  // Test 1: Health Diagnostics
  total++;
  try {
    const res = await makeRequest('/api/health');
    if (res.status === 200 && res.data.success === true && res.data.data.database.connected === true) {
      console.log('✔ Test 1 Passed: /api/health returned 200 with active database status & metrics');
      passed++;
    } else {
      console.error('✖ Test 1 Failed: /api/health response unexpected', res);
    }
  } catch (err) {
    console.error('✖ Test 1 Error:', err.message);
  }

  // Test 2: System Version Metadata
  total++;
  try {
    const res = await makeRequest('/api/version');
    if (res.status === 200 && res.data.success === true && res.data.data.version === '1.0.0-PROD') {
      console.log('✔ Test 2 Passed: /api/version returned 200 with blueprint specification metadata');
      passed++;
    } else {
      console.error('✖ Test 2 Failed: /api/version unexpected', res);
    }
  } catch (err) {
    console.error('✖ Test 2 Error:', err.message);
  }

  // Test 3: Standard Request ID Tracing Header
  total++;
  try {
    const res = await makeRequest('/api/health');
    if (res.headers['x-request-id']) {
      console.log(`✔ Test 3 Passed: X-Request-ID present in headers (${res.headers['x-request-id']})`);
      passed++;
    } else {
      console.error('✖ Test 3 Failed: X-Request-ID missing in response headers');
    }
  } catch (err) {
    console.error('✖ Test 3 Error:', err.message);
  }

  // Test 4: Standard 404 Error Envelope
  total++;
  try {
    const res = await makeRequest('/api/undefined-endpoint-check');
    if (res.status === 404 && res.data.success === false && res.data.error === 'ROUTE_NOT_FOUND') {
      console.log('✔ Test 4 Passed: 404 handler returns standardized error contract');
      passed++;
    } else {
      console.error('✖ Test 4 Failed: 404 response unexpected', res);
    }
  } catch (err) {
    console.error('✖ Test 4 Error:', err.message);
  }

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed === total) {
    console.log('🎉 Phase 1 Architecture & Foundation Hardening VERIFIED successfully!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runSmokeTests();
