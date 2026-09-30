import { db } from '../models/database.js';
import { aiService } from './ai/aiService.js';
import { logger } from '../utils/logger.js';

export const ticketService = {
  async createTicket({ businessId, customerId, subject, description, priority, category }) {
    // Run sentiment analysis on description to determine AI suggested priority
    const analysis = await aiService.analyzeSentiment(`${subject} ${description}`);
    
    let aiSuggestedPriority = 'medium';
    if (analysis.sentiment === 'negative' && analysis.confidence > 0.8) {
      aiSuggestedPriority = 'urgent';
    } else if (analysis.sentiment === 'negative') {
      aiSuggestedPriority = 'high';
    } else if (analysis.sentiment === 'positive') {
      aiSuggestedPriority = 'low';
    }

    const ticket = await db.insert('tickets', {
      business_id: businessId,
      customer_id: customerId,
      assigned_agent_id: null,
      subject,
      description,
      priority: priority || aiSuggestedPriority,
      category: category || 'general',
      status: 'open',
      sentiment_score: analysis.sentiment === 'positive' ? 0.8 : (analysis.sentiment === 'negative' ? -0.8 : 0.0),
      ai_suggested_priority: aiSuggestedPriority,
    });

    logger.audit('TICKET_CREATED', customerId, {
      ticketId: ticket.id,
      priority: ticket.priority,
      aiSuggestedPriority,
    });

    return ticket;
  },

  async getTickets(businessId, { status, priority, agentId, search } = {}) {
    let tickets = await db.findMany('tickets', { business_id: businessId });

    if (status) tickets = tickets.filter(t => t.status === status);
    if (priority) tickets = tickets.filter(t => t.priority === priority);
    if (agentId) tickets = tickets.filter(t => t.assigned_agent_id === agentId);
    if (search) {
      const q = search.toLowerCase();
      tickets = tickets.filter(t => t.subject.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    // Enrich with customer and assigned agent info
    const enriched = await Promise.all(tickets.map(async (t) => {
      const customer = await db.findOne('customers', { id: t.customer_id });
      const agent = t.assigned_agent_id ? await db.findOne('profiles', { id: t.assigned_agent_id }) : null;
      return {
        ...t,
        customer,
        assignedAgent: agent ? { id: agent.id, fullName: agent.full_name, email: agent.email } : null,
      };
    }));

    return enriched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getTicketById(id) {
    const ticket = await db.findOne('tickets', { id });
    if (!ticket) throw new Error('Ticket not found');

    const customer = await db.findOne('customers', { id: ticket.customer_id });
    const agent = ticket.assigned_agent_id ? await db.findOne('profiles', { id: ticket.assigned_agent_id }) : null;
    const messages = await db.findMany('ticket_messages', { ticket_id: id });

    return {
      ...ticket,
      customer,
      assignedAgent: agent ? { id: agent.id, fullName: agent.full_name, email: agent.email } : null,
      messages: messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    };
  },

  async updateTicket(id, updates, currentUserId = null) {
    const existing = await db.findOne('tickets', { id });
    if (!existing) throw new Error('Ticket not found');

    const payload = { ...updates };
    if (updates.status === 'resolved' || updates.status === 'closed') {
      if (!existing.resolved_at) {
        payload.resolved_at = new Date().toISOString();
      }
    } else if (updates.status && updates.status !== 'resolved' && updates.status !== 'closed') {
      payload.resolved_at = null;
    }

    const updated = await db.update('tickets', id, payload);
    logger.audit('TICKET_UPDATED', currentUserId, { ticketId: id, updates });
    return updated;
  },

  async addMessage(ticketId, { senderId, senderType = 'agent', content, isInternal = false }) {
    const ticket = await db.findOne('tickets', { id: ticketId });
    if (!ticket) throw new Error('Ticket not found');

    const msg = await db.insert('ticket_messages', {
      ticket_id: ticketId,
      sender_id: senderId,
      sender_type: senderType,
      content,
      is_internal: isInternal,
    });

    // Touch ticket updated_at
    await db.update('tickets', ticketId, { updated_at: new Date().toISOString() });

    return msg;
  }
};
