import api from './api';

export const chatService = {
  async sendMessage({ message, conversationId, customerId }) {
    const res = await api.post('/chat/message', { message, conversationId, customerId });
    return res.data;
  },

  async getConversations(customerId = null) {
    const params = customerId ? { customerId } : {};
    const res = await api.get('/chat/conversations', { params });
    return res.data;
  },

  async getConversationById(id) {
    const res = await api.get(`/chat/conversations/${id}`);
    return res.data;
  },

  async escalateConversation(conversationId, reason) {
    const res = await api.post('/chat/escalate', { conversationId, reason });
    return res.data;
  },

  async submitFeedback({ conversationId, rating, comment, customerId }) {
    const res = await api.post('/chat/feedback', { conversationId, rating, comment, customerId });
    return res.data;
  }
};
