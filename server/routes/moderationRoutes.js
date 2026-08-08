import { Router } from 'express';
import { getReports, submitReport, reviewReport, getAuditLogs } from '../controllers/moderationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReportSchema, moderateReportSchema } from '../schemas/reportSchemas.js';

const router = Router();

// Student confidential report submission
router.post('/reports', authenticateToken, validate(createReportSchema), submitReport);

// Admin-only endpoints
router.get('/reports', authenticateToken, requireRole('ADMIN'), getReports);
router.post('/reports/review', authenticateToken, requireRole('ADMIN'), validate(moderateReportSchema), reviewReport);
router.get('/audit-logs', authenticateToken, requireRole('ADMIN'), getAuditLogs);

export default router;
