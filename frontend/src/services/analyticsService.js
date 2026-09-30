import api from './api';

export const analyticsService = {
  async getOverview(days = 30) {
    const res = await api.get('/analytics/overview', { params: { days } });
    return res.data;
  },

  async getSentimentDistribution(days = 30) {
    const res = await api.get('/analytics/sentiment', { params: { days } });
    return res.data;
  },

  async getEngagementTrends(days = 7) {
    const res = await api.get('/analytics/engagement', { params: { days } });
    return res.data;
  },

  async getSupportBreakdown() {
    const res = await api.get('/analytics/support');
    return res.data;
  }
};
