import helmet from 'helmet';

/**
 * Enterprise Helmet configuration with strict Content Security Policy,
 * anti-clickjacking headers, HSTS, and MIME sniffing protection.
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Needed for Vite development & React Fast Refresh
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3001", "http://localhost:5000", "ws://localhost:3000", "ws://localhost:3001"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Allows cross-origin development resource loading
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' }, // Anti-clickjacking (OWASP A05)
  hidePoweredBy: true, // Prevents technology fingerprinting
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true, // Prevents MIME-type sniffing (OWASP A05)
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true, // Reflected XSS auditor
});
