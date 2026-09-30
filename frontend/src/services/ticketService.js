import api from './api';

export const ticketService = {
  async getTickets(params = {}) {
    const res = await api.get('/tickets', { params });
    return res.data;
  },

  async getTicketById(id) {
    const res = await api.get(`/tickets/${id}`);
    return res.data;
  },

  async createTicket(data) {
    const res = await api.post('/tickets', data);
    return res.data;
  },

  async updateTicket(id, updates) {
    const res = await api.patch(`/tickets/${id}`, updates);
    return res.data;
  },

  async addMessage(ticketId, { content, isInternal }) {
    const res = await api.post(`/tickets/${ticketId}/messages`, { content, isInternal });
    return res.data;
  }
};
