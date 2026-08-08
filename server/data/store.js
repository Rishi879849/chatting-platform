import bcrypt from 'bcryptjs';

// Pre-hashed passwords using bcrypt (12 rounds) for default test accounts:
// Password for 'admin_master': "AdminSecurePass!2026"
// Password for 'learner_user': "StudentPass!2026"
const ADMIN_HASH = bcrypt.hashSync("AdminSecurePass!2026", 12);
const STUDENT_HASH = bcrypt.hashSync("StudentPass!2026", 12);

export const db = {
  users: [
    {
      id: 'usr-admin-1',
      username: 'admin_dtv',
      email: 'security.lead@acadsphere.edu.in',
      passwordHash: ADMIN_HASH,
      role: 'ADMIN',
      publicHandle: '@DTV_Lead_Admin',
      pseudonym: 'anon_nexus_99',
      identityMode: 'PUBLIC',
      isVerified: true,
      college: 'IIT Madras',
      collegeEmail: 'lead@iitm.ac.in',
      badges: ['Staff Moderator', 'System Architect', 'Academic Honor'],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-student-1',
      username: 'student_alex',
      email: 'alex.learner@bits-pilani.ac.in',
      passwordHash: STUDENT_HASH,
      role: 'STUDENT',
      publicHandle: '@Alex_Algorithms',
      pseudonym: 'anon_quantum_42',
      identityMode: 'ANONYMOUS',
      isVerified: true,
      college: 'BITS Pilani',
      collegeEmail: 'alex@pilani.bits-pilani.ac.in',
      badges: ['Algorithm Specialist', 'Verified Student'],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      createdAt: '2026-02-01T00:00:00.000Z'
    }
  ],

  revokedTokens: new Set(),

  channels: [
    { id: 'dsa-live-help', name: 'dsa-live-help', category: 'SUBJECT', description: 'Real-time algorithms, dynamic programming, and complexity proofs.' },
    { id: 'maths-discrete', name: 'maths-discrete', category: 'SUBJECT', description: 'Combinatorics, graph theory, modular arithmetic, and proofs.' },
    { id: 'system-design', name: 'system-design', category: 'SUBJECT', description: 'Distributed consensus, CAP theorem, replication, and caching.' },
    { id: 'gate-cse-prep', name: 'gate-cse-prep', category: 'OFFICIAL', description: 'National GATE CSE exam curriculum and standard PYQs.' },
    { id: 'faang-interviews', name: 'faang-interviews', category: 'CAREER', description: 'Behavioral prep, mock coding rounds, and system design.' },
  ],

  messages: [
    {
      id: 'msg-sec-1',
      channelId: 'dsa-live-help',
      authorId: 'usr-admin-1',
      author: {
        handle: 'anon_nexus_99',
        isAnonymous: true,
        college: 'IIT Madras',
        isVerified: true,
        role: 'ADMIN',
        badges: ['Staff Moderator']
      },
      content: 'Welcome to the hardened AcadSphere channel. Zero contact sharing is strictly enforced by the server-side analysis pipeline.',
      upvotes: 8,
      upvotedBy: ['usr-student-1'],
      isSolution: false,
      isQuarantined: false,
      createdAt: '2026-08-08T10:00:00.000Z'
    },
    {
      id: 'msg-sec-2',
      channelId: 'dsa-live-help',
      authorId: 'usr-student-1',
      author: {
        handle: 'anon_quantum_42',
        isAnonymous: true,
        college: 'BITS Pilani',
        isVerified: true,
        role: 'STUDENT',
        badges: ['Algorithm Specialist']
      },
      content: 'Here is an immutable C++ recursion template for Tree Traversals:\n```cpp\n#include <iostream>\nstruct Node { int val; Node* left; Node* right; };\nvoid inorder(Node* root) {\n    if (!root) return;\n    inorder(root->left);\n    std::cout << root->val << " ";\n    inorder(root->right);\n}\n```\nMathematical recurrence is:\n$$\nT(n) = 2T(n/2) + O(1) \\implies O(n)\n$$',
      upvotes: 14,
      upvotedBy: ['usr-admin-1'],
      isSolution: true,
      isQuarantined: false,
      createdAt: '2026-08-08T10:15:00.000Z'
    }
  ],

  threads: [
    {
      id: 'th-sec-1',
      channelId: 'dsa-live-help',
      authorId: 'usr-student-1',
      author: {
        handle: 'anon_quantum_42',
        isAnonymous: true,
        college: 'BITS Pilani',
        isVerified: true,
        role: 'STUDENT',
        badges: ['Algorithm Specialist']
      },
      title: "Intuitive Proof: Why does 0/1 Knapsack 1D array optimization require iterating backwards?",
      content: "When compressing the 2D DP table `dp[i][w]` into `dp[w]`, we MUST iterate `w` from `Capacity` down to `weight[i]`. Why does forward iteration compute the Unbounded Knapsack instead?\n\nMathematical formulation:\n$$\ndp[w] = \\max(dp[w], dp[w - \\text{wt}[i]] + \\text{val}[i])\n$$",
      tags: ['DynamicProgramming', 'Knapsack', 'Proofs'],
      upvotes: 21,
      upvotedBy: ['usr-admin-1'],
      hasSolution: true,
      isQuarantined: false,
      createdAt: '2026-08-08T09:00:00.000Z',
      replies: [
        {
          id: 'rep-sec-1',
          threadId: 'th-sec-1',
          authorId: 'usr-admin-1',
          author: {
            handle: 'anon_nexus_99',
            isAnonymous: true,
            college: 'IIT Madras',
            isVerified: true,
            role: 'ADMIN',
            badges: ['Staff Moderator']
          },
          content: "Iterating forwards causes values from the *current* item state `i` to overwrite `dp[w - wt[i]]` before higher weights can read the *previous* state `i-1`. Backward iteration preserves the immutable invariant `dp[w - wt[i]] == dp[i-1][w - wt[i]]`.\n```cpp\nfor (int i = 0; i < n; ++i) {\n    for (int w = W; w >= wt[i]; --w) {\n        dp[w] = std::max(dp[w], dp[w - wt[i]] + val[i]);\n    }\n}\n```",
          isAcceptedSolution: true,
          upvotes: 18,
          upvotedBy: ['usr-student-1'],
          createdAt: '2026-08-08T09:30:00.000Z'
        }
      ]
    }
  ],

  reports: [
    {
      id: 'rep-mod-1',
      threadId: 'th-quarantine-1',
      title: 'Quarantined Contact Share Attempt',
      authorHandle: 'suspicious_actor_9',
      category: 'CONTACT_SHARING',
      reason: 'AI filter detected Indian 10-digit mobile number in body.',
      status: 'PENDING',
      createdAt: '2026-08-08T08:00:00.000Z'
    }
  ],

  auditLogs: [
    {
      id: 'log-sec-1',
      timestamp: '2026-08-08T08:00:00.000Z',
      eventType: 'CONTENT_QUARANTINE',
      actor: 'SERVER_AI_GUARD',
      target: 'suspicious_actor_9',
      action: 'AUTO_QUARANTINE_PHONE_LEAK',
      severity: 'HIGH'
    }
  ]
};
