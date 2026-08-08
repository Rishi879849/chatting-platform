import { z } from 'zod';

export const createThreadSchema = z.object({
  channelId: z.string().min(1, 'Channel ID is required.').max(50),
  title: z.string()
    .min(5, 'Thread title must be at least 5 characters long.')
    .max(150, 'Thread title cannot exceed 150 characters.')
    .trim(),
  content: z.string()
    .min(10, 'Thread content must be at least 10 characters long.')
    .max(10000, 'Thread content exceeds maximum allowable payload size (10,000 characters).')
    .trim(),
  tags: z.array(z.string().min(1).max(30)).max(8).default(['Academic Discussion']),
});

export const addReplySchema = z.object({
  content: z.string()
    .min(2, 'Reply content must be at least 2 characters long.')
    .max(8000, 'Reply exceeds maximum allowable payload size (8,000 characters).')
    .trim(),
});

export const upvoteSchema = z.object({
  id: z.string().min(1).max(50),
});

export const solutionSchema = z.object({
  threadId: z.string().min(1).max(50),
  replyId: z.string().min(1).max(50),
});
