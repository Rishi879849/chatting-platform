import { db } from '../data/store.js';
import { logAuditEvent, AuditEventType } from '../services/auditLogger.js';
import { verifyOwnershipOrAdmin } from '../middleware/auth.js';

/**
 * Basic server-side regex safety scanner for contact sharing / off-topic content.
 */
function analyzeContentSafety(text = '', title = '') {
  const combined = `${title} ${text}`.toLowerCase();
  const warnings = [];
  let isQuarantined = false;

  // 10-digit phone number detection
  const phonePattern = /(?:\+91[\-\s]?)?[6-9]\d{9}|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/;
  if (phonePattern.test(combined)) {
    warnings.push('Contact sharing attempt detected: phone numbers are prohibited.');
    isQuarantined = true;
  }

  // Personal email detection
  const emailPattern = /\b[A-Za-z0-9._%+-]+@(?!iitm\.ac\.in|bits-pilani\.ac\.in|ac\.in|edu\.in)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i;
  if (emailPattern.test(combined)) {
    warnings.push('Personal email exchange detected. Please maintain privacy.');
    isQuarantined = true;
  }

  return { warnings, isQuarantined };
}

/**
 * Get all active study threads (quarantined threads visible only to ADMINs)
 */
export function getThreads(req, res) {
  const { channelId, query, unanswered, hasSolution } = req.query;

  let results = db.threads;

  // Non-admins cannot view quarantined content
  if (!req.user || req.user.role !== 'ADMIN') {
    results = results.filter(t => !t.isQuarantined);
  }

  if (channelId) {
    results = results.filter(t => t.channelId === channelId);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  if (unanswered === 'true') {
    results = results.filter(t => t.replies.length === 0);
  }

  if (hasSolution === 'true') {
    results = results.filter(t => t.hasSolution);
  }

  res.json({
    success: true,
    count: results.length,
    threads: results,
  });
}

/**
 * Get single thread detail with replies
 */
export function getThreadById(req, res) {
  const { id } = req.params;
  const thread = db.threads.find(t => t.id === id);

  if (!thread) {
    return res.status(404).json({
      success: false,
      error: 'Discussion thread not found.',
      code: 'THREAD_NOT_FOUND',
    });
  }

  if (thread.isQuarantined && (!req.user || req.user.role !== 'ADMIN')) {
    return res.status(403).json({
      success: false,
      error: 'This thread has been quarantined by automated moderation.',
      code: 'THREAD_QUARANTINED',
    });
  }

  res.json({
    success: true,
    thread,
  });
}

/**
 * Create new academic discussion thread
 */
export function createThread(req, res) {
  const { channelId, title, content, tags } = req.body;
  const user = req.user;

  const safety = analyzeContentSafety(content, title);

  const newThread = {
    id: `th-${Date.now()}`,
    channelId,
    authorId: user.id,
    author: {
      handle: user.identityMode === 'ANONYMOUS' ? user.pseudonym : user.publicHandle,
      isAnonymous: user.identityMode === 'ANONYMOUS',
      college: user.college,
      isVerified: user.isVerified,
      role: user.role,
      badges: user.badges || [],
    },
    title,
    content,
    tags: tags || ['Academic Discussion'],
    upvotes: 0,
    upvotedBy: [],
    hasSolution: false,
    isQuarantined: safety.isQuarantined,
    createdAt: new Date().toISOString(),
    replies: [],
  };

  db.threads.unshift(newThread);

  if (safety.isQuarantined) {
    db.reports.push({
      id: `rep-auto-${Date.now()}`,
      threadId: newThread.id,
      title: newThread.title,
      authorHandle: newThread.author.handle,
      category: 'CONTACT_SHARING',
      reason: safety.warnings.join('; '),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    logAuditEvent(AuditEventType.CONTENT_QUARANTINE, user, {
      threadId: newThread.id,
      title: newThread.title,
      reasons: safety.warnings,
    });
  }

  res.status(201).json({
    success: true,
    message: safety.isQuarantined
      ? 'Thread created but automatically quarantined pending moderator verification.'
      : 'Thread published successfully.',
    thread: newThread,
    isQuarantined: safety.isQuarantined,
  });
}

/**
 * Add structured reply to a thread
 */
export function addReply(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  const thread = db.threads.find(t => t.id === id);
  if (!thread) {
    return res.status(404).json({
      success: false,
      error: 'Discussion thread not found.',
      code: 'THREAD_NOT_FOUND',
    });
  }

  const safety = analyzeContentSafety(content, '');

  const newReply = {
    id: `rep-${Date.now()}`,
    threadId: thread.id,
    authorId: user.id,
    author: {
      handle: user.identityMode === 'ANONYMOUS' ? user.pseudonym : user.publicHandle,
      isAnonymous: user.identityMode === 'ANONYMOUS',
      college: user.college,
      isVerified: user.isVerified,
      role: user.role,
      badges: user.badges || [],
    },
    content,
    isAcceptedSolution: false,
    upvotes: 0,
    upvotedBy: [],
    isQuarantined: safety.isQuarantined,
    createdAt: new Date().toISOString(),
  };

  thread.replies.push(newReply);

  res.status(201).json({
    success: true,
    message: 'Response published successfully.',
    reply: newReply,
  });
}

/**
 * Upvote thread with duplicate prevention
 */
export function upvoteThread(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const thread = db.threads.find(t => t.id === id);
  if (!thread) {
    return res.status(404).json({
      success: false,
      error: 'Thread not found.',
      code: 'THREAD_NOT_FOUND',
    });
  }

  if (thread.upvotedBy.includes(userId)) {
    // Toggle remove upvote
    thread.upvotedBy = thread.upvotedBy.filter(uid => uid !== userId);
    thread.upvotes = Math.max(0, thread.upvotes - 1);
  } else {
    thread.upvotedBy.push(userId);
    thread.upvotes += 1;
  }

  res.json({
    success: true,
    upvotes: thread.upvotes,
    hasUpvoted: thread.upvotedBy.includes(userId),
  });
}

/**
 * Mark solution with IDOR verification: only thread author or ADMIN can accept
 */
export function markSolution(req, res) {
  const { threadId, replyId } = req.body;
  const user = req.user;

  const thread = db.threads.find(t => t.id === threadId);
  if (!thread) {
    return res.status(404).json({
      success: false,
      error: 'Thread not found.',
      code: 'THREAD_NOT_FOUND',
    });
  }

  // IDOR check: Is user the thread author or an ADMIN?
  const isAuthorized = verifyOwnershipOrAdmin(req, res, thread.authorId, 'thread_solution');
  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      error: 'IDOR Protection: Only the original thread author or an administrator can verify solutions.',
      code: 'IDOR_UNAUTHORIZED',
    });
  }

  const reply = thread.replies.find(r => r.id === replyId);
  if (!reply) {
    return res.status(404).json({
      success: false,
      error: 'Reply not found.',
      code: 'REPLY_NOT_FOUND',
    });
  }

  // Reset any other accepted solution on this thread
  thread.replies.forEach(r => { r.isAcceptedSolution = false; });
  reply.isAcceptedSolution = true;
  thread.hasSolution = true;

  logAuditEvent(AuditEventType.MODERATION_ACTION, user, {
    action: 'VERIFIED_SOLUTION_ACCEPTED',
    threadId,
    replyId,
  });

  res.json({
    success: true,
    message: 'Solution verified and accepted.',
    thread,
  });
}
