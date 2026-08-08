import { z } from 'zod';

export const createReportSchema = z.object({
  threadId: z.string().max(50).optional().nullable(),
  messageId: z.string().max(50).optional().nullable(),
  title: z.string().max(150).default('User Report'),
  authorHandle: z.string().min(1).max(50),
  category: z.enum(['CONTACT_SHARING', 'OFF_TOPIC', 'HARASSMENT', 'SPAM']),
  reason: z.string().min(5, 'Report reason must provide at least 5 characters of context.').max(1000).trim(),
});

export const moderateReportSchema = z.object({
  reportId: z.string().min(1).max(50),
  action: z.enum(['DISMISS', 'QUARANTINE_PERMANENT', 'BAN_USER']),
  notes: z.string().max(500).optional(),
});
