# CX Intelligence - System Architecture

## 1. System Overview

**CX Intelligence** is an enterprise AI-powered Customer Experience Platform architected for high-throughput automated support, multi-tenant conversational analytics, real-time sentiment tracking, and knowledge-grounded response generation.

```
                           ┌────────────────────────────┐
                           │   React 18 + Vite Client   │
                           │ (Tailwind + Recharts + UI) │
                           └──────────────┬─────────────┘
                                          │  HTTPS / REST
                                          ▼
                           ┌────────────────────────────┐
                           │  Express.js API Gateway    │
                           │  (Helmet, CORS, RateLimit) │
                           └──────────────┬─────────────┘
                                          │
       ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
       │                  │                               │                  │
       ▼                  ▼                               ▼                  ▼
┌──────────────┐   ┌──────────────┐               ┌──────────────┐   ┌──────────────┐
│ Auth Service │   │ Chat Service │               │ Ticket Svc   │   │ Analytics Svc│
│  (JWT+Bcrypt)│   │  & Studio    │               │  & Replies   │   │ & Reporting  │
└──────────────┘   └──────┬───────┘               └──────────────┘   └──────────────┘
                          │
                          ▼
            ┌───────────────────────────┐
            │     AI Service Layer      │
            │  (Google Gemini 3.8 Flash │
            │   & Grounded Mock Engine) │
            └─────────────┬─────────────┘
                          │
                          ▼
            ┌───────────────────────────┐
            │   Database & Storage      │
            │   Supabase / PostgreSQL   │
            │ (Multi-tenant RLS + Cache)│
            └───────────────────────────┘
```

## 2. Key Architecture Pillars

### A. Grounded Knowledge Retrieval & Anti-Hallucination
The platform strictly grounds conversational outputs using verified business knowledge base articles stored in PostgreSQL.
1. When a customer or agent queries the AI assistant, the query is analyzed for intent and sentiment.
2. The retrieval layer matches relevant approved documents across title, category, and tags.
3. If grounded content exists, the AI constructs an authoritative reply and cites the exact article title.
4. If no grounded content exists with high confidence, the system avoids fabricating policies and explicitly offers human escalation.

### B. Multi-Tenancy & Security
- **Tenant Isolation**: Every customer, conversation, ticket, product, and knowledge article is keyed by `business_id`.
- **Row Level Security (RLS)**: PostgreSQL enforces data boundaries between different client organizations.
- **Secure Key Storage**: Supabase service-role keys and AI provider keys reside exclusively on the server and are never sent to frontend bundles.

### C. Graceful Fallbacks & Offline Resilience
- **Dual AI Engine**: Automatically switches between live Google Gemini API (`gemini-3.8-flash`) and an intelligent deterministic local engine when running offline or in mock test mode.
- **Database Resilience**: Supports direct Supabase PostgreSQL connections with an in-memory/JSON fallback store, guaranteeing zero downtime.
