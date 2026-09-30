import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().nullable().optional(),
    preferences: z.record(z.any()).nullable().optional(),
  }),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Customer ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().nullable().optional(),
    preferences: z.record(z.any()).nullable().optional(),
  }),
});

export const chatMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().nullable().optional(),
    customerId: z.string().nullable().optional(),
    message: z.string().min(1, 'Message content cannot be empty'),
  }),
});

export const createTicketSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    category: z.enum(['billing', 'technical', 'product', 'account', 'general']).default('general'),
  }),
});

export const updateTicketSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Ticket ID is required'),
  }),
  body: z.object({
    status: z.enum(['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    assignedAgentId: z.string().nullable().optional(),
    category: z.enum(['billing', 'technical', 'product', 'account', 'general']).optional(),
  }),
});

export const addTicketMessageSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Ticket ID is required'),
  }),
  body: z.object({
    content: z.string().min(1, 'Message content cannot be empty'),
    isInternal: z.boolean().default(false),
  }),
});

export const createKnowledgeSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    category: z.string().default('general'),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
  }),
});
