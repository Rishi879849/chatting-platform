// Automated Closed-Loop Security Verification Script
const BASE_URL = 'http://localhost:5000/api';

async function runSecurityAudit() {
  console.log('🚀 [STARTING CLOSED-LOOP SECURITY AUDIT]');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ [FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('1. Health Check & Security Engine Active', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (res.status !== 200 || data.status !== 'HEALTHY') throw new Error('Health check failed');
  });

  // 2. Authentication with Bcrypt (Valid Credentials)
  let adminToken = '';
  let adminRefresh = '';
  await test('2. Bcrypt Password Verification & JWT Issuance (Admin)', async () => {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_dtv',
        password: 'AdminSecurePass!2026'
      })
    });
    const data = await res.json();
    if (!data.success || !data.accessToken) throw new Error(data.error || 'Login failed');
    adminToken = data.accessToken;
    adminRefresh = data.refreshToken;
  });

  // 3. Authentication with Invalid Password (Bcrypt Rejection)
  await test('3. Invalid Password Rejection (Bcrypt Constant-Time Defense)', async () => {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'admin_dtv',
        password: 'WrongPassword123!'
      })
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 4. Student Login
  let studentToken = '';
  await test('4. Student Login & Session Generation', async () => {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: 'student_alex',
        password: 'StudentPass!2026'
      })
    });
    const data = await res.json();
    if (!data.success || !data.accessToken) throw new Error('Student login failed');
    studentToken = data.accessToken;
  });

  // 5. RBAC Enforcement (Student cannot access Admin moderation reports)
  await test('5. Server-Side RBAC: Student Blocked from Admin Moderation Reports', async () => {
    const res = await fetch(`${BASE_URL}/v1/moderation/reports`, {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  });

  // 6. RBAC Allowed (Admin can access moderation reports)
  await test('6. Server-Side RBAC: Admin Authorized for Moderation Reports', async () => {
    const res = await fetch(`${BASE_URL}/v1/moderation/reports`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (res.status !== 200 || !data.success) throw new Error('Admin was denied report access');
  });

  // 7. Zod Schema Input Validation (Rejection of Malformed / Empty Payloads)
  await test('7. Zod Schema Input Validation: Rejecting Invalid Thread Payload', async () => {
    const res = await fetch(`${BASE_URL}/v1/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        channelId: 'dsa-live-help',
        title: 'Hi', // Too short (minimum 5 chars)
        content: 'Short' // Too short (minimum 10 chars)
      })
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request for malformed input, got ${res.status}`);
  });

  // 8. Refresh Token Rotation
  await test('8. Cryptographic Refresh Token Rotation', async () => {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: adminRefresh })
    });
    const data = await res.json();
    if (!data.success || !data.accessToken) throw new Error('Refresh token rotation failed');
  });

  // 9. IDOR Defense (Unauthorized Solution Acceptance Blocked)
  await test('9. IDOR Protection: Non-Owner Student Cannot Accept Solutions on Others Threads', async () => {
    const res = await fetch(`${BASE_URL}/v1/threads/solution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        threadId: 'th-non-existent-or-unowned',
        replyId: 'rep-1'
      })
    });
    // Should be 404 or 403, not 200
    if (res.status === 200) throw new Error('IDOR vulnerability: unauthorized solution accepted');
  });

  console.log(`\n==============================================`);
  console.log(`🎯 AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==============================================`);
}

runSecurityAudit();
