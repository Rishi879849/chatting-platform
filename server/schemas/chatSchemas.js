import { z } from 'zod';

export const createMessageSchema = z.object({
  channelId: z.string().min(1, 'Channel ID is required.').max(50),
  content: z.string()
    .min(1, 'Message content cannot be empty.')
    .max(5000, 'Message exceeds 5,000 characters payload threshold.')
    .trim(),
});

export const createChannelSchema = z.object({
  name: z.string()
    .min(2, 'Channel name must be at least 2 characters.')
    .max(40, 'Channel name cannot exceed 40 characters.')
    .regex(/^[a-z0-9-]+$/, 'Channel name must consist of lowercase alphanumeric characters and hyphens only.'),
  category: z.enum(['SUBJECT', 'OFFICIAL', 'CAREER']).default('SUBJECT'),
  description: z.string().max(250).default('Academic study channel.'),
});
