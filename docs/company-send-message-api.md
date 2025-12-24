# Company Send Message API - Backend Requirements

## Overview

Companies can browse talents through shortlists, view talent profiles, and send messages to candidates. The "Send Message" button currently exists in the UI but is not functional.

---

## Endpoint Proposal Review

### Your Proposed Endpoint

```
POST /api/shortlists/{shortlistId}/message
Authorization: Bearer <company_token>

{
  "candidateId": "guid",
  "subject": "optional subject",
  "content": "message content"
}
```

### Recommendation: Modify the URL

I suggest changing the endpoint to:

```
POST /api/companies/shortlists/{shortlistId}/candidates/{candidateId}/message
```

**Or simpler alternative:**

```
POST /api/shortlists/{shortlistId}/message
```

Both work, but the key point is: **Remove `/api/` prefix duplication**.

Looking at the existing codebase patterns in [api.ts](lib/api.ts), all endpoints use paths like:
- `GET /shortlists/{id}`
- `GET /companies/messages`
- `PUT /admin/shortlists/{id}/rankings`

So the endpoint should be:

```
POST /shortlists/{shortlistId}/message
```

This matches the existing pattern where `/shortlists/{id}` is already used for company access.

---

## Required Endpoint

### Send Message to Candidate

```
POST /shortlists/{shortlistId}/message
Authorization: Bearer <company_token>
```

#### Request Body

```json
{
  "candidateId": "guid",
  "subject": "string (optional)",
  "content": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `candidateId` | string (GUID) | Yes | The candidate's unique ID |
| `subject` | string | No | Email/message subject line |
| `content` | string | Yes | Message body content (max 5000 chars recommended) |

#### Validation Rules

1. `shortlistId` must belong to the authenticated company
2. `candidateId` must exist in the shortlist's candidates
3. `content` must not be empty
4. Shortlist must have status `completed` (company can only message after shortlist is delivered)

#### Success Response

```json
{
  "success": true,
  "data": {
    "id": "message-guid",
    "shortlistId": "shortlist-guid",
    "fromCompanyId": "company-guid",
    "fromCompanyName": "Acme Corp",
    "toCandidateId": "candidate-guid",
    "toCandidateName": "John Doe",
    "toCandidateEmail": "john@example.com",
    "subject": "Opportunity at Acme Corp",
    "content": "Hello John, we reviewed your profile...",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Message sent successfully"
}
```

#### Error Responses

**404 - Shortlist Not Found:**
```json
{
  "success": false,
  "error": "Shortlist not found"
}
```

**404 - Candidate Not in Shortlist:**
```json
{
  "success": false,
  "error": "Candidate not found in this shortlist"
}
```

**403 - Shortlist Not Ready:**
```json
{
  "success": false,
  "error": "Shortlist is not yet completed"
}
```

**403 - Message Quota Exceeded:**
```json
{
  "success": false,
  "error": "Message quota exceeded. Please upgrade your plan."
}
```

**400 - Validation Error:**
```json
{
  "success": false,
  "error": "Message content is required"
}
```

---

## Message Quota System

The frontend already has a `messagesRemaining` field in the `CompanyProfile` type. The backend should:

1. Check if company has messages remaining before allowing send
2. Decrement `messagesRemaining` after successful send
3. Return quota error if `messagesRemaining <= 0`

### Optional: Include Quota in Response

```json
{
  "success": true,
  "data": {
    "id": "message-guid",
    ...
  },
  "message": "Message sent successfully",
  "messagesRemaining": 4
}
```

---

## Frontend Implementation Notes

The frontend will:

1. Open a message modal when clicking "Message" button on [company/shortlists/[id]/page.tsx:328](app/company/shortlists/[id]/page.tsx#L328)
2. Call `POST /shortlists/{shortlistId}/message` with the form data
3. Show success/error toast notification
4. Optionally redirect to messages inbox after successful send

### API Call Example (Frontend)

```typescript
const sendMessage = async (shortlistId: string, candidateId: string, subject: string, content: string) => {
  const response = await api.post(`/shortlists/${shortlistId}/message`, {
    candidateId,
    subject,
    content
  });
  return response;
};
```

---

## Related Existing Endpoints

### Get Company Messages (Already Exists)

```
GET /companies/messages
```

Returns all messages sent by the company. Used in [company/messages/page.tsx](app/company/messages/page.tsx).

---

## Summary

| Aspect | Value |
|--------|-------|
| **Endpoint** | `POST /shortlists/{shortlistId}/message` |
| **Auth** | Bearer token (company) |
| **Required Fields** | `candidateId`, `content` |
| **Optional Fields** | `subject` |
| **Validations** | Shortlist belongs to company, candidate in shortlist, shortlist completed, quota available |
| **Side Effects** | Decrement `messagesRemaining`, send notification to candidate |

---

## Additional Consideration: Notification to Candidate

When a message is sent, the backend should:

1. Store the message in the database
2. Send an email notification to the candidate
3. Create an in-app notification for the candidate (if notifications system exists)

The candidate should be able to view and reply to messages in their dashboard.
