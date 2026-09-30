import { chatService } from '../services/chatService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, message, customerId } = req.body;
    const effectiveCustomerId = customerId || (req.user?.role === 'customer' ? req.user.id : null);

    const result = await chatService.sendMessage({
      customerId: effectiveCustomerId,
      conversationId,
      messageContent: message,
      businessId: req.user?.businessId || 'b1000000-0000-0000-0000-000000000001',
    });

    return sendSuccess(res, result, 'Message processed', 200);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getConversations = async (req, res) => {
  try {
    const customerId = req.user?.role === 'customer' ? req.user.id : req.query.customerId;
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';

    const conversations = await chatService.getConversations(businessId, customerId);
    return sendSuccess(res, conversations, 'Conversations retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await chatService.getConversationById(req.params.id);
    return sendSuccess(res, conversation, 'Conversation retrieved');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

export const escalate = async (req, res) => {
  try {
    const { reason } = req.body;
    const escalated = await chatService.escalateConversation(req.params.id || req.body.conversationId, reason);
    return sendSuccess(res, escalated, 'Conversation escalated to human agent');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { conversationId, rating, comment, customerId } = req.body;
    const feedback = await chatService.submitFeedback({
      customerId: customerId || req.user?.id || 'c1000000-0000-0000-0000-000000000001',
      conversationId,
      rating,
      comment,
    });
    return sendSuccess(res, feedback, 'Feedback submitted successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};
