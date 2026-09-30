import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { mockAiService } from './mockAiService.js';

let cachedClient = null;
let cachedKey = null;

// Dynamic resolution of Gemini API Key from process environment or disk .env files
function resolveGeminiApiKey() {
  // 1. Check all standard environment variable names
  const envCandidates = [
    process.env.GEMINI_API_KEY,
    process.env.gemini_ai_api,
    process.env.GEMINI_AI_API,
    process.env.GEMINI_AI_API_KEY,
    process.env.GOOGLE_GENAI_API_KEY,
    process.env.GOOGLE_API_KEY,
    config.ai.geminiApiKey,
  ];

  for (const candidate of envCandidates) {
    if (candidate && typeof candidate === 'string' && candidate.trim().length > 10) {
      return candidate.trim();
    }
  }

  // 2. Check disk .env files directly (hot-reload without server restart)
  const envFilePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'backend/.env'),
    path.resolve(process.cwd(), '../backend/.env'),
    path.resolve(process.cwd(), '../../backend/.env'),
  ];

  for (const envPath of envFilePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const fileContent = fs.readFileSync(envPath, 'utf8');
        const match = fileContent.match(
          /^[ \t]*(?:GEMINI_API_KEY|gemini_ai_api|GEMINI_AI_API|GEMINI_AI_API_KEY|GOOGLE_API_KEY|GOOGLE_GENAI_API_KEY)[ \t]*=[ \t]*([^\r\n#]+)/im
        );
        if (match && match[1]) {
          const extractedKey = match[1].trim().replace(/^['"]|['"]$/g, '');
          if (extractedKey && extractedKey.length > 10 && !extractedKey.includes('=')) {
            // Also update process.env so other modules can use it
            process.env.GEMINI_API_KEY = extractedKey;
            return extractedKey;
          }
        }
      }
    } catch {
      // ignore file read errors
    }
  }

  return null;
}

const getGenAIClient = () => {
  const currentKey = resolveGeminiApiKey();

  if (!currentKey) {
    return null;
  }

  if (!cachedClient || cachedKey !== currentKey) {
    try {
      cachedClient = new GoogleGenAI({ apiKey: currentKey });
      cachedKey = currentKey;
      logger.info(`[AI Service] Successfully initialized Google GenAI client (Key: ${currentKey.slice(0, 6)}...${currentKey.slice(-4)})`);
    } catch (err) {
      logger.warn('[AI Service] Failed to initialize Google GenAI:', { error: err.message });
      return null;
    }
  }

  return cachedClient;
};

// Map unsupported or alias model names to valid Google Gemini models
function getValidModelName() {
  const rawModel = config.ai.modelName || process.env.AI_MODEL_NAME || 'gemini-2.5-flash';
  if (rawModel === 'gemini-3.8-flash' || rawModel.startsWith('gemini-3')) {
    return 'gemini-2.5-flash';
  }
  return rawModel;
}

export const aiService = {
  isConfigured() {
    return !!resolveGeminiApiKey();
  },

  async analyzeSentiment(text) {
    const client = getGenAIClient();
    if (config.ai.mockMode || !client) {
      return mockAiService.analyzeSentiment(text);
    }

    try {
      const prompt = `You are an expert customer sentiment and intent analyzer for an enterprise Customer Experience (CX) platform.
Analyze the following customer message carefully:
"${text}"

Return STRICT JSON only, matching this exact schema:
{
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": number between 0.0 and 1.0,
  "intent": "string descriptor of user goal (e.g. general_inquiry, billing_inquiry, refund_request, technical_issue, escalation_request, feature_request)",
  "keywords": ["array", "of", "key", "terms"],
  "escalationRecommended": boolean,
  "escalationReason": "string explanation if escalation recommended or null"
}`;

      const model = getValidModelName();
      const response = await client.models.generateContent({
        model,
        contents: prompt,
      });

      const responseText = response.text?.trim() || '';
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      logger.warn('[AI Service] Gemini sentiment call failed, using mock fallback:', { error: err.message });
      return mockAiService.analyzeSentiment(text);
    }
  },

  async generateChatbotResponse({ message, history = [], knowledgeArticles = [], customer = null }) {
    const client = getGenAIClient();
    // If mock mode explicitly set or no Gemini key found, use local grounded engine
    if (config.ai.mockMode || !client) {
      return mockAiService.generateGroundedResponse(message, knowledgeArticles, customer);
    }

    try {
      const articlesContext = knowledgeArticles
        .map(a => `[Article ID: ${a.id}]\nTitle: "${a.title}"\nCategory: ${a.category}\nContent: ${a.content}`)
        .join('\n\n---\n\n');

      const systemInstruction = `You are CX Intelligence Copilot, the official enterprise AI customer support specialist for the CX Intelligence Platform.

MISSION & APPLICATION PROBLEM STATEMENT:
CX Intelligence is a state-of-the-art Customer Experience Platform providing omnichannel support, real-time sentiment tracking, anti-hallucination knowledge grounding, intelligent ticketing, and proactive escalation.
Your mission is to assist customers and platform users with any question they ask warmly, accurately, and professionally.

CORE INSTRUCTIONS:
1. GROUNDING & ACCURACY:
   - When asked about company policies, subscriptions, pricing, refunds, webhooks, rate limits, SOC 2/HIPAA compliance, or SLA terms, refer directly to the APPROVED BUSINESS KNOWLEDGE BASE below.
   - Mention the title of the article (e.g. "According to our official [Title] policy...") to ensure transparency and trustworthiness.
2. COMPREHENSIVE PROBLEM RESOLUTION:
   - For general inquiries, platform features, how-to guides, troubleshooting, and customer service requests, provide complete, helpful, step-by-step answers.
   - NEVER provide abrupt refusals or claim you cannot assist unless the request is completely off-topic or harmful.
3. EMPATHY & ESCALATION:
   - If a customer is frustrated, reporting a production blocker, or explicitly asking for a human representative, empathetically acknowledge their issue and recommend escalating to a Tier 2 Human Support Specialist.
4. FORMATTING & STYLE:
   - Use clean, structured Markdown (bullet points, bold key terms, numbered steps).
   - Address the customer warmly by name if provided.

APPROVED BUSINESS KNOWLEDGE BASE:
${articlesContext || 'Standard enterprise platform guidelines apply.'}`;

      // Build conversation contents including history
      const formattedContents = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const h of history.slice(-6)) {
          const role = (h.sender_type === 'customer' || h.role === 'user') ? 'user' : 'model';
          formattedContents.push({
            role,
            parts: [{ text: h.content || '' }]
          });
        }
      }

      // Add current message
      const customerName = customer?.name || 'Valued Customer';
      formattedContents.push({
        role: 'user',
        parts: [{ text: `[Customer: ${customerName}]\n${message}` }]
      });

      const model = getValidModelName();
      const response = await client.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });

      const replyText = response.text || '';

      // Check if grounded in a knowledge article
      const citedArticle = knowledgeArticles.find(a => 
        replyText.toLowerCase().includes(a.title.toLowerCase()) || 
        a.title.toLowerCase().split(/\s+/).filter(w => w.length > 4).every(w => replyText.toLowerCase().includes(w))
      ) || null;

      const escalationSuggested = 
        replyText.toLowerCase().includes('escalat') || 
        replyText.toLowerCase().includes('tier 2') || 
        replyText.toLowerCase().includes('human agent') ||
        replyText.toLowerCase().includes('support specialist');

      return {
        reply: replyText,
        grounded: !!citedArticle,
        sourceArticle: citedArticle ? { id: citedArticle.id, title: citedArticle.title, category: citedArticle.category } : null,
        confidence: citedArticle ? 0.98 : 0.92,
        escalationSuggested,
      };
    } catch (err) {
      logger.warn('[AI Service] Gemini chat call failed, using mock fallback:', { error: err.message });
      return mockAiService.generateGroundedResponse(message, knowledgeArticles, customer);
    }
  }
};
