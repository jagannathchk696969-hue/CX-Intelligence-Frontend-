# CX Intelligence - Setup & Deployment Guide

## Prerequisites

- **Node.js**: v20+ (tested on v24.21.0)
- **npm**: v10+ (tested on v11.19.0)
- **Supabase Account**: (Optional - backend includes automatic self-healing memory store and active demo project connection)
- **Google Gemini API Key**: (Optional - backend includes smart local grounded intelligence engine when key is not provided)

---

## Quick Start (Zero Setup Mode)

The platform is designed to run immediately without requiring manual cloud infrastructure setup.

### 1. Clone & Install Dependencies
From the repository root:
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```
Or simply run:
```bash
npm run install:all
```

### 2. Configure Environment Variables (Optional)
Defaults are pre-configured in `backend/.env` and `frontend/.env`.

To connect your own Google Gemini API key or Supabase project:
- Open `backend/.env`
- Add your `GEMINI_API_KEY`:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  AI_MODEL_NAME=gemini-3.8-flash
  ```

### 3. Launch Development Server
```bash
npm run dev
```
This runs both the Express API on `http://localhost:5000` and the Vite React Frontend on `http://localhost:5173`.

---

## Default Demo Logins

When accessing `http://localhost:5173/login`, you can use the **One-Click Demo Buttons** or enter:

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@apex.com` | `Password123!` |
| **Support Agent** | `agent.sarah@apex.com` | `Password123!` |
| **Customer** | `alex.turner@gmail.com` | `Password123!` |

---

## Running Automated Tests

Run backend integration test suite:
```bash
npm test
```
All tests verify Auth, Chat, Sentiment Analysis, Ticket prioritization, Knowledge retrieval, and Analytics aggregation.
