import { env } from '../config/env.js';

/**
 * Production-grade error handler preventing internal stack traces,
 * file paths, or raw DB errors from leaking to users (OWASP A05).
 */
export function errorHandler(err, req, res, next) {
  const isDev = env.NODE_ENV === 'development';

  // Log error internally for operational diagnostics
  console.error(`💥 [SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  const sanitizedResponse = {
    success: false,
    error: err.isOperational ? err.message : 'An unexpected security-monitored error occurred on the server.',
    code: err.code || 'INTERNAL_SERVER_ERROR',
  };

  // Only include debug stack trace in local development
  if (isDev && err.stack) {
    sanitizedResponse.debugStack = err.stack;
  }

  res.status(statusCode).json(sanitizedResponse);
}
