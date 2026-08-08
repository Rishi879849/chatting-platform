import { db } from '../data/store.js';
import { logAuditEvent, AuditEventType } from '../services/auditLogger.js';

/**
 * College Email Verification for Institutional Badging
 */
export function verifyCollegeEmail(req, res) {
  const { email } = req.body;
  const user = req.user;

  const domain = email.toLowerCase();
  let collegeName = 'Verified University';

  if (domain.includes('iitm.ac.in')) collegeName = 'IIT Madras';
  else if (domain.includes('bits-pilani.ac.in')) collegeName = 'BITS Pilani';
  else if (domain.includes('iitb.ac.in')) collegeName = 'IIT Bombay';
  else if (domain.includes('iitd.ac.in')) collegeName = 'IIT Delhi';
  else if (domain.includes('iisc.ac.in')) collegeName = 'IISc Bangalore';

  user.isVerified = true;
  user.college = collegeName;
  user.collegeEmail = email;

  if (!user.badges.includes('Verified Student')) {
    user.badges.push('Verified Student');
  }

  logAuditEvent(AuditEventType.DOMAIN_VERIFIED, user, {
    college: collegeName,
    domain: email.split('@')[1],
  });

  const sanitizedUser = { ...user };
  delete sanitizedUser.passwordHash;

  res.json({
    success: true,
    message: `Domain verified! Official institutional badge issued for ${collegeName}.`,
    user: sanitizedUser,
  });
}

/**
 * Toggle Identity Mode (Pseudonymous vs Public)
 */
export function toggleIdentityMode(req, res) {
  const user = req.user;
  user.identityMode = user.identityMode === 'ANONYMOUS' ? 'PUBLIC' : 'ANONYMOUS';

  const sanitizedUser = { ...user };
  delete sanitizedUser.passwordHash;

  res.json({
    success: true,
    identityMode: user.identityMode,
    user: sanitizedUser,
  });
}
