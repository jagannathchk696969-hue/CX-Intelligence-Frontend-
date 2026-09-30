import { GoogleGenAI } from '@google/genai';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { mockAiService } from './mockAiService.js';

let genAIClient = null;

if (config.ai.geminiApiKey) {
  try {
    genAIClient = new GoogleGenAI({ apiKey: config.ai.geminiApiKey });
    logger.info(`[AI Service] Initialized Google GenAI with model ${config.ai.modelName}`);
  } catch (err) {
    logger.warn('[AI Service] Failed to initialize Google GenAI, fallback to mock mode:', { error: err.message });
  }
}

export const aiService = {
  async analyzeSentiment(text) {
    if (config.ai.mockMode || !genAIClient) {
      return mockAiService.analyzeSentiment(text);
    }

    try {
      const prompt = `You are an expert customer sentiment and intent analyzer for an enterprise customer experience platform.
Analyze the following customer message carefully:
"${text}"

Return STRICT JSON only, matching this exact schema:
{
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": number between 0.0 and 1.0,
  "intent": "string descriptor of user goal",
  "keywords": ["array", "of", "key", "terms"],
  "escalationRecommended": boolean,
  "escalationReason": "string explanation if escalation recommended or null"
}`;

      const response = await genAIClient.interactions.create({
        model: config.ai.modelName,
        input: prompt,
      });

      const responseText = response.output_text?.trim() || '';
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      logger.warn('[AI Service] Gemini sentiment call failed, using mock fallback:', { error: err.message });
      return mockAiService.analyzeSentiment(text);
    }
  },

  async generateChatbotResponse({ message, history = [], knowledgeArticles = [], customer = null }) {
    // If mock mode or no client, use grounded mock engine
    if (config.ai.mockMode || !genAIClient) {
      return mockAiService.generateGroundedResponse(message, knowledgeArticles, customer);
    }

    try {
      const articlesContext = knowledgeArticles.map(a => `[Article ID: ${a.id}, Title: "${a.title}", Category: ${a.category}]\n${a.content}`).join('\n\n---\n\n');

      const systemInstruction = `You are CX Intelligence Assistant, an enterprise AI customer experience agent.
CRITICAL GROUNDING RULES:
1. ONLY answer based strictly on the provided knowledge base articles below.
2. DO NOT invent or hallucinate company policies, prices, subscription tiers, refund days, or system availability.
3. If the knowledge base does not contain the answer or the confidence is low, clearly state uncertainty and suggest escalating to a human support agent.
4. Always cite the title of the article you used to answer.

APPROVED BUSINESS KNOWLEDGE BASE:
${articlesContext || 'No approved articles available.'}
`;

      const response = await genAIClient.interactions.create({
        model: config.ai.modelName,
        input: `Customer name: ${customer?.name || 'Customer'}\nCustomer question: ${message}\n\nPlease respond helpfully and ground your answer strictly in the approved knowledge base.`,
        system_instruction: systemInstruction,
      });

      const replyText = response.output_text || '';

      // Check if grounded in an article
      const citedArticle = knowledgeArticles.find(a => replyText.toLowerCase().includes(a.title.toLowerCase())) || null;

      return {
        reply: replyText,
        grounded: !!citedArticle,
        sourceArticle: citedArticle ? { id: citedArticle.id, title: citedArticle.title, category: citedArticle.category } : null,
        confidence: citedArticle ? 0.94 : 0.60,
        escalationSuggested: replyText.toLowerCase().includes('agent') || replyText.toLowerCase().includes('escalat'),
      };
    } catch (err) {
      logger.warn('[AI Service] Gemini chat call failed, using mock fallback:', { error: err.message });
      return mockAiService.generateGroundedResponse(message, knowledgeArticles, customer);
    }
  }
};
