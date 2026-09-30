import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('CX Intelligence API Endpoints', () => {
  let authToken = '';

  it('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('CX Intelligence API');
  });

  it('POST /api/auth/login with valid admin credentials should return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@apex.com',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('admin');
    authToken = res.body.data.token;
  });

  it('POST /api/auth/login with invalid password should fail', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@apex.com',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me with bearer token should return profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('admin@apex.com');
  });

  it('POST /api/chat/message should analyze sentiment and respond', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({
        message: 'What is your refund policy for annual enterprise plans?',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.aiMessage).toBeDefined();
    expect(res.body.data.analysis.sentiment).toBeDefined();
    expect(res.body.data.aiMessage.content).toContain('knowledge base article');
  });

  it('POST /api/ai/sentiment should classify sentiment with confidence', async () => {
    const res = await request(app)
      .post('/api/ai/sentiment')
      .send({
        text: 'This system is broken and failing completely! I am extremely frustrated.',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.sentiment).toBe('negative');
    expect(res.body.data.escalationRecommended).toBe(true);
  });

  it('GET /api/tickets should return list of support tickets', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/knowledge should return published knowledge base articles', async () => {
    const res = await request(app).get('/api/knowledge');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/analytics/overview should return CSAT and metrics', async () => {
    const res = await request(app)
      .get('/api/analytics/overview?days=30')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalCustomers).toBeGreaterThan(0);
    expect(res.body.data.csatScore).toBeDefined();
  });
});
