import { analyticsService } from '../services/analytics/analyticsService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getOverview = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';
    const days = parseInt(req.query.days || '30', 10);

    const data = await analyticsService.getOverview(businessId, days);
    return sendSuccess(res, data, 'Analytics overview retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getSentimentAnalytics = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';
    const days = parseInt(req.query.days || '30', 10);

    const data = await analyticsService.getSentimentDistribution(businessId, days);
    return sendSuccess(res, data, 'Sentiment distribution retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getEngagementTrends = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';
    const days = parseInt(req.query.days || '7', 10);

    const data = await analyticsService.getEngagementTrends(businessId, days);
    return sendSuccess(res, data, 'Engagement trends retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getSupportAnalytics = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';

    const data = await analyticsService.getSupportBreakdown(businessId);
    return sendSuccess(res, data, 'Support analytics retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
