import { supabase, isOnline } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';

// Pre-seeded in-memory store for instant fallback & standalone operation
const passwordHash = bcrypt.hashSync('Password123!', 10);

const DEFAULT_BUSINESS_ID = 'b1000000-0000-0000-0000-000000000001';

const initialStore = {
  businesses: [
    {
      id: DEFAULT_BUSINESS_ID,
      name: 'Apex Cloud Solutions',
      description: 'Enterprise AI Customer Experience Platform & Infrastructure Services',
      settings: {
        ai_model: 'gemini-3.8-flash',
        auto_escalate_negative: true,
        welcome_message: 'Welcome to Apex CX Support! How can our AI assistant help you today?',
      },
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  profiles: [
    {
      id: 'p1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Elena Vance (System Admin)',
      email: 'admin@apex.com',
      password_hash: passwordHash,
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'p1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Sarah Jenkins (Senior Agent)',
      email: 'agent.sarah@apex.com',
      password_hash: passwordHash,
      role: 'support_agent',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: 'p1000000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Marcus Thorne (Tier 2 Engineer)',
      email: 'agent.marcus@apex.com',
      password_hash: passwordHash,
      role: 'support_agent',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: 'p1000000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Alex Turner (Client)',
      email: 'alex.turner@gmail.com',
      password_hash: passwordHash,
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    }
  ],
  customers: [
    {
      id: 'c1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Alex Turner',
      email: 'alex.turner@gmail.com',
      phone: '+1 (555) 234-8901',
      preferences: { preferred_channel: 'chat', interests: ['AI Copilot', 'Cloud API', 'Enterprise Scaling'], industry: 'SaaS', plan: 'Enterprise' },
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Maya Lin',
      email: 'maya.lin@technext.io',
      phone: '+1 (555) 789-0123',
      preferences: { preferred_channel: 'chat', interests: ['Omnichannel SDK', 'Ticket Automation'], industry: 'E-commerce', plan: 'Growth' },
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c1000000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Carlos Gomez',
      email: 'carlos.gomez@fintechglobal.com',
      phone: '+1 (555) 456-7890',
      preferences: { preferred_channel: 'email', interests: ['Security Compliance', 'SOC2', 'Audit Logging'], industry: 'FinTech', plan: 'Enterprise Plus' },
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c1000000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Elena Rostova',
      email: 'elena.rostova@mediavibe.de',
      phone: '+49 170 555 4321',
      preferences: { preferred_channel: 'chat', interests: ['Sentiment Analysis', 'Multilingual Chat'], industry: 'Media', plan: 'Growth' },
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'c1000000-0000-0000-0000-000000000005',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'David Kim',
      email: 'david.kim@nexusdata.org',
      phone: '+1 (555) 678-1234',
      preferences: { preferred_channel: 'chat', interests: ['Real-time Analytics', 'Webhooks'], industry: 'Data Analytics', plan: 'Starter' },
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  knowledge_articles: [
    {
      id: 'k1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'Enterprise Subscription Plans and Billing Cycles',
      content: 'Apex CX offers three primary subscription tiers: Starter ($99/month, up to 1,000 monthly active users and 5 support agents), Growth ($299/month, up to 10,000 active users, custom AI models, and 20 agent seats), and Enterprise ($899/month or custom annual contracts, unlimited seats, dedicated customer success manager, 99.99% uptime SLA, and custom LLM grounding). Billing occurs on the 1st of each calendar month. We accept major credit cards, ACH transfers, and corporate invoicing for annual contracts.',
      category: 'billing',
      published: true,
      views_count: 428,
      tags: ['billing', 'plans', 'pricing', 'enterprise', 'subscription'],
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'k1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'Refund Policy and 30-Day Money-Back Guarantee',
      content: 'We maintain a transparent 30-day money-back guarantee for all new Starter and Growth tier subscriptions. If you are not completely satisfied within the first 30 days of initial enrollment, you may request a 100% full refund through customer support or the billing dashboard with no penalty. Refunds are processed back to the original payment method within 3 to 5 business days. Enterprise annual contracts are governed by custom MSA terms and prorated service credits.',
      category: 'billing',
      published: true,
      views_count: 312,
      tags: ['refund', 'cancellation', 'money-back', 'policy'],
      created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'k1000000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'API Rate Limits, Webhooks, and Integration Architecture',
      content: 'Apex REST APIs enforce rate limits based on subscription tier: Starter allows 120 requests/minute, Growth allows 600 requests/minute, and Enterprise allows 3,000 requests/minute with custom burst allowances. API keys must be passed via the Authorization: Bearer <token> header. Webhook payloads are cryptographically signed using HMAC-SHA256 headers (x-apex-signature) for verified authenticity. Supported event triggers include ticket.created, ticket.resolved, conversation.escalated, and customer.sentiment_alert.',
      category: 'technical',
      published: true,
      views_count: 589,
      tags: ['api', 'rate-limits', 'webhooks', 'integration', 'developer'],
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'k1000000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'Security, SOC 2 Type II, and HIPAA Compliance Standards',
      content: 'Apex Cloud Solutions is certified SOC 2 Type II compliant and offers HIPAA Business Associate Agreements (BAA) for healthcare organizations. All data is encrypted in transit using TLS 1.3 and at rest with AES-256 encryption. We employ strict tenant isolation with PostgreSQL Row-Level Security (RLS). We never train public foundation models on private customer conversations without explicit opt-in.',
      category: 'compliance',
      published: true,
      views_count: 640,
      tags: ['security', 'soc2', 'hipaa', 'privacy', 'encryption'],
      created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'k1000000-0000-0000-0000-000000000005',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'Human Support Escalation and Response Time SLAs',
      content: 'If the AI Assistant cannot resolve your question or detects frustrated customer sentiment (confidence > 0.80), your session is automatically escalated to a Tier 2 Support Agent. For Enterprise plans, our first response SLA is under 15 minutes 24/7/365. For Growth plans, response SLA is within 2 hours during business hours (EST). Starter tickets receive responses within 8 business hours.',
      category: 'support',
      published: true,
      views_count: 720,
      tags: ['sla', 'escalation', 'support', 'agents', 'tickets'],
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  products: [
    {
      id: 'pr100000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Enterprise CX Suite Pro',
      description: 'All-in-one AI omnichannel platform with automated resolution, CRM sync, and dedicated agent copilot.',
      category: 'Platform',
      price: 899.00,
      currency: 'USD',
      active: true,
      features: ['Unlimited Agent Seats', 'Omnichannel Live Chat & Voice', 'Dedicated CSM', 'SOC2 / HIPAA Compliant', 'Custom LLM Fine-tuning'],
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pr100000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'AI Sentiment & Ticket Copilot',
      description: 'Autonomous sentiment classification, urgency detection, and auto-drafting replies for human agents.',
      category: 'AI Tools',
      price: 199.00,
      currency: 'USD',
      active: true,
      features: ['Real-time Sentiment Gauge', 'Auto Ticket Prioritization', 'One-Click AI Reply Generator', 'Multilingual Support (40+ langs)'],
      created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pr100000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Omnichannel Web & Mobile Chat SDK',
      description: 'High-performance drop-in React, iOS, and Android chat widgets with offline caching and streaming AI replies.',
      category: 'Developer SDK',
      price: 99.00,
      currency: 'USD',
      active: true,
      features: ['Ultra-lightweight (<25kb)', 'Dark / Light Glassmorphism UI', 'Custom Branding', 'End-to-End Encryption'],
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pr100000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Real-Time Predictive Analytics Engine',
      description: 'Machine learning dashboard forecasting customer churn, agent workloads, and CSAT bottlenecks.',
      category: 'Analytics',
      price: 249.00,
      currency: 'USD',
      active: true,
      features: ['Customer Churn Risk Warnings', 'Agent Resolution Time Telemetry', 'Export to BigQuery & Snowflake', 'Weekly Executive Briefs'],
      created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  conversations: [
    {
      id: 'cv100000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000001',
      status: 'active',
      channel: 'web_chat',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'cv100000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000002',
      status: 'escalated',
      channel: 'web_chat',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 'cv100000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000003',
      status: 'resolved',
      channel: 'web_chat',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    }
  ],
  messages: [
    {
      id: 'm1000000-0000-0000-0000-000000000001',
      conversation_id: 'cv100000-0000-0000-0000-000000000001',
      sender_type: 'customer',
      sender_id: 'c1000000-0000-0000-0000-000000000001',
      content: 'Hi! I would like to know your refund policy for annual enterprise plans and how fast the team processes it.',
      sentiment: 'neutral',
      intent: 'inquire_refund_policy',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'm1000000-0000-0000-0000-000000000002',
      conversation_id: 'cv100000-0000-0000-0000-000000000001',
      sender_type: 'ai_assistant',
      sender_id: null,
      content: 'Hello Alex! According to our official knowledge base article on Refund Policy, we provide a 30-day money-back guarantee for Starter and Growth plans with full refunds processed in 3-5 business days. For Enterprise annual plans, refund terms and prorated credits are governed by your custom Master Services Agreement (MSA). Would you like me to connect you with our billing specialist to review your specific agreement?',
      sentiment: 'positive',
      intent: 'answer_refund_policy',
      created_at: new Date(Date.now() - 2 * 86400000 + 4000).toISOString(),
    },
    {
      id: 'm1000000-0000-0000-0000-000000000003',
      conversation_id: 'cv100000-0000-0000-0000-000000000001',
      sender_type: 'customer',
      sender_id: 'c1000000-0000-0000-0000-000000000001',
      content: 'That explains it clearly, thank you so much for the quick help!',
      sentiment: 'positive',
      intent: 'customer_gratitude',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'm1000000-0000-0000-0000-000000000004',
      conversation_id: 'cv100000-0000-0000-0000-000000000002',
      sender_type: 'customer',
      sender_id: 'c1000000-0000-0000-0000-000000000002',
      content: 'Our production API webhook failed 3 times this morning and our customer orders are stuck! This is very frustrating.',
      sentiment: 'negative',
      intent: 'report_api_incident',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'm1000000-0000-0000-0000-000000000005',
      conversation_id: 'cv100000-0000-0000-0000-000000000002',
      sender_type: 'ai_assistant',
      sender_id: null,
      content: 'I sincerely apologize for the disruption to your production orders, Maya. I have detected critical urgency in your webhook deliveries and have immediately escalated this conversation to our Senior Support Engineering team. Agent Sarah Jenkins has been alerted with top priority.',
      sentiment: 'neutral',
      intent: 'escalate_support',
      created_at: new Date(Date.now() - 86400000 + 3000).toISOString(),
    }
  ],
  tickets: [
    {
      id: 't1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000002',
      assigned_agent_id: 'p1000000-0000-0000-0000-000000000002',
      subject: 'Production Webhook Dispatch Failures (HTTP 504)',
      description: 'Customer reports multiple failed webhook events for order triggers. AI sentiment detected negative frustration.',
      priority: 'urgent',
      category: 'technical',
      status: 'in_progress',
      sentiment_score: -0.85,
      ai_suggested_priority: 'urgent',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null,
    },
    {
      id: 't1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000003',
      assigned_agent_id: 'p1000000-0000-0000-0000-000000000003',
      subject: 'Request for SOC 2 Type II Audit Report & BAA Addendum',
      description: 'Customer compliance team requires latest SOC2 report and executed Business Associate Agreement for upcoming security review.',
      priority: 'medium',
      category: 'account',
      status: 'open',
      sentiment_score: 0.20,
      ai_suggested_priority: 'medium',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null,
    },
    {
      id: 't1000000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000004',
      assigned_agent_id: 'p1000000-0000-0000-0000-000000000002',
      subject: 'German Language Localization in Widget Prompts',
      description: 'Customer inquired about expanding localized German greetings and quick replies in the embedded web chat.',
      priority: 'low',
      category: 'product',
      status: 'resolved',
      sentiment_score: 0.75,
      ai_suggested_priority: 'low',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      resolved_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 't1000000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000001',
      assigned_agent_id: 'p1000000-0000-0000-0000-000000000002',
      subject: 'Enterprise Billing Tier Upgrade Consultation',
      description: 'Customer exploring annual upgrade from Growth to Enterprise Suite for Q4 scaling.',
      priority: 'high',
      category: 'billing',
      status: 'waiting_for_customer',
      sentiment_score: 0.60,
      ai_suggested_priority: 'high',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null,
    }
  ],
  ticket_messages: [
    {
      id: 'tm100000-0000-0000-0000-000000000001',
      ticket_id: 't1000000-0000-0000-0000-000000000001',
      sender_id: 'p1000000-0000-0000-0000-000000000002',
      sender_type: 'agent',
      content: 'Internal note: Checked server logs. AWS us-east-1 endpoint experienced high latency causing client timeouts. We routed traffic through backup zone.',
      is_internal: true,
      created_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    },
    {
      id: 'tm100000-0000-0000-0000-000000000002',
      ticket_id: 't1000000-0000-0000-0000-000000000001',
      sender_id: 'p1000000-0000-0000-0000-000000000002',
      sender_type: 'agent',
      content: 'Hello Maya, our infrastructure team has applied a traffic reroute to bypass the localized transit delay. All pending webhooks have been requeued with zero message loss.',
      is_internal: false,
      created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    }
  ],
  recommendations: [
    {
      id: 'rc100000-0000-0000-0000-000000000001',
      customer_id: 'c1000000-0000-0000-0000-000000000001',
      product_id: 'pr100000-0000-0000-0000-000000000001',
      reason: 'Recommended based on your interest in Enterprise Scaling and high conversational volume.',
      confidence_score: 0.94,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'rc100000-0000-0000-0000-000000000002',
      customer_id: 'c1000000-0000-0000-0000-000000000001',
      product_id: 'pr100000-0000-0000-0000-000000000002',
      reason: 'Pairs well with your existing chat deployment to automate negative sentiment prioritization.',
      confidence_score: 0.89,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'rc100000-0000-0000-0000-000000000003',
      customer_id: 'c1000000-0000-0000-0000-000000000002',
      product_id: 'pr100000-0000-0000-0000-000000000003',
      reason: 'Recommended for E-commerce mobile shoppers to deliver sub-second response times.',
      confidence_score: 0.91,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    }
  ],
  feedback: [
    {
      id: 'fb100000-0000-0000-0000-000000000001',
      customer_id: 'c1000000-0000-0000-0000-000000000001',
      conversation_id: 'cv100000-0000-0000-0000-000000000001',
      rating: 5,
      comment: 'The AI assistant answered my policy questions immediately without having to wait in a queue!',
      sentiment: 'positive',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'fb100000-0000-0000-0000-000000000002',
      customer_id: 'c1000000-0000-0000-0000-000000000003',
      conversation_id: 'cv100000-0000-0000-0000-000000000003',
      rating: 4,
      comment: 'Great compliance documentation and helpful agent follow-up.',
      sentiment: 'positive',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    }
  ],
  ai_analysis: [
    {
      id: 'an100000-0000-0000-0000-000000000001',
      message_id: 'm1000000-0000-0000-0000-000000000004',
      sentiment: 'negative',
      confidence: 0.92,
      intent: 'report_api_incident',
      keywords: ['webhook', 'failed', 'orders', 'stuck', 'frustrating'],
      escalation_recommended: true,
      escalation_reason: 'Critical production outage risk with negative customer sentiment detected.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'an100000-0000-0000-0000-000000000002',
      message_id: 'm1000000-0000-0000-0000-000000000003',
      sentiment: 'positive',
      confidence: 0.96,
      intent: 'customer_gratitude',
      keywords: ['clearly', 'thank you', 'quick help'],
      escalation_recommended: false,
      escalation_reason: null,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    }
  ]
};

// Global in-memory cache
const memoryStore = JSON.parse(JSON.stringify(initialStore));

export const db = {
  // Generic collection operations
  async findMany(table, filter = {}) {
    if (supabase && isOnline()) {
      try {
        let query = supabase.from(table).select('*');
        for (const [key, value] of Object.entries(filter)) {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        logger.warn(`Supabase findMany on ${table} fallback:`, { error: err.message });
      }
    }

    const items = memoryStore[table] || [];
    return items.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null && item[key] !== value) return false;
      }
      return true;
    });
  },

  async findOne(table, filter = {}) {
    if (supabase && isOnline()) {
      try {
        let query = supabase.from(table).select('*');
        for (const [key, value] of Object.entries(filter)) {
          query = query.eq(key, value);
        }
        const { data, error } = await query.limit(1).maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        logger.warn(`Supabase findOne on ${table} fallback:`, { error: err.message });
      }
    }

    const items = memoryStore[table] || [];
    return items.find(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (item[key] !== value) return false;
      }
      return true;
    }) || null;
  },

  async insert(table, record) {
    const newRecord = {
      id: record.id || `${table.substring(0, 2)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: record.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...record,
    };

    if (supabase && isOnline()) {
      try {
        const { data, error } = await supabase.from(table).insert([newRecord]).select().single();
        if (!error && data) {
          if (!memoryStore[table]) memoryStore[table] = [];
          memoryStore[table].push(data);
          return data;
        }
      } catch (err) {
        logger.warn(`Supabase insert on ${table} fallback:`, { error: err.message });
      }
    }

    if (!memoryStore[table]) memoryStore[table] = [];
    memoryStore[table].push(newRecord);
    return newRecord;
  },

  async update(table, id, updates) {
    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (supabase && isOnline()) {
      try {
        const { data, error } = await supabase.from(table).update(updatePayload).eq('id', id).select().single();
        if (!error && data) {
          const index = (memoryStore[table] || []).findIndex(item => item.id === id);
          if (index !== -1) memoryStore[table][index] = data;
          return data;
        }
      } catch (err) {
        logger.warn(`Supabase update on ${table} fallback:`, { error: err.message });
      }
    }

    const items = memoryStore[table] || [];
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updatePayload };
    return items[index];
  },

  async delete(table, id) {
    if (supabase) {
      try {
        await supabase.from(table).delete().eq('id', id);
      } catch (err) {
        logger.warn(`Supabase delete on ${table} fallback:`, { error: err.message });
      }
    }

    const items = memoryStore[table] || [];
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      return true;
    }
    return false;
  },

  getStore() {
    return memoryStore;
  }
};
