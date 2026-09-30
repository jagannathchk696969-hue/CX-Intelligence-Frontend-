# CX Intelligence - AI-Powered Customer Experience Platform

[![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-blue.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2F%20Vite-indigo.svg)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20Supabase-green.svg)]()
[![AI](https://img.shields.io/badge/AI%20Engine-Gemini%203.8%20Flash%20%2F%20Grounded-cyan.svg)]()

> **CX Intelligence** is a multi-tenant, AI-powered Customer Experience Platform featuring automated conversational support, real-time sentiment intelligence, anti-hallucination knowledge grounding, personalized recommendation engines, and full support ticket management.

---

## 🌟 Key Functional Modules

1. **Intelligent AI Chatbot**: Context-aware natural language assistant strictly grounded in business knowledge articles, with typing indicators, suggested questions, customer feedback, and live human escalation.
2. **Sentiment Analysis**: Classifies customer interactions into Positive, Neutral, and Negative, detecting customer intent, extracting key phrases, and computing escalation urgency.
3. **Smart Recommendation Engine**: Evaluates customer preferences, industry context, and product catalog to recommend personalized addons with AI-generated reasoning.
4. **Customer Support Ticketing**: Full ticket lifecycle management with AI-suggested priorities, staff-only internal notes, customer-visible replies, and resolution telemetry.
5. **Customer Analytics Dashboard**: Interactive KPIs and Recharts visualizations tracking CSAT score, resolution times, sentiment distributions, daily deflection volume, and category breakdowns.
6. **Knowledge Base Management**: Business article repository with categorization, full-text search, and automated grounding citations.
7. **Role-Based Access Control**: Granular permissions for Admins, Support Agents, and Customers with JWT authentication and bcrypt password protection.

---

## 🏗️ Project Architecture

```
cx-intelligence/
├── frontend/                     # React 18 + Vite + Tailwind SaaS Application
│   ├── src/
│   │   ├── components/           # Common, Dashboard, Chatbot, Analytics, Tickets, Layout
│   │   ├── pages/                # Overview, Assistant Studio, Tickets, Analytics, etc.
│   │   ├── services/             # Axios API integration layer
│   │   ├── context/              # AuthContext and ToastContext
│   │   └── routes/               # Protected and public routes
│   └── package.json
│
├── backend/                      # Express.js REST API with MVC Architecture
│   ├── src/
│   │   ├── config/               # Environment & Supabase config
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic (AI, sentiment, tickets, analytics)
│   │   ├── models/               # Resilient database abstraction (Supabase + Memory store)
│   │   ├── middleware/           # Auth, RBAC, Rate Limiting, Validation, Error handlers
│   │   └── routes/               # Modular REST endpoints
│   ├── tests/                    # Vitest integration tests (100% pass)
│   └── package.json
│
├── database/                     # PostgreSQL schema, migrations, and seed scripts
│   ├── migrations/               # Version-controlled migrations
│   ├── schema.sql                # Complete relational schema & RLS policies
│   └── seed.sql                  # Production seed data
│
└── docs/                         # Architecture, API documentation, and setup guide
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run the Development Servers
```bash
npm run dev
```
- **Web Dashboard**: `http://localhost:5173`
- **Customer Portal**: `http://localhost:5173/customer-chat`
- **Backend API**: `http://localhost:5000/api`

### 3. Demo Accounts
One-click demo buttons are provided on `http://localhost:5173/login`:
- **Admin**: `admin@apex.com` / `Password123!`
- **Support Agent**: `agent.sarah@apex.com` / `Password123!`
- **Customer**: `alex.turner@gmail.com` / `Password123!`

### 4. Run Automated Tests
```bash
npm test
```
All integration tests run against API endpoints and verify Auth, Chat, Sentiment, Tickets, Knowledge, and Analytics.
