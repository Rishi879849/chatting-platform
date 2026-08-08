import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores.'),
  email: z.string().email('Valid institutional email address is required.'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(100, 'Password is too long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
  publicHandle: z.string().min(2).max(40).optional(),
  college: z.string().min(2).max(100).optional(),
});

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(3).max(100),
  password: z.string().min(1).max(100),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Valid refresh token is required.').optional(),
});

export const verifyCollegeSchema = z.object({
  email: z.string().email('Invalid email address format.').refine(val => {
    const domain = val.toLowerCase();
    return domain.endsWith('.ac.in') || domain.endsWith('.edu.in') || domain.endsWith('.edu');
  }, {
    message: 'Institutional email must belong to an accredited .ac.in, .edu.in, or .edu academic domain.'
  }),
});
