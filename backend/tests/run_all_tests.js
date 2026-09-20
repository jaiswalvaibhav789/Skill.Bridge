/**
 * SkillBridge Enterprise - Master Test Suite Runner
 * Executes all phase test suites sequentially, records execution durations,
 * and compiles an overarching QA and verification report for SIH Statement ID: SIH26044.
 */
const { execSync } = require('child_process');
const path = require('path');

const TEST_SUITES = [
  { id: 'Phase 01', file: 'phase1_smoke_test.js', name: 'Architecture & Foundation Hardening' },
  { id: 'Phase 02', file: 'phase2_database_test.js', name: 'Database Architecture & ER Schema Model' },
  { id: 'Phase 03', file: 'phase3_api_contracts_test.js', name: 'RESTful Contracts & Auth Middleware' },
  { id: 'Phase 10', file: 'phase10_internship_test.js', name: 'Internship Portal & State Machine Pipeline' },
  { id: 'Phase 12', file: 'phase12_collaboration_test.js', name: 'Academia–Industry Collaboration & R&D' },
  { id: 'Phase 13', file: 'phase13_portfolio_test.js', name: 'Verifiable Digital Portfolio & SHA-256 Ledger' },
  { id: 'Phase 14', file: 'phase14_recommendation_test.js', name: 'Multi-Factor Compatibility & Recommendation Engine' },
  { id: 'Phase 15', file: 'phase15_analytics_test.js', name: 'Role Dashboards & 6-Stage Placement Funnel' },
  { id: 'Phase 16', file: 'phase16_notification_audit_test.js', name: 'Real-Time Notifications & System Audit Logging' },
  { id: 'Phase 17', file: 'phase17_security_qa_test.js', name: 'End-to-End Security Hardening & QA Verifications' }
];

async function runMasterSuite() {
  console.log('\n=============================================================================');
  console.log('       SKILLBRIDGE ENTERPRISE — MASTER AUTOMATED TEST SUITE RUNNER           ');
  console.log('                   SIH Problem Statement: SIH26044                           ');
  console.log('=============================================================================\n');

  const startTime = Date.now();
  const results = [];
  let totalTestsPassed = 0;
  let totalTestsFailed = 0;

  for (const suite of TEST_SUITES) {
    const suiteFilePath = path.join(__dirname, suite.file);
    const suiteStart = Date.now();
    process.stdout.write(`⏳ Running [${suite.id}] ${suite.name}... `);

    try {
      const output = execSync(`node "${suiteFilePath}"`, {
        cwd: __dirname,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });

      const suiteDuration = ((Date.now() - suiteStart) / 1000).toFixed(2);
      
      // Parse passed count from output if present
      const passMatches = (output.match(/✔ Test \d+ Passed/g) || []).length;
      totalTestsPassed += passMatches;

      results.push({
        ...suite,
        status: 'PASSED',
        tests: passMatches || 'OK',
        duration: `${suiteDuration}s`
      });

      console.log(`✔ PASSED (${passMatches} tests, ${suiteDuration}s)`);
    } catch (err) {
      const suiteDuration = ((Date.now() - suiteStart) / 1000).toFixed(2);
      totalTestsFailed += 1;

      results.push({
        ...suite,
        status: 'FAILED',
        tests: 'ERR',
        duration: `${suiteDuration}s`,
        error: err.stderr || err.stdout || err.message
      });

      console.log(`❌ FAILED (${suiteDuration}s)`);
    }
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n=============================================================================');
  console.log('                          TEST EXECUTION MATRIX                              ');
  console.log('=============================================================================');
  console.log(
    'Phase'.padEnd(10) +
    'Test Suite Name'.padEnd(52) +
    'Tests'.padEnd(10) +
    'Duration'.padEnd(10) +
    'Status'
  );
  console.log('-'.repeat(87));

  results.forEach(r => {
    const statusFormatted = r.status === 'PASSED' ? '✔ PASS' : '❌ FAIL';
    console.log(
      r.id.padEnd(10) +
      r.name.padEnd(52) +
      String(r.tests).padEnd(10) +
      r.duration.padEnd(10) +
      statusFormatted
    );
  });

  console.log('='.repeat(87));
  console.log(`Total Suites Executed: ${results.length}`);
  console.log(`Total Tests Passed:    ${totalTestsPassed}`);
  console.log(`Total Failures:        ${totalTestsFailed}`);
  console.log(`Total Execution Time:  ${totalDuration}s`);
  console.log('='.repeat(87) + '\n');

  if (totalTestsFailed === 0) {
    console.log('🎉 ALL TEST SUITES PASSED! System verified production-ready.\n');
    process.exit(0);
  } else {
    console.error(`💥 ${totalTestsFailed} test suite(s) failed. Check details above.\n`);
    process.exit(1);
  }
}

runMasterSuite();
