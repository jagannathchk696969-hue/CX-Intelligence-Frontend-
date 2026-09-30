import { knowledgeService } from '../services/knowledgeService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getKnowledgeArticles = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';
    const { category, search, published } = req.query;

    const articles = await knowledgeService.getArticles(businessId, { category, search, published });
    return sendSuccess(res, articles, 'Knowledge articles retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getKnowledgeArticleById = async (req, res) => {
  try {
    const article = await knowledgeService.getArticleById(req.params.id);
    return sendSuccess(res, article, 'Knowledge article retrieved');
  } catch (err) {
    return sendError(res, err.message, 404);
  }
};

export const createKnowledgeArticle = async (req, res) => {
  try {
    const businessId = req.user?.businessId || 'b1000000-0000-0000-0000-000000000001';
    const article = await knowledgeService.createArticle(businessId, req.body);
    return sendSuccess(res, article, 'Knowledge article published', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const updateKnowledgeArticle = async (req, res) => {
  try {
    const updated = await knowledgeService.updateArticle(req.params.id, req.body);
    return sendSuccess(res, updated, 'Knowledge article updated');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const deleteKnowledgeArticle = async (req, res) => {
  try {
    await knowledgeService.deleteArticle(req.params.id);
    return sendSuccess(res, null, 'Knowledge article deleted');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};
