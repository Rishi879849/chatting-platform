import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../data/store.js';
import { logAuditEvent, AuditEventType } from '../services/auditLogger.js';

/**
 * Verifies the incoming Bearer JWT Access Token or HttpOnly cookie.
 */
export function authenticateToken(req, res, next) {
  let token = null;

  // Check Authorization Header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Fallback to HttpOnly cookie if present
  if (!token && req.cookies && req.cookies.acad_access_token) {
    token = req.cookies.acad_access_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication credentials missing. Please log in.',
      code: 'UNAUTHORIZED',
    });
  }

  // Check if token has been revoked
  if (db.revokedTokens.has(token)) {
    logAuditEvent(AuditEventType.AUTH_FAILED, { ip: req.ip }, { reason: 'Attempted use of revoked access token.' });
    return res.status(401).json({
      success: false,
      error: 'Session token has been revoked. Please re-authenticate.',
      code: 'TOKEN_REVOKED',
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = db.users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account associated with this session no longer exists.',
        code: 'USER_NOT_FOUND',
      });
    }

    // Attach verified user entity and raw token to request context
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Access token expired. Please refresh your session.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(403).json({
      success: false,
      error: 'Invalid or forged authentication signature.',
      code: 'FORBIDDEN_SIGNATURE',
    });
  }
}

/**
 * Optional authentication middleware for public endpoints that can enhance responses for logged-in users.
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.acad_access_token) {
    token = req.cookies.acad_access_token;
  }

  if (token && !db.revokedTokens.has(token)) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = db.users.find(u => u.id === decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token validation failure in optionalAuth
    }
  }
  next();
}

/**
 * Enforces Role-Based Access Control (RBAC) on protected server routes.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to access this resource.',
        code: 'UNAUTHORIZED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logAuditEvent(AuditEventType.PRIVILEGE_CHECK, req.user, {
        requiredRoles: allowedRoles,
        userRole: req.user.role,
        path: req.originalUrl,
        status: 'DENIED',
      });
      return res.status(403).json({
        success: false,
        error: 'Access denied: Insufficient role permissions.',
        code: 'FORBIDDEN_ROLE',
      });
    }

    next();
  };
}

/**
 * IDOR Defense: Verifies that the authenticated user either owns the resource or has the ADMIN role.
 */
export function verifyOwnershipOrAdmin(req, res, resourceOwnerId, resourceName = 'resource') {
  const isOwner = req.user && (req.user.id === resourceOwnerId || req.user.publicHandle === resourceOwnerId || req.user.pseudonym === resourceOwnerId);
  const isAdmin = req.user && req.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    logAuditEvent(AuditEventType.IDOR_ATTEMPT, req.user, {
      resourceName,
      targetOwnerId: resourceOwnerId,
      path: req.originalUrl,
    });
    return false;
  }
  return true;
}
