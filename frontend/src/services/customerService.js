import api from './api';

export const customerService = {
  async getCustomers(search = '') {
    const res = await api.get('/customers', { params: { search } });
    return res.data;
  },

  async getCustomerById(id) {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  },

  async createCustomer(data) {
    const res = await api.post('/customers', data);
    return res.data;
  },

  async updateCustomer(id, data) {
    const res = await api.put(`/customers/${id}`, data);
    return res.data;
  }
};

export const recommendationService = {
  async getRecommendations(customerId) {
    const res = await api.get(`/recommendations/${customerId}`);
    return res.data;
  }
};
