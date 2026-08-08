import { db } from '../data/store.js';
import { logAuditEvent, AuditEventType } from '../services/auditLogger.js';

/**
 * Get all moderation reports (Admin Only)
 */
export function getReports(req, res) {
  res.json({
    success: true,
    count: db.reports.length,
    reports: db.reports,
  });
}

/**
 * Submit confidential report (Authenticated Students)
 */
export function submitReport(req, res) {
  const { threadId, messageId, title, authorHandle, category, reason } = req.body;
  const user = req.user;

  const newReport = {
    id: `rep-${Date.now()}`,
    threadId: threadId || null,
    messageId: messageId || null,
    title,
    authorHandle,
    category,
    reason,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  db.reports.unshift(newReport);

  logAuditEvent(AuditEventType.MODERATION_ACTION, user, {
    action: 'REPORT_SUBMITTED',
    reportId: newReport.id,
    targetHandle: authorHandle,
    category,
  });

  res.status(201).json({
    success: true,
    message: 'Report submitted confidentially to moderator audit queue.',
    report: newReport,
  });
}

/**
 * Review and action report (Admin Only)
 */
export function reviewReport(req, res) {
  const { reportId, action, notes } = req.body;
  const admin = req.user;

  const report = db.reports.find(r => r.id === reportId);
  if (!report) {
    return res.status(404).json({
      success: false,
      error: 'Report record not found.',
      code: 'REPORT_NOT_FOUND',
    });
  }

  report.status = action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED';
  report.actionTaken = action;
  report.reviewedBy = admin.publicHandle;
  report.reviewedAt = new Date().toISOString();

  // If thread was quarantined, approve or delete it
  if (report.threadId) {
    const thread = db.threads.find(t => t.id === report.threadId);
    if (thread) {
      if (action === 'DISMISS') {
        thread.isQuarantined = false;
      }
    }
  }

  logAuditEvent(AuditEventType.MODERATION_ACTION, admin, {
    reportId,
    action,
    targetHandle: report.authorHandle,
    notes,
  });

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'MODERATION_ACTION',
    actor: admin.publicHandle,
    target: report.authorHandle,
    action: action === 'DISMISS' ? 'DISMISSED_APPROVE' : 'CONFIRM_QUARANTINE',
    severity: 'MEDIUM',
  });

  res.json({
    success: true,
    message: `Moderation action '${action}' applied successfully.`,
    report,
  });
}

/**
 * Get Security & Moderation Audit Logs (Admin Only)
 */
export function getAuditLogs(req, res) {
  res.json({
    success: true,
    count: db.auditLogs.length,
    auditLogs: db.auditLogs,
  });
}
