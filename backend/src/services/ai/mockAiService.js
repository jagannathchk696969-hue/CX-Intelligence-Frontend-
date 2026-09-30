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
    const queryLower = userQuery.toLowerCase();
    
    // Find best matching knowledge article
    let bestMatch = null;
    let maxScore = 0;

    for (const article of knowledgeArticles) {
      let score = 0;
      const titleWords = article.title.toLowerCase().split(/\s+/);
      const contentWords = article.content.toLowerCase().split(/\s+/);
      const tags = (article.tags || []).map(t => t.toLowerCase());

      for (const word of titleWords) {
        if (word.length > 3 && queryLower.includes(word)) score += 3;
      }
      for (const tag of tags) {
        if (queryLower.includes(tag)) score += 2;
      }
      for (const word of contentWords) {
        if (word.length > 4 && queryLower.includes(word)) score += 1;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = article;
      }
    }

    const customerGreeting = customer ? `Hello ${customer.name || 'there'}! ` : 'Hello! ';

    if (bestMatch && maxScore >= 2) {
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

    // Fallback when query cannot be answered confidently
    return {
      reply: `${customerGreeting}I want to provide you with verified and accurate information, but I could not find a confirmed policy or document in our knowledge base matching your specific question.\n\nTo ensure you receive the right details without any delays, would you like me to connect you directly with a Human Support Agent or open a support ticket for your account?`,
      grounded: false,
      sourceArticle: null,
      confidence: 0.45,
      escalationSuggested: true,
    };
  }
};
