import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../data/store.js';
import { logAuditEvent, AuditEventType } from '../services/auditLogger.js';

/**
 * Generates short-lived Access Token (15 mins) and rotating Refresh Token (7 days).
 */
function generateTokens(user) {
  const payload = {
    userId: user.id,
    role: user.role,
    pseudonym: user.pseudonym,
    publicHandle: user.publicHandle,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

  return { accessToken, refreshToken };
}

/**
 * Cookie options configuring HttpOnly, Secure, and SameSite flags (OWASP A07).
 */
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

/**
 * User Registration
 */
export async function register(req, res, next) {
  try {
    const { username, email, password, publicHandle, college } = req.body;

    // Check if user already exists
    const existing = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'A user with this username or email already exists.',
        code: 'USER_ALREADY_EXISTS',
      });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

    const newUser = {
      id: `usr-${Date.now()}`,
      username,
      email,
      passwordHash,
      role: 'STUDENT',
      publicHandle: publicHandle || `@${username}`,
      pseudonym: `anon_${Math.random().toString(36).substring(2, 8)}`,
      identityMode: 'ANONYMOUS',
      isVerified: false,
      college: college || null,
      collegeEmail: null,
      badges: ['New Learner'],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.cookie('acad_access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('acad_refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    logAuditEvent(AuditEventType.AUTH_SUCCESS, newUser, { action: 'USER_REGISTERED', email: newUser.email });

    const sanitizedUser = { ...newUser };
    delete sanitizedUser.passwordHash;

    res.status(201).json({
      success: true,
      message: 'Account created successfully with secure credentials.',
      user: sanitizedUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * User Login with Lockout and Bcrypt Verification
 */
export async function login(req, res, next) {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = db.users.find(u =>
      u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
      u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );

    if (!user) {
      logAuditEvent(AuditEventType.AUTH_FAILED, { handle: usernameOrEmail, ip: req.ip }, { reason: 'User not found.' });
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials provided.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Check account lockout status
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.lockoutUntil) - new Date()) / 60000);
      logAuditEvent(AuditEventType.ACCOUNT_LOCKOUT, user, { ip: req.ip, remainingMinutes });
      return res.status(423).json({
        success: false,
        error: `Account is temporarily locked due to excessive failed attempts. Please try again in ${remainingMinutes} minute(s).`,
        code: 'ACCOUNT_LOCKED',
      });
    }

    // Verify bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 consecutive failures
      if (user.failedLoginAttempts >= env.AUTH_RATE_LIMIT_MAX) {
        user.lockoutUntil = new Date(Date.now() + env.AUTH_LOCKOUT_DURATION_MS).toISOString();
        logAuditEvent(AuditEventType.ACCOUNT_LOCKOUT, user, { ip: req.ip, attempts: user.failedLoginAttempts });
      }

      logAuditEvent(AuditEventType.AUTH_FAILED, user, { ip: req.ip, failedAttempts: user.failedLoginAttempts });

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials provided.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Reset lockout counters on successful login
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('acad_access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('acad_refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    logAuditEvent(AuditEventType.AUTH_SUCCESS, user, { action: 'USER_LOGIN' });

    const sanitizedUser = { ...user };
    delete sanitizedUser.passwordHash;

    res.json({
      success: true,
      message: 'Authentication successful.',
      user: sanitizedUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Refresh Token Rotation
 */
export async function refreshSession(req, res, next) {
  try {
    let refreshToken = req.body.refreshToken || (req.cookies && req.cookies.acad_refresh_token);

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required.',
        code: 'MISSING_REFRESH_TOKEN',
      });
    }

    if (db.revokedTokens.has(refreshToken)) {
      logAuditEvent(AuditEventType.TOKEN_REVOKED, { ip: req.ip }, { reason: 'Revoked refresh token reused.' });
      return res.status(403).json({
        success: false,
        error: 'Security alert: Refresh token has been invalidated.',
        code: 'REFRESH_TOKEN_INVALIDATED',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired refresh token.',
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    const user = db.users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found.',
        code: 'USER_NOT_FOUND',
      });
    }

    // Invalidate the old refresh token (Strict Token Rotation)
    db.revokedTokens.add(refreshToken);

    // Issue brand new token pair
    const tokens = generateTokens(user);

    res.cookie('acad_access_token', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('acad_refresh_token', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    logAuditEvent(AuditEventType.TOKEN_REFRESH, user, { action: 'TOKEN_ROTATION_SUCCESS' });

    res.json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Logout and Token Revocation
 */
export function logout(req, res) {
  if (req.token) {
    db.revokedTokens.add(req.token);
  }
  const refreshToken = req.body?.refreshToken || req.cookies?.acad_refresh_token;
  if (refreshToken) {
    db.revokedTokens.add(refreshToken);
  }

  res.clearCookie('acad_access_token', cookieOptions);
  res.clearCookie('acad_refresh_token', cookieOptions);

  logAuditEvent(AuditEventType.AUTH_SUCCESS, req.user || { ip: req.ip }, { action: 'USER_LOGOUT' });

  res.json({
    success: true,
    message: 'Logged out successfully. All session tokens invalidated.',
  });
}

/**
 * Get Authenticated User Profile
 */
export function getMe(req, res) {
  const sanitizedUser = { ...req.user };
  delete sanitizedUser.passwordHash;
  res.json({
    success: true,
    user: sanitizedUser,
  });
}
