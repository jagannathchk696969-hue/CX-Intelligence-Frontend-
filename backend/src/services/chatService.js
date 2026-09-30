import { db } from '../models/database.js';
import { aiService } from './ai/aiService.js';
import { sentimentService } from './sentiment/sentimentService.js';
import { logger } from '../utils/logger.js';

export const chatService = {
  async sendMessage({ customerId, conversationId, messageContent, businessId }) {
    let customer = null;
    if (customerId) {
      customer = await db.findOne('customers', { id: customerId });
    }

    const bId = businessId || customer?.business_id || 'b1000000-0000-0000-0000-000000000001';

    // 1. Find or create conversation
    let conv = null;
    if (conversationId) {
      conv = await db.findOne('conversations', { id: conversationId });
    }

    if (!conv) {
      conv = await db.insert('conversations', {
        business_id: bId,
        customer_id: customerId || 'c1000000-0000-0000-0000-000000000001',
        status: 'active',
        channel: 'web_chat',
      });
    }

    // 2. Perform Sentiment & Intent Analysis on user message
    const sentimentResult = await aiService.analyzeSentiment(messageContent);

    // 3. Save customer message
    const userMsg = await db.insert('messages', {
      conversation_id: conv.id,
      sender_type: 'customer',
      sender_id: customerId,
      content: messageContent,
      sentiment: sentimentResult.sentiment,
      intent: sentimentResult.intent,
      metadata: {
        confidence: sentimentResult.confidence,
        keywords: sentimentResult.keywords,
      }
    });

    // Save AI analysis log
    await db.insert('ai_analysis', {
      message_id: userMsg.id,
      sentiment: sentimentResult.sentiment,
      confidence: sentimentResult.confidence,
      intent: sentimentResult.intent,
      keywords: sentimentResult.keywords || [],
      escalation_recommended: sentimentResult.escalationRecommended,
      escalation_reason: sentimentResult.escalationReason,
    });

    // 4. Check if auto-escalation is needed due to extreme negative sentiment
    let autoEscalated = false;
    if (sentimentResult.escalationRecommended) {
      await db.update('conversations', conv.id, { status: 'escalated' });
      autoEscalated = true;
      logger.audit('CONVERSATION_AUTO_ESCALATED', customerId, {
        conversationId: conv.id,
        reason: sentimentResult.escalationReason,
      });
    }

    // 5. Fetch approved knowledge base articles for business
    const knowledgeArticles = await db.findMany('knowledge_articles', {
      business_id: bId,
      published: true,
    });

    // 6. Generate grounded AI response
    const aiResult = await aiService.generateChatbotResponse({
      message: messageContent,
      knowledgeArticles,
      customer,
    });

    // 7. Save AI assistant message
    const aiMsg = await db.insert('messages', {
      conversation_id: conv.id,
      sender_type: 'ai_assistant',
      sender_id: null,
      content: aiResult.reply,
      sentiment: 'positive',
      intent: 'assistant_response',
      metadata: {
        grounded: aiResult.grounded,
        sourceArticle: aiResult.sourceArticle,
        confidence: aiResult.confidence,
        escalationSuggested: aiResult.escalationSuggested || autoEscalated,
      }
    });

    return {
      conversationId: conv.id,
      customerMessage: userMsg,
      aiMessage: aiMsg,
      analysis: sentimentResult,
      autoEscalated,
    };
  },

  async getConversations(businessId, customerId = null) {
    const filter = { business_id: businessId };
    if (customerId) filter.customer_id = customerId;

    const list = await db.findMany('conversations', filter);
    
    // Sort descending by updated_at
    const sorted = list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Enrich with customer details and last message
    const enriched = await Promise.all(sorted.map(async (c) => {
      const cust = await db.findOne('customers', { id: c.customer_id });
      const msgs = await db.findMany('messages', { conversation_id: c.id });
      const lastMsg = msgs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

      return {
        ...c,
        customer: cust,
        messagesCount: msgs.length,
        lastMessage: lastMsg ? {
          content: lastMsg.content,
          senderType: lastMsg.sender_type,
          sentiment: lastMsg.sentiment,
          createdAt: lastMsg.created_at,
        } : null,
      };
    }));

    return enriched;
  },

  async getConversationById(id) {
    const conv = await db.findOne('conversations', { id });
    if (!conv) {
      throw new Error('Conversation not found');
    }

    const messages = await db.findMany('messages', { conversation_id: id });
    const customer = await db.findOne('customers', { id: conv.customer_id });

    return {
      ...conv,
      customer,
      messages: messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    };
  },

  async escalateConversation(id, reason = 'Customer requested human support') {
    const conv = await db.findOne('conversations', { id });
    if (!conv) {
      throw new Error('Conversation not found');
    }

    const updated = await db.update('conversations', id, { status: 'escalated' });

    // Insert system message into conversation
    await db.insert('messages', {
      conversation_id: id,
      sender_type: 'system',
      content: `This session has been escalated to Tier 2 live support. Reason: ${reason}. A human agent will join shortly.`,
      metadata: { escalationReason: reason }
    });

    return updated;
  },

  async submitFeedback({ customerId, conversationId, rating, comment }) {
    const sentiment = rating >= 4 ? 'positive' : (rating === 3 ? 'neutral' : 'negative');
    const feedback = await db.insert('feedback', {
      customer_id: customerId,
      conversation_id: conversationId,
      rating,
      comment,
      sentiment,
    });
    return feedback;
  }
};
