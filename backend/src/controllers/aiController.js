import { sentimentService } from '../services/sentiment/sentimentService.js';
import { aiService } from '../services/ai/aiService.js';
import { config } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const analyzeSentiment = async (req, res) => {
  try {
    const { text, messageId } = req.body;
    if (!text) return sendError(res, 'Text is required for sentiment analysis', 400);

    const result = await sentimentService.analyzeMessage(text, messageId);
    return sendSuccess(res, result, 'Sentiment analysis completed');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getAnalysisByMessageId = async (req, res) => {
  try {
    const analysis = await sentimentService.getAnalysisByMessageId(req.params.messageId);
    if (!analysis) return sendError(res, 'Analysis not found for message', 404);
    return sendSuccess(res, analysis, 'Analysis retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getAiStatus = async (req, res) => {
  try {
    const isConfigured = aiService.isConfigured();
    return sendSuccess(res, {
      geminiConfigured: isConfigured,
      engine: isConfigured ? 'Google Gemini Live API' : 'Intelligent Local Copilot Engine',
      model: config.ai.modelName,
      problemStatement: 'CX Intelligence - Omnichannel Customer Experience, Sentiment Intelligence, and Grounded Ticketing'
    }, 'AI service status retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
