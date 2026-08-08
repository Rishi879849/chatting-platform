import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const auditLogFile = path.join(logDirectory, 'security_audit.log');

export const AuditEventType = {
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILED: 'AUTH_FAILED',
  ACCOUNT_LOCKOUT: 'ACCOUNT_LOCKOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  PRIVILEGE_CHECK: 'PRIVILEGE_CHECK',
  IDOR_ATTEMPT: 'IDOR_ATTEMPT',
  CONTENT_QUARANTINE: 'CONTENT_QUARANTINE',
  MODERATION_ACTION: 'MODERATION_ACTION',
  DOMAIN_VERIFIED: 'DOMAIN_VERIFIED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  USER_BLOCK: 'USER_BLOCK',
  DATA_DELETION: 'DATA_DELETION',
};

/**
 * Records a security audit event with timestamp, actor, event type, and sanitized metadata.
 */
export function logAuditEvent(eventType, actor, details = {}) {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    eventType,
    actor: {
      userId: actor?.id || 'anonymous',
      handle: actor?.handle || 'unauthenticated',
      role: actor?.role || 'NONE',
      ip: actor?.ip || '0.0.0.0',
    },
    details: sanitizeLogDetails(details),
  };

  const line = JSON.stringify(auditEntry) + '\n';

  // Output to structured console in development
  console.log(`🔒 [AUDIT] [${auditEntry.timestamp}] [${eventType}] Actor: ${auditEntry.actor.handle} (${auditEntry.actor.role}) - ${JSON.stringify(auditEntry.details)}`);

  // Write to log file asynchronously
  fs.appendFile(auditLogFile, line, (err) => {
    if (err) {
      console.error('Failed to append to audit log file:', err.message);
    }
  });

  return auditEntry;
}

/**
 * Removes sensitive fields like passwords, tokens, and authorization headers from log details.
 */
function sanitizeLogDetails(details) {
  if (!details || typeof details !== 'object') return details;
  const sanitized = { ...details };
  const sensitiveKeys = ['password', 'token', 'refreshToken', 'authorization', 'cookie', 'secret'];
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED_SECRET]';
    }
  }
  return sanitized;
}
