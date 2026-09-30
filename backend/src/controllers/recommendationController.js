import { recommendationService } from '../services/recommendation/recommendationService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getRecommendationsByCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.user?.id;
    const businessId = req.user?.businessId;

    const list = await recommendationService.getRecommendationsForCustomer(customerId, businessId);
    return sendSuccess(res, list, 'Customer recommendations retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
