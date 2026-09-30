import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

const DEFAULT_BUSINESS_ID = 'b1000000-0000-0000-0000-000000000001';
const passwordHash = bcrypt.hashSync('Password123!', 10);

async function seed() {
  console.log('----------------------------------------------------');
  console.log('Seeding Live Supabase Cloud Database...');
  console.log('----------------------------------------------------');

  // 1. Business
  console.log('1. Inserting Business...');
  const { error: errBiz } = await supabase.from('businesses').upsert([{
    id: DEFAULT_BUSINESS_ID,
    name: 'Apex Cloud Solutions',
    description: 'Enterprise AI Customer Experience Platform & Infrastructure Services',
    settings: {
      ai_model: 'gemini-3.8-flash',
      auto_escalate_negative: true,
      welcome_message: 'Welcome to Apex CX Support! How can our AI assistant help you today?',
    }
  }]);
  if (errBiz) console.error('Error seeding businesses:', errBiz.message);

  // 2. Profiles
  console.log('2. Inserting Profiles...');
  const profiles = [
    {
      id: 'a1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Elena Vance (System Admin)',
      email: 'admin@apex.com',
      password_hash: passwordHash,
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'a1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Sarah Jenkins (Senior Agent)',
      email: 'agent.sarah@apex.com',
      password_hash: passwordHash,
      role: 'support_agent',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'a1000000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Marcus Thorne (Tier 2 Engineer)',
      email: 'agent.marcus@apex.com',
      password_hash: passwordHash,
      role: 'support_agent',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'a1000000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      full_name: 'Alex Turner (Client)',
      email: 'alex.turner@gmail.com',
      password_hash: passwordHash,
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    }
  ];
  const { error: errProf } = await supabase.from('profiles').upsert(profiles);
  if (errProf) console.error('Error seeding profiles:', errProf.message);

  // 3. Customers
  console.log('3. Inserting Customers...');
  const customers = [
    {
      id: 'c1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Alex Turner',
      email: 'alex.turner@gmail.com',
      phone: '+1 (555) 234-8901',
      preferences: { preferred_channel: 'chat', interests: ['AI Copilot', 'Cloud API', 'Enterprise Scaling'], industry: 'SaaS', plan: 'Enterprise' },
    },
    {
      id: 'c1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Maya Lin',
      email: 'maya.lin@technext.io',
      phone: '+1 (555) 789-0123',
      preferences: { preferred_channel: 'chat', interests: ['Omnichannel SDK', 'Ticket Automation'], industry: 'E-commerce', plan: 'Growth' },
    },
    {
      id: 'c1000000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Carlos Gomez',
      email: 'carlos.gomez@fintechglobal.com',
      phone: '+1 (555) 456-7890',
      preferences: { preferred_channel: 'email', interests: ['Security Compliance', 'SOC2', 'Audit Logging'], industry: 'FinTech', plan: 'Enterprise Plus' },
    },
    {
      id: 'c1000000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Elena Rostova',
      email: 'elena.rostova@mediavibe.de',
      phone: '+49 170 555 4321',
      preferences: { preferred_channel: 'chat', interests: ['Sentiment Analysis', 'Multilingual Chat'], industry: 'Media', plan: 'Growth' },
    },
    {
      id: 'c1000000-0000-0000-0000-000000000005',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'David Kim',
      email: 'david.kim@nexusdata.org',
      phone: '+1 (555) 678-1234',
      preferences: { preferred_channel: 'chat', interests: ['Real-time Analytics', 'Webhooks'], industry: 'Data Analytics', plan: 'Starter' },
    }
  ];
  const { error: errCust } = await supabase.from('customers').upsert(customers);
  if (errCust) console.error('Error seeding customers:', errCust.message);

  // 4. Knowledge Articles
  console.log('4. Inserting Knowledge Articles...');
  const articles = [
    {
      id: 'd1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'Enterprise Subscription Plans and Billing Cycles',
      content: 'Apex CX offers three primary subscription tiers: Starter ($99/month, up to 1,000 monthly active users and 5 support agents), Growth ($299/month, up to 10,000 active users, custom AI models, and 20 agent seats), and Enterprise ($899/month or custom annual contracts, unlimited seats, dedicated customer success manager, 99.99% uptime SLA, and custom LLM grounding). Billing occurs on the 1st of each calendar month. We accept major credit cards, ACH transfers, and corporate invoicing for annual contracts.',
      category: 'billing',
      published: true,
      views_count: 428,
      tags: ['billing', 'plans', 'pricing', 'enterprise', 'subscription'],
    },
    {
      id: 'd1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'Refund Policy and 30-Day Money-Back Guarantee',
      content: 'We maintain a transparent 30-day money-back guarantee for all new Starter and Growth tier subscriptions. If you are not completely satisfied within the first 30 days of initial enrollment, you may request a 100% full refund through customer support or the billing dashboard with no penalty. Refunds are processed back to the original payment method within 3 to 5 business days. Enterprise annual contracts are governed by custom MSA terms and prorated service credits.',
      category: 'billing',
      published: true,
      views_count: 312,
      tags: ['refund', 'cancellation', 'money-back', 'policy'],
    },
    {
      id: 'd1000000-0000-0000-0000-000000000003',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'API Rate Limits, Webhooks, and Integration Architecture',
      content: 'Apex REST APIs enforce rate limits based on subscription tier: Starter allows 120 requests/minute, Growth allows 600 requests/minute, and Enterprise allows 3,000 requests/minute with custom burst allowances. API keys must be passed via the Authorization: Bearer <token> header. Webhook payloads are cryptographically signed using HMAC-SHA256 headers (x-apex-signature) for verified authenticity. Supported event triggers include ticket.created, ticket.resolved, conversation.escalated, and customer.sentiment_alert.',
      category: 'technical',
      published: true,
      views_count: 589,
      tags: ['api', 'rate-limits', 'webhooks', 'integration', 'developer'],
    },
    {
      id: 'd1000000-0000-0000-0000-000000000004',
      business_id: DEFAULT_BUSINESS_ID,
      title: 'Security, SOC 2 Type II, and HIPAA Compliance Standards',
      content: 'Apex Cloud Solutions is certified SOC 2 Type II compliant and offers HIPAA Business Associate Agreements (BAA) for healthcare organizations. All data is encrypted in transit using TLS 1.3 and at rest with AES-256 encryption. We employ strict tenant isolation with PostgreSQL Row-Level Security (RLS). We never train public foundation models on private customer conversations without explicit opt-in.',
      category: 'security',
      published: true,
      views_count: 275,
      tags: ['security', 'compliance', 'soc2', 'hipaa', 'gdpr', 'privacy'],
    }
  ];
  const { error: errArt } = await supabase.from('knowledge_articles').upsert(articles);
  if (errArt) console.error('Error seeding knowledge articles:', errArt.message);

  // 5. Products
  console.log('5. Inserting Products...');
  const products = [
    {
      id: 'prod_10000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Omnichannel CX Suite',
      description: 'Unified ticketing and conversation routing across email, webchat, SMS, and WhatsApp.',
      category: 'software',
      price: 299.00,
      currency: 'USD',
      active: true,
      features: ['Unified Inbox', 'SLA Automation', 'Custom Workflows'],
    },
    {
      id: 'prod_10000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      name: 'Grounded AI Copilot',
      description: 'Autonomous support agent fine-tuned on custom knowledge bases with instant auto-resolution.',
      category: 'ai_services',
      price: 499.00,
      currency: 'USD',
      active: true,
      features: ['95%+ Grounding Accuracy', 'Real-Time Sentiment Monitoring', 'Automated Human Escalation'],
    }
  ];
  const { error: errProd } = await supabase.from('products').upsert(products);
  if (errProd) console.error('Error seeding products:', errProd.message);

  // 6. Tickets
  console.log('6. Inserting Initial Tickets...');
  const tickets = [
    {
      id: 'f1000000-0000-0000-0000-000000000001',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000001',
      assigned_agent_id: 'a1000000-0000-0000-0000-000000000002',
      subject: 'SSO SAML Integration 403 Forbidden Error',
      description: 'Customer reports that Okta SSO identity provider returns 403 when redirecting to production dashboard.',
      priority: 'high',
      category: 'technical',
      status: 'in_progress',
      sentiment_score: 0.28,
      ai_suggested_priority: 'urgent',
    },
    {
      id: 'f1000000-0000-0000-0000-000000000002',
      business_id: DEFAULT_BUSINESS_ID,
      customer_id: 'c1000000-0000-0000-0000-000000000002',
      assigned_agent_id: 'a1000000-0000-0000-0000-000000000003',
      subject: 'Invoice Overcharge on Custom Enterprise Tiers',
      description: 'Annual commitment discount was not reflected on invoice INV-2026-089.',
      priority: 'medium',
      category: 'billing',
      status: 'open',
      sentiment_score: 0.40,
      ai_suggested_priority: 'medium',
    }
  ];
  const { error: errTix } = await supabase.from('tickets').upsert(tickets);
  if (errTix) console.error('Error seeding tickets:', errTix.message);

  console.log('\n----------------------------------------------------');
  console.log('SUCCESS: Live Supabase database seeded with demo data!');
  console.log('----------------------------------------------------\n');
}

seed().catch(console.error);
