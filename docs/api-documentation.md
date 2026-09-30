# CX Intelligence - REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. Register User
- **Method**: `POST /auth/register`
- **Request Body**:
  ```json
  {
    "fullName": "Elena Vance",
    "email": "elena@apex.com",
    "password": "Password123!",
    "role": "admin",
    "businessName": "Apex Technologies"
  }
  ```
- **Response**: `201 Created` with JWT token and user profile object.

### 2. Login User
- **Method**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@apex.com",
    "password": "Password123!"
  }
  ```
- **Response**: `200 OK` with session token.

### 3. Current User Profile
- **Method**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with user and tenant details.

---

## Chat & AI Endpoints

### 4. Send Chat Message
- **Method**: `POST /chat/message`
- **Request Body**:
  ```json
  {
    "conversationId": "optional-uuid",
    "customerId": "optional-uuid",
    "message": "What is your refund policy?"
  }
  ```
- **Response**: `200 OK` containing customer message, grounded AI assistant reply with source citation, and sentiment analysis telemetry.

### 5. Escalate Session to Human Support
- **Method**: `POST /chat/escalate`
- **Request Body**:
  ```json
  {
    "conversationId": "uuid",
    "reason": "Customer requested human supervisor"
  }
  ```
- **Response**: `200 OK`

### 6. Submit Customer CSAT Feedback
- **Method**: `POST /chat/feedback`
- **Request Body**:
  ```json
  {
    "conversationId": "uuid",
    "rating": 5,
    "comment": "Quick and accurate response!"
  }
  ```
- **Response**: `201 Created`

### 7. Standalone Sentiment Analysis
- **Method**: `POST /ai/sentiment`
- **Request Body**:
  ```json
  {
    "text": "The API endpoint has been failing for 2 hours."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "sentiment": "negative",
    "confidence": 0.92,
    "intent": "technical_issue",
    "keywords": ["failing", "api"],
    "escalationRecommended": true
  }
  ```

---

## Support Ticket Endpoints

### 8. List Support Tickets
- **Method**: `GET /tickets?status=open&priority=urgent`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with enriched tickets.

### 9. Create Support Ticket
- **Method**: `POST /tickets`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "customerId": "c1000000-0000-0000-0000-000000000001",
    "subject": "Production Outage in us-east-1",
    "description": "API webhooks failing with HTTP 504.",
    "category": "technical",
    "priority": "urgent"
  }
  ```
- **Response**: `201 Created` with AI-suggested priority.

### 10. Update Ticket Status / Priority
- **Method**: `PATCH /tickets/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "status": "resolved",
    "priority": "high"
  }
  ```
- **Response**: `200 OK`

### 11. Add Ticket Message or Staff Note
- **Method**: `POST /tickets/:id/messages`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "content": "Rerouted traffic to backup region.",
    "isInternal": true
  }
  ```
- **Response**: `201 Created`

---

## Analytics Endpoints

### 12. Overview Metrics
- **Method**: `GET /analytics/overview?days=30`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with CSAT, total conversations, open tickets, and response times.

### 13. Sentiment Distribution
- **Method**: `GET /analytics/sentiment?days=30`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with counts and percentage breakdown.

### 14. Engagement Trends
- **Method**: `GET /analytics/engagement?days=7`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` daily timeline of total, AI resolved, and human escalated.
