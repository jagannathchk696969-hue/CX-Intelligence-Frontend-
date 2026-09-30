import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    businessName: z.string().min(2, 'Business name must be at least 2 characters').optional(),
    role: z.enum(['admin', 'support_agent', 'customer']).default('customer'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});
