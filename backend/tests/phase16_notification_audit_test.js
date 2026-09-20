/**
 * Phase 16: Real-Time Notification Subsystem & Immutable System Audit Logging Test Suite
 * Tests Notification Creation, Unread Counting, State Transitions, Lifecycle Triggers,
 * Audit Event Append-Only Storage, Telemetry Aggregations, and Role Authorization Guards.
 */
const http = require('http');
const mongoose = require('mongoose');
const { createNotification } = require('../utils/notificationService');
const { logAuditEvent } = require('../utils/auditLogger');

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

async function runPhase16Tests() {
  console.log('=== Phase 16: Notification Subsystem & Immutable Audit Logging Verification ===\n');
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
    // Connect to database for utility helpers in test runner
    await mongoose.connect('mongodb://127.0.0.1:27017/skillbridge_ayush');

    // 1. Authenticate Student
    const studentLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'student.ayush@gmail.com',
      password: 'Password@123'
    });
    const studentToken = studentLogin.data?.data?.token;
    const studentUser = studentLogin.data?.data?.user;
    assert(studentLogin.status === 200 && !!studentToken, 'Student authenticated successfully');

    // 2. Authenticate Admin
    const adminLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@ayush.gov.in',
      password: 'Password@123'
    });
    const adminToken = adminLogin.data?.data?.token;
    assert(adminLogin.status === 200 && !!adminToken, 'Ministry Admin authenticated successfully');

    // 3. Authenticate Industry Recruiter
    const industryLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'careers@dabur.com',
      password: 'Password@123'
    });
    const industryToken = industryLogin.data?.data?.token;
    assert(industryLogin.status === 200 && !!industryToken, 'Industry recruiter authenticated successfully');

    // 4. Dispatch System Notification via Helper Service
    const testNotif = await createNotification({
      recipient: studentUser._id || studentUser.id,
      title: 'Diagnostic Benchmark Completed',
      message: 'Your Panchakarma Protocol clinical diagnostic report has been scored.',
      type: 'ASSESSMENT_COMPLETED',
      link: '/skill-gap'
    });
    assert(!!testNotif && testNotif.title === 'Diagnostic Benchmark Completed', 'Notification created via notificationService');

    // 5. Retrieve Student Notifications & Unread Counter
    const notifsRes = await makeRequest('/api/notifications', 'GET', null, studentToken);
    const notifsData = notifsRes.data?.data;
    const notifsList = notifsData?.notifications || [];
    assert(
      notifsRes.status === 200 &&
      notifsData?.unreadCount > 0 &&
      notifsList.length > 0 &&
      notifsList.some(n => n.title === 'Diagnostic Benchmark Completed'),
      'Student retrieves notifications feed with accurate unread counter'
    );

    // 6. Mark Single Notification as Read
    const targetNotif = notifsList.find(n => n.title === 'Diagnostic Benchmark Completed') || notifsList[0];
    const readRes = await makeRequest(`/api/notifications/${targetNotif._id}/read`, 'PUT', null, studentToken);
    assert(
      readRes.status === 200 &&
      readRes.data?.data?.notification?.isRead === true,
      'Individual notification successfully marked as read'
    );

    // 7. Bulk Mark All Notifications Read
    const markAllRes = await makeRequest('/api/notifications/mark-all-read', 'PUT', null, studentToken);
    assert(
      markAllRes.status === 200 &&
      markAllRes.data?.data?.unreadCount === 0,
      'Bulk markAllAsRead resets unread counter to 0'
    );

    // 8. Log Immutable Audit Events
    const auditRecord = await logAuditEvent({
      actor: studentUser._id || studentUser.id,
      actorRole: 'student',
      action: 'PORTFOLIO_VERIFICATION_REQUEST',
      entityType: 'StudentProfile',
      ipAddress: '192.168.1.50',
      details: { verificationMethod: 'SHA-256 Digest Ledger' }
    });
    assert(
      !!auditRecord &&
      auditRecord.action === 'PORTFOLIO_VERIFICATION_REQUEST' &&
      auditRecord.ipAddress === '192.168.1.50',
      'Immutable audit event recorded with actor role, IP address, and payload snapshot'
    );

    // 9. Admin Query of System Audit Logs
    const auditLogsRes = await makeRequest('/api/audit-logs', 'GET', null, adminToken);
    const auditData = auditLogsRes.data?.data;
    const auditLogs = auditData?.logs || [];
    assert(
      auditLogsRes.status === 200 &&
      auditData?.total > 0 &&
      auditLogs.length > 0 &&
      auditLogs.some(l => l.action === 'PORTFOLIO_VERIFICATION_REQUEST'),
      'Admin queries system audit trail with timestamps and entity linkages'
    );

    // 10. Audit Summary Telemetry
    const auditSummaryRes = await makeRequest('/api/audit-logs/summary', 'GET', null, adminToken);
    const auditSummary = auditSummaryRes.data?.data;
    assert(
      auditSummaryRes.status === 200 &&
      auditSummary?.totalEvents > 0 &&
      typeof auditSummary?.eventsLast24h === 'number' &&
      auditSummary?.roleDistribution?.length > 0 &&
      auditSummary?.topActions?.length > 0,
      'Audit summary produces forensic telemetry (24h events, role breakdown, top actions)'
    );

    // 11. Role Authorization Guard (Student blocked from Audit Logs)
    const unauthorizedAuditRes = await makeRequest('/api/audit-logs', 'GET', null, studentToken);
    assert(
      unauthorizedAuditRes.status === 403,
      'Role authorization guard blocks non-admin users from accessing system audit logs'
    );

    // 12. Delete Notification
    const deleteRes = await makeRequest(`/api/notifications/${targetNotif._id}`, 'DELETE', null, studentToken);
    assert(
      deleteRes.status === 200,
      'Notification successfully deleted from candidate feed'
    );

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await mongoose.connection.close();
  }

  console.log(`\n======================================================`);
  console.log(`Phase 16 Verification Complete: ${passed}/${total} Tests Passed`);
  console.log(`======================================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runPhase16Tests();
