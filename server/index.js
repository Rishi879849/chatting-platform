import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import threadRoutes from './routes/threadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import moderationRoutes from './routes/moderationRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// 1. Strict Security Headers (Helmet CSP, HSTS, X-Frame-Options)
app.use(securityHeaders);

// 2. Strict CORS Configuration (Disallows Wildcard '*' for Authenticated Routes)
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocks access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// 3. Payload Bombs & Injection Protection (Strict 100kb JSON Limit)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 4. Secure Cookie Parser
app.use(cookieParser());

// 5. Global Rate Limiting
app.use(globalLimiter);

// 6. Security Health & Diagnostics Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'AcadSphere Security Core',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// 7. Protected & Versioned API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/threads', threadRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/moderation', moderationRoutes);
app.use('/api/v1/users', userRoutes);

// 8. 404 Handler for Unrecognized Endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// 9. Centralized Error Handler (Masks Internal Schemas & Stack Traces)
app.use(errorHandler);

// Start listening
const server = app.listen(env.PORT, () => {
  console.log(`🛡️ [ACADSPHERE SECURITY CORE] Running on port ${env.PORT} in [${env.NODE_ENV}] mode.`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});

export default app;
