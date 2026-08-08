import rateLimit from 'express-rate-limit';
import { logAuditEvent, AuditEventType } from '../services/auditLogger.js';

/**
 * Global rate limiter applying a broad ceiling across general read endpoints.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250, // Limit each IP to 250 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: (req, res, next, options) => {
    logAuditEvent(AuditEventType.RATE_LIMIT_EXCEEDED, { id: req.user?.id, handle: req.user?.publicHandle, ip: req.ip }, {
      path: req.originalUrl,
      method: req.method,
      limitType: 'GLOBAL',
    });
    res.status(429).json(options.message);
  },
});

/**
 * Aggressive rate limiter on authentication endpoints (login, registration, verification)
 * to prevent brute-force attacks and credential stuffing.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Your access is temporarily restricted for 15 minutes to protect account security.',
    code: 'AUTH_RATE_LIMIT_LOCKOUT',
  },
  handler: (req, res, next, options) => {
    logAuditEvent(AuditEventType.RATE_LIMIT_EXCEEDED, { id: req.user?.id, handle: req.body?.usernameOrEmail, ip: req.ip }, {
      path: req.originalUrl,
      limitType: 'AUTH_LOCKOUT',
    });
    res.status(429).json(options.message);
  },
});

/**
 * Moderate rate limiter on content creation (threads, replies, messages)
 * to prevent spamming and automated script flooding.
 */
export const creationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 messages / threads per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Posting rate limit exceeded. Please wait a moment before sending more messages.',
    code: 'CREATION_RATE_LIMIT',
  },
});
