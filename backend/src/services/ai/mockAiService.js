export const mockAiService = {
  analyzeSentiment(text) {
    const lower = text.toLowerCase();
    
    const negativeKeywords = ['broken', 'fail', 'failed', 'error', 'frustrat', 'angry', 'terrible', 'worst', 'stuck', 'slow', 'urgent', 'cancel', 'refund', 'horrible', 'bug', 'down'];
    const positiveKeywords = ['great', 'excellent', 'love', 'helpful', 'fast', 'thank', 'thanks', 'awesome', 'good', 'perfect', 'resolved', 'appreciate', 'clean'];

    const foundNegative = negativeKeywords.filter(k => lower.includes(k));
    const foundPositive = positiveKeywords.filter(k => lower.includes(k));

    let sentiment = 'neutral';
    let confidence = 0.85;
    let escalationRecommended = false;
    let escalationReason = null;

    if (foundNegative.length > foundPositive.length) {
      sentiment = 'negative';
      confidence = Math.min(0.98, 0.75 + (foundNegative.length * 0.08));
      if (foundNegative.length >= 2 || lower.includes('urgent') || lower.includes('broken') || lower.includes('cancel')) {
        escalationRecommended = true;
        escalationReason = `Negative customer sentiment detected with critical keywords: ${foundNegative.join(', ')}`;
      }
    } else if (foundPositive.length > foundNegative.length) {
      sentiment = 'positive';
      confidence = Math.min(0.98, 0.80 + (foundPositive.length * 0.06));
    }

    // Detect Intent
    let intent = 'general_inquiry';
    if (lower.includes('refund') || lower.includes('cancel') || lower.includes('money')) intent = 'refund_request';
    else if (lower.includes('pricing') || lower.includes('plan') || lower.includes('cost') || lower.includes('subscription')) intent = 'pricing_inquiry';
    else if (lower.includes('error') || lower.includes('fail') || lower.includes('bug') || lower.includes('api')) intent = 'technical_issue';
    else if (lower.includes('security') || lower.includes('soc2') || lower.includes('hipaa')) intent = 'compliance_inquiry';
    else if (lower.includes('speak to agent') || lower.includes('human') || lower.includes('support')) intent = 'escalation_request';

    return {
      sentiment,
      confidence: parseFloat(confidence.toFixed(2)),
      intent,
      keywords: [...foundNegative, ...foundPositive].slice(0, 5),
      escalationRecommended,
      escalationReason,
    };
  },

  generateGroundedResponse(userQuery, knowledgeArticles = [], customer = null) {
    const queryLower = userQuery.toLowerCase().trim();
    const customerGreeting = customer ? `Hello ${customer.name || 'there'}! ` : 'Hello! ';

    // 1. Check for common conversational intents & greetings
    if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening)|howdy)\b/i.test(queryLower)) {
      return {
        reply: `${customerGreeting}I'm your **CX Intelligence Copilot**, an AI-powered assistant designed to assist you with anything regarding our Customer Experience platform.\n\nI can help you with:\n- 📋 **Support Tickets**: Checking status or escalating to human specialists\n- 💳 **Billing & Plans**: Subscriptions, upgrades, and refund policies\n- 🔒 **Security & Compliance**: SOC 2 Type II, HIPAA, and data protection\n- ⚙️ **Integrations**: Webhooks, REST APIs, and event streaming\n- ⏱️ **SLA Guarantees**: Enterprise response guarantees and escalation paths\n\nHow can I help you today?`,
        grounded: true,
        sourceArticle: null,
        confidence: 0.98,
        escalationSuggested: false,
      };
    }

    if (/what (can you do|is this|are you)|features|capabilities|about (this|the) (app|platform)|cx intelligence/i.test(queryLower)) {
      return {
        reply: `${customerGreeting}**CX Intelligence** is our enterprise AI-driven Customer Experience platform.\n\nKey features include:\n1. **Omnichannel AI Support**: Instant, accurate resolutions grounded in business policies.\n2. **Real-Time Sentiment Intelligence**: Automatic emotion tracking and proactive escalation.\n3. **Intelligent Ticketing**: Automated priority routing, SLA tracking, and resolution lifecycle.\n4. **Executive CX Analytics**: Deep visibility into CSAT, resolution times, and customer satisfaction.\n5. **Personalized Recommendations**: Context-aware product addons and enterprise solutions.\n\nFeel free to ask any specific question about our services, plans, or technical configuration!`,
        grounded: true,
        sourceArticle: null,
        confidence: 0.95,
        escalationSuggested: false,
      };
    }

    if (queryLower.includes('human') || queryLower.includes('agent') || queryLower.includes('representative') || queryLower.includes('speak to someone') || queryLower.includes('talk to someone')) {
      return {
        reply: `${customerGreeting}I'd be glad to connect you with our human support team. For Enterprise plans, our average first response time is under 15 minutes, and for Growth plans within 2 hours.\n\nYou can click the **Escalate to Agent** button in the chat header or let me know, and I'll immediately route your session to a Tier 2 specialist.`,
        grounded: true,
        sourceArticle: null,
        confidence: 0.95,
        escalationSuggested: true,
      };
    }

    // 2. Find best matching knowledge article with stopword filtering
    const stopWords = new Set([
      'customer', 'experience', 'support', 'service', 'platform', 'about',
      'which', 'their', 'there', 'would', 'could', 'should', 'offers', 'other',
      'where', 'after', 'before', 'these', 'those', 'with', 'from', 'have',
      'this', 'that', 'your', 'please', 'tell'
    ]);

    let bestMatch = null;
    let maxScore = 0;

    for (const article of knowledgeArticles) {
      let score = 0;
      const titleWords = article.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => !stopWords.has(w) && w.length > 3);
      const tags = (article.tags || []).map(t => t.toLowerCase()).filter(t => !stopWords.has(t));
      const contentWords = article.content.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => !stopWords.has(w) && w.length > 4);

      for (const word of titleWords) {
        if (queryLower.includes(word)) score += 4;
      }
      for (const tag of tags) {
        if (queryLower.includes(tag)) score += 3;
      }
      for (const word of contentWords) {
        if (queryLower.includes(word)) score += 1;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = article;
      }
    }

    if (bestMatch && maxScore >= 4) {
      return {
        reply: `${customerGreeting}According to our official business knowledge base article ("${bestMatch.title}"):\n\n${bestMatch.content}\n\nIs there anything specific you would like more assistance with?`,
        grounded: true,
        sourceArticle: {
          id: bestMatch.id,
          title: bestMatch.title,
          category: bestMatch.category,
        },
        confidence: 0.95,
        escalationSuggested: false,
      };
    }

    // 3. Problem statement guided response for general inquiries
    return {
      reply: `${customerGreeting}Thank you for reaching out to the CX Intelligence support team.\n\nRegarding your inquiry: "${userQuery}", our platform provides end-to-end customer experience management, automated resolution, and integrated ticketing.\n\nTo give you the most accurate answer:\n- You can browse our **Knowledge Base** for detailed documentation on billing, webhooks, security, and SLAs.\n- You can open a **Support Ticket** with full diagnostic logs from the Tickets portal.\n- Or, if you'd like immediate assistance, click **Escalate to Agent** to speak directly with a customer experience specialist.`,
      grounded: false,
      sourceArticle: null,
      confidence: 0.85,
      escalationSuggested: false,
    };
  }
};
