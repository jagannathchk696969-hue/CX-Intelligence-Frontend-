import { aiService } from '../ai/aiService.js';
import { db } from '../../models/database.js';

export const sentimentService = {
  async analyzeMessage(text, messageId = null) {
    const analysis = await aiService.analyzeSentiment(text);

    let savedRecord = null;
    if (messageId) {
      savedRecord = await db.insert('ai_analysis', {
        message_id: messageId,
        sentiment: analysis.sentiment,
        confidence: analysis.confidence,
        intent: analysis.intent,
        keywords: analysis.keywords || [],
        escalation_recommended: analysis.escalationRecommended,
        escalation_reason: analysis.escalationReason,
      });
    }

    return {
      ...analysis,
      id: savedRecord?.id,
    };
  },

  async getAnalysisByMessageId(messageId) {
    return await db.findOne('ai_analysis', { message_id: messageId });
  }
};
