/**
 * AcadSphere Initial Mock Dataset - Discord-Style Real-Time Chat Architecture
 * Servers, Live Chat Channels, Streaming Chat Messages, Badges, and Moderation Records.
 */

export const INITIAL_SERVERS = [
  {
    id: 'srv-dtv',
    name: 'Digital Twin Verse',
    shortName: 'DTV',
    icon: 'GraduationCap',
    color: 'emerald',
    unreadCount: 4,
    description: 'Official DTV live academic chat ecosystem for students across India.',
    channels: [
      { id: 'dsa-live-help', name: 'dsa-live-help', category: 'SUBJECT', icon: 'Code2', description: 'Live Q&A on Data Structures, Algorithms, DP & Complexity Proofs' },
      { id: 'dbms-optimization', name: 'dbms-optimization', category: 'SUBJECT', icon: 'Database', description: 'Real-time discussions on Normalization, B+ Trees & ACID Transactions' },
      { id: 'os-kernel-chat', name: 'os-kernel-chat', category: 'SUBJECT', icon: 'Cpu', description: 'Semaphores, Peterson Algorithm, Paging & Synchronization' },
      { id: 'sde-placement-chat', name: 'sde-placement-chat', category: 'CAREER', icon: 'Briefcase', description: 'Live discussions on SDE interviews, resumes & online assessments' }
    ]
  },
  {
    id: 'srv-cs-hub',
    name: 'Computer Science Hub',
    shortName: 'CS',
    icon: 'Code2',
    color: 'indigo',
    unreadCount: 2,
    description: 'Deep-dive real-time algorithms, machine learning math, and system design.',
    channels: [
      { id: 'dsa-dp-graphs', name: 'dsa-dp-and-graphs', category: 'SUBJECT', icon: 'Code2', description: 'Advanced Graph Algorithms & Dynamic Programming Recurrences' },
      { id: 'ml-math-lounge', name: 'ml-math-lounge', category: 'SUBJECT', icon: 'Sparkles', description: 'Loss Functions, Backpropagation Derivatives & PyTorch Tensors' },
      { id: 'networks-live', name: 'networks-tcp-ip-chat', category: 'SUBJECT', icon: 'Network', description: 'OSI 7 Layers, Socket Programming & Congestion Control' }
    ]
  },
  {
    id: 'srv-careers',
    name: 'Global Careers & Placement',
    shortName: 'GC',
    icon: 'Briefcase',
    color: 'amber',
    unreadCount: 1,
    description: 'Real-time peer guidance for placement rounds, GATE CS, M.Tech & MS research.',
    channels: [
      { id: 'placements-2027', name: 'placements-2027-lounge', category: 'CAREER', icon: 'Briefcase', description: 'Real-time OA discussions and technical interview rounds' },
      { id: 'gate-prep-lounge', name: 'gate-prep-lounge', category: 'CAREER', icon: 'GraduationCap', description: 'GATE CS weightage, PYQ solving & IISc/IIT admissions' }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-101',
    serverId: 'srv-dtv',
    channelId: 'dsa-live-help',
    content: `Does anyone have an intuitive way to decide between Top-Down (Memoization) vs Bottom-Up (Tabulation) in DP?

I wrote this C++ space-optimized knapsack solution:

\`\`\`cpp
int solveKnapsack(int W, const vector<int>& wt, const vector<int>& val, int n) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
}
\`\`\`

Why do we iterate backwards from $W$ down to $wt[i]$?`,
    author: {
      isAnonymous: true,
      handle: 'QuietCoder_4471',
      college: 'IIT Madras',
      isVerified: true,
      badges: ['DSA Specialist', 'Verified Student']
    },
    createdAt: '2026-08-03T20:10:00Z',
    upvotes: 14,
    hasSolution: true,
    isQuarantined: false
  },
  {
    id: 'msg-102',
    serverId: 'srv-dtv',
    channelId: 'dsa-live-help',
    content: `Iterating backwards in 0/1 Knapsack ensures each item is used at most **once**!

Transition formula:
$$ dp[w] = \\max(dp[w], val[i] + dp[w - wt[i]]) $$

If you iterate forwards, $dp[w - wt[i]]$ uses the *already updated* value from the current item $i$, turning it into Unbounded Knapsack!`,
    author: {
      isAnonymous: false,
      handle: '@aravind_v',
      name: 'Aravind V.',
      college: 'BITS Pilani',
      isVerified: true,
      badges: ['Top Academic Contributor', 'Verified Student']
    },
    createdAt: '2026-08-03T20:12:30Z',
    upvotes: 18,
    isAcceptedSolution: true,
    isQuarantined: false
  },
  {
    id: 'msg-103',
    serverId: 'srv-dtv',
    channelId: 'os-kernel-chat',
    content: `Quick Peterson's algorithm question for OS exam:
Mutual exclusion proof assumes $turn$ is a scalar memory variable.

Why does it fail on modern Intel/ARM CPUs without memory barriers?`,
    author: {
      isAnonymous: false,
      handle: '@riya_sharma',
      name: 'Riya Sharma',
      college: 'NIT Trichy',
      isVerified: true,
      badges: ['OS Core Reviewer', 'Verified Student']
    },
    createdAt: '2026-08-03T20:15:00Z',
    upvotes: 9,
    hasSolution: true,
    isQuarantined: false
  },
  {
    id: 'msg-104',
    serverId: 'srv-dtv',
    channelId: 'os-kernel-chat',
    content: `Modern out-of-order CPUs perform Store-Load memory reordering!

Compiler & CPU reorder:
\`\`\`c
flag[i] = true;
turn = j;
\`\`\`
Both CPU cores read \`flag[j] == false\` before committing stores to cache, breaking mutual exclusion unless an explicit atomic fence is injected.`,
    author: {
      isAnonymous: true,
      handle: 'NeuralScholar_8920',
      college: 'IIT Bombay',
      isVerified: true,
      badges: ['Systems Researcher', 'Verified Student']
    },
    createdAt: '2026-08-03T20:18:00Z',
    upvotes: 12,
    isAcceptedSolution: true,
    isQuarantined: false
  },
  {
    id: 'msg-105',
    serverId: 'srv-cs-hub',
    channelId: 'ml-math-lounge',
    content: `Backpropagation Through Time (BPTT) gradient calculation for RNN hidden state:

$$ \\frac{\\partial L}{\\partial h_0} = \\frac{\\partial L}{\\partial h_T} \\prod_{k=1}^T \\frac{\\partial h_k}{\\partial h_{k-1}} $$

If largest eigenvalue $\\lambda_{max}(W_{hh}) < 1$, gradient vanishes as $T \\to \\infty$.`,
    author: {
      isAnonymous: true,
      handle: 'MatrixMind_1042',
      college: 'IIIT Hyderabad',
      isVerified: true,
      badges: ['ML Math Specialist', 'Verified Student']
    },
    createdAt: '2026-08-03T20:22:00Z',
    upvotes: 21,
    hasSolution: false,
    isQuarantined: false
  }
];

export const INITIAL_THREADS = [
  {
    id: 'th-1',
    serverId: 'srv-dtv',
    channelId: 'dsa-live-help',
    title: "Intuitive Proof: Why does 0/1 Knapsack 1D array optimization require iterating backwards?",
    content: `When converting the 2D DP table $dp[i][w]$ to a 1D array $dp[w]$, we iterate the capacity $w$ from $W$ down to $wt[i]$:

\`\`\`cpp
for (int i = 0; i < n; i++) {
    for (int w = W; w >= wt[i]; w--) {
        dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
    }
}
\`\`\`

If we were to iterate forwards ($w = wt[i] \\dots W$), how does the recurrence inadvertently solve the Unbounded Knapsack problem instead?`,
    tags: ['Dynamic Programming', 'Knapsack', 'Space Optimization'],
    author: {
      isAnonymous: true,
      handle: 'QuietCoder_4471',
      college: 'IIT Madras',
      isVerified: true,
      badges: ['DSA Specialist', 'Verified Student']
    },
    createdAt: '2026-08-03T19:30:00Z',
    upvotes: 24,
    hasSolution: true,
    isQuarantined: false,
    replies: [
      {
        id: 'rep-101',
        author: {
          isAnonymous: false,
          handle: '@aravind_v',
          name: 'Aravind V.',
          college: 'IIT Madras',
          isVerified: true,
          badges: ['Top Academic Contributor', 'Verified Student']
        },
        content: `In 1D array optimization, $dp[w]$ represents values from the **previous** item step $i-1$.

When iterating backwards:
$$ dp[w] = \\max(dp[w], val[i] + dp[w - wt[i]]) $$

Because $w - wt[i] < w$, the cell $dp[w - wt[i]]$ has **not yet been updated** in the current outer loop pass $i$. Thus, it correctly holds the value from step $i-1$, guaranteeing each item $i$ is included at most once!

If you iterate forwards from $wt[i]$ to $W$, $dp[w - wt[i]]$ would already contain item $i$, allowing the item to be picked unlimited times (Unbounded Knapsack).`,
        createdAt: '2026-08-03T19:42:00Z',
        isAcceptedSolution: true
      }
    ]
  },
  {
    id: 'th-2',
    serverId: 'srv-dtv',
    channelId: 'os-kernel-chat',
    title: "Peterson's Algorithm Failure on Multi-Core CPUs with Store Buffers",
    content: `The classical proof of Peterson's algorithm guarantees mutual exclusion using two shared flags and a turn variable:

\`\`\`c
flag[i] = true;
turn = j;
while (flag[j] && turn == j); // Busy wait
\`\`\`

Why does this fail on modern x86/ARM hardware without explicit memory barriers (e.g. \`mfence\` or atomic sequentially consistent stores)?`,
    tags: ['Operating Systems', 'Memory Barriers', 'Concurrency'],
    author: {
      isAnonymous: false,
      handle: '@riya_sharma',
      name: 'Riya Sharma',
      college: 'NIT Trichy',
      isVerified: true,
      badges: ['OS Core Reviewer', 'Verified Student']
    },
    createdAt: '2026-08-03T20:00:00Z',
    upvotes: 18,
    hasSolution: true,
    isQuarantined: false,
    replies: [
      {
        id: 'rep-102',
        author: {
          isAnonymous: true,
          handle: 'SystemsResearcher_8920',
          college: 'IIT Bombay',
          isVerified: true,
          badges: ['Systems Researcher', 'Verified Student']
        },
        content: `Modern out-of-order processors employ **Store Buffers**. A store to memory (\`flag[i] = true\`) is buffered locally and not immediately visible to other cores.

Simultaneously, the load of \`flag[j]\` can be executed speculatively before the store is committed (Store-Load reordering). As a result, both cores can read \`flag[j] == false\` and simultaneously enter the Critical Section!

An explicit hardware fence instruction forces all buffered stores to commit before any subsequent loads execute.`,
        createdAt: '2026-08-03T20:15:00Z',
        isAcceptedSolution: true
      }
    ]
  },
  {
    id: 'th-3',
    serverId: 'srv-cs-hub',
    channelId: 'ml-math-lounge',
    title: "Analytical derivation of Backpropagation Through Time (BPTT) and Vanishing Gradients",
    content: `Consider an RNN with recurrent state equation:
$$ h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h) $$

When calculating $\\frac{\\partial L}{\\partial W_{hh}}$, the chain rule yields:
$$ \\frac{\\partial h_t}{\\partial h_k} = \\prod_{j=k+1}^t \\frac{\\partial h_j}{\\partial h_{j-1}} $$

Can someone formalize why the spectral radius of $W_{hh}$ governs exponential decay?`,
    tags: ['Machine Learning', 'Linear Algebra', 'Deep Learning'],
    author: {
      isAnonymous: true,
      handle: 'MatrixMind_1042',
      college: 'IIIT Hyderabad',
      isVerified: true,
      badges: ['ML Math Specialist', 'Verified Student']
    },
    createdAt: '2026-08-03T20:30:00Z',
    upvotes: 31,
    hasSolution: false,
    isQuarantined: false,
    replies: []
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'rep-901',
    messageId: 'msg-spam-1',
    targetContent: 'Join our WhatsApp group for paid project help: wa.me/919876543210',
    targetTitle: 'Join our WhatsApp group for paid project help',
    targetAuthor: 'SpamUser_99',
    reportedBy: 'Anonymous Student',
    category: 'CONTACT_SHARING',
    severity: 'HIGH',
    reason: 'Sharing WhatsApp invite link and asking for personal phone numbers.',
    timestamp: '2026-08-03T20:25:00Z',
    status: 'PENDING',
    autoQuarantined: true
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-08-03T20:25:01Z',
    moderator: 'System AI Engine',
    action: 'AUTO_QUARANTINE',
    target: 'Chat Message #msg-spam-1',
    reason: 'Detected WhatsApp URL pattern (wa.me/91...)',
    severity: 'HIGH'
  }
];
