-- ====================================================================
-- CX Intelligence Database Schema
-- Multi-tenant AI Customer Experience Platform
-- PostgreSQL / Supabase
-- ====================================================================

-- Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing tables if needed (careful cascading)
DROP TABLE IF EXISTS ai_analysis CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS knowledge_articles CASCADE;
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;

-- 1. BUSINESSES (Multi-tenancy tenant root)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{"ai_model": "gemini-3.8-flash", "auto_escalate_negative": true, "welcome_message": "Hello! How can I assist your customer experience today?"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PROFILES (Admins, Support Agents, and Business Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'support_agent' CHECK (role IN ('admin', 'support_agent', 'customer')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CUSTOMERS
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    preferences JSONB DEFAULT '{"preferred_channel": "chat", "interests": [], "language": "en"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_business_customer_email UNIQUE (business_id, email)
);

-- 4. CONVERSATIONS
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'escalated', 'resolved', 'closed')),
    channel VARCHAR(50) NOT NULL DEFAULT 'web_chat',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('customer', 'ai_assistant', 'support_agent', 'system')),
    sender_id UUID,
    content TEXT NOT NULL,
    sentiment VARCHAR(50) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    intent VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. TICKETS
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    assigned_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100) NOT NULL DEFAULT 'general' CHECK (category IN ('billing', 'technical', 'product', 'account', 'general')),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed')),
    sentiment_score NUMERIC(3,2),
    ai_suggested_priority VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 7. TICKET_MESSAGES
CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_type VARCHAR(50) NOT NULL DEFAULT 'agent' CHECK (sender_type IN ('agent', 'customer', 'system')),
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. KNOWLEDGE_ARTICLES
CREATE TABLE knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    published BOOLEAN NOT NULL DEFAULT true,
    views_count INTEGER NOT NULL DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    active BOOLEAN NOT NULL DEFAULT true,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. RECOMMENDATIONS
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0.85,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. FEEDBACK
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    sentiment VARCHAR(50) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. AI_ANALYSIS
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    sentiment VARCHAR(50) NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    confidence NUMERIC(3,2) NOT NULL,
    intent VARCHAR(100),
    keywords TEXT[] DEFAULT '{}',
    escalation_recommended BOOLEAN NOT NULL DEFAULT false,
    escalation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================
CREATE INDEX idx_profiles_business_id ON profiles(business_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_conversations_business_id ON conversations(business_id);
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_tickets_business_id ON tickets(business_id);
CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned_agent ON tickets(assigned_agent_id);
CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_knowledge_business_id ON knowledge_articles(business_id);
CREATE INDEX idx_knowledge_category ON knowledge_articles(category);
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_recommendations_customer_id ON recommendations(customer_id);
CREATE INDEX idx_feedback_customer_id ON feedback(customer_id);
CREATE INDEX idx_feedback_conversation_id ON feedback(conversation_id);
CREATE INDEX idx_ai_analysis_message_id ON ai_analysis(message_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Allow public/authenticated service role full access for backend application
CREATE POLICY "Allow public backend access to businesses" ON businesses FOR ALL USING (true);
CREATE POLICY "Allow public backend access to profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow public backend access to customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow public backend access to conversations" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow public backend access to messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow public backend access to tickets" ON tickets FOR ALL USING (true);
CREATE POLICY "Allow public backend access to ticket_messages" ON ticket_messages FOR ALL USING (true);
CREATE POLICY "Allow public backend access to knowledge_articles" ON knowledge_articles FOR ALL USING (true);
CREATE POLICY "Allow public backend access to products" ON products FOR ALL USING (true);
CREATE POLICY "Allow public backend access to recommendations" ON recommendations FOR ALL USING (true);
CREATE POLICY "Allow public backend access to feedback" ON feedback FOR ALL USING (true);
CREATE POLICY "Allow public backend access to ai_analysis" ON ai_analysis FOR ALL USING (true);
-- ====================================================================
-- CX Intelligence Database Seed Data
-- ====================================================================

-- 1. BUSINESS
INSERT INTO businesses (id, name, description, settings) VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'Apex Cloud Solutions',
    'Enterprise AI Customer Experience Platform & Infrastructure Services',
    '{"ai_model": "gemini-3.8-flash", "auto_escalate_negative": true, "welcome_message": "Welcome to Apex CX Support! How can our AI assistant help you today?"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. PROFILES (Admins, Support Agents, Customer)
-- Password for all seed users is 'Password123!' (hashed with bcrypt)
INSERT INTO profiles (id, business_id, full_name, email, password_hash, role, avatar_url) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Elena Vance (System Admin)',
    'admin@apex.com',
    '$2b$10$wT8hTqL/4Fh6GZ7KzL8p.e9H7e1Fqj4T9d7Y4s2D3q5v8w0y2.1e',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
),
(
    'a1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Sarah Jenkins (Senior Agent)',
    'agent.sarah@apex.com',
    '$2b$10$wT8hTqL/4Fh6GZ7KzL8p.e9H7e1Fqj4T9d7Y4s2D3q5v8w0y2.1e',
    'support_agent',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256'
),
(
    'a1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'Marcus Thorne (Tier 2 Engineer)',
    'agent.marcus@apex.com',
    '$2b$10$wT8hTqL/4Fh6GZ7KzL8p.e9H7e1Fqj4T9d7Y4s2D3q5v8w0y2.1e',
    'support_agent',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'
),
(
    'a1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'Alex Turner (Client)',
    'alex.turner@gmail.com',
    '$2b$10$wT8hTqL/4Fh6GZ7KzL8p.e9H7e1Fqj4T9d7Y4s2D3q5v8w0y2.1e',
    'customer',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256'
) ON CONFLICT (id) DO NOTHING;

-- 3. CUSTOMERS
INSERT INTO customers (id, business_id, name, email, phone, preferences) VALUES
(
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Alex Turner',
    'alex.turner@gmail.com',
    '+1 (555) 234-8901',
    '{"preferred_channel": "chat", "interests": ["AI Copilot", "Cloud API", "Enterprise Scaling"], "industry": "SaaS", "plan": "Enterprise"}'::jsonb
),
(
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Maya Lin',
    'maya.lin@technext.io',
    '+1 (555) 789-0123',
    '{"preferred_channel": "chat", "interests": ["Omnichannel SDK", "Ticket Automation"], "industry": "E-commerce", "plan": "Growth"}'::jsonb
),
(
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'Carlos Gomez',
    'carlos.gomez@fintechglobal.com',
    '+1 (555) 456-7890',
    '{"preferred_channel": "email", "interests": ["Security Compliance", "SOC2", "Audit Logging"], "industry": "FinTech", "plan": "Enterprise Plus"}'::jsonb
),
(
    'c1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'Elena Rostova',
    'elena.rostova@mediavibe.de',
    '+49 170 555 4321',
    '{"preferred_channel": "chat", "interests": ["Sentiment Analysis", "Multilingual Chat"], "industry": "Media", "plan": "Growth"}'::jsonb
),
(
    'c1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000001',
    'David Kim',
    'david.kim@nexusdata.org',
    '+1 (555) 678-1234',
    '{"preferred_channel": "chat", "interests": ["Real-time Analytics", "Webhooks"], "industry": "Data Analytics", "plan": "Starter"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 4. KNOWLEDGE ARTICLES (Grounded Truth for AI)
INSERT INTO knowledge_articles (id, business_id, title, content, category, published, views_count, tags) VALUES
(
    'd1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Enterprise Subscription Plans and Billing Cycles',
    'Apex CX offers three primary subscription tiers: Starter ($99/month, up to 1,000 monthly active users and 5 support agents), Growth ($299/month, up to 10,000 active users, custom AI models, and 20 agent seats), and Enterprise ($899/month or custom annual contracts, unlimited seats, dedicated customer success manager, 99.99% uptime SLA, and custom LLM grounding). Billing occurs on the 1st of each calendar month. We accept major credit cards, ACH transfers, and corporate invoicing for annual contracts.',
    'billing',
    true,
    428,
    ARRAY['billing', 'plans', 'pricing', 'enterprise', 'subscription']
),
(
    'd1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Refund Policy and 30-Day Money-Back Guarantee',
    'We maintain a transparent 30-day money-back guarantee for all new Starter and Growth tier subscriptions. If you are not completely satisfied within the first 30 days of initial enrollment, you may request a 100% full refund through customer support or the billing dashboard with no penalty. Refunds are processed back to the original payment method within 3 to 5 business days. Enterprise annual contracts are governed by custom MSA terms and prorated service credits.',
    'billing',
    true,
    312,
    ARRAY['refund', 'cancellation', 'money-back', 'policy']
),
(
    'd1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'API Rate Limits, Webhooks, and Integration Architecture',
    'Apex REST APIs enforce rate limits based on subscription tier: Starter allows 120 requests/minute, Growth allows 600 requests/minute, and Enterprise allows 3,000 requests/minute with custom burst allowances. API keys must be passed via the Authorization: Bearer <token> header. Webhook payloads are cryptographically signed using HMAC-SHA256 headers (x-apex-signature) for verified authenticity. Supported event triggers include ticket.created, ticket.resolved, conversation.escalated, and customer.sentiment_alert.',
    'technical',
    true,
    589,
    ARRAY['api', 'rate-limits', 'webhooks', 'integration', 'developer']
),
(
    'd1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'Security, SOC 2 Type II, and HIPAA Compliance',
    'Apex Cloud Solutions is certified SOC 2 Type II compliant and offers HIPAA Business Associate Agreements (BAA) for healthcare organizations. All data is encrypted in transit using TLS 1.3 and at rest with AES-256 encryption. We employ strict tenant isolation with PostgreSQL Row-Level Security (RLS). We never train public foundation models on private customer conversations without explicit opt-in.',
    'compliance',
    true,
    640,
    ARRAY['security', 'soc2', 'hipaa', 'privacy', 'encryption']
),
(
    'd1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000001',
    'Human Support Escalation and Response Time SLAs',
    'If the AI Assistant cannot resolve your question or detects frustrated customer sentiment (confidence > 0.80), your session is automatically escalated to a Tier 2 Support Agent. For Enterprise plans, our first response SLA is under 15 minutes 24/7/365. For Growth plans, response SLA is within 2 hours during business hours (EST). Starter tickets receive responses within 8 business hours.',
    'support',
    true,
    720,
    ARRAY['sla', 'escalation', 'support', 'agents', 'tickets']
) ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCTS / SERVICES
INSERT INTO products (id, business_id, name, description, category, price, currency, active, features) VALUES
(
    'e1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Enterprise CX Suite Pro',
    'All-in-one AI omnichannel platform with automated resolution, CRM sync, and dedicated agent copilot.',
    'Platform',
    899.00,
    'USD',
    true,
    '["Unlimited Agent Seats", "Omnichannel Live Chat & Voice", "Dedicated CSM", "SOC2 / HIPAA Compliant", "Custom LLM Fine-tuning"]'::jsonb
),
(
    'e1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'AI Sentiment & Ticket Copilot',
    'Autonomous sentiment classification, urgency detection, and auto-drafting replies for human agents.',
    'AI Tools',
    199.00,
    'USD',
    true,
    '["Real-time Sentiment Gauge", "Auto Ticket Prioritization", "One-Click AI Reply Generator", "Multilingual Support (40+ langs)"]'::jsonb
),
(
    'e1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'Omnichannel Web & Mobile Chat SDK',
    'High-performance drop-in React, iOS, and Android chat widgets with offline caching and streaming AI replies.',
    'Developer SDK',
    99.00,
    'USD',
    true,
    '["Ultra-lightweight (<25kb)", "Dark / Light Glassmorphism UI", "Custom Branding", "End-to-End Encryption"]'::jsonb
),
(
    'e1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'Real-Time Predictive Analytics Engine',
    'Machine learning dashboard forecasting customer churn, agent workloads, and CSAT bottlenecks.',
    'Analytics',
    249.00,
    'USD',
    true,
    '["Customer Churn Risk Warnings", "Agent Resolution Time Telemetry", "Export to BigQuery & Snowflake", "Weekly Executive Briefs"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 6. CONVERSATIONS & MESSAGES
INSERT INTO conversations (id, business_id, customer_id, status, channel, created_at, updated_at) VALUES
(
    '11000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'active',
    'web_chat',
    now() - INTERVAL '2 days',
    now() - INTERVAL '1 hour'
),
(
    '11000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'escalated',
    'web_chat',
    now() - INTERVAL '1 day',
    now() - INTERVAL '3 hours'
),
(
    '11000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000003',
    'resolved',
    'web_chat',
    now() - INTERVAL '4 days',
    now() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_type, content, sentiment, intent, created_at) VALUES
(
    '21000000-0000-0000-0000-000000000001',
    '11000000-0000-0000-0000-000000000001',
    'customer',
    'Hi! I would like to know your refund policy for annual enterprise plans and how fast the team processes it.',
    'neutral',
    'inquire_refund_policy',
    now() - INTERVAL '2 days'
),
(
    '21000000-0000-0000-0000-000000000002',
    '11000000-0000-0000-0000-000000000001',
    'ai_assistant',
    'Hello Alex! According to our official knowledge base article on Refund Policy, we provide a 30-day money-back guarantee for Starter and Growth plans with full refunds processed in 3-5 business days. For Enterprise annual plans, refund terms and prorated credits are governed by your custom Master Services Agreement (MSA). Would you like me to connect you with our billing specialist to review your specific agreement?',
    'positive',
    'answer_refund_policy',
    now() - INTERVAL '2 days' + INTERVAL '3 seconds'
),
(
    '21000000-0000-0000-0000-000000000003',
    '11000000-0000-0000-0000-000000000001',
    'customer',
    'That explains it clearly, thank you so much for the quick help!',
    'positive',
    'customer_gratitude',
    now() - INTERVAL '1 hour'
),
(
    '21000000-0000-0000-0000-000000000004',
    '11000000-0000-0000-0000-000000000002',
    'customer',
    'Our production API webhook failed 3 times this morning and our customer orders are stuck! This is very frustrating.',
    'negative',
    'report_api_incident',
    now() - INTERVAL '1 day'
),
(
    '21000000-0000-0000-0000-000000000005',
    '11000000-0000-0000-0000-000000000002',
    'ai_assistant',
    'I sincerely apologize for the disruption to your production orders, Maya. I have detected critical urgency in your webhook deliveries and have immediately escalated this conversation to our Senior Support Engineering team. Agent Sarah Jenkins has been alerted with top priority.',
    'neutral',
    'escalate_support',
    now() - INTERVAL '1 day' + INTERVAL '4 seconds'
) ON CONFLICT (id) DO NOTHING;

-- 7. TICKETS & TICKET MESSAGES
INSERT INTO tickets (id, business_id, customer_id, assigned_agent_id, subject, description, priority, category, status, sentiment_score, ai_suggested_priority, created_at, resolved_at) VALUES
(
    'f1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    'Production Webhook Dispatch Failures (HTTP 504)',
    'Customer reports multiple failed webhook events for order triggers. AI sentiment detected negative frustration.',
    'urgent',
    'technical',
    'in_progress',
    -0.85,
    'urgent',
    now() - INTERVAL '1 day',
    NULL
),
(
    'f1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000003',
    'Request for SOC 2 Type II Audit Report & BAA Addendum',
    'Customer compliance team requires latest SOC2 report and executed Business Associate Agreement for upcoming security review.',
    'medium',
    'account',
    'open',
    0.20,
    'medium',
    now() - INTERVAL '2 days',
    NULL
),
(
    'f1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000002',
    'German Language Localization in Widget Prompts',
    'Customer inquired about expanding localized German greetings and quick replies in the embedded web chat.',
    'low',
    'product',
    'resolved',
    0.75,
    'low',
    now() - INTERVAL '5 days',
    now() - INTERVAL '3 days'
),
(
    'f1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'Enterprise Billing Tier Upgrade Consultation',
    'Customer exploring annual upgrade from Growth to Enterprise Suite for Q4 scaling.',
    'high',
    'billing',
    'waiting_for_customer',
    0.60,
    'high',
    now() - INTERVAL '3 days',
    NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_type, content, is_internal, created_at) VALUES
(
    '31000000-0000-0000-0000-000000000001',
    'f1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'agent',
    'Internal note: Checked server logs. AWS us-east-1 endpoint experienced high latency causing client timeouts. We routed traffic through backup zone.',
    true,
    now() - INTERVAL '20 hours'
),
(
    '31000000-0000-0000-0000-000000000002',
    'f1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    'agent',
    'Hello Maya, our infrastructure team has applied a traffic reroute to bypass the localized transit delay. All pending webhooks have been requeued with zero message loss.',
    false,
    now() - INTERVAL '18 hours'
) ON CONFLICT (id) DO NOTHING;

-- 8. RECOMMENDATIONS
INSERT INTO recommendations (id, customer_id, product_id, reason, confidence_score, created_at) VALUES
(
    '41000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    'Recommended based on your interest in Enterprise Scaling and high conversational volume.',
    0.94,
    now() - INTERVAL '1 day'
),
(
    '41000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000002',
    'Pairs well with your existing chat deployment to automate negative sentiment prioritization.',
    0.89,
    now() - INTERVAL '1 day'
),
(
    '41000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000003',
    'Recommended for E-commerce mobile shoppers to deliver sub-second response times.',
    0.91,
    now() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- 9. FEEDBACK
INSERT INTO feedback (id, customer_id, conversation_id, rating, comment, sentiment, created_at) VALUES
(
    '51000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    '11000000-0000-0000-0000-000000000001',
    5,
    'The AI assistant answered my policy questions immediately without having to wait in a queue!',
    'positive',
    now() - INTERVAL '1 day'
),
(
    '51000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003',
    '11000000-0000-0000-0000-000000000003',
    4,
    'Great compliance documentation and helpful agent follow-up.',
    'positive',
    now() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

-- 10. AI_ANALYSIS
INSERT INTO ai_analysis (id, message_id, sentiment, confidence, intent, keywords, escalation_recommended, escalation_reason, created_at) VALUES
(
    '61000000-0000-0000-0000-000000000001',
    '21000000-0000-0000-0000-000000000004',
    'negative',
    0.92,
    'report_api_incident',
    ARRAY['webhook', 'failed', 'orders', 'stuck', 'frustrating'],
    true,
    'Critical production outage risk with negative customer sentiment detected.',
    now() - INTERVAL '1 day'
),
(
    '61000000-0000-0000-0000-000000000002',
    '21000000-0000-0000-0000-000000000003',
    'positive',
    0.96,
    'customer_gratitude',
    ARRAY['clearly', 'thank you', 'quick help'],
    false,
    NULL,
    now() - INTERVAL '1 hour'
) ON CONFLICT (id) DO NOTHING;
