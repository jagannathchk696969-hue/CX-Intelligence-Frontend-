import api from './api';

export const knowledgeService = {
  async getArticles(params = {}) {
    const res = await api.get('/knowledge', { params });
    return res.data;
  },

  async getArticleById(id) {
    const res = await api.get(`/knowledge/${id}`);
    return res.data;
  },

  async createArticle(data) {
    const res = await api.post('/knowledge', data);
    return res.data;
  },

  async updateArticle(id, data) {
    const res = await api.put(`/knowledge/${id}`, data);
    return res.data;
  },

  async deleteArticle(id) {
    const res = await api.delete(`/knowledge/${id}`);
    return res.data;
  }
};
