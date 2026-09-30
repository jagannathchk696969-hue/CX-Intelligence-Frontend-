import { ticketService } from '../services/ticketService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getTickets = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';
    const { status, priority, agentId, search } = req.query;

    const tickets = await ticketService.getTickets(businessId, { status, priority, agentId, search });
    return sendSuccess(res, tickets, 'Tickets retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    return sendSuccess(res, ticket, 'Ticket retrieved');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

export const createTicket = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';
    const customerId = req.body.customerId || (req.user?.role === 'customer' ? req.user.id : 'c1000000-0000-0000-0000-000000000001');

    const ticket = await ticketService.createTicket({
      businessId,
      customerId,
      subject: req.body.subject,
      description: req.body.description,
      priority: req.body.priority,
      category: req.body.category,
    });

    return sendSuccess(res, ticket, 'Support ticket created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const updateTicket = async (req, res) => {
  try {
    const updated = await ticketService.updateTicket(req.params.id, req.body, req.user?.id);
    return sendSuccess(res, updated, 'Ticket updated successfully');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const addTicketMessage = async (req, res) => {
  try {
    const { content, isInternal } = req.body;
    const senderType = req.user?.role === 'customer' ? 'customer' : 'agent';

    const msg = await ticketService.addMessage(req.params.id, {
      senderId: req.user?.id,
      senderType,
      content,
      isInternal: !!isInternal,
    });

    return sendSuccess(res, msg, 'Reply added to ticket', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};
